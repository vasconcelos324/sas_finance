export function formatexpoDate(dateStr: string): string {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
}

export function toDisplayDate(dateStr: string): string {
  const [month, year] = dateStr.split("/");
  return `${month}/${year}`;
}

export function getStartDate(range: string): string {
  const now = new Date();
  const map: Record<string, number | "MAX"> = {
    "1A": 1,
    "5A": 5,
    "10A": 10,
    MAX: "MAX",
  };

  const years = map[range] || 3;
  if (years === "MAX") {
    return "01/01/1996";
  }
  const d = new Date(now);
  d.setFullYear(d.getFullYear() - (years as number));
  return d.toLocaleDateString("pt-BR");
}

export function formatTick(dateStr: string, range: string): string {
  const [day, month, year] = dateStr.split("/");
  if (range === "1A") return `${day}/${month}/${year?.slice(2)}`;
  return year || dateStr;
}
