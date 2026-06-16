"use client"

import { Search, TrendingUp, X } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { cn } from "@/lib/utils";
import { menuItems } from "./Header-Balance";



interface Props {
    ticker: (value: string) => void
    periodo: (value: string) => void
    selectedPeriod: string
}



const PERIOD_LABELS: Record<"1d" | "1w" | "1m", string> = {
    "1d": "Diário",
    "1w": "Semanal",
    "1m": "Mensal"
};


export default function HeaderPriceFinance({ ticker, periodo, selectedPeriod }: Props) {

    const pathname = usePathname()
    const [inputValue, setInputValue] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const iv = inputValue.trim().toUpperCase()
        if (!iv) return
        const formattedTicker = iv.endsWith(".SA") ? iv : `${iv}.SA`
        ticker(formattedTicker)
        setInputValue(formattedTicker)
    }

    const handleClear = () => {
        setInputValue("")
        ticker("")
    }

    return (

        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-8">

                <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-cyan-400 to-violet-600" />
                    <div className="absolute inset-0.5 rounded-xl bg-slate-950 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-cyan-400" />
                    </div>
                </div>

                <div className="flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSubmit}>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white z-10" />
                                <Input
                                    type="text"
                                    placeholder="Buscar Companhia...."
                                    value={inputValue}
                                    className="h-10 pl-10 pr-10 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onBlur={handleSubmit}
                                />
                                {inputValue && (
                                    <Button
                                        type="button"
                                        onClick={handleClear}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}

                            </div>
                        </form>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-white/90 font-medium">Período</span>
                        <ToggleGroup
                            type="single"
                            value={selectedPeriod}
                            onValueChange={(v) => v && periodo(v)}
                            className="bg-white/5 p-1 rounded-xl"
                        >

                            {(Object.keys(PERIOD_LABELS) as Array<keyof typeof PERIOD_LABELS>).map((p) => (
                                <ToggleGroupItem
                                    key={p}
                                    value={p}
                                    className="data-[state=on]:bg-gray-950 data-[state=on]:text-white text-white/80 hover:text-white px-3 rounded-lg transition-all cursor-pointer text-sm"
                                >
                                    {PERIOD_LABELS[p]}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                </div>
                <nav className="flex items-center gap-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer",
                                    isActive
                                        ? "bg-linear-to-r from-green-500 to-gray-950 text-white shadow-lg shadow-violet-500/30"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                )}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.name}
                            </a>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}