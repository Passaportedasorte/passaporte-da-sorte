import { NextResponse } from "next/server";

const ASAAS_URL = "https://api-sandbox.asaas.com/v3";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    access_token: process.env.ASAAS_API_KEY || "",
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      valor,
      nome,
      email,
      cpf,
      campanhaId,
      quantidade,
      userId,
    } = body;

    if (!valor || !nome || !email || !cpf) {
      return NextResponse.json(
        {
          error: "Dados obrigatórios ausentes",
          details: "Informe valor, nome, email e CPF.",
        },
        { status: 400 }
      );
    }

    const customerId = await criarCliente(nome, email, cpf);

    const paymentResponse = await fetch(`${ASAAS_URL}/payments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        customer: customerId,
        billingType: "UNDEFINED",
        value: Number(valor),
        dueDate: new Date().toISOString().split("T")[0],
        description: "Passaporte da Sorte",
      }),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error("ERRO PAGAMENTO ASAAS:", paymentData);

      return NextResponse.json(paymentData, {
        status: paymentResponse.status,
      });
    }

    const compraResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/compras`,
      {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          user_id: userId || null,
          campaign_id: campanhaId,
          payment_id: paymentData.id,
          nome,
          email,
          cpf,
          quantidade,
          valor,
          status: paymentData.status,
        }),
      }
    );

    if (!compraResponse.ok) {
      const compraError = await compraResponse.text();
      console.error("ERRO AO SALVAR COMPRA:", compraError);

      return NextResponse.json(
        {
          error: "Pagamento criado, mas erro ao salvar compra.",
          details: compraError,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: paymentData.id,
      status: paymentData.status,
      value: paymentData.value,
      dueDate: paymentData.dueDate,
      invoiceUrl: paymentData.invoiceUrl,
      bankSlipUrl: paymentData.bankSlipUrl,
      rawPayment: paymentData,
    });
  } catch (error: any) {
    console.error("ERRO ASAAS:", error);

    return NextResponse.json(
      {
        error: "Erro ao gerar cobrança",
        details: error?.message || JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}

async function criarCliente(nome: string, email: string, cpf: string) {
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
    console.error("ERRO CLIENTE ASAAS:", customerData);

    throw new Error(
      customerData?.errors?.[0]?.description ||
        "Erro ao criar cliente no Asaas."
    );
  }

  return customerData.id;
}