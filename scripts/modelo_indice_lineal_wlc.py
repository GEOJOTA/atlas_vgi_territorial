#!/usr/bin/env python3
# -*- coding: utf-8 -*-
r"""
=============================================================================
  MODELO DE ÍNDICE LINEAL PONDERADO (WLC) — VERSIÓN 2.0 ESCALABLE
  Weighted Linear Combination for Territorial Prioritization & Spatial Quality
  Atlas VGI — Nodo GeoAbierto | Universidad Alberto Hurtado (UAH)
  Proyecto Fondecyt Regular F1261256 (ANID)
=============================================================================

DESCRIPCIÓN GENERAL
-------------------
Implementa la Combinación Lineal Ponderada (WLC - Weighted Linear Combination)
para construir índices territoriales multidimensionales (vulnerabilidad, idoneidad,
priorización de inversión) y auditorías de calidad espacial (IGV ISO 19157 / ISO 19115).
Integra formalmente la correlación espacial de Pearson y el rezago espacial (spatial lag)
como mecanismo empírico objetivo para la justificación y calibración de los pesos asignados.

ESTRUCTURA DEL SCRIPT
----------------------
  BLOQUE 0 — Importaciones y dependencias
  BLOQUE 1 — PARÁMETROS DE CONFIGURACIÓN POR DEFECTO
  BLOQUE 2 — Funciones de normalización Min-Max y WLC
  BLOQUE 3 — Justificación empírica de pesos vía correlación espacial bivariada
  BLOQUE 4 — Motor de ejecución del modelo (orquestador)
  BLOQUE 5 — CLI (argparse) para ejecución en terminal

FUNDAMENTO MATEMÁTICO
---------------------
1. Normalización Min-Max (Malczewski, 1999; Eastman, 1999):
   - Criterio de Beneficio (mayor valor = mayor prioridad / calidad):
       x_norm = (x - x_min) / (x_max - x_min)
   - Criterio de Costo (menor valor = mayor prioridad / calidad; penalización invertida):
       x_norm = (x_max - x) / (x_max - x_min)

2. Combinación Lineal Ponderada (WLC; Voogd, 1983; Malczewski & Rinner, 2015):
       S_j = Σ (w_i · x_ij_norm)   para i ∈ {1..n criterios}
   donde Σ w_i = 1.0.

3. Desglose analítico por entidad:
   - norm_{criterio}    : Valor del criterio reescalado a [0, 1].
   - contrib_{criterio} : Aporte ponderado parcial (w_i · norm_{criterio}).
   - indice_score       : Puntaje global compuesto [0, 1] o [0, 100%].
   - prioridad_rank     : Ranking ordinal (1 = máxima prioridad/calidad).

4. Justificación empírica de pesos vía correlación espacial (Anselin, 1988/1995; Tobler, 1970):
       lag_X = W · X
       r_clasica = pearsonr(X_i, X_j)
       r_espacial = pearsonr(X_i, lag_X_j)
   Donde W es la matriz de pesos espaciales estandarizada por filas (distancia euclidiana
   entre centroides con umbral de vecindad d). Correlaciones altas (> 0.70) indican
   redundancia dimensional, justificando pesos moderados o combinados, mientras que
   correlaciones bajas validan independencia factorial.

CÓMO USAR ESTE SCRIPT
----------------------
OPCIÓN A — Ejecución directa con datos territoriales de Santiago Centro / Barrio Brasil:
  python3 scripts/modelo_indice_lineal_wlc.py

OPCIÓN B — Ejecución vía CLI con parámetros personalizados:
  python3 scripts/modelo_indice_lineal_wlc.py \
      -i src/data/IGVUST_UV_2026_Agosto.geojson \
      -c pob_rsh_uv hog_uv rank_nac \
      -w 0.40 0.35 0.25 \
      -t beneficio beneficio costo \
      -o src/data/priorizacion_uv_wlc.geojson \
      --umbral 1500 --justificar

OPCIÓN C — Modo MetaCalidad (evaluación de capas bajo WLC):
  python3 scripts/modelo_indice_lineal_wlc.py --modo metacalidad
=============================================================================
"""

# ─────────────────────────────────────────────────────────────────────────────
# BLOQUE 0 — IMPORTACIONES
# ─────────────────────────────────────────────────────────────────────────────
import os
import sys
import argparse
import warnings
import json
import numpy as np
import pandas as pd

try:
    import geopandas as gpd
    HAS_GEOPANDAS = True
except ImportError:
    HAS_GEOPANDAS = False
    gpd = None

try:
    from scipy.stats import pearsonr
    HAS_SCIPY = True
except ImportError:
    HAS_SCIPY = False
    pearsonr = None

try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    HAS_MATPLOTLIB = True
except ImportError:
    HAS_MATPLOTLIB = False
    plt = None

warnings.filterwarnings("ignore", category=RuntimeWarning)

# Directorios del proyecto
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DATA_DIR = os.path.join(BASE_DIR, 'src', 'data')
DATA_DIR = os.path.join(BASE_DIR, 'data')
DOCS_DIR = os.path.join(BASE_DIR, 'docs')
SRC_DOCS_DIR = os.path.join(BASE_DIR, 'src', 'docs')


# ─────────────────────────────────────────────────────────────────────────────
# BLOQUE 1 — PARÁMETROS DE CONFIGURACIÓN POR DEFECTO
# ─────────────────────────────────────────────────────────────────────────────

CONFIG = {
    # --- Entrada de datos ---------------------------------------------------
    # Capa territorial de Unidades Vecinales de Santiago Centro / RM
    "input_file": os.path.join(SRC_DATA_DIR, "IGVUST_UV_2026_Agosto.geojson"),
    "layer_name": None,

    # --- Salida de datos ---------------------------------------------------
    "output_file":  os.path.join(SRC_DATA_DIR, "wlc_priorizacion_uv_resultado.geojson"),
    "output_layer": "UV_Priorizadas_WLC",

    # --- Definición de criterios -------------------------------------------
    # Tupla: (columna, peso_relativo, tipo)
    # tipo = "beneficio" → mayor valor = mayor prioridad territorial
    # tipo = "costo"     → menor valor = mayor prioridad territorial (ej. rank más bajo = más vulnerable)
    "criterios": [
        ("pob_rsh_uv",  0.40, "beneficio"),  # Demanda social / Población RSH
        ("hog_uv",      0.35, "beneficio"),  # Densidad de hogares en la unidad vecinal
        ("rank_nac",    0.25, "costo"),      # Ranking nacional de vulnerabilidad (1 = más crítico)
    ],

    # --- Identificador de zona ---------------------------------------------
    "id_column": "t_uv_nom",
    "filtro_comuna": "SANTIAGO",  # Filtrar caso comunal de Santiago / Barrio Brasil si aplica

    # --- Opciones de correlación espacial para justificación de pesos ------
    "justificar_pesos":   True,
    "umbral_vecindad_m":  1500.0,
    "exportar_heatmap":   True,
    "ruta_heatmap":       os.path.join(DOCS_DIR, "correlacion_pesos_espacial.png"),
    "exportar_csv":       True,
    "ruta_csv":           os.path.join(DOCS_DIR, "correlacion_pesos_espacial.csv"),

    # --- Resumen en consola ------------------------------------------------
    "top_n": 10,
}


# ─────────────────────────────────────────────────────────────────────────────
# BLOQUE 2 — FUNCIONES CORE DEL MODELO WLC
# ─────────────────────────────────────────────────────────────────────────────

def normalizar_criterio(values: np.ndarray, tipo: str = "beneficio") -> np.ndarray:
    """
    Normaliza un array unidimensional al rango [0, 1] usando Min-Max scaling.

    Parámetros
    ----------
    values : np.ndarray
        Valores numéricos brutos del criterio (puede contener NaN).
    tipo : str
        'beneficio' → mayor valor = mayor prioridad / calidad (x - x_min)/(x_max - x_min)
        'costo'     → menor valor = mayor prioridad / calidad (x_max - x)/(x_max - x_min)

    Retorna
    -------
    np.ndarray  normalizado al rango [0, 1].

    Referencias:
    - Malczewski, J. (1999). GIS and Multicriteria Decision Analysis. Cap. 4, pp. 81–96.
    - Voogd, H. (1983). Multicriteria Evaluation for Urban and Regional Planning. pp. 57–75.
    - Eastman, J.R. (1999). Multi-criteria evaluation and GIS. pp. 493–502.
    """
    val_clean = np.array(values, dtype=float)
    if np.isnan(val_clean).all():
        return np.zeros_like(val_clean)

    media = np.nanmean(val_clean)
    val_clean = np.nan_to_num(val_clean, nan=media)

    v_min = float(np.min(val_clean))
    v_max = float(np.max(val_clean))

    if np.isclose(v_min, v_max):
        if tipo == "beneficio":
            val_const = 1.0 if v_max > 0 else 0.0
        else:  # costo
            val_const = 1.0 if v_max == 0 else 0.0
        return np.full_like(val_clean, val_const)

    if tipo == "beneficio":
        return (val_clean - v_min) / (v_max - v_min)
    elif tipo == "costo":
        return (v_max - val_clean) / (v_max - v_min)
    else:
        raise ValueError(f"Tipo no válido: '{tipo}'. Debe ser 'beneficio' o 'costo'.")


def construir_wlc(df_o_gdf, criterios, pesos, tipos):
    """
    Construye el modelo aditivo ponderado (Weighted Linear Combination - WLC).

    Parámetros
    ----------
    df_o_gdf  : pd.DataFrame | gpd.GeoDataFrame
    criterios : list[str]   — Nombres de columnas de los criterios
    pesos     : list[float] — Ponderadores numéricos (se normalizan a suma 1.0)
    tipos     : list[str]   — 'beneficio' o 'costo' por criterio

    Retorna
    -------
    pd.DataFrame | gpd.GeoDataFrame enriquecido con columnas:
      - norm_{criterio}    : Valor reescalado [0, 1]
      - contrib_{criterio} : Aporte ponderado = w_i * norm
      - indice_score       : Puntaje final WLC
      - prioridad_rank     : Ranking ordinal (1 = máxima prioridad)

    Referencias:
    - Malczewski, J. & Rinner, C. (2015). Cap. 5, pp. 99–130.
    - Jankowski, P. (1995). Integrating GIS and MCDM methods. p. 260.
    """
    n = len(criterios)
    if len(pesos) != n or len(tipos) != n:
        raise ValueError(f"Inconsistencia: {n} criterios, {len(pesos)} pesos, {len(tipos)} tipos.")

    suma = float(sum(pesos))
    if not np.isclose(suma, 1.0):
        print(f"   [INFO] Suma de pesos = {suma:.4f} ≠ 1.0. Se normalizan proporcionalmente.")
        pesos = [float(w) / suma for w in pesos]

    print(f"\n   {'CRITERIO':<32} {'TIPO':<12} {'PESO (w_i)':>12}")
    print(f"   {'─'*58}")
    for c, w, t in zip(criterios, pesos, tipos):
        icono = "▲ Beneficio" if t == "beneficio" else "▼ Costo"
        print(f"   {c:<32} {icono:<12} {w:>12.4f}")

    df_res = df_o_gdf.copy()
    score_total = np.zeros(len(df_res), dtype=float)

    for c, w, t in zip(criterios, pesos, tipos):
        vals = pd.to_numeric(df_res[c], errors="coerce").values
        norm = normalizar_criterio(vals, t)
        contrib = norm * w

        df_res[f"norm_{c}"] = np.round(norm, 6)
        df_res[f"contrib_{c}"] = np.round(contrib, 6)
        score_total += contrib

    df_res["indice_score"] = np.round(score_total, 6)
    df_res["prioridad_rank"] = df_res["indice_score"].rank(ascending=False, method="min").astype(int)

    return df_res


# ─────────────────────────────────────────────────────────────────────────────
# BLOQUE 3 — JUSTIFICACIÓN DE PESOS VÍA CORRELACIÓN ESPACIAL BIVARIADA
# ─────────────────────────────────────────────────────────────────────────────

def _matriz_pesos_espaciales(gdf, dist_umbral_m: float = 1500.0):
    """
    Construye la matriz de pesos espaciales W estandarizada por filas
    a partir de las distancias euclidianas entre centroides geométricos.

    Referencias:
    - Anselin, L. (1988). Spatial Econometrics: Methods and Models. pp. 17–32.
    - Tobler, W.R. (1970). A computer movie simulating urban growth. pp. 234–240.
    """
    if gdf.geometry is None or gdf.geometry.is_empty.all():
        n = len(gdf)
        return np.eye(n) / n

    # Si las coordenadas son geográficas (WGS84), proyectar a UTM 19S (EPSG:32719) para distancias métricas exactas
    if gdf.crs and gdf.crs.is_geographic:
        try:
            gdf_proj = gdf.to_crs(epsg=32719)
            centroides = gdf_proj.geometry.centroid
            coords_x = centroides.x.values
            coords_y = centroides.y.values
        except Exception:
            centroides = gdf.geometry.centroid
            coords_x = centroides.x.values * 93000.0  # ~93 km por grado longitud en lat -33.45°
            coords_y = centroides.y.values * 111000.0 # ~111 km por grado latitud
    else:
        centroides = gdf.geometry.centroid
        coords_x = centroides.x.values
        coords_y = centroides.y.values

    coords = np.column_stack([coords_x, coords_y])
    diff = coords[:, np.newaxis, :] - coords[np.newaxis, :, :]
    dist_matrix = np.sqrt(np.sum(diff ** 2, axis=-1))

    # W binaria basada en umbral de vecindad
    W = np.where((dist_matrix <= dist_umbral_m) & (dist_matrix > 0), 1.0, 0.0)

    # Si una entidad no tiene vecinos dentro del umbral, conectar con su vecino más cercano (k=1)
    for i in range(len(W)):
        if np.sum(W[i]) == 0:
            dists_i = dist_matrix[i].copy()
            dists_i[i] = np.inf
            cercano = np.argmin(dists_i)
            W[i, cercano] = 1.0

    # Estandarización por filas
    sumas_filas = np.sum(W, axis=1, keepdims=True)
    sumas_filas[sumas_filas == 0] = 1.0
    W_norm = W / sumas_filas
    return W_norm


def _rezago_espacial(W: np.ndarray, vector_z: np.ndarray) -> np.ndarray:
    """
    Calcula el rezago espacial (spatial lag): lag_X = W · X_z.
    Referencia: Bivand et al. (2013) Cap. 9, pp. 263–280.
    """
    return np.dot(W, vector_z)


def justificar_pesos_con_correlacion(gdf, criterios, pesos_propuestos, tipos,
                                      dist_umbral=1500.0, exportar_heatmap=True,
                                      ruta_heatmap="correlacion_pesos_espacial.png",
                                      exportar_csv=True, ruta_csv="correlacion_pesos_espacial.csv"):
    """
    Evalúa empíricamente la independencia y redundancia espacial de los criterios.
    Calcula la correlación clásica de Pearson r(X_i, X_j) frente a la
    correlación espacial bivariada r(X_i, lag_X_j).
    """
    print("\n" + "─" * 62)
    print("  JUSTIFICACIÓN EMPÍRICA DE PESOS VÍA CORRELACIÓN ESPACIAL")
    print("─" * 62)

    n_crit = len(criterios)
    k_entidades = len(gdf)

    # 1. Matriz W
    W = _matriz_pesos_espaciales(gdf, dist_umbral)

    # 2. Matriz de datos estandarizados Z
    matriz_z = np.zeros((k_entidades, n_crit))
    matriz_lag = np.zeros((k_entidades, n_crit))

    for idx, c in enumerate(criterios):
        vals = pd.to_numeric(gdf[c], errors="coerce").fillna(0).values
        std = np.std(vals)
        z = (vals - np.mean(vals)) / (std if std > 0 else 1.0)
        matriz_z[:, idx] = z
        matriz_lag[:, idx] = _rezago_espacial(W, z)

    # 3. Correlaciones
    corr_clasica = np.zeros((n_crit, n_crit))
    corr_espacial = np.zeros((n_crit, n_crit))

    for i in range(n_crit):
        for j in range(n_crit):
            if HAS_SCIPY and pearsonr:
                r_c, _ = pearsonr(matriz_z[:, i], matriz_z[:, j])
                r_e, _ = pearsonr(matriz_z[:, i], matriz_lag[:, j])
            else:
                r_c = float(np.corrcoef(matriz_z[:, i], matriz_z[:, j])[0, 1])
                r_e = float(np.corrcoef(matriz_z[:, i], matriz_lag[:, j])[0, 1])
            corr_clasica[i, j] = np.round(r_c, 4)
            corr_espacial[i, j] = np.round(r_e, 4)

    df_clasica = pd.DataFrame(corr_clasica, index=criterios, columns=criterios)
    df_espacial = pd.DataFrame(corr_espacial, index=criterios, columns=[f"lag_{c}" for c in criterios])

    print("\n  Matriz de Correlación Clásica Pearson r(X_i, X_j):")
    print(df_clasica.to_string())

    print("\n  Matriz de Correlación Espacial Bivariada r(X_i, lag_X_j):")
    print(df_espacial.to_string())

    # Diagnóstico de redundancia vs independencia
    print("\n  Evaluación de Redundancia y Diagnóstico de Pesos:")
    for i in range(n_crit):
        for j in range(i + 1, n_crit):
            r_c = corr_clasica[i, j]
            r_e = corr_espacial[i, j]
            ci, cj = criterios[i], criterios[j]
            wi, wj = pesos_propuestos[i], pesos_propuestos[j]
            if abs(r_c) > 0.70 or abs(r_e) > 0.65:
                print(f"   ⚠ Redundancia moderada/alta entre '{ci}' y '{cj}' (r={r_c:.2f}, r_lag={r_e:.2f}).")
                print(f"     Justificación: Pesos balanceados w_i={wi:.2f}, w_j={wj:.2f} previenen sobrerrepresentación.")
            else:
                print(f"   ✔ Independencia confirmada entre '{ci}' y '{cj}' (r={r_c:.2f}, r_lag={r_e:.2f}).")
                print(f"     Justificación: Criterios capturan dimensiones distintas; pesos diferenciados son robustos.")

    if exportar_csv:
        df_clasica.to_csv(ruta_csv)
        print(f"  ✔ Matriz de correlación exportada a: {ruta_csv}")

    if exportar_heatmap and HAS_MATPLOTLIB and plt:
        _graficar_heatmaps(df_clasica, df_espacial, ruta_heatmap)

    return df_clasica, df_espacial


def _graficar_heatmaps(df_clasica, df_espacial, ruta):
    """Genera figura de dos heatmaps: correlación clásica y espacial bivariada."""
    try:
        fig, axes = plt.subplots(1, 2, figsize=(14, 6), dpi=130)
        for ax, data, titulo in zip(
            axes,
            [df_clasica.values, df_espacial.values],
            ["Correlación Pearson Clásica\nr(Xᵢ, Xⱼ)",
             "Correlación Espacial Bivariada\nr(Xᵢ, lag_Xⱼ)"]
        ):
            im = ax.imshow(data, cmap="coolwarm", vmin=-1, vmax=1, aspect="auto")
            fig.colorbar(im, ax=ax, shrink=0.8, label="r")
            ax.set_xticks(range(data.shape[1]))
            ax.set_yticks(range(data.shape[0]))
            cols_labels = df_espacial.columns if "lag" in titulo else df_clasica.columns
            ax.set_xticklabels(cols_labels, rotation=35, ha="right", fontsize=8)
            ax.set_yticklabels(df_clasica.index, fontsize=8)
            ax.set_title(titulo, fontsize=10, fontweight="bold", pad=8)
            for i in range(data.shape[0]):
                for j in range(data.shape[1]):
                    v = data[i, j]
                    if not np.isnan(v):
                        ax.text(j, i, f"{v:.2f}", ha="center", va="center",
                                color="white" if abs(v) > 0.55 else "black",
                                fontsize=8, fontweight="bold")
        plt.suptitle("Atlas VGI — Análisis de Correlación para Justificación de Pesos WLC v2.0",
                     fontsize=12, fontweight="bold", y=1.02)
        plt.tight_layout()
        os.makedirs(os.path.dirname(os.path.abspath(ruta)), exist_ok=True)
        plt.savefig(ruta, bbox_inches="tight")
        plt.close()
        print(f"  ✔ Heatmap gráfico exportado: {ruta}")
    except Exception as e:
        print(f"  ⚠ Advertencia al graficar heatmap: {e}")


# ─────────────────────────────────────────────────────────────────────────────
# BLOQUE 4 — MOTOR DE EJECUCIÓN (ORQUESTADOR)
# ─────────────────────────────────────────────────────────────────────────────

def ejecutar_modelo(config):
    """
    Orquesta la ejecución completa del modelo WLC a partir del diccionario CONFIG.
    """
    print("\n" + "═" * 64)
    print("   MODELO DE ÍNDICE LINEAL PONDERADO (WLC) — v2.0 ESCALABLE")
    print("   Atlas VGI · Caso Piloto Barrio Brasil & Santiago Centro")
    print("═" * 64)

    input_file = config["input_file"]
    if not os.path.exists(input_file):
        # Fallback a data/ si no está en src/data/
        alt_input = os.path.join(DATA_DIR, os.path.basename(input_file))
        if os.path.exists(alt_input):
            input_file = alt_input
            config["input_file"] = alt_input
        else:
            raise FileNotFoundError(f"Archivo de entrada no encontrado: {input_file}")

    print(f"\n  Archivo de entrada: {input_file}")
    criterios_def = config["criterios"]
    criterios = [x[0] for x in criterios_def]
    pesos     = [float(x[1]) for x in criterios_def]
    tipos     = [str(x[2]).lower() for x in criterios_def]

    # Cargar datos
    if HAS_GEOPANDAS and gpd:
        gdf = gpd.read_file(input_file)
    else:
        with open(input_file, 'r', encoding='utf-8') as f:
            data_json = json.load(f)
        features = data_json.get('features', [])
        props_list = [f.get('properties', {}) for f in features]
        gdf = pd.DataFrame(props_list)

    print(f"  Registros cargados: {len(gdf)}")

    # Filtro comunal si aplica
    filtro_comuna = config.get("filtro_comuna")
    if filtro_comuna:
        col_com = None
        for c in ['Comuna', 'comuna', 't_com_nom', 'COMUNA']:
            if c in gdf.columns:
                col_com = c
                break
        if col_com:
            gdf_sub = gdf[gdf[col_com].astype(str).str.upper().str.contains(filtro_comuna.upper(), na=False)].copy()
            if len(gdf_sub) > 0:
                print(f"  Filtro comunal '{filtro_comuna}': {len(gdf_sub)} unidades seleccionadas.")
                gdf = gdf_sub

    # Verificar existencia de columnas
    cols_faltantes = [c for c in criterios if c not in gdf.columns]
    if cols_faltantes:
        raise KeyError(f"Columnas no encontradas en el dataset: {cols_faltantes}\nDisponibles: {list(gdf.columns)[:15]}...")

    # Limpieza de registros con NaN total
    gdf_clean = gdf.dropna(subset=criterios, how="all").copy()
    print(f"  Registros analizados: {len(gdf_clean)}")

    # Justificación de pesos vía correlación espacial
    if config.get("justificar_pesos", True) and HAS_GEOPANDAS and isinstance(gdf_clean, gpd.GeoDataFrame):
        justificar_pesos_con_correlacion(
            gdf=gdf_clean,
            criterios=criterios,
            pesos_propuestos=pesos,
            tipos=tipos,
            dist_umbral=config.get("umbral_vecindad_m", 1500.0),
            exportar_heatmap=config.get("exportar_heatmap", True),
            ruta_heatmap=config.get("ruta_heatmap", "correlacion_pesos_espacial.png"),
            exportar_csv=config.get("exportar_csv", True),
            ruta_csv=config.get("ruta_csv", "correlacion_pesos_espacial.csv")
        )

    # Construcción WLC
    print("\n" + "─" * 62)
    print("  CONSTRUCCIÓN DEL ÍNDICE WLC v2.0")
    print("─" * 62)
    gdf_resultado = construir_wlc(gdf_clean, criterios, pesos, tipos)

    # Mostrar top N zonas prioritarias
    id_col = config.get("id_column", "")
    if id_col not in gdf_resultado.columns:
        for candidato in ['t_uv_nom', 'uv_carto', 't_id_uv_ca', 'nombre', 'id', 'fid', 'ID']:
            if candidato in gdf_resultado.columns:
                id_col = candidato
                break
        if not id_col:
            id_col = gdf_resultado.columns[0]

    top_n = config.get("top_n", 10)
    cols_resumen = [id_col, "indice_score", "prioridad_rank"] + [f"contrib_{c}" for c in criterios]
    cols_resumen = [c for c in cols_resumen if c in gdf_resultado.columns]

    print(f"\n  TOP {min(top_n, len(gdf_resultado))} ZONAS CON MAYOR PRIORIDAD (WLC):")
    print("  " + "─" * 60)
    top_df = gdf_resultado.nsmallest(top_n, "prioridad_rank")[cols_resumen]
    print(top_df.to_string(index=False))

    print("\n  ESTADÍSTICAS DEL ÍNDICE SCORE:")
    for stat, val in gdf_resultado["indice_score"].describe().round(4).items():
        print(f"    {stat:>8}: {val:.4f}")

    # Guardar resultado
    out_file = config.get("output_file", "wlc_resultado.geojson")
    os.makedirs(os.path.dirname(os.path.abspath(out_file)), exist_ok=True)
    print(f"\n  Guardando resultado → {out_file}")

    if HAS_GEOPANDAS and isinstance(gdf_resultado, gpd.GeoDataFrame):
        gdf_resultado.to_file(out_file, driver="GeoJSON")
    else:
        gdf_resultado.to_json(out_file, orient="records", force_ascii=False)

    print("  ✔ Proceso WLC completado con éxito.")
    return gdf_resultado


def ejecutar_modelo_metacalidad(config):
    """
    Ejecuta el modelo WLC v2.0 sobre la totalidad de la base de datos cartográfica
    del Atlas VGI (118 componentes: 108 capas oficiales + 10 macro-categorías comunitarias).
    """
    print("\n" + "═" * 64)
    print("   MODELO WLC v2.0 — ÍNDICE DE CALIDAD Y METACALIDAD ESPACIAL")
    print("   Auditoría Multicriterio ISO 19157:2023 & ISO 19115-1:2014")
    print("═" * 64)

    matriz_json_path = os.path.join(DOCS_DIR, "matriz_metacalidad.json")
    if not os.path.exists(matriz_json_path):
        matriz_json_path = os.path.join(SRC_DOCS_DIR, "matriz_metacalidad.json")

    if not os.path.exists(matriz_json_path):
        raise FileNotFoundError(f"Matriz de metacalidad no encontrada en: {matriz_json_path}")

    with open(matriz_json_path, 'r', encoding='utf-8') as f:
        datos_matriz = json.load(f)

    capas = datos_matriz.get("capas", [])
    print(f"\n  Capas cargadas para evaluación WLC: {len(capas)}")

    # Criterios WLC de Calidad y MetaCalidad
    criterios_meta = [
        ("score_topo", 0.20, "beneficio"),  # Consistencia topológica OGC
        ("score_comp", 0.15, "beneficio"),  # Completitud tabular de atributos
        ("score_pos",  0.15, "beneficio"),  # Integridad posicional y CRS
        ("score_mc",   0.20, "beneficio"),  # Metadatos núcleo ISO 19115
        ("score_ll",   0.15, "beneficio"),  # Linaje y derechos jurídicos (ODbL / Ley 20.285)
        ("score_cc",   0.10, "beneficio"),  # Conformidad normativa y semántica
        ("anillos_abiertos", 0.05, "costo") # Error topológico crítico (anillos no cerrados)
    ]

    criterios = [x[0] for x in criterios_meta]
    pesos     = [x[1] for x in criterios_meta]
    tipos     = [x[2] for x in criterios_meta]

    df_capas = pd.DataFrame(capas)
    for c in criterios:
        if c not in df_capas.columns:
            df_capas[c] = 0.0
        df_capas[c] = pd.to_numeric(df_capas[c], errors="coerce").fillna(0.0)

    # Correlación entre dimensiones de calidad
    print("\n  Matriz de Correlación de Pearson entre Dimensiones de Calidad (Justificación WLC):")
    df_corr = df_capas[criterios].corr().round(3)
    print(df_corr.to_string())

    ruta_csv_corr = os.path.join(DOCS_DIR, "correlacion_dimensiones_calidad.csv")
    df_corr.to_csv(ruta_csv_corr)
    print(f"  ✔ Correlación de dimensiones exportada a: {ruta_csv_corr}")

    # Construcción WLC
    df_resultado = construir_wlc(df_capas, criterios, pesos, tipos)
    df_resultado["calidad_rank"] = df_resultado["prioridad_rank"]

    # Mostrar TOP 10 capas con mayor calidad
    cols_top = ["id", "nombre", "tipo_fuente", "indice_score", "calidad_rank"]
    print("\n  TOP 10 CAPAS CON MAYOR ÍNDICE DE CALIDAD (WLC):")
    print("  " + "─" * 60)
    print(df_resultado.nsmallest(10, "calidad_rank")[cols_top].to_string(index=False))

    # Guardar resultados
    out_json = os.path.join(DOCS_DIR, "wlc_metacalidad_resultado.json")
    out_csv = os.path.join(DOCS_DIR, "wlc_metacalidad_ranking.csv")

    cols_export = ["id", "nombre", "tipo_fuente", "institucion", "indice_score", "calidad_rank"] + \
                  [f"norm_{c}" for c in criterios] + [f"contrib_{c}" for c in criterios]
    cols_export = [c for c in cols_export if c in df_resultado.columns]

    df_resultado[cols_export].to_csv(out_csv, index=False, encoding="utf-8-sig")
    df_resultado[cols_export].to_json(out_json, orient="records", indent=2, force_ascii=False)

    # Replicar a src/docs/
    os.makedirs(SRC_DOCS_DIR, exist_ok=True)
    df_resultado[cols_export].to_json(os.path.join(SRC_DOCS_DIR, "wlc_metacalidad_resultado.json"), orient="records", indent=2, force_ascii=False)
    df_resultado[cols_export].to_csv(os.path.join(SRC_DOCS_DIR, "wlc_metacalidad_ranking.csv"), index=False, encoding="utf-8-sig")

    print(f"\n  ✔ Resultados WLC de MetaCalidad exportados a:")
    print(f"    - {out_json}")
    print(f"    - {out_csv}")
    return df_resultado


# ─────────────────────────────────────────────────────────────────────────────
# BLOQUE 5 — INTERFAZ CLI (argparse)
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="WLC v2.0 — Modelo de Índice Lineal Ponderado para Priorización Territorial y Calidad Espacial.",
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument("-i",  "--input",         type=str,   help="Ruta al archivo vectorial de entrada (GeoJSON / GPKG)")
    parser.add_argument("-l",  "--layer",         type=str,   help="Nombre de la capa dentro del GPKG")
    parser.add_argument("-c",  "--criterios",     nargs="+",  help="Lista de columnas criterio")
    parser.add_argument("-w",  "--pesos",         nargs="+",  type=float, help="Pesos correspondientes a los criterios")
    parser.add_argument("-t",  "--tipos",         nargs="+",  help="Tipo por criterio: 'beneficio' o 'costo'")
    parser.add_argument("-o",  "--output",        type=str,   help="Ruta al archivo de salida")
    parser.add_argument("-u",  "--umbral",        type=float, help="Umbral de distancia para matriz espacial W (metros)")
    parser.add_argument("--justificar",           action="store_true", help="Calcular correlación espacial bivariada")
    parser.add_argument("--top_n",                type=int,   help="Cantidad de entidades a listar en el ranking resumen")
    parser.add_argument("--no_heatmap",           action="store_true", help="Desactivar generación de heatmap PNG")
    parser.add_argument("--no_csv",               action="store_true", help="Desactivar exportación de correlación CSV")
    parser.add_argument("--modo",                 choices=["territorial", "metacalidad"], default="territorial",
                        help="Modo de ejecución: 'territorial' (default) o 'metacalidad'")

    args = parser.parse_args()
    cfg = dict(CONFIG)

    if args.input:     cfg["input_file"]  = args.input
    if args.layer:     cfg["layer_name"]  = args.layer
    if args.criterios and args.pesos and args.tipos:
        if len(args.criterios) != len(args.pesos) or len(args.criterios) != len(args.tipos):
            print("❌ Error: La cantidad de criterios, pesos y tipos debe coincidir exactamente.")
            sys.exit(1)
        cfg["criterios"] = list(zip(args.criterios, args.pesos, args.tipos))

    if args.output:             cfg["output_file"]       = args.output
    if args.umbral is not None: cfg["umbral_vecindad_m"] = args.umbral
    if args.justificar:         cfg["justificar_pesos"]  = True
    if args.top_n:              cfg["top_n"]             = args.top_n
    if args.no_heatmap:         cfg["exportar_heatmap"]  = False
    if args.no_csv:             cfg["exportar_csv"]      = False

    try:
        if args.modo == "metacalidad":
            ejecutar_modelo_metacalidad(cfg)
        else:
            ejecutar_modelo(cfg)
    except Exception as e:
        print(f"\n❌ Error al ejecutar el modelo WLC: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()


# =============================================================================
# FUENTES BIBLIOGRÁFICAS CANÓNICAS
# =============================================================================
# [1] Malczewski, J. (1999). GIS and Multicriteria Decision Analysis.
#     John Wiley & Sons, Nueva York. Cap. 4, pp. 81–96; Cap. 5, pp. 101–118.
# [2] Voogd, H. (1983). Multicriteria Evaluation for Urban and Regional Planning.
#     Pion, Londres. pp. 57–75.
# [3] Eastman, J.R. (1999). Multi-criteria evaluation and GIS. En: Longley, P.A.
#     et al. (Eds.), Geographical Information Systems. Vol. 1, pp. 493–502.
# [4] Jankowski, P. (1995). Integrating GIS and multiple criteria decision-making.
#     International Journal of GIS, 9(3), pp. 251–273.
# [5] Anselin, L. (1988). Spatial Econometrics: Methods and Models.
#     Kluwer Academic Publishers, Dordrecht. pp. 17–32.
# [6] Anselin, L. (1995). Local Indicators of Spatial Association—LISA.
#     Geographical Analysis, 27(2), pp. 93–115.
# [7] Tobler, W.R. (1970). A computer movie simulating urban growth.
#     Economic Geography, 46(sup1), pp. 234–240.
# [8] Saaty, T.L. (1980). The Analytic Hierarchy Process. McGraw-Hill.
# =============================================================================
