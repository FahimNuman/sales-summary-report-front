import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") || "";
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sheets${endpoint}`);
  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const endpoint = body.endpoint || "";
  delete body.endpoint;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sheets${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

