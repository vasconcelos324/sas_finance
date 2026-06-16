"use client"

import YahooFinanceChart from "@/components/chart/PriceFinanceChart"
import HeaderPriceFinance from "@/components/header/Header-Price-Finance"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { aggregateByPeriod, LISTTICKER_CONFIG } from "@/utils/price-finance"
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react"
import { useEffect, useMemo, useState } from "react"




export interface CandleData {
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
}

interface ListItem {
    symbol: string
    name: string
    price?: number
    change?: number
    changePercent?: number
    loading?: boolean
}


export default function YahooFinancePage() {
    const [ticker, setTicker] = useState('^BVSP')
    const [periodo, setPeriodo] = useState<'1d' | '1w' | '1m'>('1d')
    const [dailyData, setDailyData] = useState<CandleData[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handlePeriodoChange = (value: string) => {
        if (value === '1d' || value === '1w' || value === '1m') {
            setPeriodo(value)
        }
    }

    const candleData = useMemo(() => aggregateByPeriod(dailyData, periodo), [dailyData, periodo])

    useEffect(() => {
        const fetchCandles = async () => {
            setLoading(true)
            setError(null)
            try {
                const interval = '1d'
                const range = '10y'
                const res = await fetch(
                    `/api/price-finance?symbol=${encodeURIComponent(ticker)}&interval=${interval}&range=${range}`,
                )

                if (!res.ok) {
                    const errorData = await res.json().catch(() => null)
                    throw new Error(errorData?.error || `Erro ao carregar dados (${res.status})`)
                }

                const data = await res.json()
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('Sem dados de candle disponíveis.')
                }

                setDailyData(data)
            } catch (err) {
                setDailyData([])
                setError(err instanceof Error ? err.message : 'Erro ao carregar dados.')
            } finally {
                setLoading(false)
            }
        }

        fetchCandles()
    }, [ticker])

    const handleTickerChange = (newTicker: string) => {
        if (newTicker && newTicker !== ticker)
            setTicker(newTicker.toUpperCase())
    }

    const [listData, setListData] = useState<Record<string, ListItem>>({})
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ 'Ibovespa': true, 'Tech EUA': true })
    const toggleGroup = (group: string) =>
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
    const [showList, setShowList] = useState(true)
    const [sortKey, setSortKey] = useState<'price' | 'change' | ''>('')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    const sortedGroupItems = useMemo(() => {
        return LISTTICKER_CONFIG.map(group => ({
            ...group,
            items: [...group.items].sort((a, b) => {
                if (!sortKey) {
                    return a.symbol.localeCompare(b.symbol)
                }

                const first = listData[a.symbol]?.[sortKey]
                const second = listData[b.symbol]?.[sortKey]

                if (first == null && second == null) {
                    return a.symbol.localeCompare(b.symbol)
                }
                if (first == null) return 1
                if (second == null) return -1

                const diff = (first as number) - (second as number)
                return diff === 0 ? a.symbol.localeCompare(b.symbol) : (sortDirection === 'asc' ? diff : -diff)
            }),
        }))
    }, [sortKey, sortDirection, listData])

    const handleSort = (key: 'price' | 'change') => {
        if (sortKey === key) {
            setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'))
        } else {
            setSortKey(key)
            setSortDirection('desc')
        }
    }

    useEffect(() => {
        const allSymbols = LISTTICKER_CONFIG.flatMap(g => g.items.map(i => i.symbol))
        setListData(
            Object.fromEntries(allSymbols.map(s => [s, { symbol: s, name: '', loading: true }]))
        )
        Promise.allSettled(
            allSymbols.map(async (symbol) => {
                try {
                    const res = await fetch(
                        `/api/price-finance?symbol=${encodeURIComponent(symbol)}&interval=1d&range=5d`
                    )
                    if (!res.ok) throw new Error()
                    const data = await res.json()

                    if (!Array.isArray(data) || data.length < 2) throw new Error()

                    const last = data[data.length - 1]
                    const prev = data[data.length - 2]
                    const change = ((last.close - prev.close) / prev.close) * 100

                    setListData(prev => ({
                        ...prev,
                        [symbol]: {
                            symbol,
                            name: '',
                            price: last.close,
                            change,
                            loading: false,
                        },
                    }))
                } catch {
                    setListData(prev => ({
                        ...prev,
                        [symbol]: { symbol, name: '', loading: false },
                    }))
                }
            })
        )

    }, [])


    return (
        <div className="flex h-screen flex-col overflow-hidden bg-black">
            <HeaderPriceFinance
                ticker={handleTickerChange}
                periodo={handlePeriodoChange}
                selectedPeriod={periodo}
            />
            <div className="flex flex-1 flex-row-reverse min-h-0 overflow-hidden h-0">
                <Card
                    className={`
        overflow-hidden flex flex-col h-full min-h-0
        transition-all duration-300
        bg-[#131722] border-l border-[#2a2e39]
        ${showList ? 'w-[320px] min-w-[320px]' : 'w-10 min-w-10'}
    `}
                >

                    <div className="px-3 py-2 border-b border-[#2a2e39] flex items-center justify-between shrink-0">
                        {showList && (
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-semibold text-white">Lista Companhia</span>
                            </div>
                        )}
                        <Button
                            onClick={() => setShowList(!showList)}
                            variant="ghost"
                            className="h-7 w-7 p-0 text-[#787b86] hover:text-white hover:bg-[#2a2e39]"
                        >
                            {showList ? '»' : '«'}
                        </Button>
                    </div>

                    {showList && (
                        <div className="grid grid-cols-[1fr_80px_64px] px-3 py-1.5 border-b border-[#2a2e39] shrink-0">
                            <span className="text-[11px] text-[#787b86]">Símbolo</span>
                            <button
                                type="button"
                                onClick={() => handleSort('price')}
                                className="flex items-center justify-end gap-1 text-[11px] text-[#787b86]"
                            >
                                Preço
                                {sortKey === 'price' ? (
                                    sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                                ) : (
                                    <span className="w-3 h-3" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSort('change')}
                                className="flex items-center justify-end gap-1 text-[11px] text-[#787b86]"
                            >
                                Var%
                                {sortKey === 'change' ? (
                                    sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                                ) : (
                                    <span className="w-3 h-3" />
                                )}
                            </button>
                        </div>
                    )}

                    <div className="flex-1 min-h-0 overflow-y-auto">
                        {sortedGroupItems.map(group => (
                            <div key={group.group}>
                                <button
                                    onClick={() => toggleGroup(group.group)}
                                    className="w-full flex items-center gap-1.5 px-3 py-1.5 bg-[#1e222d] border-b border-[#2a2e39] text-[#787b86] text-[11px] uppercase tracking-[0.8px] font-medium"
                                >
                                    <ChevronRight
                                        className={`w-3 h-3 transition-transform duration-150 ${expandedGroups[group.group] ? 'rotate-90' : ''}`}
                                    />
                                    {group.group}
                                </button>

                                {expandedGroups[group.group] &&
                                    group.items.map(item => {
                                        const w = listData[item.symbol]
                                        const isActive = ticker === item.symbol
                                        const pos = (w?.change ?? 0) >= 0
                                        const symbolClean = item.symbol.replace('.SA', '').replace('^', '')
                                        const avatarColors = ['#2962ff', '#0097a7', '#e91e63', '#ff6d00', '#6200ea', '#00897b', '#c62828']
                                        const colorIdx = symbolClean.charCodeAt(0) % avatarColors.length
                                        const avatarBg = avatarColors[colorIdx]

                                        return (
                                            <button
                                                key={item.symbol}
                                                onClick={() => handleTickerChange(item.symbol)}
                                                className={`
                                    w-full grid grid-cols-[auto_1fr_80px_64px] items-center gap-2
                                    px-3 py-2 border-b border-[#2a2e39]
                                    transition-colors duration-100 text-left
                                    ${isActive ? 'bg-[#2a2e39]' : 'hover:bg-[#1e222d]'}
                                `}
                                            >

                                                <div
                                                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                                    style={{ background: avatarBg }}
                                                >
                                                    {symbolClean.slice(0, 2)}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className={`text-[13px] font-semibold truncate leading-tight ${isActive ? 'text-white' : 'text-[#d1d4dc]'}`}>
                                                        {symbolClean}
                                                    </div>
                                                    <div className="text-[11px] text-[#787b86] truncate leading-tight">
                                                        {item.name}
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    {w?.loading ? (
                                                        <div className="w-12 h-4 rounded bg-[#2a2e39] animate-pulse ml-auto" />
                                                    ) : (
                                                        <span className="text-[13px] font-medium text-[#d1d4dc] tabular-nums">
                                                            {w?.price != null ? w.price.toFixed(2) : '—'}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-right">
                                                    {w?.loading ? (
                                                        <div className="w-10 h-4 rounded bg-[#2a2e39] animate-pulse ml-auto" />
                                                    ) : w?.change != null ? (
                                                        <span className={`text-[12px] font-medium tabular-nums ${pos ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                                                            {pos ? '+' : ''}{w.change.toFixed(2)}%
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </button>
                                        )
                                    })}
                            </div>
                        ))}
                    </div>
                </Card>


                <main className="flex-1 min-w-0 overflow-hidden h-full p-0">
                    {loading ? (
                        <div className="flex h-full items-center justify-center bg-[#1e222d] border-r border-y border-[#2a2e39] px-6">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-10 w-10 rounded-full border-4 border-white/10 border-t-white animate-spin" />
                                <span className="text-sm text-white/80">Carregando dados...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex h-full items-center justify-center bg-[#1e222d] border-r border-y border-[#2a2e39] px-6 text-center">
                            <div>
                                <p className="text-base font-semibold text-white">Erro ao carregar</p>
                                <p className="mt-2 text-sm text-[#d1d4dc]">{error}</p>
                            </div>
                        </div>
                    ) : candleData.length > 0 ? (
                        <div className="bg-[#1e222d] border-r border-y border-[#2a2e39] overflow-hidden h-full">
                            <YahooFinanceChart
                                data={candleData}
                                ticker={ticker}
                                colors={{
                                    backgroundColor: '#1e222d',
                                    textColor: '#b2b5be',
                                    upColor: '#26a69a',
                                    downColor: '#ef5350',
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center bg-[#1e222d] border-r border-y border-[#2a2e39] px-6 text-center">
                            <p className="text-sm text-white/80">Selecione um ativo ou aguarde enquanto os dados são carregados.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>


    )
}