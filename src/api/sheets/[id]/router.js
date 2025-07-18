import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sheets/${id}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request, { params }) {
  const { id } = params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sheets/${id}/export`);
  const blob = await response.blob();
  return new NextResponse(blob, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="sheet_${id}.csv"`,
    },
  });
}

