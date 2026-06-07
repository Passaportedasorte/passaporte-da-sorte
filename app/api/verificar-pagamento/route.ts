import { NextResponse } from "next/server";

const ASAAS_URL = "https://api-sandbox.asaas.com/v3";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    access_token: process.env.ASAAS_API_KEY || "",
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID ausente." }, { status: 400 });
  }

  const response = await fetch(`${ASAAS_URL}/payments/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json({
    id: data.id,
    status: data.status,
  });
}