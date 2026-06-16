export interface DataPoint {
  date: string;
  value: number;
}

export async function fetchSeries(
  code: number,
  startDate: string,
  endDate: string
): Promise<DataPoint[]> {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`BACEN API error: ${res.status}`);
  const raw: Array<{ data: string; valor: string }> = await res.json();
  return raw
    .map((d) => ({ date: d.data, value: parseFloat(d.valor.replace(",", ".")) }))
    .filter((d) => !isNaN(d.value));
}

export function formatexpoDate(dateStr: string): string {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
}

export function toDisplayDate(dateStr: string): string {
  const [day, month, year] = dateStr.split("/");
  return `${month}/${year}`;
}
