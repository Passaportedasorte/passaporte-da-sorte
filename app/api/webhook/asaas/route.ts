import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function gerarPassId() {
  const n = Math.floor(Math.random() * 9999999)
    .toString()
    .padStart(7, "0");

  return `PSD-${n}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("WEBHOOK RECEBIDO:", body);

    const evento = body.event;
    const pagamento = body.payment;

    if (!pagamento?.id) {
      console.log("Pagamento sem ID");
      return NextResponse.json({ ok: true });
    }

    if (
      evento !== "PAYMENT_CONFIRMED" &&
      evento !== "PAYMENT_RECEIVED"
    ) {
      console.log("Evento ignorado:", evento);
      return NextResponse.json({ ok: true });
    }

    const { data: compra, error: compraError } = await supabase
      .from("compras")
      .select("*")
      .eq("payment_id", pagamento.id)
      .single();

    if (compraError || !compra) {
      console.error("Compra não encontrada:", compraError);

      return NextResponse.json({
        ok: false,
        error: "Compra não encontrada",
      });
    }

    console.log("Compra encontrada:", compra.id);

    await supabase
      .from("compras")
      .update({
        status: evento,
      })
      .eq("payment_id", pagamento.id);

    // Evita gerar PASS IDs duplicados
    const { data: passExistentes, error: passExistentesError } =
      await supabase
        .from("pass_ids")
        .select("id")
        .eq("payment_id", pagamento.id);

    if (passExistentesError) {
      console.error(
        "Erro ao consultar PASS IDs:",
        passExistentesError
      );
    }

    if (passExistentes && passExistentes.length > 0) {
      console.log("PASS IDs já gerados");

      return NextResponse.json({
        ok: true,
        message: "PASS IDs já gerados",
      });
    }

    const { data: campanha, error: campanhaError } =
      await supabase
        .from("campaigns")
        .select("*")
        .eq("id", compra.campaign_id)
        .single();

    if (campanhaError) {
      console.error(
        "Erro ao buscar campanha:",
        campanhaError
      );
    }

    const ids = Array.from(
      { length: Number(compra.quantidade || 0) },
      () => ({
        nome: compra.nome,
        contato: compra.email,
        pass_id: gerarPassId(),
        milhas: campanha?.milhas ?? 0,
        user_id: compra.user_id,
        campaign_id: compra.campaign_id,
        compra_id: compra.id,
        payment_id: pagamento.id,
      })
    );

    const { data: passCriados, error: passError } =
      await supabase
        .from("pass_ids")
        .insert(ids)
        .select();

    if (passError) {
      console.error(
        "Erro ao gerar PASS IDs:",
        passError
      );

      return NextResponse.json(
        {
          ok: false,
          error: passError.message,
        },
        { status: 500 }
      );
    }

    console.log(
      `${passCriados?.length || 0} PASS IDs gerados`
    );

    return NextResponse.json({
      ok: true,
      pass_ids: passCriados,
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