"use client"


import SeriesCard from "@/components/chart/SerieCard";
import HeaderBacen from "@/components/header/Header-Bacen";
import { CATEGORIES, Category, CATEGORY_META, SERIES } from "@/lib/serie-bacen";
import { useMemo, useState } from "react";



export default function BacenPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "Todas">("Todas");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    return SERIES.filter((s) => {
      const matchCat = activeCategory === "Todas" || s.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.fonte.toLowerCase().includes(q) ||
        String(s.code).includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);


  return (
    <div className="min-h-screen bg-slate-950 ">

      <HeaderBacen
        search={search}
        setSearch={setSearch}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        SERIES={SERIES}
        CATEGORIES={CATEGORIES}
        CATEGORY_META={CATEGORY_META}
      />


      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            Nenhuma série encontrada para &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((s) => (
              <SeriesCard key={s.code} series={s} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}