import { NextResponse } from "next/server";

const ASAAS_URL = "https://api.asaas.com/v3";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    access_token: process.env.ASAAS_API_KEY || "",
  };
}

export async function POST(req: Request) {
  try {
    const { plano, userId, nome, email, cpf, billingType } = await req.json();

    if (!plano || !userId || !nome || !email || !cpf) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const valor = plano === "semestral" ? 119.4 : 24.9;

    const customerResponse = await fetch(`${ASAAS_URL}/customers`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        name: nome,
        email,
        cpfCnpj: cpf,
      }),
    });

    const customerData = await customerResponse.json();

    if (!customerResponse.ok) {
      return NextResponse.json(customerData, {
        status: customerResponse.status,
      });
    }

    const paymentResponse = await fetch(`${ASAAS_URL}/payments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        customer: customerData.id,
        billingType: billingType === "CREDIT_CARD" ? "UNDEFINED" : billingType || "UNDEFINED",
        value: valor,
        dueDate: new Date().toISOString().split("T")[0],
        description:
          plano === "semestral"
            ? "Clube Passaporte da Sorte - Semestral"
            : "Clube Passaporte da Sorte - Mensal",
      }),
    });

    const paymentData = await paymentResponse.json();

let pixQrCode = null;

if (billingType === "PIX") {
  const pixResponse = await fetch(
    `${ASAAS_URL}/payments/${paymentData.id}/pixQrCode`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const pixData = await pixResponse.json();

  if (pixResponse.ok) {
    pixQrCode = pixData;
  }
}

    if (!paymentResponse.ok) {
      return NextResponse.json(paymentData, {
        status: paymentResponse.status,
      });
    }

    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/clube_assinaturas`, {
      method: "POST",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        user_id: userId,
        payment_id: paymentData.id,
        plano,
        valor,
        status: paymentData.status,
      }),
    });

    return NextResponse.json({
  invoiceUrl: paymentData.invoiceUrl,
  bankSlipUrl: paymentData.bankSlipUrl,
  paymentId: paymentData.id,
  pixQrCode,
  billingType,
});
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao gerar pagamento." },
      { status: 500 }
    );
  }
}