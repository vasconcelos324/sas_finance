'use client'


"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { menuItems } from "./Header-Balance";

interface BacenHeaderProps {
    search: string;
    setSearch: (value: string) => void;
    activeCategory: string;
    setActiveCategory: (value: any) => void;
    SERIES: any[];
    CATEGORIES: string[];
    CATEGORY_META: any;
}

export default function BacenHeader({
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    SERIES,
    CATEGORIES,
    CATEGORY_META,
}: BacenHeaderProps) {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                            style={{ background: "#EEEDFE" }}
                        >
                            🏦
                        </div>

                        <div>
                            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-none">
                                BACEN · Séries Macroeconômicas
                            </h1>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                SGS — Sistema Gerenciador de Séries Temporais
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white z-10" />
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar série ou código..."
                        className="h-10 pl-10 pr-10 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                    {search && (
                        <Button
                            onClick={() => setSearch("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
                <Button
                    onClick={() => setActiveCategory("Todas")}
                    className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${activeCategory === "Todas"
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                >
                    Todas ({SERIES.length})
                </Button>

                {CATEGORIES.map((cat) => {
                    const meta = CATEGORY_META[cat];
                    const count = SERIES.filter(
                        (s) => s.category === cat
                    ).length;

                    const isActive = activeCategory === cat;

                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            style={
                                isActive
                                    ? {
                                        background: meta.border,
                                        color: meta.text,
                                    }
                                    : {}
                            }
                        >
                            <span
                                className={
                                    !isActive
                                        ? "text-slate-600 dark:text-slate-400"
                                        : ""
                                }
                            >
                                {meta.icon} {cat} ({count})
                            </span>
                        </button>
                    );
                })}
            </div>
        </header>
    );
}