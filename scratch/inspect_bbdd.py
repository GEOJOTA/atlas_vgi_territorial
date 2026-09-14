import pandas as pd

excel_path = r"D:\17082025\2026\Practica profesional\Base de datos VGI\BBDD.xlsx"
df = pd.read_excel(excel_path)
print("TOTAL ROWS IN BBDD.xlsx:", len(df))
print(df.columns.tolist())
for idx, row in df.iterrows():
    print(f"ID: {row['ID']} | NOMBRE: {row['NOMBRE']} | DIR: {row['DIR']} | JOIN: {row['JOIN Y LIMPIEZA']}")
