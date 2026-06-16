import { getDB } from "@/lib/sqlite";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const denomCia = searchParams.get("DENOM_CIA");
    const grupoDfp = searchParams.get("GRUPO_DFP");
    const periodo = searchParams.get("PERIODO");

    const grupoMap: Record<string, string> = {
      IND: "DF Individual - Demonstração do Resultado",
      CON: "DF Consolidado - Demonstração do Resultado",
    };

    const periodoMap: Record<string, string> = {
      "1T": "1T%",
      "2T": "2T%",
      "3T": "3T%",
      "1S": "1S%",
      "9M": "9M%",
      "AA": "20%",
    };

    const grupoDB = grupoDfp ? grupoMap[grupoDfp.toUpperCase()] : undefined;
    const periodoDB = periodo ? periodoMap[periodo.toUpperCase()] : undefined;

    if (!denomCia || !grupoDB || !periodoDB) {
      return NextResponse.json(
        { error: "Parâmetro inválido ou ausente", params: { denomCia, grupoDfp, periodo } },
        { status: 400 },
      );
    }

    const db = await getDB();

    const data = await db.all(
      `SELECT * FROM dre
       WHERE DENOM_CIA = ?
         AND GRUPO_DFP = ?
         AND PERIODO LIKE ?`,
      [denomCia, grupoDB, periodoDB],
    );

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Erro inesperado", details: errorMessage },
      { status: 500 },
    );
  }
}