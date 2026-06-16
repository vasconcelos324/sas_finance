import { useEffect, useRef } from 'react'
import {
    createChart,
    ColorType,
    IChartApi,
    CandlestickSeries,
    HistogramSeries,
    LineSeries,
} from 'lightweight-charts'
import { calculateRSI, calculateSMA } from '@/utils/price-finance'


interface CandleData {
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
}

interface Props {
    data: CandleData[]
    ticker: string
    colors?: {
        backgroundColor?: string
        textColor?: string
        upColor?: string
        downColor?: string
    }
}


export default function YahooFinanceChart({
    data,
    ticker,
    colors = {},
}: Props) {

    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)


    const {
        backgroundColor = '#1e222d',
        textColor = '#b2b5be',
        upColor = '#26a69a',
        downColor = '#ef5350',
    } = colors

    useEffect(() => {
        if (!chartContainerRef.current || data.length === 0) return

        if (chartRef.current) {
            chartRef.current.remove()
            chartRef.current = null
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: {
                    type: ColorType.Solid,
                    color: backgroundColor,
                },
                textColor,
                fontSize: 11,
            },
            width: chartContainerRef.current.clientWidth,
            height: 700,
            grid: {
                vertLines: { color: '#2a2e39' },
                horzLines: { color: '#2a2e39' },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: '#758696',
                    width: 1,
                    style: 0,
                    labelBackgroundColor: '#363c4e',
                },
                horzLine: {
                    color: '#758696',
                    width: 1,
                    style: 0,
                    labelBackgroundColor: '#363c4e',
                },
            },
            timeScale: {
                borderColor: '#2a2e39',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: '#2a2e39',
                autoScale: true,
                textColor,
            },
        })

        const candleSeries = chart.addSeries(
            CandlestickSeries,
            {
                upColor,
                downColor,
                borderUpColor: upColor,
                borderDownColor: downColor,
                wickUpColor: upColor,
                wickDownColor: downColor,
                priceLineVisible: false,
            }
        )

        const candleData = data.map(candle => ({
            time: (new Date(candle.date).getTime() / 1000) as any,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
        }))

        candleSeries.setData(candleData)

        const volumeSeries = chart.addSeries(
            HistogramSeries,// 
            {
                priceFormat: { type: 'volume' },
                priceScaleId: 'volume',
                priceLineVisible: false,
            }
        )

        volumeSeries.setData(
            data.map(candle => ({
                time: (new Date(candle.date).getTime() / 1000) as any,
                value: candle.volume,
                color:
                    candle.close >= candle.open
                        ? 'rgba(38,166,154,0.35)'
                        : 'rgba(239,83,80,0.35)',
            }))
        )

        chart.priceScale('volume').applyOptions({
            scaleMargins: {
                top: 0.82,
                bottom: 0,
            },
        })

        const sma9Line = chart.addSeries(LineSeries, {
            color: '#f5d85c',
            lineWidth: 1,
            crosshairMarkerVisible: false,
            lastValueVisible: true,
            priceLineVisible: false,
        })

        sma9Line.setData(
            calculateSMA(candleData, 9) as any
        )

        const sma21Line = chart.addSeries(LineSeries, {
            color: '#e0d9ca',
            lineWidth: 1,
            crosshairMarkerVisible: false,
            lastValueVisible: true,
            priceLineVisible: false,
        })

        sma21Line.setData(
            calculateSMA(candleData, 21) as any
        )

        const sma200Line = chart.addSeries(LineSeries, {
            color: '#5b9cf6',
            lineWidth: 2,
            crosshairMarkerVisible: false,
            lastValueVisible: true,
            priceLineVisible: false,
        })

        sma200Line.setData(
            calculateSMA(candleData, 200) as any
        )

        const rsiSeries = chart.addSeries(
            LineSeries,
            {
                color: '#000000',
                lineWidth: 1,
                priceLineVisible: false,
                lastValueVisible: true,
                crosshairMarkerVisible: false,
            },
            1
        )

        const rsiData = calculateRSI(
            candleData.map(c => ({
                time: c.time,
                close: c.close,
            })),
            21
        )

        rsiSeries.setData(rsiData as any)

        rsiSeries.createPriceLine({
            price: 70,
            color: '#ef5350',
            lineWidth: 1,
            axisLabelVisible: false,
        })

        rsiSeries.createPriceLine({
            price: 30,
            color: '#00ff00',
            lineWidth: 1,
            axisLabelVisible: false,
        })

        const panes = chart.panes()

        if (panes.length >= 2) {
            panes[0].setHeight(550)
            panes[1].setHeight(150)
        }

        chart.timeScale().fitContent()

        chartRef.current = chart

        const handleResize = () => {
            if (!chartContainerRef.current) return

            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)

            if (chartRef.current) {
                chartRef.current.remove()
                chartRef.current = null
            }
        }
    }, [
        data,
        backgroundColor,
        textColor,
        upColor,
        downColor,
    ])
    if (data.length === 0) return null

    return (
        <div className="bg-[#1e222d] rounded-lg overflow-hidden p-0 relative">
            <div className="text-[72px] font-black text-white/8 whitespace-nowrap">
                {ticker}
            </div>
            <div
                ref={chartContainerRef}
                className="w-full flex-1"
            />
        </div>
    )
}