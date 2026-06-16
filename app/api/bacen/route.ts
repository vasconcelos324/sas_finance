import { NextRequest, NextResponse } from "next/server";
import { fetchSeries } from "@/lib/bacen-api";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = Number(searchParams.get("code"));
  const start = searchParams.get("start") || "01/01/1900";
  const end = searchParams.get("end") || new Date().toLocaleDateString("pt-BR");

  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  try {
    const data = await fetchSeries(code, start, end);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
