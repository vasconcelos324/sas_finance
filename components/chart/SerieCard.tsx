"use client"

import { BacenSeries, CATEGORY_META} from "@/lib/serie-bacen";
import dynamic from "next/dynamic"
import { useState } from "react";
import { Button } from "../ui/button";



const SeriesChart = dynamic(() => import("./SerieChart"), { ssr: false });
const RANGES = ["1A", "5A", "10A", "MAX"] as const;
interface Props {
    series: BacenSeries;
}

export default function SeriesCard({ series }: Props) {
    const [range, setRange] = useState<string>("1A");
    const catMeta = CATEGORY_META[series.category];
    

    return (
        <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-4 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base leading-tight truncate">
                        {series.name} - {series.code}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                        fonte:{series.fonte} 
                    </p>
                </div>
            </div>
            <SeriesChart series={series} range={range} />
            <div className="flex gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                {RANGES.map((r) => (
                    <Button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`flex-1 text-xs py-1 rounded-lg font-medium transition-colors ${range === r
                            ? "text-white"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        style={range === r ? { background: series.color } : {}}
                    >
                        {r}
                    </Button>
                ))}
            </div>
        </div>
    )
}