
"use client"



import { Bar, BarChart, CartesianGrid, ComposedChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { dadosGraficoDFC, pivotarDados, VariacaoPercentualContasDFC } from "@/utils/balance"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"


interface Props {
    dados: any[]
}

export function BalanceDfcChart({ dados }: Props) {

    const dadosGrafico = dadosGraficoDFC(dados)
    const dadosVariacaoContas = VariacaoPercentualContasDFC(dados)

    const barChartConfig = {
        caixa_liquido: { label: "Caixa Líquido", color: "hsl(221, 83%, 53%)" },
        caixa_gerado: { label: "Caixa Gerado", color: "hsl(262, 83%, 58%)" },
        fluxo_caixa: { label: "Fluxo Caixa Líquido", color: "hsl(142, 71%, 45%)" },

    } satisfies ChartConfig

    const saidaChartConfig = {
        caixa_investimento: { label: "FCI", color: "hsl(0, 84%, 60%)" },
        caixa_financiamento: { label: "FCF", color: "hsl(25, 95%, 53%)" },
        fluxo_caixa: { label: "Fluxo Caixa Líquido", color: "hsl(142, 71%, 45%)" },

    } satisfies ChartConfig

    const metricChartConfig = {
        cobertura_investimento: { label: "Cobertura Investimento", color: "hsl(221, 83%, 53%)" },
        reinvestimento: { label: "Tx. Reinvestimento", color: "hsl(262, 83%, 58%)" },
        relativo: { label: "Relativo", color: "hsl(142, 71%, 45%)" }
    } satisfies ChartConfig

    const varicaoChartConfig = {
        fco: { label: "Fluxo Caixa Operacional", color: "hsl(221, 83%, 53%)" },
        fci: { label: "Fluxo Caixa Investimento", color: "hsl(262, 83%, 58%)" },
        fcf: { label: "Fluxo Caixa Financiamento", color: "hsl(142, 71%, 45%)" },

    } satisfies ChartConfig


    
    const escalaMoeda = dados[0]?.ESCALA_MOEDA ?? "-"
    const { colunas, linhas } = pivotarDados(dados)
    const [contaFiltro, setContaFiltro] = useState<string>("selecionadas")
    const contasDisponiveis = [
        '6.01', '6.01.01', '6.01.02', '6.02', '6.03', '6.04', '6.05'
    ]
    const linhasFiltradas = contaFiltro === "todas"
        ? linhas
        : contaFiltro === "selecionadas"
            ? linhas.filter((linha) => contasDisponiveis.includes(linha.CD_CONTA))
            : linhas.filter((linha) => linha.CD_CONTA.startsWith(contaFiltro))

    return (
        <div className="space-y-6">

            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">
                                    Fluxo Caixa Operacinal
                                </CardTitle>

                                <p className="text-sm text-muted-foreground mt-1">
                                    Evolução histórica dos resultados
                                </p>
                            </div>

                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    FCO
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                                    Caixa Gerado nas Operações
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    FCL
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl bg-linear-to-b from-muted/20 to-background p-4">
                            <ChartContainer
                                config={barChartConfig}
                                className="h-95 w-full">
                                <ComposedChart
                                    data={dadosGrafico}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 20,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        opacity={0.3}
                                    />
                                    <XAxis
                                        dataKey="period"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tickFormatter={(value) =>
                                            `${(value / 1000000).toFixed(1)}M`
                                        }
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />
                                    <Bar
                                        dataKey="caixa_liquido"
                                        fill="var(--color-caixa_liquido)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    />

                                    <Bar
                                        dataKey="caixa_gerado"
                                        fill="var(--color-caixa_gerado)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    />

                                    <Line
                                        dataKey="fluxo_caixa"
                                        stroke="var(--color-fluxo_caixa)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "var(--color-fluxo_caixa)",
                                        }}
                                        activeDot={{
                                            r: 8,
                                        }}
                                        type="monotone"
                                    />
                                </ComposedChart>
                            </ChartContainer>

                        </div>

                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">
                                    Fluxo Financeiro de Saída
                                </CardTitle>
                                <CardDescription>
                                    Evolução dos gasto operacionais sobre o ativo
                                </CardDescription>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    FCI
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                                    FCF
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    FCL
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl bg-linear-to-b from-muted/20 to-background p-4">
                            <ChartContainer config={saidaChartConfig} className="h-95 w-full">
                                <ComposedChart
                                    data={dadosGrafico}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 20,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        opacity={0.25}
                                    />

                                    <XAxis
                                        dataKey="period"
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <YAxis
                                        tickFormatter={(value) =>
                                            `${(value / 1000000).toFixed(1)}M`
                                        }
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />
                                    <Bar
                                        dataKey="caixa_investimento"
                                        fill="var(--color-caixa_investimento)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={35}
                                    />
                                    <Bar
                                        dataKey="caixa_financiamento"
                                        fill="var(--color-caixa_financiamento)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={35}
                                    />
                                    <Line
                                        dataKey="fluxo_caixa"
                                        stroke="var(--color-fluxo_caixa)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "var(--color-fluxo_caixa)",
                                        }}
                                        activeDot={{
                                            r: 8,
                                        }}
                                        type="monotone"
                                    />
                                </ComposedChart>

                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">
                                    Evolução das Metricas
                                </CardTitle>

                                <CardDescription className="mt-1">
                                    CI = ( FCO / FCI),
                                    TR = (FCI / FCO),
                                    FCL- R = (FCL/FCO) (%)
                                </CardDescription>
                            </div>

                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    C.Investimento
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    T.Reinvestimento
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-violet-500" />
                                    FCL Rel
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl bg-linear-to-b from-muted/20 to-background p-4">
                            <ChartContainer
                                config={metricChartConfig}
                                className="h-95 w-full"
                            >
                                <LineChart
                                    data={dadosGrafico}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 20,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        opacity={0.25}
                                    />

                                    <XAxis
                                        dataKey="period"
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <YAxis
                                        tickFormatter={(value) => `${value}%`}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, "auto"]}
                                    />

                                    <ChartTooltip
                                        content={<ChartTooltipContent />}

                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="cobertura_investimento"
                                        name="Cobertura Investimento"
                                        stroke="var(--color-cobertura_investimento)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "var(--color-cobertura_investimento)",
                                        }}
                                        activeDot={{
                                            r: 8,
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="reinvestimento"
                                        name="Tx. Reinvestimento"
                                        stroke="var(--color-reinvestimento)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "var(--color-reinvestimento)",
                                        }}
                                        activeDot={{
                                            r: 8,
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="relativo"
                                        name="FCL Relativo"
                                        stroke="var(--color-relativo)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "var(--color-relativo)",
                                        }}
                                        activeDot={{
                                            r: 8,
                                        }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">
                                    Variação Percentual
                                </CardTitle>

                                <CardDescription className="mt-1">
                                    Crescimento em 5 anos, 10 anos e no período total
                                </CardDescription>
                            </div>

                            <div className="flex flex-wrap gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    FCO
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-violet-500" />
                                    FCI
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    FCF
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-xl bg-linear-to-b from-muted/20 to-background p-4">
                            <ChartContainer
                                config={varicaoChartConfig}
                                className="h-95 w-full"
                            >
                                <BarChart
                                    data={dadosVariacaoContas}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 20,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        opacity={0.3}
                                    />

                                    <XAxis
                                        dataKey="periodo"
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <YAxis
                                        tickFormatter={(value) => `${value}%`}
                                        tickLine={false}
                                        axisLine={false}
                                    />

                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />

                                    <Bar
                                        dataKey="fco"
                                        fill="var(--color-fco)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    />

                                    <Bar
                                        dataKey="fci"
                                        fill="var(--color-fci)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    />

                                    <Bar
                                        dataKey="fcf"
                                        fill="var(--color-fcf)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>

            </div >



            {/* table */}
            < Card className="border-0 shadow-xl rounded-2xl overflow-hidden" >
                <CardHeader className="bg-muted/40 border-b flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold">
                            Demonstração do Resultado do Exercício
                        </CardTitle>

                        <p className="text-sm text-muted-foreground mt-1">
                            Valores em {escalaMoeda}
                        </p>
                    </div>

                    <Select value={contaFiltro} onValueChange={setContaFiltro}>
                        <SelectTrigger className="w-52">
                            <SelectValue placeholder="Filtrar conta" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="selecionadas">
                                Principais Contas
                            </SelectItem>

                            <SelectItem value="todas">
                                Todas as Contas
                            </SelectItem>

                            {contasDisponiveis.map((conta) => (
                                <SelectItem key={conta} value={conta}>
                                    {conta}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="max-h-175 overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                                <TableRow>
                                    <TableHead className="w-32 font-semibold">
                                        Código
                                    </TableHead>

                                    <TableHead className="max-h-175 font-semibold">
                                        Conta
                                    </TableHead>

                                    {colunas.map((col) => (
                                        <TableHead
                                            key={col.key}
                                            className={`font-semibold ${col.isAH
                                                ? "text-center"
                                                : "text-right"
                                                }`}
                                        >
                                            {col.label}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {linhasFiltradas.map((linha, index) => (
                                    <TableRow
                                        key={index}
                                        className="
                                hover:bg-muted/40
                                transition-colors
                                even:bg-muted/10
                            "
                                    >
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {linha.CD_CONTA}
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            {linha.DS_CONTA}
                                        </TableCell>

                                        {colunas.map((col) => (
                                            <TableCell
                                                key={col.key}
                                                className={
                                                    col.isAH
                                                        ? "text-center"
                                                        : "text-right"
                                                }
                                            >
                                                {col.isAH ? (
                                                    linha[col.key] !== null ? (
                                                        <span
                                                            className={`
                                                    inline-flex
                                                    items-center
                                                    rounded-full
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    ${linha[col.key] >= 0
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                                }
                                                `}
                                                        >
                                                            {linha[col.key] >= 0 ? "▲" : "▼"}{" "}
                                                            {linha[col.key].toFixed(1)}%
                                                        </span>
                                                    ) : (
                                                        "-"
                                                    )
                                                ) : linha[col.key] !== undefined ? (
                                                    <span className="font-medium">
                                                        {Number(
                                                            linha[col.key]
                                                        ).toLocaleString(
                                                            "pt-BR",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </span>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card >
        </div >
    )
}