import { CandleData } from "@/app/page/price-yahoo-finance/page";

export function calculateSMA(data: any[], period: number) {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc: number, val: any) => acc + val.close, 0);
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
}

export function calculateRSI(
  data: { time: number; close: number }[],
  period: number,
) {
  if (data.length < period + 1) return [];
  const result = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    result.push({ time: data[i].time, value: +rsi.toFixed(2) });
  }

  return result;
}

function getWeekOfMonth(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  return Math.floor((day - 1) / 7) + 1;
}

export const aggregateByPeriod = (data: CandleData[], period: '1d' | '1w' | '1m') => {
    if (period === '1d') return data

    const groups = new Map<string, CandleData[]>()
    for (const candle of data) {

        const [year, month] = candle.date.split('-')

        const key = period === '1w'
            ? `${year}-${month}-W${getWeekOfMonth(candle.date)}`
            : `${year}-${month}`

        const group = groups.get(key) ?? []
        group.push(candle)
        groups.set(key, group)
    }

    const aggregated = Array.from(groups.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([, candles]) => {
            const sorted = candles.sort((a, b) => a.date.localeCompare(b.date))
            return {
                date: sorted[sorted.length - 1].date,
                open: sorted[0].open,
                high: Math.max(...sorted.map((c) => c.high)),
                low: Math.min(...sorted.map((c) => c.low)),
                close: sorted[sorted.length - 1].close,
                volume: sorted.reduce((sum, c) => sum + c.volume, 0),
            }
        })

        .sort((a, b) => a.date.localeCompare(b.date))

    return aggregated
} 


export const LISTTICKER_CONFIG = [
  {
    group: "INDICE MUDIAL",
    items: [
      { symbol: "^BVSP", name: "IBOVESPA" },
      { symbol: "BRL=X", name: "USD/BRL" },
      { symbol: "^VIX", name: "VIX" },
      { symbol: "^GSPC", name: "S&P 500" },
      { symbol: "^IXIC", name: "NASDAQ" },
      { symbol: "DX-Y.NYB", name: "DXY" },
      { symbol: "^STOXX50E", name: "EURO STOXX" },
      { symbol: "^GDAXI", name: "DAX P " },
      { symbol: "^N225", name: "Nikkei" },
      { symbol: "^HSI", name: "HANG SENG" },
      { symbol: "000001.SS", name: "SSE Composite" },
    ],
  },
  {
    group: "IBOVESPA",
    items: [
      { symbol: "VALE3.SA", name: "VALE" },
      { symbol: "ITUB4.SA", name: "BCO ITAU" },
      { symbol: "PETR4.SA", name: "PETROBRAS" },
      { symbol: "AXIA3.SA", name: "AXIA ENERGIA" },
      { symbol: "BBDC4.SA", name: "BCO BRADESCO" },
      { symbol: "SBSP3.SA", name: "SABESP" },

      { symbol: "AURE3.SA", name: "AUREN" },
      { symbol: "CMIG4.SA", name: "CEMIG" },
      { symbol: "ENEV3.SA", name: "ENEVA" },
      { symbol: "ENGI11.SA", name: "ENERGISA" },
      { symbol: "CPFE3.SA", name: "CPFL ENERGIA" },
      { symbol: "CPLE3.SA", name: "COPEL" },
      { symbol: "EGIE3.SA", name: "ENGIE BRASIL" },
      { symbol: "EQTL3.SA", name: "EQUATORIAL" },
      { symbol: "ISAE4.SA", name: "ISA ENERGIA" },
      { symbol: "TAEE11.SA", name: "TAESA" },
      { symbol: "CSMG3.SA", name: "COPASA" },

      { symbol: "BBAS3.SA", name: "BCO BRASIL" },
      { symbol: "BPAC11.SA", name: "BCO BTG" },
      { symbol: "SANB11.SA", name: "BCO SANTANDER" },
      { symbol: "BBSE3.SA", name: "BB SEGURIDADE" },
      { symbol: "CXSE3.SA", name: "CAIXA SEGURI" },
      { symbol: "PSSA3.SA", name: "PORTO SEGURO" },
      { symbol: "ITSA4.SA", name: "ITAUSA" },
      { symbol: "B3SA3.SA", name: "B3" },
      { symbol: "IGTI11.SA", name: "IGUATEMI S.A" },
      { symbol: "ALOS3.SA", name: "ALLOS" },
      { symbol: "MULT3.SA", name: "MULTIPLAN" },

      { symbol: "CURY3.SA", name: "CURY S/A" },
      { symbol: "CYRE3.SA", name: "CYRELA REALT" },
      { symbol: "DIRR3.SA", name: "DIRECIONAL" },
      { symbol: "MRVE3.SA", name: "MRV" },

      { symbol: "CEAB3.SA", name: "CEA MODAS" },
      { symbol: "LREN3.SA", name: "LOJAS RENNER" },
      { symbol: "AZZA3.SA", name: "AZZAS 2154" },
      { symbol: "MGLU3.SA", name: "MAGAZ LUIZA" },
      { symbol: "VIVA3.SA", name: "VIVARA S.A." },
      { symbol: "COGN3.SA", name: "COGNA ON" },
      { symbol: "YDUQ3.SA", name: "YDUQS PART" },
      { symbol: "RENT3.SA", name: "LOCALIZA" },
      { symbol: "VAMO3.SA", name: "VAMOS" },
      { symbol: "SMFT3.SA", name: "SMART FIT" },

      { symbol: "MBRF3.SA", name: "MARFRIG" },
      { symbol: "BEEF3.SA", name: "MINERVA" },
      { symbol: "ABEV3.SA", name: "Ambev" },
      { symbol: "ASAI3.SA", name: "ASSAI" },
      { symbol: "SLCE3.SA", name: "SLC AGRICOLA" },
      { symbol: "NATU3.SA", name: "NATURA" },

      { symbol: "CSNA3.SA", name: "SID NACIONAL" },
      { symbol: "GGBR4.SA", name: "GERDAU" },
      { symbol: "GOAU4.SA", name: "GERDAU MET" },
      { symbol: "USIM5.SA", name: "USIMINAS" },
      { symbol: "BRAP4.SA", name: "BRADESPAR" },
      { symbol: "CMIN3.SA", name: "CSNMINERACAO" },
      { symbol: "KLBN11.SA", name: "KLABIN S/A" },
      { symbol: "SUZB3.SA", name: "SUZANO S.A." },
      { symbol: "BRKM5.SA", name: "BRASKEM" },

      { symbol: "EMBJ3.SA", name: "EMBRAER" },
      { symbol: "POMO4.SA", name: "MARCOPOLO" },
      { symbol: "MOTV3.SA", name: "MOTIVA SA" },
      { symbol: "WEGE3.SA", name: "WEG" },

      { symbol: "FLRY3.SA", name: "FLEURY" },
      { symbol: "RDOR3.SA", name: "REDE D OR" },
      { symbol: "RADL3.SA", name: "RAIADROGASIL" },
      { symbol: "HYPE3.SA", name: "HYPERA" },
      { symbol: "RAIL3.SA", name: "RUMO S.A." },
      { symbol: "HAPV3.SA", name: "HAPVIDA" },

      { symbol: "RECV3.SA", name: "PETRORECSA" },
      { symbol: "CSAN3.SA", name: "COSAN" },
      { symbol: "BRAV3.SA", name: "BRAVA" },
      { symbol: "UGPA3.SA", name: "ULTRAPAR" },
      { symbol: "PRIO3.SA", name: "PRIO" },
      { symbol: "VBBR3.SA", name: "VIBRA" },

      { symbol: "TIMS3.SA", name: "TIMS" },
      { symbol: "VIVT3.SA", name: "TELEF BRASIL" },
      { symbol: "TOTS3.SA", name: "TOTVS" },
    ],
  },
  {
    group: "FINANCEIRO",
    items: [
      { symbol: "ABCB4.SA", name: "BCO ABC BRASIL S.A." },
      { symbol: "BBDC4.SA", name: "BCO BRADESCO" },
      { symbol: "BBAS3.SA", name: "BCO BRASIL" },
      { symbol: "BMGB4.SA", name: "BCO BMG" },
      { symbol: "BPAC11.SA", name: "BCO BTG" },
      { symbol: "SANB11.SA", name: "BCO SANTANDER" },
      { symbol: "ITUB4.SA", name: "BCO ITAU" },
      { symbol: "BBSE3.SA", name: "BB SEGURIDADE" },
      { symbol: "CXSE3.SA", name: "CAIXA SEGURI" },
      { symbol: "PSSA3.SA", name: "PORTO SEGURO" },
      { symbol: "IRBR3.SA", name: "IRBR" },
      { symbol: "WIZC3.SA", name: "WIZC" },
      { symbol: "ITSA4.SA", name: "ITAUSA" },
      { symbol: "SIMH3.SA", name: "SIMPAR S.A." },
      { symbol: "B3SA3.SA", name: "B3" },
      { symbol: "IGTI11.SA", name: "IGUATEMI S.A" },
      { symbol: "ALOS3.SA", name: "ALLOS" },
      { symbol: "MULT3.SA", name: "MULTIPLAN" },
    ],
  },
  {
    group: "ELETRICA",
    items: [
      { symbol: "AXIA3.SA", name: "AXIA ENERGIA" },
      { symbol: "AURE3.SA", name: "AUREN" },
      { symbol: "AFLT3.SA", name: "AFLUENTE" },
      { symbol: "ALUP11.SA", name: "ALUPAR" },
      { symbol: "CMIG4.SA", name: "CEMIG" },
      { symbol: "ENEV3.SA", name: "ENEVA" },
      { symbol: "ENGI11.SA", name: "ENERGISA" },
      { symbol: "CPFE3.SA", name: "CPFL ENERGIA" },
      { symbol: "CPLE3.SA", name: "COPEL" },
      { symbol: "EGIE3.SA", name: "ENGIE BRASIL" },
      { symbol: "EQTL3.SA", name: "EQUATORIAL" },
      { symbol: "ISAE4.SA", name: "ISA ENERGIA" },
      { symbol: "TAEE11.SA", name: "TAESA" },
      { symbol: "CSMG3.SA", name: "COPASA" },
    ],
  },
  {
    group: "PESSOAL",
    items: [
      { symbol: "CMIG4.SA", name: "CEMIG" },
      { symbol: "SAPR4.SA", name: "SANEPAR" },
      { symbol: "GOAU4.SA", name: "GERDAU MET" },
      { symbol: "BPAC11.SA", name: "BCO BTG" },
      { symbol: "BMGB4.SA", name: "BCO BMG" },
      { symbol: "MEAL3.SA", name: "IMC" },
    ],
  },
];
