import { useEffect, useRef } from 'react'
import {
    createChart,
    ColorType,
    IChartApi,
    CandlestickSeries,
    HistogramSeries,
    LineSeries,
    AreaSeries,
    BaselineSeries,
} from 'lightweight-charts'
import { calculateDrawdown, calculateRSI, calculateSMA } from '@/utils/price-finance'


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
            height: 930,
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

        const lastRSI =
            rsiData[rsiData.length - 1]?.value ?? 0



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

        const drawdownData = calculateDrawdown(
            candleData.map(c => ({
                time: c.time,
                close: c.close,
            }))
        )

        const drawdownSeries = chart.addSeries(
            BaselineSeries,
            {
                baseValue: {
                    type: 'price',
                    price: 0,
                },

                topLineColor: 'rgba(255,255,255,0)',
                topFillColor1: 'rgba(255,255,255,0)',
                topFillColor2: 'rgba(255,255,255,0)',

                bottomLineColor: '#ff6b6b',
                bottomFillColor1: 'rgba(255,107,107,0.45)',
                bottomFillColor2: 'rgba(255,107,107,0.02)',

                lineWidth: 2,

                priceLineVisible: false,
                lastValueVisible: true,
                crosshairMarkerVisible: false,

                priceFormat: {
                    type: 'custom',
                    formatter: (price: number) =>
                        `${price.toFixed(2)}%`,
                },
            },
            2
        )

        const drawdownLabel = document.createElement('div')

        drawdownLabel.innerHTML = `
    <span style="
        color:#ff6b6b;
        font-size:12px;
        font-weight:600;
    ">
        Drawdown (%)
    </span>
`

        drawdownLabel.style.position = 'absolute'
        drawdownLabel.style.left = '10px'
        drawdownLabel.style.bottom = '70px'
        drawdownLabel.style.zIndex = '10'

        chartContainerRef.current?.appendChild(drawdownLabel)

        drawdownSeries.setData(drawdownData as any)

        drawdownSeries.createPriceLine({
            price: 0,
            color: '#8b949e',
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
        })

        drawdownSeries.createPriceLine({
            price: -10,
            color: 'rgba(255,255,255,0.15)',
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
        })

        drawdownSeries.createPriceLine({
            price: -20,
            color: 'rgba(255,255,255,0.15)',
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
        })

        drawdownSeries.createPriceLine({
            price: -30,
            color: 'rgba(255,255,255,0.15)',
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: false,
        })

        const panes = chart.panes()

        if (panes.length >= 2) {
            panes[0].setHeight(550)
            panes[1].setHeight(150)
            panes[2].setHeight(140)

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
            <div className="absolute top-2 left-4 z-10 text-[72px] font-black text-white/8 whitespace-nowrap leading-none pointer-events-none">
                {ticker}
            </div>
            <div
                ref={chartContainerRef}
                className="w-full flex-1"
            />
        </div>
    )
}