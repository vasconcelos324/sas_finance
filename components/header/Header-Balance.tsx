'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface Props {
    empresa: string
    grupo: string
    periodo: string
    setEmpresa: (v: string) => void
    setGrupo: (v: string) => void
    setPeriodo: (v: string) => void
}

export const menuItems = [
    { name: 'Balance', icon: '⚖️', href: '/page/balance' },
    { name: 'Yahoo Finance', icon: '📈', href: '/page/price-yahoo-finance' },
    { name: 'Bacen', icon: '🏦', href: '/page/bacen' },
]

export default function HeaderBalance({
    empresa,
    grupo,
    periodo,
    setEmpresa,
    setGrupo,
    setPeriodo,
}: Props) {
    const [opcoes, setOpcoes] = React.useState<{ value: string; label: string }[]>([])
    const [loadingEmpresas, setLoadingEmpresas] = React.useState(true)
    const [open, setOpen] = React.useState(false)
    const pathname = usePathname()

    React.useEffect(() => {
        fetch("/api/balance/company")
            .then((res) => res.json())
            .then((data: { empresas: { DENOM_CIA: string }[] }) => {
                const mapped = data.empresas.map((e) => ({
                    value: e.DENOM_CIA,
                    label: e.DENOM_CIA,
                }))
                setOpcoes(mapped)
                if (mapped.length > 0 && !empresa) {
                    setEmpresa(mapped[0].value)
                }
            })
            .finally(() => setLoadingEmpresas(false))
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 backdrop-blur-xl">

            <div className="flex h-16 items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-end gap-1">
                        <div className="w-3 h-6 bg-purple-500 rounded-sm"></div>
                        <div className="w-3 h-10 bg-blue-500 rounded-sm"></div>
                        <div className="w-3 h-14 bg-cyan-400 rounded-sm"></div>
                    </div>

                </div>
                <div className="flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-3">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-96 h-10 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white justify-between rounded-xl transition-all duration-200 cursor-pointer"
                                >
                                    {loadingEmpresas
                                        ? "Carregando nomes da companhia..."
                                        : empresa
                                            ? opcoes.find((op) => op.value === empresa)?.label
                                            : "Selecione uma empresa..."}
                                    <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-96 p-0 bg-zinc-900 border-white/10" align="start">
                                <Command className="bg-transparent">
                                    <CommandInput
                                        placeholder="Buscar empresa..."
                                        className="bg-zinc-900 border-none focus:ring-1 focus:ring-violet-500 text-white"
                                    />
                                    <CommandList>
                                        <CommandEmpty className="text-white/60 py-6 text-center">
                                            Nenhuma empresa encontrada.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {opcoes.map((opcao) => (
                                                <CommandItem
                                                    key={opcao.value}
                                                    value={opcao.value}
                                                    onSelect={() => {
                                                        setEmpresa(opcao.value)
                                                        setOpen(false)
                                                    }}
                                                    className="text-white hover:bg-white/10 cursor-pointer"
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-3 h-4 w-4 text-emerald-500",
                                                            empresa === opcao.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {opcao.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-white/90 font-medium">Grupo</span>
                        <ToggleGroup
                            type="single"
                            value={grupo}
                            onValueChange={(val) => val && setGrupo(val)}
                            className="bg-white/5 p-1 rounded-xl"
                        >
                            <ToggleGroupItem
                                value="CON"
                                className="data-[state=on]:bg-emerald-500 data-[state=on]:text-white text-white/80 hover:text-white transition-all duration-200 px-5 rounded-lg cursor-pointer"
                            >
                                CON
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="IND"
                                className="data-[state=on]:bg-amber-500 data-[state=on]:text-white text-white/80 hover:text-white transition-all duration-200 px-5 rounded-lg cursor-pointer"
                            >
                                IND
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-white/90 font-medium">Período</span>
                        <ToggleGroup
                            type="single"
                            value={periodo}
                            onValueChange={(val) => val && setPeriodo(val)}
                            className="bg-white/5 p-1 rounded-xl"
                        >
                            {["1T", "2T", "3T", "1S", "9M", "AA"].map((p) => (
                                <ToggleGroupItem
                                    key={p}
                                    value={p}
                                    className="data-[state=on]:bg-gray-950 data-[state=on]:text-white text-white/80 hover:text-white px-3 rounded-lg transition-all cursor-pointer"
                                >
                                    {p}
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