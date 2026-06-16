
import { getDB } from "@/lib/sqlite";
import { NextResponse } from "next/server";

const tabelas = ["dre", "dfc", "bpa", "bpp"];

export async function GET() {
  try {
    const db = await getDB();

    const queries = tabelas.map(
      (tabela) => `SELECT DISTINCT DENOM_CIA FROM ${tabela}`,
    );

    const uniao = `SELECT DISTINCT DENOM_CIA FROM (${queries.join(" UNION ALL ")}) ORDER BY DENOM_CIA`;

    const empresas = await db.all<{ DENOM_CIA: string }[]>(uniao);

    return NextResponse.json({ empresas });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Erro inesperado", details: errorMessage },
      { status: 500 },
    );
  }
}


