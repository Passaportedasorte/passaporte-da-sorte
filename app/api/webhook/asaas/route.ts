import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function gerarPassId() {
  const n = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");

  return `PSD-${n}`;
}

async function gerarPassIdUnico() {
  let passId = gerarPassId();
  let tentativas = 0;

  while (tentativas < 20) {
    const { data } = await supabase
      .from("pass_ids")
      .select("id")
      .eq("pass_id", passId)
      .limit(1);

    if (!data || data.length === 0) {
      return passId;
    }

    passId = gerarPassId();
    tentativas++;
  }

  throw new Error("Não foi possível gerar um PASS-ID único.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const evento = body.event;
    const pagamento = body.payment;

    if (!pagamento?.id) {
      return NextResponse.json({ ok: true });
    }

    if (evento !== "PAYMENT_CONFIRMED" && evento !== "PAYMENT_RECEIVED") {
      return NextResponse.json({ ok: true });
    }

    const { data: compra, error: compraError } = await supabase
      .from("compras")
      .select("*")
      .eq("payment_id", pagamento.id)
      .single();

    if (compraError || !compra) {
      console.error("Compra não encontrada:", compraError);
      return NextResponse.json({ ok: false, error: "Compra não encontrada" });
    }

    await supabase
      .from("compras")
      .update({ status: evento })
      .eq("payment_id", pagamento.id);

    const { data: passExistentes } = await supabase
      .from("pass_ids")
      .select("id")
      .eq("payment_id", pagamento.id);

    if (passExistentes && passExistentes.length > 0) {
      return NextResponse.json({
        ok: true,
        message: "PASS IDs já gerados",
      });
    }

    const { data: campanha, error: campanhaError } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", compra.campaign_id)
      .single();

    if (campanhaError) {
      console.error("Erro ao buscar campanha:", campanhaError);
    }

   const ids = [];

for (let i = 0; i < Number(compra.quantidade || 0); i++) {
  ids.push({
    nome: compra.nome,
    contato: compra.email,
    pass_id: await gerarPassIdUnico(),
    milhas: campanha?.milhas ?? 0,
    user_id: compra.user_id,
    campaign_id: compra.campaign_id,
    compra_id: compra.id,
    payment_id: pagamento.id,
  });
}

    const { data: passCriados, error: passError } = await supabase
      .from("pass_ids")
      .insert(ids)
      .select();

    if (passError) {
      console.error("Erro ao gerar PASS IDs:", passError);
      return NextResponse.json(
        { ok: false, error: passError.message },
        { status: 500 }
      );
    }

    const totalMilhasGeradas = ids.reduce(
      (total, item) => total + Number(item.milhas || 0),
      0
    );

    if (compra.user_id && totalMilhasGeradas > 0) {
      const { data: milhasAtuais, error: milhasSelectError } = await supabase
        .from("user_miles")
        .select("total_milhas")
        .eq("user_id", compra.user_id)
        .single();

      if (milhasSelectError && milhasSelectError.code !== "PGRST116") {
        console.error("Erro ao buscar milhas:", milhasSelectError);
      }

      if (milhasAtuais) {
        const { error: milhasUpdateError } = await supabase
          .from("user_miles")
          .update({
            total_milhas:
              Number(milhasAtuais.total_milhas || 0) + totalMilhasGeradas,
          })
          .eq("user_id", compra.user_id);

        if (milhasUpdateError) {
          console.error("Erro ao atualizar milhas:", milhasUpdateError);
        }
      } else {
        const { error: milhasInsertError } = await supabase
          .from("user_miles")
          .insert({
            user_id: compra.user_id,
            total_milhas: totalMilhasGeradas,
          });

        if (milhasInsertError) {
          console.error("Erro ao inserir milhas:", milhasInsertError);
        }
      }
    } else {
      console.log("Milhas não geradas: compra sem user_id ou total zerado", {
        user_id: compra.user_id,
        totalMilhasGeradas,
      });
    }

    return NextResponse.json({
      ok: true,
      pass_ids: passCriados,
      milhas: totalMilhasGeradas,
    });
  } catch (error: any) {
    console.error("ERRO WEBHOOK ASAAS:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message,
      },
      { status: 500 }
    );
  }
}