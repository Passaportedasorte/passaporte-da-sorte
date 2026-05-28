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

    const evento = body.event;
    const pagamento = body.payment;

    if (!pagamento?.id) {
      return NextResponse.json({ ok: true });
    }

    if (evento !== "PAYMENT_CONFIRMED" && evento !== "PAYMENT_RECEIVED") {
      return NextResponse.json({ ok: true });
    }

    const { data: compra } = await supabase
      .from("compras")
      .select("*")
      .eq("payment_id", pagamento.id)
      .single();

    if (!compra) {
      return NextResponse.json({ ok: true });
    }

    await supabase
      .from("compras")
      .update({ status: evento })
      .eq("payment_id", pagamento.id);

    const { data: campanha } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", compra.campaign_id)
      .single();

    const ids = Array.from({ length: compra.quantidade }, () => ({
      nome: compra.nome,
      contato: compra.email,
      pass_id: gerarPassId(),
      milhas: campanha?.milhas ?? 0,
      user_id: compra.user_id,
      campaign_id: compra.campaign_id,
    }));

    await supabase.from("pass_ids").insert(ids);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("ERRO WEBHOOK ASAAS:", error);

    return NextResponse.json(
      { error: "Erro no webhook", details: error?.message },
      { status: 500 }
    );
  }
}