
export function pivotarDados(dados: any[]) {
    const periodos = [...new Set(dados.map((item) => item.PERIODO))].sort((a, b) => b.localeCompare(a))
    const contasMap = new Map<string, any>()
    dados.forEach((item) => {
        const chave = item.CD_CONTA

        if (!contasMap.has(chave)) {
            contasMap.set(chave, {
                CD_CONTA: item.CD_CONTA,
                DS_CONTA: item.DS_CONTA,
            })
        }
        contasMap.get(chave)[item.PERIODO] = item.VL_CONTA
    })
    const linhas = Array.from(contasMap.values())
    const colunas: { key: string; label: string; isAH: boolean }[] = []

    periodos.forEach((periodo, index) => {
        colunas.push({ key: periodo, label: periodo, isAH: false })
        if (index < periodos.length - 1) {
            const proximoPeriodo = periodos[index + 1]
            colunas.push({
                key: `AH_${periodo}_${proximoPeriodo}`,
                label: "AH%",
                isAH: true,
            })
        }
    })
    const linhasComAH = linhas.map((linha) => {
        const novaLinha = { ...linha }
        periodos.forEach((periodo, index) => {
            if (index < periodos.length - 1) {
                const proximoPeriodo = periodos[index + 1]
                const valorAtual = Number(linha[periodo])
                const valorAnterior = Number(linha[proximoPeriodo])

                const key = `AH_${periodo}_${proximoPeriodo}`

                if (!isNaN(valorAtual) && !isNaN(valorAnterior) && valorAnterior !== 0) {
                    novaLinha[key] = ((valorAtual - valorAnterior) / Math.abs(valorAnterior)) * 100
                } else {
                    novaLinha[key] = null
                }
            }
        })

        return novaLinha
    })

    return { periodos, colunas, linhas: linhasComAH }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value)
}


export function prepararDadosGrafico(dados: any[]) {
    const periodos = [...new Set(dados.map((item) => item.PERIODO))].sort((a, b) => a.localeCompare(b))
    return periodos.map((periodo) => {
        const receita = dados.find((d) => d.CD_CONTA === "3.01" && d.PERIODO === periodo)
        const custo = dados.find((d) => d.CD_CONTA === "3.02" && d.PERIODO === periodo)
        const bruto = dados.find((d) => d.CD_CONTA === "3.03" && d.PERIODO === periodo)
        const despesa = dados.find((d) => d.CD_CONTA === "3.04" && d.PERIODO === periodo)
        const ebit = dados.find((d) => d.CD_CONTA === "3.05" && d.PERIODO === periodo)
        const imposto = dados.find((d) => d.CD_CONTA === "3.08" && d.PERIODO === periodo)
        const lucro = dados.find((d) => d.CD_CONTA === "3.09" && d.PERIODO === periodo)

        const receitaVal = Number(receita?.VL_CONTA ?? 0)
        const brutoVal   = Number(bruto?.VL_CONTA ?? 0)
        const ebitVal    = Number(ebit?.VL_CONTA  ?? 0)
        const lucroVal   = Number(lucro?.VL_CONTA ?? 0)

        return {
            period: periodo,
            receita: Number(receita?.VL_CONTA ?? 0),
            custo: Number(custo?.VL_CONTA ?? 0),
            despesa: Number(despesa?.VL_CONTA ?? 0),
            ebit: Number(ebit?.VL_CONTA ?? 0),
            imposto: Number(imposto?.VL_CONTA ?? 0),
            lucro: Number(lucro?.VL_CONTA ?? 0),
            bruta: receitaVal > 0 ? Number(((brutoVal / receitaVal) * 100).toFixed(2)) : 0,
            operacional: receitaVal > 0 ? Number(((ebitVal  / receitaVal) * 100).toFixed(2)) : 0,
            liquida:     receitaVal > 0 ? Number(((lucroVal / receitaVal) * 100).toFixed(2)) : 0,
            
        }
    })
}


export function prepararVariacaoPercentualContas(dados: any[]) {
    const periodos = [...new Set(dados.map((item) => item.PERIODO))].sort((a, b) => a.localeCompare(b))
    const valoresPorPeriodo = periodos.map((periodo) => ({
        periodo,
        receita: Number(dados.find((item) => item.CD_CONTA === "3.01" && item.PERIODO === periodo)?.VL_CONTA ?? 0),
        ebit: Number(dados.find((item) => item.CD_CONTA === "3.05" && item.PERIODO === periodo)?.VL_CONTA ?? 0),
        lucro: Number(dados.find((item) => item.CD_CONTA === "3.09" && item.PERIODO === periodo)?.VL_CONTA ?? 0),
    }))

    const calcularVariacao = (serie: number[], intervalo: number) => {
        if (serie.length <= intervalo) return null
        const atual = serie[serie.length - 1]
        const anterior = serie[serie.length - 1 - intervalo]
        if (anterior === 0) return null
        return Number((((atual - anterior) / Math.abs(anterior)) * 100).toFixed(2))
    }

    const serieReceita = valoresPorPeriodo.map((item) => item.receita)
    const serieEbit = valoresPorPeriodo.map((item) => item.ebit)
    const serieLucro = valoresPorPeriodo.map((item) => item.lucro)

    const variacao5y = {
        periodo: "5 anos",
        receita: calcularVariacao(serieReceita, 5),
        ebit: calcularVariacao(serieEbit, 5),
        lucro: calcularVariacao(serieLucro, 5),
    }

    const variacao10y = {
        periodo: "10 anos",
        receita: calcularVariacao(serieReceita, 10),
        ebit: calcularVariacao(serieEbit, 10),
        lucro: calcularVariacao(serieLucro, 10),
    }

    const variacaoTotal = {
        periodo: "Total",
        receita:
            valoresPorPeriodo.length > 1 && serieReceita[0] !== 0
                ? Number(
                      (((serieReceita[serieReceita.length - 1] - serieReceita[0]) / Math.abs(serieReceita[0])) * 100).toFixed(2)
                  )
                : null,
        ebit:
            valoresPorPeriodo.length > 1 && serieEbit[0] !== 0
                ? Number(
                      (((serieEbit[serieEbit.length - 1] - serieEbit[0]) / Math.abs(serieEbit[0])) * 100).toFixed(2)
                  )
                : null,
        lucro:
            valoresPorPeriodo.length > 1 && serieLucro[0] !== 0
                ? Number(
                      (((serieLucro[serieLucro.length - 1] - serieLucro[0]) / Math.abs(serieLucro[0])) * 100).toFixed(2)
                  )
                : null,
    }

    const variacao1y = {
        periodo: "1 ano",
        receita: calcularVariacao(serieReceita, 1),
        ebit: calcularVariacao(serieEbit, 1),
        lucro: calcularVariacao(serieLucro, 1),
    }

    return [variacaoTotal, variacao10y, variacao5y, variacao1y]
}

/* DFC */

export function dadosGraficoDFC(dados: any[]) {
    const periodos = [...new Set(dados.map((item) => item.PERIODO))].sort((a, b) => a.localeCompare(b))
    return periodos.map((periodo) => {
        const caixa_liquido = dados.find((d) => d.CD_CONTA === "6.01" && d.PERIODO === periodo)
        const caixa_gerado = dados.find((d) => d.CD_CONTA === "6.01.01" && d.PERIODO === periodo)
        const caixa_investimento = dados.find((d) => d.CD_CONTA === "6.02" && d.PERIODO === periodo)
        const caixa_financiamento = dados.find((d) => d.CD_CONTA === "6.03" && d.PERIODO === periodo)

        const caixaliquidoVal = Number(caixa_liquido?.VL_CONTA ?? 0)
        const caixaInvestimentoVal = Math.abs(Number(caixa_investimento?.VL_CONTA ?? 0)) 
        return {
            period: periodo,
            caixa_liquido: Number(caixa_liquido?.VL_CONTA ?? 0),
            caixa_gerado: Number(caixa_gerado?.VL_CONTA ?? 0),
            fluxo_caixa: caixaliquidoVal > 0
            ? Number((caixaliquidoVal - caixaInvestimentoVal).toFixed(2))
            : 0,
            caixa_financiamento: Number(caixa_financiamento?.VL_CONTA ?? 0),
            caixa_investimento: Number(caixa_investimento?.VL_CONTA ?? 0),

            cobertura_investimento: caixaliquidoVal > 0 ? Number(((caixaliquidoVal / caixaInvestimentoVal)*100).toFixed(2)) : 0,
            reinvestimento: caixaInvestimentoVal > 0 ? Number(((caixaInvestimentoVal / caixaliquidoVal)*100).toFixed(2)) : 0,
            relativo: caixaliquidoVal > 0 ? Number((((caixaliquidoVal - caixaInvestimentoVal)/caixaliquidoVal)*100).toFixed(2)) : 0,
            
        }
    })
}

export function VariacaoPercentualContasDFC(dados: any[]) {
    const periodos = [...new Set(dados.map((item) => item.PERIODO))].sort((a, b) => a.localeCompare(b))
    const valoresPorPeriodo = periodos.map((periodo) => ({
        periodo,
        fco: Number(dados.find((item) => item.CD_CONTA === "6.01" && item.PERIODO === periodo)?.VL_CONTA ?? 0),
        fci: Number(dados.find((item) => item.CD_CONTA === "6.02" && item.PERIODO === periodo)?.VL_CONTA ?? 0),
        fcf: Number(dados.find((item) => item.CD_CONTA === "6.03" && item.PERIODO === periodo)?.VL_CONTA ?? 0),
    }))

    const calcularVariacao = (serie: number[], intervalo: number) => {
        if (serie.length <= intervalo) return null
        const atual = serie[serie.length - 1]
        const anterior = serie[serie.length - 1 - intervalo]
        if (anterior === 0) return null
        return Number((((atual - anterior) / Math.abs(anterior)) * 100).toFixed(2))
    }

    const serieFco = valoresPorPeriodo.map((item) => item.fco)
    const serieFci = valoresPorPeriodo.map((item) => item.fci)
    const serieFcf = valoresPorPeriodo.map((item) => item.fcf)

    const variacao5y = {
        periodo: "5 anos",
        fco: calcularVariacao(serieFco, 5),
        fci: calcularVariacao(serieFci, 5),
        fcf: calcularVariacao(serieFcf, 5),
    }

    const variacao10y = {
        periodo: "10 anos",
        fco: calcularVariacao(serieFco, 10),
        fci: calcularVariacao(serieFci, 10),
        fcf: calcularVariacao(serieFcf, 10),
    }

    const variacaoTotal = {
        periodo: "Total",
        fco:
            valoresPorPeriodo.length > 1 && serieFco[0] !== 0
                ? Number(
                      (((serieFco[serieFco.length - 1] - serieFco[0]) / Math.abs(serieFco[0])) * 100).toFixed(2)
                  )
                : null,
        fci:
            valoresPorPeriodo.length > 1 && serieFci[0] !== 0
                ? Number(
                      (((serieFci[serieFci.length - 1] - serieFci[0]) / Math.abs(serieFci[0])) * 100).toFixed(2)
                  )
                : null,
        fcf:
            valoresPorPeriodo.length > 1 && serieFcf[0] !== 0
                ? Number(
                      (((serieFcf[serieFcf.length - 1] - serieFcf[0]) / Math.abs(serieFcf[0])) * 100).toFixed(2)
                  )
                : null,
    }

    const variacao1y = {
        periodo: "1 ano",
        fco: calcularVariacao(serieFco, 1),
        fci: calcularVariacao(serieFci, 1),
        fcf: calcularVariacao(serieFcf, 1),
    }

    return [variacaoTotal, variacao10y, variacao5y, variacao1y]
}

