'use client'

import { DataPoint } from "@/lib/bacen-api";
import { BacenSeries } from "@/lib/serie-bacen"
import { formatTick, getStartDate } from "@/utils/bacen";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


interface Props {
    series: BacenSeries;
    range: string
}

export default function SeriesChart({ series, range }: Props) {

    const [data, setData] = useState<DataPoint[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        setLoading(true)
        setError(false)
        const start = getStartDate(range)
        const end = new Date().toLocaleDateString("pt-BR")
        fetch(`/api/bacen?code=${series.code}&start=${start}&end=${end}`)
            .then((r) => r.json())
            .then((d) => {
                if (Array.isArray(d)) setData(d)
                else setError(true)
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [series.code, range])

    const lastValue = data[data.length - 1]?.value
    const prevValue = data[data.length - 2]?.value
    const change = lastValue !== undefined && prevValue !== undefined ? lastValue - prevValue : null
    const trimed = data.length > 120
        ? data.filter((_, i) => i % Math.ceil(data.length / 120) === 0)
        : data;
    const minVal = Math.min(...trimed.map((d) => d.value))
    const maxVal = Math.max(...trimed.map((d) => d.value))
    const domain: [number, number] = [
        minVal - (maxVal - minVal) * 0.05,
        minVal + (maxVal - minVal) * 0.05,
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <div key={i}
                            className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{ background: series.color, animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
            </div>
        )
    }
    if (error || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-sm text-slate-400 dark:text-slate-500">
                Sem dados disponíveis
            </div>
        )
    }

    return (
        <>
            <div className="flex items-end justify-between mb-3">
                <>
                    <div className="flex items-baseline gap-1 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                        {lastValue !== undefined
                            ? lastValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : "-"
                        }
                        {lastValue !== undefined && series.unid && (
                            <span className="text-base font-normal text-slate-500 dark:text-slate-400 lowercase">
                                {series.unid}
                            </span>
                        )}
                    </div>
                </>
                {change !== null && (
                    <div className="flex items-center gap-1 text-sm font-medium"
                        style={{ color: change > 0 ? "#1D9E75" : change < 0 ? "#D85A30" : "#888" }}
                    >
                        {change > 0 ? (
                            <TrendingUp size={14} />
                        ) : change < 0 ? (
                            <TrendingDown size={14} />
                        ) : (
                            <Minus size={14} />
                        )}
                        {Math.abs(change).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                    </div>
                )}
            </div>
            <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={trimed} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                        <linearGradient id={`grad-${series.code}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={series.color} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={series.color} stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => formatTick(v, range)}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        domain={domain}
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        tickLine={false}
                        axisLine={false}
                        width={36}
                        tickFormatter={(v) =>
                            v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })
                        }
                    />
                    <Tooltip
                        contentStyle={{
                            background: "#1e293b",
                            border: "none",
                            borderRadius: 8,
                            color: "#f1f5f9",
                            fontSize: 12,
                            padding: "6px 10px",
                        }}
                        itemStyle={{ color: series.color }}
                        formatter={(v) => [
                            Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " " + series.unid,
                            series.name,
                        ]}
                        labelStyle={{ color: "#94a3b8", marginBottom: 2 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={series.color}
                        strokeWidth={1.5}
                        fill={`url(#grad-${series.code})`}
                        dot={false}
                        activeDot={{ r: 3, fill: series.color, stroke: "#fff", strokeWidth: 2 }}
                    />
                </AreaChart>

            </ResponsiveContainer>


        </>
    )
}