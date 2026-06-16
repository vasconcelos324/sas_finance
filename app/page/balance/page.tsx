"use client"

import { BalanceDfcChart } from "@/components/chart/BalanceDfcChart"
import { BalanceDreChart } from "@/components/chart/BalanceDreChart"
import HeaderBalance from "@/components/header/Header-Balance"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"



export default function BalancePage() {

    const [empresa, setEmpresa] = useState("")
    const [grupo, setGrupo] = useState("CON")
    const [periodo, setPeriodo] = useState("AA")
    const [dadosDRE, setDadosDRE] = useState([])
    const [dadosDFC, setDadosDFC] = useState([])

    useEffect(() => {
        if (!empresa) return

        const carregarDRE = async () => {
            try {
                const response = await fetch(
                    `/api/balance/dre?DENOM_CIA=${empresa}&GRUPO_DFP=${grupo}&PERIODO=${periodo}`
                )

                const data = await response.json()
                setDadosDRE(data.data)
            } catch (error) {
                console.error("Erro ao carregar DRE:", error)
            }
        }

        carregarDRE()
    }, [empresa, grupo, periodo])

    useEffect(() => {
        if (!empresa) return

        const carregarDFC = async () => {
            try {
                const response = await fetch(
                    `/api/balance/dfc?DENOM_CIA=${empresa}&GRUPO_DFP=${grupo}&PERIODO=${periodo}`
                )

                const data = await response.json()
                setDadosDFC(data.data)
            } catch (error) {
                console.error("Erro ao carregar DFC:", error)
            }
        }

        carregarDFC()
    }, [empresa, grupo, periodo])

    return (
        <div>
            <HeaderBalance
                empresa={empresa}
                grupo={grupo}
                periodo={periodo}
                setEmpresa={setEmpresa}
                setGrupo={setGrupo}
                setPeriodo={setPeriodo}
            />
            <main className="w-full bg-slate-950">
                <div className="mx-auto max-w-475 px-6 py-6">

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-50">
                            Demonstrativos Financeiros
                        </h1>

                        <p className="mt-2 text-slate-400">
                            Análise detalhada dos resultados e fluxo de caixa
                        </p>
                    </div>

                    <Tabs defaultValue="dre" className="w-full">
                        <TabsList
                            className="
                    grid
                    w-full
                    max-w-md
                    grid-cols-2
                    bg-slate-900
                    border
                    border-slate-800
                "
                        >
                            <TabsTrigger
                                value="dre"
                                className="
                        data-[state=active]:bg-slate-800
                        data-[state=active]:text-white
                    "
                            >
                                DRE
                            </TabsTrigger>

                            <TabsTrigger
                                value="dfc"
                                className="
                        data-[state=active]:bg-slate-800
                        data-[state=active]:text-white
                    "
                            >
                                DFC
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="dre" className="mt-4">
                            <BalanceDreChart dados={dadosDRE} />
                        </TabsContent>

                        <TabsContent value="dfc" className="mt-4">
                            <BalanceDfcChart dados={dadosDFC} />
                        </TabsContent>
                    </Tabs>

                </div>
            </main>
        </div>
    )
}