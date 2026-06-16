
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { pivotarDados, prepararDadosGrafico, prepararVariacaoPercentualContas } from "@/utils/balance"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, LineChart, XAxis, YAxis } from "recharts"


interface Props {
    dados: any[]
}

export function BalanceDreChart({ dados }: Props) {
    const { colunas, linhas } = pivotarDados(dados)
    const escalaMoeda = dados[0]?.ESCALA_MOEDA ?? "-"
    const [contaFiltro, setContaFiltro] = useState<string>("selecionadas")
    const contasDisponiveis = [
        "3.01", "3.02", "3.03", "3.04", "3.04.02",
        "3.05", "3.06", "3.07", "3.08", "3.09", "3.11"
    ]

    const linhasFiltradas = contaFiltro === "todas"
        ? linhas
        : contaFiltro === "selecionadas"
            ? linhas.filter((linha) => contasDisponiveis.includes(linha.CD_CONTA))
            : linhas.filter((linha) => linha.CD_CONTA.startsWith(contaFiltro))

    const dadosGrafico = prepararDadosGrafico(dados)
    const dadosVariacaoContas = prepararVariacaoPercentualContas(dados)

    const barChartConfig = {
        receita: { label: "Receita Bruta", color: "hsl(221, 83%, 53%)" },
        ebit: { label: "EBIT", color: "hsl(262, 83%, 58%)" },
        lucro: { label: "Lucro Líquido", color: "hsl(142, 71%, 45%)" },
    } satisfies ChartConfig

    const custoChartConfig = {
        custo: { label: "Custo", color: "hsl(0, 84%, 60%)" },
        despesa: { label: "Despesa", color: "hsl(25, 95%, 53%)" },
        lucro: { label: "Lucro Líquido", color: "hsl(142, 71%, 45%)" },
    } satisfies ChartConfig

    const margemChartConfig = {
        bruta: { label: "Margem Bruta", color: "hsl(221, 83%, 53%)" },
        operacional: { label: "Margem Operacional", color: "hsl(262, 83%, 58%)" },
        liquida: { label: "Margem Líquida", color: "hsl(142, 71%, 45%)" },
    } satisfies ChartConfig


    const variacaoChartConfig = {
        receita: { label: "Receita", color: "hsl(221, 83%, 53%)" },
        ebit: { label: "EBIT", color: "hsl(262, 83%, 58%)" },
        lucro: { label: "Lucro", color: "hsl(142, 71%, 45%)" },
    } satisfies ChartConfig

    return (
        <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">
                                    Receita, EBIT e Lucro
                                </CardTitle>

                                <p className="text-sm text-muted-foreground mt-1">
                                    Evolução histórica dos resultados
                                </p>
                            </div>

                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    Receita
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                                    EBIT
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    Lucro
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-xl bg-linear-to-b from-muted/20 to-background p-4">
                            <ChartContainer
                                config={barChartConfig}
                                className="h-95 w-full"
                            >
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
                                        dataKey="receita"
                                        fill="var(--color-receita)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    />

                                    <Bar
                                        dataKey="ebit"
                                        fill="var(--color-ebit)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    />

                                    <Line
                                        dataKey="lucro"
                                        stroke="var(--color-lucro)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "var(--color-lucro)",
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
                                    Custos & Despesas
                                </CardTitle>

                                <CardDescription className="mt-1">
                                    Evolução dos gastos operacionais e lucro
                                </CardDescription>
                            </div>

                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500 " />
                                    Custo
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                                    Despesa
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    Lucro
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-xl bg-linear-to-b from-muted/20 to-background p-4">
                            <ChartContainer
                                config={custoChartConfig}
                                className="h-95 w-full"
                            >
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
                                        dataKey="custo"
                                        fill="var(--color-custo)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={35}
                                    />

                                    <Bar
                                        dataKey="despesa"
                                        fill="var(--color-despesa)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={35}
                                    />

                                    <Line
                                        dataKey="lucro"
                                        stroke="var(--color-lucro)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "var(--color-lucro)",
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
                                    Evolução das Margens
                                </CardTitle>

                                <CardDescription className="mt-1">
                                    Margem Bruta, EBIT e Líquida (%)
                                </CardDescription>
                            </div>

                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    Bruta
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    EBIT
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-violet-500" />
                                    Líquida
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-xl bg-linear-to-b from-muted/20 to-background p-4">
                            <ChartContainer
                                config={margemChartConfig}
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
                                        opacity={0.3}
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
                                        dataKey="bruta"
                                        name="Margem Bruta"
                                        stroke="var(--color-bruta)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "var(--color-bruta)",
                                        }}
                                        activeDot={{
                                            r: 8,
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="operacional"
                                        name="Margem Operacional"
                                        stroke="var(--color-operacional)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "var(--color-operacional)",
                                        }}
                                        activeDot={{
                                            r: 8,
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="liquida"
                                        name="Margem Líquida"
                                        stroke="var(--color-liquida)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "var(--color-liquida)",
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
                                    Receita
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-violet-500" />
                                    EBIT
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    Lucro
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-xl bg-linear-to-b from-muted/20 to-background p-4">
                            <ChartContainer
                                config={variacaoChartConfig}
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
                                        dataKey="receita"
                                        fill="var(--color-receita)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    />

                                    <Bar
                                        dataKey="ebit"
                                        fill="var(--color-ebit)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    />

                                    <Bar
                                        dataKey="lucro"
                                        fill="var(--color-lucro)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/40 border-b flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold">
                            Demonstração do Resultado do Exercício</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Valores em {escalaMoeda}
                        </p>
                    </div>
                    <Select value={contaFiltro} onValueChange={setContaFiltro}>
                        <SelectTrigger className="w-52">
                            <SelectValue placeholder="Filtrar conta" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="selecionadas">Selecionadas</SelectItem>
                            <SelectItem value="todas">Todas</SelectItem>
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
            </Card>
        </div>
    )
}