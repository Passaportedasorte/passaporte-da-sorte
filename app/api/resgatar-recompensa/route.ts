import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function gerarCodigoResgate() {
  const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PSD-${codigo}`;
}
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

    if (!data || data.length === 0) return passId;

    passId = gerarPassId();
    tentativas++;
  }

  throw new Error("Não foi possível gerar um PASS-ID único.");
}

export async function POST(req: Request) {
  try {
    const { userId, rewardId } = await req.json();

    if (!userId || !rewardId) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const { data: assinatura } = await supabase
      .from("clube_assinaturas")
      .select("id")
      .eq("user_id", userId)
      .in("status", ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"])
      .maybeSingle();

    if (!assinatura) {
      return NextResponse.json(
        { error: "Resgate disponível apenas para assinantes do clube." },
        { status: 403 }
      );
    }

    const { data: recompensa, error: recompensaError } = await supabase
      .from("rewards")
      .select("*")
      .eq("id", rewardId)
      .eq("ativo", true)
      .single();

    if (recompensaError || !recompensa) {
      return NextResponse.json(
        { error: "Recompensa não encontrada." },
        { status: 404 }
      );
    }

    const { data: milhas } = await supabase
      .from("user_miles")
      .select("total_milhas")
      .eq("user_id", userId)
      .single();

    const saldoAtual = Number(milhas?.total_milhas || 0);
    const custo = Number(recompensa.milhas || 0);

    if (saldoAtual < custo) {
      return NextResponse.json(
        { error: "Milhas insuficientes." },
        { status: 400 }
      );
    }

    const novoSaldo = saldoAtual - custo;

    const { error: updateMilhasError } = await supabase
      .from("user_miles")
      .update({ total_milhas: novoSaldo })
      .eq("user_id", userId);

    if (updateMilhasError) {
      return NextResponse.json(
        { error: updateMilhasError.message },
        { status: 500 }
      );
    }

    const codigo = gerarCodigoResgate();

    const { data: resgate, error: resgateError } = await supabase
      .from("reward_redemptions")
      .insert({
        user_id: userId,
        reward_id: rewardId,
        titulo: recompensa.titulo,
        milhas_usadas: custo,
        codigo,
        status: "ativo",
      })
      .select()
      .single();

       if (resgateError) {
      return NextResponse.json(
        { error: resgateError.message },
        { status: 500 }
      );
    }

let passIdsCriados: any[] = [];

if (recompensa.recompensa_tipo === "PASS_ID") {
  const quantidadePassIds = Number(recompensa.quantidade_pass_ids || 1);

  if (!recompensa.campaign_id) {
    return NextResponse.json(
      { error: "Recompensa sem campanha vinculada." },
      { status: 400 }
    );
  }

  const novosPassIds = [];

  for (let i = 0; i < quantidadePassIds; i++) {
    novosPassIds.push({
      nome: "Resgate de Milhas",
      contato: "",
      pass_id: await gerarPassIdUnico(),
      milhas: 0,
      user_id: userId,
      campaign_id: recompensa.campaign_id,
      compra_id: null,
      payment_id: `resgate-${resgate.id}`,
    });
  }

  const { data: criados, error: passError } = await supabase
    .from("pass_ids")
    .insert(novosPassIds)
    .select();

  if (passError) {
    return NextResponse.json(
      { error: passError.message },
      { status: 500 }
    );
  }

  passIdsCriados = criados || [];
}


    return NextResponse.json({
      ok: true,
      novoSaldo,
      resgate,
      passIdsCriados,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao resgatar recompensa." },
      { status: 500 }
    );
  }
}