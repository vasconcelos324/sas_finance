import os
import sqlite3
import pandas as pd

ano_inicial = 2010
ano_final = 2026


COLUMNS = [
    'CNPJ_CIA',
    'DENOM_CIA',
    'GRUPO_DFP',
    'ESCALA_MOEDA',
    'ORDEM_EXERC',
    'DT_INI_EXERC',
    'DT_FIM_EXERC',
    'CD_CONTA',
    'DS_CONTA',
    'VL_CONTA'
]

conn = sqlite3.connect("balanco_cvm.db")

def period (start,end):
    start = pd.to_datetime(start)
    end = pd.to_datetime(end)
    months = (end.year - start.year) * 12 + (end.month - start.month + 1)
    years = str(start.year)[2:]
    if months == 12:
        return f"20{years}"
    elif months == 9:
        novemeses = 9 if start.month <=9 else 2
        return f"{novemeses}M{years}"
    elif months == 6:
        semestre = 1 if start.month <=6 else 2
        return f"{semestre}S{years}"
    elif months == 3:
        trimestre = (start.month - 1) // 3+1
        return f"{trimestre}T{years}"
    else : 
         return f"{start.strftime('%Y%m%d')}_{end.strftime('%Y%m%d')}"
     
for ano in range(ano_inicial,ano_final +1):
    path =f"dados_cvm/{ano}/itr_cia_aberta_DFC_MI_con_{ano}.csv"
    
    if not os.path.exists(path):
        print(f'[aviso] arquivo nao encontrado:{path} -pulando')
        continue
    try:
        df = pd.read_csv(path, sep=';', decimal=',', encoding='ISO-8859-1',  usecols=COLUMNS)
        df = df[df['ORDEM_EXERC']=='PENÚLTIMO']
        df['PERIODO'] = df.apply(lambda r: period(r['DT_INI_EXERC'], r['DT_FIM_EXERC']),axis=1) 
        df['DT_FIM_EXERC'].apply(lambda x: str(x).split('-')[0])  
        #df['PERIODO'] = df['DT_FIM_EXERC'].apply(lambda x: str(x).split('-')[0])  // Só utilizar em dados do BPA e BPP
        df['VL_CONTA'] = pd.to_numeric(df['VL_CONTA'], errors='coerce')
        df=df[(df['VL_CONTA'] != 0)]
        df = df.drop(columns=['ORDEM_EXERC'])
        df.to_sql('dfc',conn,if_exists='append',index=False)
        print(f"[OK] {ano} → {len(df):,} linhas inseridas")
    except Exception as e :
         print(f"[ERRO] {ano}: {e}")

conn.close()
print('Banco de dados finalizados com sucesso')