import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sheets/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

