import { NextResponse } from "next/server";

export const runtime = "edge";

interface YahooBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function toDate(unix: number): string {
  return new Date(unix * 1000).toISOString().split("T")[0];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "PETR4.SA";
  const interval = searchParams.get("interval") ?? "1d";
  const range = searchParams.get("range") ?? "1y";
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}&events=history`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Yahoo Finance retornou ${res.status}` },
        { status: res.status },
      );
    }
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) {
      return NextResponse.json(
        { error: "Ativo não encontrado ou sem dados." },
        { status: 404 },
      );
    }
    const timestamps: number[] = result.timestamp ?? [];
    const q = result.indicators?.quote?.[0];
    if (!q || !timestamps.length) {
      return NextResponse.json(
        { error: "Dados insuficientes para este período." },
        { status: 404 },
      );
    }
    const bars: YahooBar[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const open = q.open[i];
      const high = q.high[i];
      const low = q.low[i];
      const close = q.close[i];

      if (
        open == null ||
        isNaN(open) ||
        high == null ||
        isNaN(high) ||
        low == null ||
        isNaN(low) ||
        close == null ||
        isNaN(close) ||
        (open === 0 && high === 0 && low === 0)
      )
        continue;

      bars.push({
        date: toDate(timestamps[i]),
        open: +open.toFixed(4),
        high: +high.toFixed(4),
        low: +low.toFixed(4),
        close: +close.toFixed(4),
        volume: q.volume[i] ?? 0,
      });
    }
    const seen = new Set<string>();
    const unique = bars
      .sort((a, b) => a.date.localeCompare(b.date))
      .filter((b) => {
        if (seen.has(b.date)) return false;
        seen.add(b.date);
        return true;
      });

    return NextResponse.json(unique, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Erro interno ao buscar cotações." },
      { status: 500 },
    );
  }
}
