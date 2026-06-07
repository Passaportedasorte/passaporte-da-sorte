import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function gerarCodigoResgate() {
  const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PSD-${codigo}`;
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

    return NextResponse.json({
      ok: true,
      novoSaldo,
      resgate,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao resgatar recompensa." },
      { status: 500 }
    );
  }
}