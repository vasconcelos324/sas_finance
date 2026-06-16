import requests
import zipfile
import io
import os


ANO_INICIAL = 2010
ANO_FINAL = 2025



PASTA_BASE = "dados_cvm"
os.makedirs(PASTA_BASE, exist_ok=True)

for ano in range(ANO_INICIAL, ANO_FINAL + 1):
    print(f"\n📥 Processando ano {ano}...")

    url = f"https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/dfp_cia_aberta_{ano}.zip"

    arquivos_desejados = [
        f"dfp_cia_aberta_DRE_ind_{ano}.csv",
        f"dfp_cia_aberta_DRE_con_{ano}.csv",
        f"dfp_cia_aberta_DFC_MI_ind_{ano}.csv",
        f"dfp_cia_aberta_DFC_MI_con_{ano}.csv",
        f"dfp_cia_aberta_BPA_ind_{ano}.csv",
        f"dfp_cia_aberta_BPA_con_{ano}.csv",
        f"dfp_cia_aberta_BPP_ind_{ano}.csv",
        f"dfp_cia_aberta_BPP_con_{ano}.csv",
    ]

    try:
        response = requests.get(url, timeout=60)
        response.raise_for_status()

        zip_bytes = io.BytesIO(response.content)

        pasta_ano = os.path.join(PASTA_BASE, str(ano))
        os.makedirs(pasta_ano, exist_ok=True)

        with zipfile.ZipFile(zip_bytes) as zip_ref:
            nomes_no_zip = zip_ref.namelist()

            for arquivo in arquivos_desejados:
                if arquivo in nomes_no_zip:
                    zip_ref.extract(arquivo, pasta_ano)
                    print(f"  ✅ Extraído: {arquivo}")
                else:
                    print(f"  ⚠️ Não encontrado: {arquivo}")

    except Exception as e:
        print(f"  ❌ Erro ao processar {ano}: {e}")

print("\n🚀 Concluído!")