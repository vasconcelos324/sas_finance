

export type Category =
  | "Política Monetária"
  | "Inflação"
  | "Atividade Econômica"
  | "Câmbio e Setor Externo"
  | "Crédito"
  | "Setor Fiscal";

export interface BacenSeries {
  code: number;
  name: string;
  fonte: string;
  unid: string;
  category: Category;
  color: string;
}

export const SERIES: BacenSeries[] = [
  { code: 432,   name: "Meta Selic",                 fonte: "Copom",                                       unid: "%",               category: "Política Monetária",     color: "#7F77DD" },

  { code: 24363, name: "IBC-Br",                     fonte: "BCB-Depec",                                   unid: "ind",             category: "Atividade Econômica",    color: "#FAC775" },
  { code: 24369, name: "Desemprego",                 fonte: "IBGE",                                        unid: "%",               category: "Atividade Econômica",    color: "#FAC775" },
  { code: 4192,  name: "PIB",                        fonte: "IBGE",                                        unid: "US$ (milhões)",   category: "Atividade Econômica",    color: "#FAC775" },
  { code: 4382,  name: "PIB CORRENTE",               fonte: "IBGE",                                        unid: "R$ (milhões)",    category: "Atividade Econômica",    color: "#FAC775" },
  
  { code: 13522, name: "IPCA Anual",                 fonte: "IBGE",                                        unid: "%"     ,          category: "Inflação",               color: "#1D9E75" },
  { code: 433,   name: "IPCA",                       fonte: "IBGE",                                        unid: "%",               category: "Inflação",               color: "#1D9E75" },
  { code: 7478,  name: "IPCA-15",                    fonte: "IBGE",                                        unid: "%",               category: "Inflação",               color: "#1D9E75" },
  { code: 188,   name: "INPC",                       fonte: "IBGE",                                        unid: "%",               category: "Inflação",               color: "#1D9E75" },
  { code: 189,   name: "IGP-M",                      fonte: "FGV",                                         unid: "%",               category: "Inflação",               color: "#1D9E75" },
  { code: 13521, name: "Meta de Inflação",           fonte: "BCB-Depec",                                   unid: "%",               category: "Inflação",               color: "#1D9E75" },
  
  { code: 3546,  name: "Reservas Internac.",         fonte: "BCB-DSTAT",                                   unid: "US$ (milhões)",   category: "Câmbio e Setor Externo", color: "#185FA5" },
  { code: 22707, name: "Balança Comercial-Saldo",    fonte: "BCB-DSTAT",                                   unid: "US$ (milhões)",   category: "Câmbio e Setor Externo", color: "#85B7EB" },
  
  { code: 13762, name: "Dív Bruta Gov Geral/PIB",    fonte: "BCB-DSTAT",                                   unid: "%",               category: "Setor Fiscal",           color: "#FAC775" },
  { code: 4505,  name: "Dív Liq Set Publ/PIB",       fonte: "BCB-DSTAT",                                   unid: "%",               category: "Setor Fiscal",           color: "#FAC775" },


  { code: 27788, name: "Meios de pagamento - M1",    fonte: "BCB-DSTAT",                                   unid: "u.m.c. (mil)",    category: "Crédito",                color: "#F0997B" },
  { code: 21082, name: "Inadimplência",              fonte: "BCB-DSTAT",                                   unid: "%",               category: "Crédito",                color: "#F5C4B3" },
  
];


export const CATEGORIES: Category[] = [
  "Política Monetária",
  "Inflação",
  "Atividade Econômica",
  "Câmbio e Setor Externo",
  "Crédito",
  "Setor Fiscal",
];

export const CATEGORY_META: Record<Category, { bg: string; text: string; border: string; icon: string }> = {
  "Política Monetária":     { bg: "#EEEDFE", text: "#3C3489", border: "#AFA9EC", icon: "🎯" },
  "Inflação":               { bg: "#E1F5EE", text: "#085041", border: "#5DCAA5", icon: "📈" },
  "Atividade Econômica":    { bg: "#FAEEDA", text: "#633806", border: "#EF9F27", icon: "🏭" },
  "Câmbio e Setor Externo": { bg: "#E6F1FB", text: "#0C447C", border: "#85B7EB", icon: "💱" },
  "Crédito":                { bg: "#FAECE7", text: "#711B13", border: "#F0997B", icon: "🏦" },
  "Setor Fiscal":           { bg: "#FBEAF0", text: "#4B1528", border: "#ED93B1", icon: "📊" },
};


