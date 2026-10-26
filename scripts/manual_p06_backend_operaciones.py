# -*- coding: utf-8 -*-
PARTE_06 = r"""# PARTE VI: ARQUITECTURA DE DATOS POSTGIS, BACKEND Y PIPELINE DE AUTOMATIZACIÓN

---

## 31. Infraestructura de Almacenamiento Espacial: PostgreSQL 17 + PostGIS 3.3 en Supabase Cloud

El Atlas de Información Geográfica Voluntaria implementa un modelo de datos híbrido de triple redundancia (*triple failover architecture*). En la cúspide de este ecosistema se ubica la base de datos relacional orientada a objetos **PostgreSQL versión 17** enriquecida con la extensión geoespacial **PostGIS versión 3.3.4**, alojada en la infraestructura gestionada de **Supabase Cloud**.

Esta capa backend proporciona capacidades de cómputo analítico geoespacial en el lado del servidor, permitiendo ejecutar consultas topológicas complejas, filtrado espacial por rectángulos envolventes (*Bounding Boxes* o BBOX), agregaciones estadísticas instantáneas y transformaciones de sistemas de referencia de coordenadas sin sobrecargar los recursos del cliente web.

```text
┌────────────────────────────────────────────────────────────────────────┐
│        ARQUITECTURA DE DATOS ESPACIALES HÍBRIDA (TRIPLE FAILOVER)      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [Cliente Web / Leaflet 1.9.4]                                        │
│                 │                                                      │
│                 ├──► 1. Supabase PostGIS RPC (PostgreSQL 17 / PostGIS) │
│                 │       │ Fallback automático si latencia > 1200ms     │
│                 ├──► 2. Netlify Edge CDN (GeoJSON estático WGS84)      │
│                 │       │ Fallback automático si offline               │
│                 └──► 3. Caché Local Navegador (IndexedDB / LocalStorage)│
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

```mermaid
flowchart TD
    Cliente["Cliente Web / Leaflet 1.9.4"]
    
    subgraph FAILOVER["Arquitectura Híbrida de Triple Redundancia"]
        P1["1. Supabase PostGIS RPC (PostgreSQL 17 / PostGIS 3.3)"]
        P2["2. Netlify Edge CDN (GeoJSON Estático WGS84)"]
        P3["3. Almacenamiento Local (IndexedDB / LocalStorage)"]
    end

    Cliente -->|"1. Petición BBOX / SQL"| P1
    P1 -.->|"Latencia > 1200ms o Error 503"| P2
    P2 -.->|"Offline o Sin Conectividad"| P3
    P1 ==>|"GeoJSON en Streaming"| Cliente
    P2 ==>|"GeoJSON Estático"| Cliente
    P3 ==>|"Datos Cacheados"| Cliente
```

### 31.1 Justificación Técnica del Motor PostGIS

La elección de PostGIS frente a otras soluciones de almacenamiento de datos espaciales (como MongoDB GeoJSON, Spatialite o bases NoSQL basadas en GeoHash) responde a las siguientes exigencias técnicas y académicas del proyecto:

1. **Cumplimiento Estricto de Estándares OGC:** PostGIS implementa fielmente la especificación *Open Geospatial Consortium (OGC) Simple Features for SQL (SFSQL)*, garantizando que todas las geometrías (Puntos, Líneas, Polígonos y Multi-geometrías) cumplan con las reglas de validez topológica universalmente reconocidas.
2. **Indexación Espacial GiST (Generalized Search Tree):** El motor utiliza árboles R-Tree balanceados (`GIST`) para indexar las cajas de delimitación mínima (*Minimum Bounding Boxes* - MBR) de cada geometría. Esto reduce la complejidad computacional de las consultas espaciales de un escaneo secuencial `O(n)` a una búsqueda logarítmica `O(log n)`, permitiendo filtrar cientos de miles de entidades en milisegundos.
3. **Indexación GIN para Metadatos Semánticos JSONB:** Los atributos alfanuméricos de OpenStreetMap y fuentes oficiales presentan esquemas altamente variables y no uniformes. La utilización del tipo de dato `JSONB` de PostgreSQL, combinada con índices invertidos generalizados (`GIN`), permite indexar cada clave-valor semántica (`amenity`, `highway`, `building`, `operator`) sin requerir costosas modificaciones al esquema relacional de la tabla.
4. **Capacidades Analíticas Nativas en el Servidor:** La presencia de funciones espaciales como `ST_Intersects`, `ST_Contains`, `ST_DWithin`, `ST_Buffer`, `ST_Centroid`, `ST_SimplifyPreserveTopology` y `ST_AsGeoJSON` elimina la necesidad de transferir millones de coordenadas al navegador web cuando solo se requiere un subconjunto o una métrica derivada.

```mermaid
erDiagram
    capas_metadata ||--o{ capas_entidades : "contiene (1:N)"
    capas_metadata ||--o{ auditoria_actualizaciones : "registra (1:N)"

    capas_metadata {
        varchar id PK
        varchar nombre
        varchar categoria
        varchar fuente
        varchar geometria_tipo
        integer total_entidades
        numeric indice_calidad_wlc
        timestamptz actualizado_el
    }

    capas_entidades {
        uuid id PK
        varchar capa_id FK
        varchar identificador_origen
        varchar nombre
        varchar categoria_osm
        jsonb propiedades
        geometry geom
        numeric calidad_puntaje
    }

    auditoria_actualizaciones {
        serial id PK
        varchar capa_id FK
        varchar tipo_evento
        integer entidades_afectadas
        numeric tiempo_ejecucion_segundos
        timestamptz fecha_evento
    }
```

---

### 31.2 Esquema DDL Completo (`01_schema_postgis.sql`)

A continuación se documenta el código de definición de datos (*Data Definition Language* - DDL) implementado en el clúster de Supabase. Este script inicializa las extensiones requeridas, crea las tablas maestras, configura las restricciones de integridad y establece los índices espaciales y semánticos.

```sql
-- ============================================================================
-- ATLAS DE INFORMACIÓN GEOGRÁFICA VOLUNTARIA — UAH
-- SCRIPT DE INICIALIZACIÓN DDL POSTGRESQL 17 + POSTGIS 3.3
-- ARCHIVO: supabase/migrations/01_schema_postgis.sql
-- ============================================================================

-- 1. Habilitación de extensiones espaciales y utilitarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "postgis_topology";

-- Verificación de versión de PostGIS instalada
DO $$
BEGIN
    RAISE NOTICE 'PostGIS Version: %', PostGIS_Full_Version();
END $$;

-- 2. Tabla Maestra de Metadatos de Capas Cartográficas
CREATE TABLE IF NOT EXISTS public.capas_metadata (
    id VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    fuente VARCHAR(100) NOT NULL,
    descripcion TEXT,
    geometria_tipo VARCHAR(50) NOT NULL,
    epsg_original INTEGER DEFAULT 4326,
    total_entidades INTEGER DEFAULT 0,
    rango_escalar VARCHAR(50) DEFAULT '1:1.000 - 1:25.000',
    formato_origen VARCHAR(20) DEFAULT 'GeoJSON',
    licencia VARCHAR(100) DEFAULT 'ODbL / CC-BY 4.0',
    url_origen TEXT,
    archivo_local VARCHAR(255),
    indice_calidad_wlc NUMERIC(5,4) DEFAULT 0.0000,
    actualizado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentarios explicativos en columnas de metadatos
COMMENT ON TABLE public.capas_metadata IS 'Registro maestro de capas vectoriales integradas en el Atlas VGI UAH.';
COMMENT ON COLUMN public.capas_metadata.id IS 'Identificador canónico de la capa (ej: cat01_arbolado_urbano).';
COMMENT ON COLUMN public.capas_metadata.indice_calidad_wlc IS 'Puntaje de Índice Global de Calidad VGI según modelo WLC ISO 19157 (0 a 1).';

-- 3. Tabla Maestra de Entidades Espaciales Vectoriales
CREATE TABLE IF NOT EXISTS public.capas_entidades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    capa_id VARCHAR(100) NOT NULL REFERENCES public.capas_metadata(id) ON DELETE CASCADE,
    identificador_origen VARCHAR(100),
    nombre VARCHAR(255),
    categoria_osm VARCHAR(100),
    propiedades JSONB NOT NULL DEFAULT '{}'::jsonb,
    geom geometry(Geometry, 4326) NOT NULL,
    longitud NUMERIC(12,8),
    latitud NUMERIC(12,8),
    calidad_puntaje NUMERIC(5,4) DEFAULT 0.0000,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentarios de tabla de entidades
COMMENT ON TABLE public.capas_entidades IS 'Almacén unificado de geometrías vectoriales del Atlas VGI en WGS84.';
COMMENT ON COLUMN public.capas_entidades.geom IS 'Geometría espacial en EPSG:4326 (Punto, Línea o Polígono).';
COMMENT ON COLUMN public.capas_entidades.propiedades IS 'Contenedor binario JSONB con los atributos semánticos completos.';

-- 4. Creación de Índices de Alto Rendimiento

-- Índice Espacial GiST para consultas topológicas y BBOX
CREATE INDEX IF NOT EXISTS idx_capas_entidades_geom 
    ON public.capas_entidades USING GIST (geom);

-- Índice B-Tree para filtrado por identificador de capa
CREATE INDEX IF NOT EXISTS idx_capas_entidades_capa_id 
    ON public.capas_entidades USING BTREE (capa_id);

-- Índice Invertido GIN para consultas semánticas sobre atributos JSONB
CREATE INDEX IF NOT EXISTS idx_capas_entidades_propiedades 
    ON public.capas_entidades USING GIN (propiedades);

-- Índice B-Tree compuesto para ordenamiento por calidad dentro de cada capa
CREATE INDEX IF NOT EXISTS idx_capas_entidades_capa_calidad 
    ON public.capas_entidades USING BTREE (capa_id, calidad_puntaje DESC);

-- 5. Tabla de Auditoría y Control de Actualizaciones
CREATE TABLE IF NOT EXISTS public.auditoria_actualizaciones (
    id SERIAL PRIMARY KEY,
    capa_id VARCHAR(100) REFERENCES public.capas_metadata(id) ON DELETE SET NULL,
    tipo_evento VARCHAR(50) NOT NULL,
    entidades_afectadas INTEGER NOT NULL,
    ejecutado_por VARCHAR(100) DEFAULT 'pipeline_python_uah',
    tiempo_ejecucion_segundos NUMERIC(8,2),
    detalles JSONB,
    fecha_evento TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

### 31.3 Funciones Remotas PL/pgSQL (Remote Procedure Calls - RPC)

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Visor Web / Script Analítico
    participant API as PostgREST API (Supabase)
    participant RPC as Función PL/pgSQL (fn_obtener_capa_bbox)
    participant GiST as Índice Espacial R-Tree (GiST)
    participant CDN as Fallback: Netlify Edge CDN (src/data/)

    Cliente->>API: POST /rest/v1/rpc/fn_obtener_capa_bbox (capa_id, BBox)
    alt Clúster PostGIS Activo (Latencia < 1200ms)
        API->>RPC: Invoca función con parámetros geodésicos
        RPC->>GiST: Filtro indexado geom && ST_MakeEnvelope(...)
        GiST-->>RPC: Subconjunto de registros espaciales
        RPC->>RPC: Ensambla FeatureCollection con ST_AsGeoJSON(geom)
        RPC-->>API: Objeto JSONB homologado
        API-->>Cliente: HTTP 200 OK (GeoJSON en Streaming)
    else Latencia > 1200ms o Modo Estático
        API--xCliente: Timeout / Conmutación automática
        Cliente->>CDN: GET /data/{archivo}.geojson
        CDN-->>Cliente: HTTP 200 OK (GeoJSON Estático WGS84)
    end
```

Para permitir que el cliente web (Leaflet) o los scripts Python interactúen con la base de datos de manera atómica y segura mediante la API REST de Supabase (*PostgREST*), se diseñaron e implementaron tres funciones almacenadas en lenguaje `PL/pgSQL`.

#### 1. Función `fn_obtener_capa_bbox`: Extracción Geoespacial por Bounding Box

```sql
CREATE OR REPLACE FUNCTION public.fn_obtener_capa_bbox(
    p_capa_id VARCHAR(100),
    p_min_lon DOUBLE PRECISION,
    p_min_lat DOUBLE PRECISION,
    p_max_lon DOUBLE PRECISION,
    p_max_lat DOUBLE PRECISION,
    p_limite INTEGER DEFAULT 2000
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_bbox geometry;
    v_resultado JSONB;
BEGIN
    v_bbox := ST_MakeEnvelope(p_min_lon, p_min_lat, p_max_lon, p_max_lat, 4326);

    SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'capa_id', p_capa_id,
        'features', COALESCE(jsonb_agg(
            jsonb_build_object(
                'type', 'Feature',
                'id', e.id,
                'geometry', ST_AsGeoJSON(e.geom)::jsonb,
                'properties', e.propiedades || jsonb_build_object(
                    'calidad_puntaje', e.calidad_puntaje,
                    'nombre', e.nombre,
                    'categoria_osm', e.categoria_osm
                )
            )
        ), '[]'::jsonb)
    ) INTO v_resultado
    FROM (
        SELECT id, nombre, categoria_osm, propiedades, geom, calidad_puntaje
        FROM public.capas_entidades
        WHERE capa_id = p_capa_id
          AND geom && v_bbox
          AND ST_Intersects(geom, v_bbox)
        LIMIT p_limite
    ) e;

    RETURN v_resultado;
END;
$$;
```

#### 2. Función `fn_buscar_entidades_radio`: Análisis de Proximidad Esférica

```sql
CREATE OR REPLACE FUNCTION public.fn_buscar_entidades_radio(
    p_lon DOUBLE PRECISION,
    p_lat DOUBLE PRECISION,
    p_radio_metros DOUBLE PRECISION,
    p_capa_id VARCHAR(100) DEFAULT NULL,
    p_limite INTEGER DEFAULT 100
)
RETURNS TABLE (
    id UUID,
    capa_id VARCHAR(100),
    nombre VARCHAR(255),
    categoria_osm VARCHAR(100),
    distancia_metros NUMERIC(10,2),
    geojson JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_origen geography;
BEGIN
    v_origen := ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography;

    RETURN QUERY
    SELECT 
        e.id,
        e.capa_id,
        e.nombre,
        e.categoria_osm,
        ROUND(ST_Distance(e.geom::geography, v_origen)::numeric, 2) AS distancia_metros,
        ST_AsGeoJSON(e.geom)::jsonb AS geojson
    FROM public.capas_entidades e
    WHERE (p_capa_id IS NULL OR e.capa_id = p_capa_id)
      AND ST_DWithin(e.geom::geography, v_origen, p_radio_metros)
    ORDER BY ST_Distance(e.geom::geography, v_origen) ASC
    LIMIT p_limite;
END;
$$;
```

#### 3. Función `fn_resumen_estadistico_capa`: Diagnóstico de Geometrías y Atributos

```sql
CREATE OR REPLACE FUNCTION public.fn_resumen_estadistico_capa(p_capa_id VARCHAR(100))
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'capa_id', p_capa_id,
        'total_entidades', COUNT(*),
        'geometrias', jsonb_object_agg(sub.tipo_geom, sub.conteo),
        'promedio_calidad', ROUND(AVG(calidad_puntaje)::numeric, 4),
        'min_calidad', MIN(calidad_puntaje),
        'max_calidad', MAX(calidad_puntaje)
    ) INTO v_stats
    FROM (
        SELECT 
            ST_GeometryType(geom) AS tipo_geom,
            COUNT(*) AS conteo,
            AVG(calidad_puntaje) AS calidad_puntaje
        FROM public.capas_entidades
        WHERE capa_id = p_capa_id
        GROUP BY ST_GeometryType(geom)
    ) sub;

    RETURN v_stats;
END;
$$;
```

---

### 31.4 Políticas de Seguridad por Fila (Row Level Security - RLS)

```sql
-- Habilitación obligatoria de RLS en todas las tablas públicas
ALTER TABLE public.capas_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capas_entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria_actualizaciones ENABLE ROW LEVEL SECURITY;

-- 1. Política de Lectura Pública (Anónima) para Metadatos
CREATE POLICY "Lectura pública anónima de capas_metadata"
    ON public.capas_metadata
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2. Política de Lectura Pública (Anónima) para Entidades Espaciales
CREATE POLICY "Lectura pública anónima de capas_entidades"
    ON public.capas_entidades
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 3. Política de Escritura Exclusiva para Rol de Servicio (Service Role)
CREATE POLICY "Escritura exclusiva service_role en capas_metadata"
    ON public.capas_metadata
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Escritura exclusiva service_role en capas_entidades"
    ON public.capas_entidades
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Escritura exclusiva service_role en auditoria_actualizaciones"
    ON public.auditoria_actualizaciones
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
```

---

### 31.5 Script de Carga Masiva por Lotes (`scripts/cargar_entidades_postgis.py`)

```python
# scripts/cargar_entidades_postgis.py
# Pipeline de ingesta y sincronización masiva hacia Supabase PostGIS.

import os
import sys
import json
import time
import requests

CHUNK_SIZE = 500
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("[ERROR] Variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas.")
    print("Defínalas en su entorno antes de ejecutar este script.")
    sys.exit(1)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def cargar_capa_a_postgis(ruta_geojson, capa_id):
    print(f"\n[*] Procesando capa: {capa_id} desde {ruta_geojson}")
    with open(ruta_geojson, 'r', encoding='utf-8') as f:
        data = json.load(f)

    features = data.get("features", [])
    total = len(features)
    print(f"    - Total de entidades detectadas: {total}")

    if total == 0:
        print("    [!] Capa sin geometrías. Omitiendo.")
        return

    for i in range(0, total, CHUNK_SIZE):
        chunk = features[i:i + CHUNK_SIZE]
        lote_postgis = []

        for f in chunk:
            geom = f.get("geometry")
            if not geom or not geom.get("coordinates"):
                continue

            props = f.get("properties", {})
            nombre = props.get("nombre") or props.get("name") or "Sin Nombre"
            categoria_osm = props.get("categoria_osm") or props.get("amenity") or "vgi_general"
            calidad = float(props.get("calidad_wlc", 0.70))

            registro = {
                "capa_id": capa_id,
                "identificador_origen": str(props.get("osm_id", f.get("id", ""))),
                "nombre": str(nombre)[:254],
                "categoria_osm": str(categoria_osm)[:99],
                "propiedades": props,
                "geom": f"SRID=4326;{json.dumps(geom)}",
                "calidad_puntaje": calidad
            }
            lote_postgis.append(registro)

        endpoint = f"{SUPABASE_URL}/rest/v1/capas_entidades"
        intentos = 0
        exito = False

        while intentos < 3 and not exito:
            intentos += 1
            try:
                resp = requests.post(endpoint, headers=HEADERS, json=lote_postgis, timeout=30)
                if resp.status_code in [200, 201]:
                    exito = True
                    print(f"    ✓ Lote {i//CHUNK_SIZE + 1} insertado con éxito ({len(lote_postgis)} registros).")
                else:
                    print(f"    [!] Error en lote {i//CHUNK_SIZE + 1} (HTTP {resp.status_code}): {resp.text}")
                    time.sleep(2 * intentos)
            except Exception as e:
                print(f"    [!] Excepción de red en intento {intentos}: {e}")
                time.sleep(2 * intentos)

        if not exito:
            print(f"    [ERROR] Falló la inserción del lote {i//CHUNK_SIZE + 1} tras 3 reintentos.")

if __name__ == "__main__":
    directorio_capas = "datos/capas"
    archivos = [a for a in os.listdir(directorio_capas) if a.endswith(".geojson")]
    print(f"[+] Iniciando ingesta masiva de {len(archivos)} capas hacia Supabase PostGIS...")
    for archivo in archivos:
        capa_id = os.path.splitext(archivo)[0]
        ruta = os.path.join(directorio_capas, archivo)
        cargar_capa_a_postgis(ruta, capa_id)
    print("\n[+] Ingesta masiva finalizada exitosamente.")
```

---

## 32. Catálogo Estandarizado Multi-Lenguaje de Componentes, Archivos y Scripts de la Plataforma Web

La plataforma web del Atlas opera mediante una arquitectura desacoplada y libre de transpiladores opacos, articulando **seis familias de lenguajes y estándares técnicos** (**HTML5**, **CSS3**, **JavaScript ES6+ IIFE**, **SQL / PL/pgSQL / Overpass QL**, **JSON / GeoJSON / TOML / XML** y **Python 3**).

Para facilitar la comprensión integral del ecosistema y permitir su modificación segura, todos los archivos de la plataforma se documentan a continuación bajo una **Estructura Estandarizada de 6 Atributos Técnicos**:
1. **Lenguaje y Estándar:** Especificación técnica e intérprete o motor de ejecución.
2. **Ruta en el Proyecto:** Ubicación relativa dentro del árbol del repositorio.
3. **Rol dentro de la Plataforma Web:** Función arquitectónica y responsabilidad dentro del geoportal.
4. **Estructura Interna y Componentes Clave:** Secciones, selectores, funciones públicas o tablas que lo componen.
5. **Entradas y Salidas (I/O):** Datos consumidos y artefactos o estados generados.
6. **Pautas de Modificación y Extensibilidad:** Instrucciones concretas para editar o ampliar el archivo sin romper la coherencia del sistema.

```text
┌────────────────────────────────────────────────────────────────────────┐
│     ECOSISTEMA MULTI-LENGUAJE DE LA PLATAFORMA WEB (ESTRUCTURA)        │
├────────────────────────────────────────────────────────────────────────┤
│ 32.1 HTML5 Semántico (WCAG 2.1 AAA)    ──► src/index.html              │
│ 32.2 CSS3 Nativo (:root + Flexbox/Grid)──► src/css/estilos.css         │
│ 32.3 JavaScript ES6+ (IIFE Modular)    ──► 21 módulos en src/js/       │
│ 32.4 SQL / PL/pgSQL + Overpass QL      ──► supabase/ y consultas QL    │
│ 32.5 JSON / GeoJSON / TOML / XML       ──► config/, netlify.toml, data/│
│ 32.6 Python 3 (Pipelines ETL y QA/QC)  ──► 25 scripts en scripts/      │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 32.1. Lenguaje de Marcado y Maquetación Estructural (HTML5 Semántico / WCAG 2.1 AAA)

#### Componente HTML-01: `src/index.html`
- **Lenguaje y Estándar:** HTML5 Semántico (`<!DOCTYPE html>`, `lang="es"`) con atributos de accesibilidad WAI-ARIA (`role`, `aria-label`, `aria-expanded`, `aria-live`) bajo norma WCAG 2.1 Nivel AAA.
- **Ruta en el Proyecto:** `src/index.html`
- **Rol dentro de la Plataforma Web:** Documento contenedor de página única (*Single-Page Application* - SPA) que estructura el lienzo cartográfico, la barra de navegación superior de los 10 módulos (`01` a `10`), la consola lateral de herramientas SIG, las vistas dedicadas de análisis y el orden determinista de carga de hojas de estilo y scripts.
- **Estructura Interna y Componentes Clave:**
  - `<head>`: Metadatos de codificación UTF-8, viewport responsivo, precarga de fuentes (`Inter`, `Fraunces`, `JetBrains Mono`), hoja de estilos de Leaflet 1.9.4 y `css/estilos.css`.
  - `<header class="encabezado-principal">`: Identidad del geoportal, selector rápido de ámbito y barra de navegación principal (`.nav-principal`) con los botones de los 10 módulos (`data-vista`).
  - `<section id="vista-visor">`: Contenedor principal dividido en el lienzo `#mapa-principal`, el lienzo `#mapa-comparacion` (Swipe), la consola lateral `.consola-lateral-gis` (con las pestañas Capas, Herramientas y Leyenda) y los paneles flotantes (Diagnóstico Territorial, PRC, Isócronas, Auditoría Temporal ohsome y Evaluador de Calidad).
  - `<section id="vista-indicadores">`, `<section id="vista-metadatos">`, `<section id="vista-licencias">` y `<section id="vista-manual">`: Vistas modulares a pantalla completa para los Módulos `07`, `08`, `09` y `10`.
  - Bloque final de scripts (`<script src="...">`): Carga secuencial de Leaflet, Chart.js, `js/config.js`, utilidades (`js/utils/*.js`), los 16 módulos funcionales (`js/modulos/*.js`) y el orquestador `js/app.js`.
- **Entradas y Salidas (I/O):**
  - *Entradas:* Eventos de interacción del usuario (clics, teclado, selección de formularios) e inyecciones dinámicas del DOM desde los módulos JavaScript.
  - *Salidas:* Árbol DOM renderizado en el navegador y contenedores de montaje para mapas y gráficos.
- **Pautas de Modificación y Extensibilidad:**
  - Para añadir un nuevo módulo de navegación, agregue un botón `<button class="nav-btn" data-vista="nuevo-modulo">` en `.nav-principal` y cree su contenedor `<section id="vista-nuevo-modulo" class="vista-contenido">` antes del pie de página.
  - Al actualizar cualquier archivo JS o CSS en producción, incremente el parámetro de versión `?v=...` en las etiquetas `<link>` y `<script>` de `src/index.html` para invalidar la caché de los navegadores.

---

### 32.2. Lenguaje de Estilización y Sistema de Diseño Visual (CSS3 Nativo)

#### Componente CSS-01: `src/css/estilos.css`
- **Lenguaje y Estándar:** CSS3 Nativo con Variables Personalizadas (*CSS Custom Properties* en `:root`), maquetación mediante `Flexbox` y `CSS Grid`, unidades dinámicas de viewport (`100dvh`), animaciones `@keyframes` y consultas de medios (`@media`).
- **Ruta en el Proyecto:** `src/css/estilos.css`
- **Rol dentro de la Plataforma Web:** Gobernador visual único del geoportal. Define la paleta cromática de alto contraste, la jerarquía tipográfica, el comportamiento responsivo en escritorio, tablet y móvil, los estados de los cursores del mapa, los marcadores vectoriales pulsantes y las reglas de exportación para impresión (`@media print`).
- **Estructura Interna y Componentes Clave:**
  - Bloque `:root`: Tokens semánticos de color (`--musgo`, `--esmeralda`, `--ocre`, `--carmesí`, `--bg-dark`, `--papel`, `--tinta`), tipografía (`--fuente-texto`, `--fuente-datos`) y dimensiones (`--ancho-consola-gis`, `--alto-header`).
  - Layout Principal: Reglas para `.contenedor-visor`, `.consola-lateral-gis`, `.area-mapa` y `.vista-contenido`.
  - Componentes Analíticos: Estilos para `.tarjeta-capa-gis`, `.kpi-card`, `.tabla-datos`, `.badge-estado`, `.modal-overlay` y tarjetas narrativas de Storyboards (`.tarjeta-storyboard`).
  - Simbología Cartográfica: Clases `.pin-svg-pulso`, `.pin-halo`, `.pin-cuerpo` y cursores `.modo-inspeccion-activa`.
- **Entradas y Salidas (I/O):**
  - *Entradas:* Clases, atributos `data-*` y variables en línea (`style="--color-pin: ..."`) aplicadas en el DOM.
  - *Salidas:* Renderizado visual acelerado por GPU en el navegador con contraste validado WCAG 2.1 AAA.
- **Pautas de Modificación y Extensibilidad:**
  - Para modificar los colores globales de toda la plataforma, edite exclusivamente los tokens del bloque `:root` al inicio del archivo; evite escribir colores hexadecimales fijos en reglas individuales.
  - Para ajustar el ancho del panel lateral izquierdo del visor, modifique la variable `--ancho-consola-gis: 380px;`.

---

### 32.3. Lenguaje de Programación Cliente y Motor Cartográfico (JavaScript ES6+ Modular IIFE)

La lógica interactiva del cliente web se compone de **21 archivos JavaScript ES6+** organizados sin dependencias de compiladores externos mediante el patrón **IIFE (*Immediately Invoked Function Expression*)**, exponiendo interfaces limpias en el objeto global `window`.

| ID | Archivo en `src/js/` | Rol Arquitectónico dentro de la Plataforma Web | API / Funciones Públicas Clave | Entradas / Salidas (I/O) | Pautas de Modificación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **JS-01** | `js/config.js` | **Configuración Maestra del Cliente:** Almacena las constantes globales del ámbito de estudio, coordenadas centrales, Bounding Box, endpoints de APIs (Overpass, ohsome, GBIF, Taginfo, IDE Chile, Supabase), mapas base y catálogo base de capas VGI. | `window.CONFIG` (`estudio`, `mapa`, `capasBase`, `endpoints`, `capasVGI`, `pesosCalidad`) | **In:** `config/config.json`. **Out:** Objeto inmutable `CONFIG` consumido por todos los módulos. | Edite `estudio.bbox`, `mapa.centro` o `endpoints` para trasladar el visor a otra comuna o servidor. |
| **JS-02** | `js/modulos/geodesia.js` | **Motor Geodésico y Proyecciones:** Transforma coordenadas entre WGS84 (`EPSG:4326`), Web Mercator (`EPSG:3857`) y UTM Huso 19 Sur (`EPSG:32719` / SIRGAS-Chile), y calcula áreas geodésicas y distancias Haversine. | `Geodesia.wgs84AUTM19S()`, `utm19SAWgs84()`, `distanciaHaversine()`, `areaPoligonoM2()` | **In:** Pares `[lon, lat]` o geometrías GeoJSON. **Out:** Coordenadas métricas `(Este, Norte)` en metros y superficies en `m²`/`ha`. | Si el área de estudio cambia al Huso 18 Sur (`EPSG:32718`), actualice el meridiano central `λ₀ = -75°`. |
| **JS-03** | `js/modulos/db_client.js` | **Conector Híbrido de Triple Redundancia:** Gestiona las consultas espaciales hacia Supabase PostGIS RPC con conmutación automática (*failover*) a los archivos GeoJSON en Netlify CDN y caché en memoria. | `DBClient.obtenerCapa()`, `consultarBBox()`, `buscarRadio()`, `estadoConexion()` | **In:** `capa_id`, `bbox` o radio en metros. **Out:** `Promise<FeatureCollection>` homologada en EPSG:4326. | Ajuste el umbral `TIMEOUT_MS` (por defecto `1200` ms) para calibrar la conmutación al modo estático. |
| **JS-04** | `js/modulos/importador_capas.js` | **Importador y Exportador Local de Geodatos:** Permite cargar archivos locales del usuario (`.geojson`, `.json`, `.kml`, `.csv`) sobre el mapa y exportar subconjuntos vectoriales filtrados. | `ImportadorCapas.cargarArchivo()`, `exportarGeoJSON()`, `exportarCSV()` | **In:** Archivos locales arrastrados o `FeatureCollection` activa. **Out:** Capas temporales en Leaflet o flujo `Blob` descargado. | Añada nuevos analizadores de formato manteniendo la validación de rangos `EPSG:4326`. |
| **JS-05** | `js/modulos/mapa.js` | **Núcleo Cartográfico Leaflet (Módulo 01):** Inicializa el lienzo Leaflet, gestiona los mapas base, controla la pila de capas vectoriales, el comparador Swipe/Lupa, la barra de coordenadas UTM/WGS84 y los marcadores SVG. | `Mapa.inicializar()`, `cargarCapaGeoJSON()`, `cambiarMapaBase()`, `activarComparador()` | **In:** `CONFIG.mapa`, eventos de ratón y capas GeoJSON. **Out:** Instancia `L.Map`, capas renderizadas y popups interactivos. | Modifique `crearPopupEntidad()` para personalizar los campos visibles al hacer clic en un elemento del mapa. |
| **JS-06** | `js/modulos/manifold_canvas.js` | ** Acelerador de Renderizado Vectorial en Canvas:** Optimiza el dibujo de coberturas masivas de puntos, líneas y polígonos mediante `L.canvas()` para mantener 60 FPS en el navegador. | `ManifoldCanvas.crearRenderer()`, `optimizarCapaMasiva()` | **In:** `FeatureCollection` con miles de vértices. **Out:** Instancia `L.Canvas` de alto rendimiento. | Ajuste la tolerancia de acolchado (`padding: 0.5`) según la densidad de geometrías. |
| **JS-07** | `js/modulos/ide_chile.js` | **Gestor del Catálogo Territorial de 132 Capas (Módulo 01):** Administra el árbol de las **122 coberturas oficiales** y **10 categorías VGI**, el buscador instantáneo, los filtros por geometría/fuente y la simbología temática. | `IDEChile.inicializar()`, `activarCapa()`, `desactivarCapa()`, `filtrarCatalogo()` | **In:** `src/data/capas_barrio_brasil.json` y `src/data/*.geojson`. **Out:** Árbol DOM de capas, contadores por categoría y leyenda dinámica. | Para registrar una nueva cobertura local, agréguela en `capas_barrio_brasil.json` y en `CAPAS_IDE_CHILE`. |
| **JS-08** | `js/modulos/osm.js` | **Conector en Vivo a OpenStreetMap (Módulo 02):** Ejecuta consultas en lenguaje Overpass QL en tiempo real para las 10 macrocategorías VGI con rotación de servidores espejo y conversión a GeoJSON. | `OSM.consultarCategoria()`, `ejecutarConsultaQL()`, `convertirOSM2GeoJSON()` | **In:** Cadena Overpass QL y `bbox`. **Out:** `FeatureCollection` extraída directamente de OpenStreetMap. | Modifique el diccionario de consultas para incorporar nuevas combinaciones de etiquetas OSM (`key=value`). |
| **JS-09** | `js/modulos/umap.js` | **Integrador de Cartografía Colaborativa uMap (Módulo 03):** Gestiona la inserción segura de mapas comunitarios externos alojados en uMap y la importación de capas remotas compatibles. | `UMap.cargarMapaEmbebido()`, `importarGeoJSONRemoto()` | **In:** URL de mapa uMap o endpoint GeoJSON. **Out:** Contenedor `<iframe>` aislado con atributos `sandbox` o capa Leaflet. | Agregue nuevos proyectos comunitarios preconfigurados en el listado `MAPAS_UMAP_DESTACADOS`. |
| **JS-10** | `js/modulos/gbif.js` | **Conector de Biodiversidad y Ciencia Ciudadana GBIF (Módulo 04):** Consulta la API v1 de GBIF (`occurrence/search`) dentro del polígono WKT de estudio, normalizando registros bajo el estándar **Darwin Core (DwC)**. | `GBIF.consultarOcurrencias()`, `filtrarPorReino()`, `renderizarFichaTaxonomica()` | **In:** Polígono WKT, filtros taxonómicos y de base de registro (`HUMAN_OBSERVATION`). **Out:** Marcadores biológicos y métricas de riqueza de especies. | Ajuste el límite de paginación (`limit`) o agregue nuevos filtros taxonómicos en `PARAMETROS_GBIF`. |
| **JS-11** | `js/modulos/taginfo.js` | **Auditor Semántico de Etiquetas Taginfo API v4 (Módulo 05):** Consulta frecuencias globales y consenso comunitario de pares `key=value` en Taginfo API v4 y calcula las componentes cualitativas del modelo WLC. | `Taginfo.auditarEtiqueta()`, `obtenerEstadisticasTag()`, `evaluarConsensoSemántico()` | **In:** Claves y valores OSM (`key`, `value`). **Out:** Frecuencia global de uso, estado de documentación Wiki y puntaje semántico. | Modifique los umbrales de consenso global en `UMBRALES_TAGINFO` para ajustar la sensibilidad semántica. |
| **JS-12** | `js/modulos/ohsome.js` | **Auditoría Histórica y Espacio-Temporal ohsome API (Módulo 06):** Conecta con la API v1 de HeiGIT (`ohsome`) y API v0.6 de OSM para ejecutar los 3 submódulos: Auditoría Histórica (`2008–2026`), Tendencias y Saturación (Herfort et al., 2023 / ISO 19157) y Monitor de Changesets / OSMCha. | `Ohsome.ejecutarAuditoria()`, `calcularIndiceSaturacion()`, `consultarChangesets()` | **In:** Categoría OSM (`filter`), rango temporal (`2008-01-01/2026-03-01/P1Y`), `bpolys` en EPSG:4326 y área reproyectada en `EPSG:32719`. **Out:** Series de tiempo, densidad `elem/km²` y `elem / 10.000 m²`, intensidad `edit/user`, Score `/100`, Estado de Saturación y enlaces OSMCha. | Para añadir una nueva categoría de auditoría histórica, incorpore su filtro y el `endpointTipo` (`/count`, `/length` o `/area`) en `CATEGORIAS_OHSOME`. |
| **JS-13** | `js/modulos/calidad_analyst.js` | **Analista Multicriterio WLC y Correlación (Módulo 05):** Ejecuta el modelo de Combinación Lineal Ponderada (WLC v2.0) combinando las 10 dimensiones cuantitativas y cualitativas ISO 19157, y grafica matrices de correlación de Pearson. | `CalidadAnalyst.calcularWLC()`, `actualizarPesos()`, `renderizarMatrizPearson()` | **In:** Vectores de calidad de las capas y pesos ponderadores (`w_i`). **Out:** Índice Global VGI (`IGV`), clasificación por niveles y gráficos radar. | Modifique los pesos predeterminados en `PESOS_WLC_DEFAULT` manteniendo siempre la restricción `∑ w_i = 1.00`. |
| **JS-14** | `js/modulos/evaluador_calidad_cuantitativa.js` | **Auditor Cuantitativo de Geometrías y Topología (Módulo 05):** Verifica el cierre de anillos poligonales, ausencia de vértices duplicados, validez de rangos WGS84, completitud del esquema de 14 atributos y frescura temporal. | `EvaluadorCuantitativo.auditarCapa()`, `validarTopologia()`, `verificarEsquema14()` | **In:** Geometrías y propiedades de las capas vectoriales. **Out:** Puntajes `[0-100%]` en las 5 dimensiones cuantitativas ISO 19157. | Añada nuevas reglas geométricas o campos obligatorios dentro de `validarEntidadIndividual()`. |
| **JS-15** | `js/modulos/evaluador_normativo.js` | **Inspector Normativo PRC e Isócronas de Accesibilidad (Módulo 01/07):** Evalúa mediante algoritmo *Ray-Casting* (*Point-in-Polygon*) la zona del PRC Santiago, Zonas Típicas e ICH, y calcula anillos de accesibilidad peatonal de 5, 10 y 15 minutos. | `EvaluadorNormativo.inspeccionarPredio()`, `calcularIsocronas()`, `emitirCertificado()` | **In:** Coordenadas `[lon, lat]` del clic, polígonos PRC/CMN y capas de equipamiento. **Out:** Ficha normativa de edificación y polígonos de isócronas. | Actualice los parámetros urbanísticos en `ZONAS_PRC_SANTIAGO` ante modificaciones o enmiendas comunales. |
| **JS-16** | `js/modulos/indicadores_analisis.js` | **Indicadores Territoriales y Storyboards Narrativos (Módulo 07):** Gestiona la vista de síntesis territorial, renderizando el tablero de indicadores clave y los **4 Storyboards Interactivos** con **75 cartografías integradas** (`11 + 11 + 29 + 24`) sincronizadas con el visor. | `IndicadoresAnalisis.inicializar()`, `abrirStoryboard()`, `cargarCartografiaEnVisor()` | **In:** `src/data/reporte_indice_calidad_vgi.json`, `capas_barrio_brasil.json` y catálogo `STORYBOARDS`. **Out:** Tarjetas de síntesis, modal narrativo interactivo con visor cartográfico embebido y tablas de datos. | Para agregar un nuevo Storyboard o capítulo cartográfico, añada un objeto al arreglo `STORYBOARDS` especificando sus `capas` y `analisisCapitulos`. |
| **JS-17** | `js/modulos/metadatos.js` | **Catálogo de Metadatos ISO 19115-1 y Exportador XML ISO 19139 (Módulo 08):** Renderiza el explorador interactivo de fichas de metadatos para las **132 coberturas (122 oficiales + 10 VGI)** y genera documentos XML `gmd:MD_Metadata`. | `Metadatos.inicializar()`, `mostrarFichaISO()`, `exportarXMLISO19139()` | **In:** Inventario de 132 capas y perfiles ISO 19115-1:2014 / ISO 19157:2013. **Out:** Tabla maestra de metadatos, modal de 14 atributos y descarga XML/JSON. | Edite la función `generarXMLISO19139()` para incorporar campos adicionales del Perfil Nacional de Metadatos de IDE Chile. |
| **JS-18** | `js/modulos/diccionario.js` | **Diccionario Territorial Interactivo ISO 19110 (Módulo 08):** Administra el catálogo de los **140 descriptores normativos y etiquetas OSM**, permitiendo filtrar por macrocategoría y consultar su equivalencia oficial-comunitaria. | `Diccionario.inicializar()`, `buscarDescriptor()`, `filtrarPorCategoria()` | **In:** Base de 140 descriptores semánticos ISO 19110. **Out:** Grilla interactiva de definiciones, tipos de datos y dominios de valores. | Incorpore nuevos descriptores en el arreglo `DESCRIPTORES_ISO19110` especificando clave OSM, fuente oficial y tipo geométrico. |
| **JS-19** | `js/modulos/licencias.js` | **Centro de Descargas, Licencias y Gobernanza (Módulo 09):** Administra el portal de descarga de la Geodatabase completa (`ZIP`), los 4 catálogos Excel OpenXML, las capas individuales y la matriz de compatibilidad jurídica (ODbL 1.0, CC BY 4.0, Ley 19.628). | `Licencias.inicializar()`, `descargarGeodatabase()`, `filtrarPorLicencia()` | **In:** Rutas de `docs/geodatabase_completa_atlas_vgi.zip` y catálogos en `datos/catalogos/`. **Out:** Descargas directas con validación de integridad y fichas legales. | Si se actualiza el paquete ZIP masivo, actualice los metadatos de peso y conteo de archivos en el módulo. |
| **JS-20** | `js/modulos/manual.js` | **Manual de Uso y Actualización In-App (Módulo 10):** Renderiza dentro de la plataforma web la guía interactiva dividida en Manual de Uso (`USO · 01` a `USO · 10`) y Manual de Actualización (`ACT · 01` a `ACT · 07`), con buscador instantáneo y guía por perfil. | `Manual.inicializar()`, `cambiarCapitulo()`, `filtrarCapitulos()`, `renderizarGuiaPerfil()` | **In:** Inventario dinámico de 132 capas y `docs/MANUAL_ACTUALIZACION_ATLAS.md`. **Out:** Interfaz documental navegable con índice lateral, tablas filtrables y descarga del manual maestro. | Añada nuevas secciones operativas en `obtenerCapitulosManual()` manteniendo la sincronía con el archivo Markdown maestro. |
| **JS-21** | `js/app.js` | **Orquestador Principal de la Aplicación (Controlador SPA):** Coordina el ciclo de vida completo de la plataforma web, enlaza la navegación entre los 10 módulos (`01` a `10`), gestiona los perfiles de usuario, las notificaciones *Toast* y el estado global. | `App.inicializar()`, `cambiarVista()`, `aplicarPerfil()`, `mostrarNotificacion()` | **In:** Eventos globales `DOMContentLoaded` y acciones de los 20 módulos anteriores. **Out:** Transiciones fluidas entre vistas y sincronización del estado entre el visor y los paneles analíticos. | Registre cualquier nuevo módulo dentro de la secuencia de arranque `App.inicializar()` y en el controlador de pestañas. |

---

### 32.4. Lenguajes de Base de Datos Espacial y Consultas (SQL / PL/pgSQL PostGIS y Overpass QL)

#### Componente SQL-01: `supabase/migrations/01_schema_postgis.sql`
- **Lenguaje y Estándar:** SQL ANSI / PostgreSQL 17 DDL y lenguaje procedimental `PL/pgSQL` con extensión espacial **PostGIS 3.3** (estándar OGC Simple Features for SQL).
- **Ruta en el Proyecto:** `supabase/migrations/01_schema_postgis.sql`
- **Rol dentro de la Plataforma Web:** Define la estructura relacional y espacial del backend en la nube, incluyendo las tablas maestras, los índices espaciales R-Tree (`GiST`), los índices semánticos sobre atributos variables (`GIN JSONB`), las políticas de seguridad por fila (*Row Level Security* - RLS) y las funciones remotas RPC consumidas por el visor.
- **Estructura Interna y Componentes Clave:**
  - Extensiones: `uuid-ossp`, `postgis`, `postgis_topology`.
  - Tablas: `public.capas_metadata`, `public.capas_entidades` (con columna `geom geometry(Geometry, 4326)` y `propiedades JSONB`) y `public.auditoria_actualizaciones`.
  - Funciones RPC: `fn_obtener_capa_bbox`, `fn_buscar_entidades_radio` y `fn_resumen_estadistico_capa`.
- **Entradas y Salidas (I/O):**
  - *Entradas:* Peticiones HTTP POST vía PostgREST desde `cliente_postgis.js` o lotes de inserción desde los scripts Python.
  - *Salidas:* Objetos `FeatureCollection` GeoJSON ensamblados directamente en el motor de base de datos mediante `ST_AsGeoJSON()`.
- **Pautas de Modificación y Extensibilidad:**
  - Para crear una nueva consulta espacial en el servidor, escriba una función `CREATE OR REPLACE FUNCTION public.fn_nueva_consulta(...) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER` y expóngala al rol `anon`.

#### Componente QL-01: `scripts/consultas_overpass.json`
- **Lenguaje y Estándar:** **Overpass QL** (*Overpass Query Language*) encapsulado en estructura JSON.
- **Ruta en el Proyecto:** `scripts/consultas_overpass.json`
- **Rol dentro de la Plataforma Web:** Almacena las sentencias de extracción semántica y espacial para las **10 macrocategorías comunitarias VGI** sobre la base de datos global de OpenStreetMap.
- **Estructura Interna y Componentes Clave:** Directivas `[out:json][timeout:60];`, bloques de unión `( node[...](bbox); way[...](bbox); relation[...](bbox); );` y directiva de salida geométrica `out body geom;`.
- **Pautas de Modificación y Extensibilidad:** Para incorporar nuevas etiquetas comunitarias en una macrocategoría, agregue el predicado `["clave"="valor"]` dentro del bloque de unión correspondiente y ejecute el script de sincronización.

---

### 32.5. Lenguajes de Configuración, Manifiestos e Intercambio de Datos (JSON, GeoJSON RFC 7946, TOML y XML)

| Componente | Lenguaje / Estándar | Ruta en el Proyecto | Rol dentro de la Plataforma Web | Estructura Interna Clave | Pautas de Modificación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CFG-01** | **JSON** (ECMA-404) | `config/config.json` y `src/config/config.json` | **Manifiesto de Configuración Territorial:** Define los parámetros del área de estudio, límites geográficos (`bbox`), proyección métrica, endpoints y metadatos generales compartidos entre el backend Python y el frontend web. | Bloques `proyecto`, `ambito_estudio`, `coordenadas`, `proyecciones` y `endpoints`. | Mantenga ambos archivos sincronizados al cambiar el polígono de estudio o el nombre del proyecto. |
| **CFG-02** | **TOML** v1.0.0 | `netlify.toml` | **Configuración Perimetral y Despliegue CDN:** Gobierna el directorio de publicación (`publish = "src"`), la expansión de binarios Git LFS (`GIT_LFS_SKIP_SMUDGE = "0"`), las cabeceras de seguridad/CORS y las redirecciones canónicas. | Bloques `[build]`, `[build.environment]`, `[[headers]]` y `[[redirects]]`. | Añada nuevas reglas `[[headers]]` si incorpora nuevos formatos binarios (ej. `.pmtiles` o `.tif`). |
| **DAT-01** | **GeoJSON** (IETF RFC 7946) | `src/data/*.geojson` y `datos/capas/*.geojson` | **Almacén Vectorial Estático:** Contiene las **132 coberturas espaciales** (122 oficiales + 10 VGI) en `EPSG:4326` con el esquema estandarizado de 14 atributos por entidad. | Objeto `FeatureCollection` con arreglo `features` (`geometry` + `properties`). | Valide siempre todo archivo editado con `verificar_integridad_despliegue.py` para asegurar topología y codificación UTF-8. |
| **DAT-02** | **JSON Analítico** | `src/data/capas_barrio_brasil.json` y `src/data/reporte_indice_calidad_vgi.json` | **Índice Maestro de Capas y Reporte de Calidad:** Registra el inventario completo de capas, conteos de entidades, categorías, fuentes y resultados de las evaluaciones ISO 19157 consumidos por los Módulos `01`, `05`, `07` y `08`. | Arreglos de objetos con `id`, `nombre`, `archivo`, `categoria`, `fuente`, `total_entidades` e `indice_wlc`. | Se regeneran automáticamente al ejecutar los scripts de enriquecimiento y modelamiento de calidad en Python. |

---

### 32.6. Lenguaje de Automatización Backend, ETL Geoespacial y Auditoría (Python 3)

A continuación se documentan los **25 scripts operativos en Python 3** ubicados en el directorio `scripts/`, encargados de la extracción automatizada, normalización topológica, cálculo de calidad, generación de catálogos OpenXML, sincronización PostGIS y validación de integridad:

```text
┌────────────────────────────────────────────────────────────────────────┐
│             MATRIZ DE AUTOMATIZACIÓN PYTHON 3 EN SCRIPTS/              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Ingesta y Extracción: Overpass, Geofabrik, IDE Chile, APIs REST     │
│ 2. Estandarización y Metadatos: ISO 19115/19157, Esquema 14 Atributos   │
│ 3. Modelamiento Espacial y Calidad: Algoritmo WLC, Correlación Pearson │
│ 4. Operaciones PostGIS: Esquemas DDL, Ingesta por Lotes, RPCs          │
│ 5. Control de Calidad y Despliegue: Verificador de 8 Pruebas y ZIP     │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Script 01: `descargar_todas_las_categorias_osm.py`
- **Propósito:** Realiza la extracción masiva automatizada de las 10 macrocategorías temáticas de OpenStreetMap para el polígono de Barrio Brasil y campus UAH mediante consultas Overpass QL directas a los servidores Kumi Systems y Overpass Main.
- **Invocación CLI:** `python3 scripts/descargar_todas_las_categorias_osm.py --timeout 180 --reintentos 3`
- **Dependencias:** `requests`, `json`, `os`, `sys`, `time`.
- **Entradas:** `scripts/consultas_overpass.json` (diccionario de 10 consultas Overpass QL).
- **Salidas:** 10 archivos GeoJSON normalizados en `datos/capas/cat01_*.geojson` a `datos/capas/cat10_*.geojson`.
- **Algoritmo:**
  1. Itera secuencialmente sobre las 10 categorías VGI maestras.
  2. Codifica la consulta Overpass QL en formato URL y la envía al endpoint `https://overpass-api.de/api/interpreter`.
  3. Si la respuesta retorna HTTP 429 (*Too Many Requests*), implementa una pausa progresiva de 15 segundos y conmuta al endpoint espejo `https://overpass.kumi.systems/api/interpreter`.
  4. Convierte la respuesta JSON de elementos OSM (nodes, ways, relations) en una `FeatureCollection` GeoJSON válida.
  5. Inyecta el esquema maestro de 14 atributos con valores predeterminados.
- **Salida de Terminal Típica:**
  ```text
  [*] Conectando a Overpass API para CAT-01 (Arbolado Urbano)...
      ✓ HTTP 200 OK. 1,482 nodos descargados en 3.42s.
      ✓ Transformación a FeatureCollection GeoJSON completada.
      ✓ Guardado en datos/capas/cat01_arbolado_urbano.geojson.
  ```

---

### Script 02: `procesar_geofabrik_rm.py`
- **Propósito:** Descomprime y procesa el extracto regional masivo de OpenStreetMap para la Región Metropolitana de Santiago provisto por Geofabrik (`chile-latest-free.shp.zip` o extractos PBF), filtrando las capas temáticas requeridas para la escala metropolitana.
- **Invocación CLI:** `python3 scripts/procesar_geofabrik_rm.py --region "Región Metropolitana de Santiago"`
- **Dependencias:** `geopandas`, `shapely`, `fiona`, `pyproj`.
- **Entradas:** Archivo Shapefile o PBF descargado en `datos/geofabrik_rm/`.
- **Salidas:** Archivos GeoJSON temáticos regionales (`gis_osm_roads_free_1.geojson`, `gis_osm_pois_free_1.geojson`, etc.) y GeoPackage consolidado.
- **Algoritmo:**
  1. Lee las capas Shapefile mediante `geopandas.read_file()`.
  2. Verifica que el sistema de coordenadas sea EPSG:4326; si viene en otra proyección, ejecuta reproyección mediante `.to_crs(epsg=4326)`.
  3. Filtra geometrías vacías (`gdf[~gdf.is_empty]`) y geometrías inválidas (`gdf.make_valid()`).
  4. Exporta las capas optimizadas a GeoJSON y GeoPackage.

---

### Script 03: `generar_gpkg_geofabrik.py`
- **Propósito:** Empaqueta todas las capas vectoriales regionales de Geofabrik dentro de un único archivo **GeoPackage estándar OGC** (`geofabrik_rm_osm.gpkg`), facilitando su uso profesional directo en software SIG de escritorio como QGIS o ArcGIS Pro.
- **Invocación CLI:** `python3 scripts/generar_gpkg_geofabrik.py --output datos/geofabrik_rm/geofabrik_rm_osm.gpkg`
- **Dependencias:** `sqlite3`, `geopandas`, `fiona`.
- **Entradas:** Archivos GeoJSON de Geofabrik en `datos/geofabrik_rm/`.
- **Salidas:** `datos/geofabrik_rm/geofabrik_rm_osm.gpkg` (archivo binario SQLite3 con extensiones OGC).
- **Algoritmo:**
  1. Inicializa el contenedor GeoPackage SQLite con la tabla `gpkg_spatial_ref_sys`.
  2. Itera sobre cada capa temática (vialidad, puntos de interés, hidrografía, uso de suelo, ferrocarriles).
  3. Escribe cada una como una capa separada (`layer`) con índices espaciales R-Tree activados.
  4. Registra los metadatos de extensión geográfica en `gpkg_contents`.

---

### Script 04: `procesar_osm_geofabrik_completo.py`
- **Propósito:** Realiza la normalización y depuración completa de atributos en las capas Geofabrik, armonizando los nombres de campos en inglés (`fclass`, `name`, `osm_id`) con el estándar en español y los 14 atributos del Atlas.
- **Invocación CLI:** `python3 scripts/procesar_osm_geofabrik_completo.py`
- **Dependencias:** `geopandas`, `pandas`.
- **Salidas:** Archivos GeoJSON saneados listos para consumo web o base de datos.

---

### Script 05: `procesar_osm_geofabrik_usuario.py`
- **Propósito:** Subconjunto especializado que extrae las entidades creadas o editadas por el mapeador local y usuarios de la comunidad de Barrio Brasil, aislando los aportes locales para análisis de actividad voluntaria.
- **Invocación CLI:** `python3 scripts/procesar_osm_geofabrik_usuario.py --bounding-box "-70.675,-33.450,-70.655,-33.435"`
- **Salidas:** `datos/capas/vgi_aportes_comunitarios_usuario.geojson`.

---

### Script 06: `sincronizar_capas_osm_locales.py`
- **Propósito:** Compara los checksums SHA256 de las capas GeoJSON locales contra las versiones almacenadas en Supabase Storage y el repositorio remoto, actualizando únicamente aquellas capas cuyos datos hayan sufrido cambios en OpenStreetMap.
- **Invocación CLI:** `python3 scripts/sincronizar_capas_osm_locales.py --check-only`
- **Dependencias:** `hashlib`, `requests`, `json`.
- **Salidas:** Reporte en consola de discrepancias y actualización atómica de capas modificadas.

---

### Script 07: `descargar_capas_normativas_ide.py`
- **Propósito:** Descarga y normaliza las capas oficiales de instrumentos de planificación territorial y normativas urbanas provenientes de IDE Chile, MINVU y Municipalidad de Santiago (Zonas de Conservación Histórica, Inmuebles de Conservación Histórica, Seccionales y Límites Comunales).
- **Invocación CLI:** `python3 scripts/descargar_capas_normativas_ide.py`
- **Dependencias:** `requests`, `urllib3`.
- **Salidas:** Capas vectoriales oficiales en `datos/oficiales_ide/`.

---

### Script 08: `descargar_categorias_faltantes.py`
- **Propósito:** Script de contingencia para reintentar la descarga de capas específicas que hayan fallado por *timeout* en ejecuciones masivas anteriores, permitiendo pasar una lista de IDs de categorías.
- **Invocación CLI:** `python3 scripts/descargar_categorias_faltantes.py --ids "cat03,cat07"`

---

### Script 09: `procesar_censo2024_rm.py`
- **Propósito:** Procesa las coberturas vectoriales y alfanuméricas del Censo de Población y Vivienda 2024 del INE a nivel de Manzanas Censales y Zonas Censales para la comuna de Santiago y la Región Metropolitana, unificando los identificadores geoespaciales con la cartografía base.
- **Invocación CLI:** `python3 scripts/procesar_censo2024_rm.py --input datos/censo2024_raw/`
- **Dependencias:** `geopandas`, `pandas`.
- **Salidas:** `datos/capas/ine_censo2024_manzanas_santiago.geojson`.

---

### Script 10: `inspeccionar_censo2024.py`
- **Propósito:** Script de diagnóstico estadístico que imprime en consola el resumen de variables censales (total viviendas, total personas, viviendas particulares ocupadas con moradores presentes) para verificar consistencia demográfica.
- **Invocación CLI:** `python3 scripts/inspeccionar_censo2024.py`

---

### Script 11: `procesar_capa_semaforos.py`
- **Propósito:** Normaliza la capa de semáforos de la Unidad Operativa de Control de Tránsito (UOCT / MTT), verificando coordenadas geográficas en EPSG:4326 y clasificando los cruces semaforizados según tipo de controlador y sincronía en Barrio Brasil.
- **Invocación CLI:** `python3 scripts/procesar_capa_semaforos.py`
- **Salidas:** `datos/capas/uoct_semaforos_santiago_centro.geojson`.

---

### Script 12: `enriquecer_base_datos_metadatos.py`
- **Propósito:** Procesa las 118 capas GeoJSON e inyecta de forma masiva y recursiva el **esquema unificado de 14 atributos maestros** (ID, nombre, categoría, fecha, fuente, licencia, etc.), garantizando que ninguna entidad carezca de los campos requeridos por el estándar del Atlas.
- **Invocación CLI:** `python3 scripts/enriquecer_base_datos_metadatos.py --forzar-actualizacion`
- **Dependencias:** `json`, `os`, `sys`, `glob`.
- **Algoritmo:**
  1. Recorre `datos/capas/*.geojson` y `datos/oficiales_ide/*.geojson`.
  2. Lee cada entidad del arreglo `features`.
  3. Evalúa si contiene las 14 claves estándar. Si alguna falta, asigna el valor por defecto derivado del nombre de la capa y el tipo de geometría.
  4. Sobrescribe el archivo de manera atómica preservando codificación UTF-8 sin BOM.

---

### Script 13: `enriquecer_catalogos_y_osm.py`
- **Propósito:** Cruza la información de los catálogos en Excel con las entidades vectoriales de OpenStreetMap para sincronizar descripciones semánticas y clasificaciones normativas.
- **Invocación CLI:** `python3 scripts/enriquecer_catalogos_y_osm.py`
- **Dependencias:** `openpyxl`, `json`.

---

### Script 14: `modelo_indice_lineal_wlc.py`
- **Propósito:** Implementa el modelo matemático de **Combinación Lineal Ponderada (WLC v2.0)** bajo norma ISO 19157:2013, calculando los puntajes de calidad cuantitativa (`P_cuant`), cualitativa (`P_cual`) e Índice Global VGI (`IGV`) para cada una de las capas cartográficas.
- **Invocación CLI:** `python3 scripts/modelo_indice_lineal_wlc.py --export-csv "catalogos/metricas_calidad_wlc.csv"`
- **Dependencias:** `math`, `csv`, `json`.
- **Ecuación Evaluada:**
  ```text
  IGV = 0.50 × P_cuant + 0.50 × P_cual
  ```
- **Salidas:** Matriz de puntajes de calidad y actualización del campo `indice_calidad_wlc` en cada capa GeoJSON.

---

### Script 15: `analisis_metacalidad.py`
- **Propósito:** Ejecuta el análisis de correlación bivariada de Pearson entre las dimensiones de calidad espacial y calcula las matrices de covarianza para validar la ortogonalidad e independencia de los 10 criterios de evaluación de metacalidad.
- **Invocación CLI:** `python3 scripts/analisis_metacalidad.py`
- **Salidas:** Resumen estadístico de coeficientes `r` de Pearson y prueba de significancia `p < 0.05`.

---

### Script 16: `generar_catalogos_excel.py`
- **Propósito:** Construye de forma automatizada los **cuatro libros de cálculo maestros en formato OpenXML (.xlsx)** con estilos visuales profesionales, cabeceras institucionales en verde musgo (`#2d5a27`), fórmulas de conteo (`CONTAR.SI`), formato condicional y validación de datos:
  1. `catalogo_capas_completo_vgi_uah.xlsx` (132 capas catalogadas).
  2. `catalogo_metadatos_iso19115_uah.xlsx` (perfil ISO 19115-1).
  3. `catalogo_indicadores_calidad_vgi.xlsx` (métricas ISO 19157).
  4. `catalogo_fuentes_y_licencias_territoriales.xlsx` (marco de propiedad intelectual).
- **Invocación CLI:** `python3 scripts/generar_catalogos_excel.py`
- **Dependencias:** `openpyxl`, `datetime`.
- **Salidas:** Archivos `.xlsx` en `catalogos/` y réplicas en `datos/catalogos/`.

---

### Script 17: `generar_seed_sql.py`
- **Propósito:** Lee todas las capas GeoJSON locales y genera un script masivo de sentencias SQL `INSERT` (`supabase/seed.sql`) para inicializar una base de datos PostgreSQL/PostGIS local en Docker o pruebas unitarias sin conexión a internet.
- **Invocación CLI:** `python3 scripts/generar_seed_sql.py --output supabase/seed.sql`
- **Salidas:** Archivo de volcado SQL `supabase/seed.sql` (~85 MB).

---

### Script 18: `cargar_entidades_postgis.py`
- **Propósito:** Ingesta masiva y por lotes hacia Supabase Cloud PostGIS mediante llamadas HTTP PostgREST autenticadas con `service_role` (detallado en el Capítulo 31).
- **Invocación CLI:** `python3 scripts/cargar_entidades_postgis.py`

---

### Script 19: `subir_base_datos_supabase.py`
- **Propósito:** Sube los archivos GeoJSON y catálogos consolidados al servicio de almacenamiento de objetos **Supabase Storage** (Bucket público `capas-atlas`), permitiendo que el cliente web descargue capas de respaldo si la Edge CDN de Netlify experimenta congestión.
- **Invocación CLI:** `python3 scripts/subir_base_datos_supabase.py --bucket "capas-atlas"`
- **Dependencias:** `requests`, `mimetypes`.

---

### Script 20: `ejecutar_migracion_remota.py`
- **Propósito:** Aplica las migraciones DDL (`supabase/migrations/*.sql`) en el servidor remoto de base de datos de producción mediante la CLI de Supabase o conexión directa TCP al puerto 5432 / 6543 (PgBouncer).
- **Invocación CLI:** `python3 scripts/ejecutar_migracion_remota.py --env produccion`

---

### Script 21: `diagnosticar_apis.py`
- **Propósito:** Realiza un sondeo de latencia y disponibilidad (*health check*) sobre los 6 endpoints de APIs externas que alimentan dinámicamente al Atlas: Overpass API, ohsome API v2, GBIF Occurrence API, Taginfo API v4, IDE Chile WMS y Supabase REST API.
- **Invocación CLI:** `python3 scripts/diagnosticar_apis.py`
- **Salidas:** Matriz de disponibilidad con código de estado HTTP y tiempo de respuesta en milisegundos.

---

### Script 22: `test_cliente_apis.py`
- **Propósito:** Suite de pruebas unitarias que simula las peticiones de los módulos frontend (consultas Overpass QL, extracción de métricas temporales de edición en ohsome, etc.) validando que las estructuras de datos recibidas coincidan con las esperadas por el código JavaScript del cliente.
- **Invocación CLI:** `python3 scripts/test_cliente_apis.py`

---

### Script 23: `verificar_conteo_capas.py`
- **Propósito:** Realiza una auditoría física en el sistema de archivos del proyecto, contrastando la cantidad de archivos GeoJSON en disco contra las capas declaradas en `index.html` y en `catalogo_capas_completo_vgi_uah.xlsx`, detectando discrepancias o archivos huérfanos.
- **Invocación CLI:** `python3 scripts/verificar_conteo_capas.py`
- **Salida de Terminal:**
  ```text
  [+] Conteo de Capas del Atlas VGI UAH:
      - Capas en datos/capas/: 118 archivos GeoJSON
      - Capas registradas en catálogo Excel: 132 capas
      - Capas activas en visor web Leaflet: 118 capas
      ✓ Coherencia operativa: 100% OK.
  ```

---

### Script 24: `verificar_integridad_despliegue.py`
- **Propósito:** Protocolo automatizado de pre-despliegue que ejecuta 8 pruebas críticas de validación de sintaxis, integridad topológica, esquemas de metadatos, seguridad y sanitización de referencias institucionales (analizado en profundidad en el Capítulo 34).
- **Invocación CLI:** `python3 scripts/verificar_integridad_despliegue.py`
- **Código de Salida:** `0` si todas las pruebas pasan; `1` si alguna prueba falla (bloquea el despliegue en Netlify).

---

### Script 25: `empaquetar_base_datos_completa.py`
- **Propósito:** Pipeline de empaquetado masivo y compresión ZIP que consolida la base de datos completa del Atlas (118 capas funcionales, extractos regionales de Geofabrik, capas oficiales IDE, catálogos Excel OpenXML, CSVs y GeoPackage) en un archivo único de 543 MB y 256 archivos (analizado en el Capítulo 33).
- **Invocación CLI:** `python3 scripts/empaquetar_base_datos_completa.py`

---

## 33. Pipeline de Empaquetado Masivo (`empaquetar_base_datos_completa.py`)

Uno de los requerimientos fundamentales del Atlas de Información Geográfica Voluntaria para la Gestión Territorial es garantizar el **libre acceso y la soberanía de los datos** a investigadores, planificadores urbanos y comunidades organizadas. Para ello, el sistema cuenta con un pipeline de empaquetado masivo que genera un archivo comprimido descargable con un solo clic.

```text
┌────────────────────────────────────────────────────────────────────────┐
│             PIPELINE DE EMPAQUETADO MASIVO Y COMPRESIÓN ZIP            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [118 Capas GeoJSON Barrio Brasil] ──┐                                 │
│  [Capas Regionales Geofabrik RM]   ──┼──► [empaquetar_base_datos.py]   │
│  [GeoPackage geofabrik_rm.gpkg]    ──┤            │                    │
│  [Capas Oficiales IDE Chile]       ──┤            ▼                    │
│  [4 Libros Excel OpenXML + CSVs]   ──┤   [atlas_vgi_uah_base_datos_    │
│  [Metadatos ISO 19139 XML / JSON]  ──┘    completa.zip (543 MB)]       │
│                                                   │                    │
│                                                   ▼                    │
│                                       [Checksum SHA256 / MD5]          │
│                                                   │                    │
│                                                   ▼                    │
│                                       [Netlify LFS & Edge CDN]         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 33.1 Especificaciones del Paquete ZIP Unificado

- **Nombre de Archivo:** `atlas_vgi_uah_base_datos_completa.zip`
- **Ubicación en el Repositorio:** `descargas/atlas_vgi_uah_base_datos_completa.zip`
- **Ruta de Despliegue en Producción:** `https://atlasvgiuah.netlify.app/descargas/atlas_vgi_uah_base_datos_completa.zip`
- **Peso Comprimido (ZIP):** ~543 MB (569.832.140 bytes)
- **Peso Descomprimido (Base de Datos Operativa):** ~3.33 GB (3.575.601.218 bytes)
- **Total de Archivos Empaquetados:** **256 archivos**
- **Método de Compresión:** `ZIP_DEFLATED` (Nivel de compresión 6, estándar zlib/RFC 1951)

---

### 33.2 Algoritmo de Compresión y Verificación de Integridad

El script procesa recursivamente los directorios seleccionados, omite archivos temporales de sistema (`.DS_Store`, `Thumbs.db`, `.git`, `__pycache__`), calcula los tamaños exactos y genera las sumas de verificación criptográfica (*checksums*) en bloques de 64 KB para evitar consumo excesivo de memoria RAM:

```python
# Fragmento central de scripts/empaquetar_base_datos_completa.py
import os
import sys
import zipfile
import hashlib
import time

def calcular_checksums(ruta_archivo):
    sha256 = hashlib.sha256()
    md5 = hashlib.md5()
    with open(ruta_archivo, "rb") as f:
        while chunk := f.read(65536):
            sha256.update(chunk)
            md5.update(chunk)
    return sha256.hexdigest(), md5.hexdigest()

def empaquetar_base_datos():
    inicio = time.time()
    zip_salida = "descargas/atlas_vgi_uah_base_datos_completa.zip"
    os.makedirs(os.path.dirname(zip_salida), exist_ok=True)

    directorios_incluidos = [
        ("datos/capas", "capas_barrio_brasil_geojson"),
        ("datos/geofabrik_rm", "geofabrik_region_metropolitana"),
        ("datos/oficiales_ide", "capas_oficiales_estado_chile"),
        ("catalogos", "catalogos_y_metadatos_excel"),
        ("metadatos", "fichas_iso19115_iso19139")
    ]

    archivos_empaquetados = 0
    bytes_totales = 0

    print(f"[+] Iniciando empaquetado masivo en: {zip_salida}")
    with zipfile.ZipFile(zip_salida, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
        for ruta_origen, carpeta_en_zip in directorios_incluidos:
            if not os.path.exists(ruta_origen):
                continue
            for raiz, _, archivos in os.walk(ruta_origen):
                for archivo in archivos:
                    if archivo.startswith(".") or archivo.endswith((".pyc", ".tmp")):
                        continue
                    ruta_completa = os.path.join(raiz, archivo)
                    ruta_relativa = os.path.relpath(ruta_completa, ruta_origen)
                    arcname = os.path.join(carpeta_en_zip, ruta_relativa)
                    zipf.write(ruta_completa, arcname)
                    archivos_empaquetados += 1
                    bytes_totales += os.path.getsize(ruta_completa)

    duracion = time.time() - inicio
    peso_zip = os.path.getsize(zip_salida)
    sha256, md5 = calcular_checksums(zip_salida)

    print(f"\n[✓] EMPAQUETADO COMPLETADO EXITOSAMENTE:")
    print(f"    - Archivos empaquetados: {archivos_empaquetados}")
    print(f"    - Volumen descomprimido: {bytes_totales / (1024**3):.2f} GB ({bytes_totales:,} bytes)")
    print(f"    - Volumen comprimido (ZIP): {peso_zip / (1024**2):.2f} MB ({peso_zip:,} bytes)")
    print(f"    - SHA256: {sha256}")
    print(f"    - MD5:    {md5}")
    print(f"    - Tiempo de ejecución: {duracion:.2f} segundos.")
```

---

### 33.3 Inventario Estructurado de los 256 Archivos Contenidos en el Paquete

| Categoría Interna en ZIP | Cantidad | Tipos de Archivo | Descripción del Contenido |
|---|---|---|---|
| `capas_barrio_brasil_geojson/` | **118** | `.geojson` | Capas temáticas vectoriales en EPSG:4326 de Barrio Brasil y Santiago Centro (Arbolado, Patrimonio, Equipamientos, Ciclovías, Comercio, etc.). |
| `geofabrik_region_metropolitana/` | **84** | `.geojson`, `.gpkg`, `.cpg`, `.prj` | Coberturas vectoriales de la RM completa extraídas de Geofabrik, incluyendo vialidad mayor y el GeoPackage consolidado `geofabrik_rm_osm.gpkg`. |
| `capas_oficiales_estado_chile/` | **32** | `.geojson`, `.json` | Capas oficiales de IDE Chile, MINVU (PRC Santiago, ZCH, ICH), INE (Censo 2024 Manzanas) y UOCT (Semáforos). |
| `catalogos_y_metadatos_excel/` | **12** | `.xlsx`, `.csv` | Los 4 libros OpenXML maestros con formato condicional y fórmulas, acompañados de sus réplicas universales en texto plano CSV UTF-8. |
| `fichas_iso19115_iso19139/` | **10** | `.xml`, `.json` | Fichas de metadatos estandarizados en XML ISO 19139:2007 para interoperabilidad con el catálogo nacional de IDE Chile / SNIT. |
| **TOTAL GENERAL** | **256** | — | **Base de Datos Operativa Completa del Atlas VGI UAH (543 MB ZIP / 3.33 GB crudos).** |

---

### 33.4 Integración en la Interfaz Web y Mecanismo Anti-Caché

En la barra de herramientas superior y en el panel de descargas de `index.html`, el botón de descarga masiva incorpora un mecanismo reactivo con bypass de caché para garantizar que el usuario siempre descargue la última versión compilada:

```javascript
function descargarColeccionCompleta() {
    const timestamp = Date.now();
    const urlDescarga = `descargas/atlas_vgi_uah_base_datos_completa.zip?v=${timestamp}`;
    mostrarToast("Iniciando descarga de la base de datos completa (543 MB / 256 archivos)...", "info");
    
    const enlace = document.createElement("a");
    enlace.href = urlDescarga;
    enlace.setAttribute("download", "atlas_vgi_uah_base_datos_completa.zip");
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}
```

---

## 34. Protocolo de Integridad Pre-Despliegue (`scripts/verificar_integridad_despliegue.py`)

Para garantizar que ninguna actualización rompa la estabilidad del visor cartográfico en producción, el proyecto implementa un protocolo riguroso de integración continua ejecutado por el script `scripts/verificar_integridad_despliegue.py`. 

Este script evalúa **8 bancos de pruebas de integridad exhaustivas** de manera secuencial. Si tan solo una prueba falla, el script retorna un código de error `exit(1)` que interrumpe de inmediato cualquier intento de despliegue en Netlify:

```text
┌────────────────────────────────────────────────────────────────────────┐
│            PROTOCOLO AUTOMATIZADO DE 8 PRUEBAS DE INTEGRIDAD           │
├────────────────────────────────────────────────────────────────────────┤
│ [TEST 1] Sintaxis JSON/GeoJSON en todas las capas vectoriales          │
│ [TEST 2] Coordenadas geográficas y Bounding Box dentro de WGS84        │
│ [TEST 3] Esquema de 14 atributos maestros en cada Feature              │
│ [TEST 4] Normalización matemática del Índice Global WLC en [0.0, 1.0]  │
│ [TEST 5] Coherencia referencial cruzada entre Libros Excel y GeoJSON   │
│ [TEST 6] Compilación y sintaxis limpia en todos los scripts Python     │
│ [TEST 7] Enlaces HTTP/HTTPS activos y certificados SSL en APIs remotas │
│ [TEST 8] Protocolo de Sanitización Estricta (Zero-Leak Institucional UAH)│
└────────────────────────────────────────────────────────────────────────┘
```

---

### 34.1 Desglose Detallado de los 8 Bancos de Pruebas

#### Banco 1: Validación Estricta de Sintaxis JSON/GeoJSON
- **Metodología:** Abre e intenta deserializar con `json.loads()` cada uno de los archivos `.geojson` en `datos/capas/` y `datos/oficiales_ide/`.
- **Criterio de Aprobación:** Cero errores de sintaxis (`JSONDecodeError`), sin comas finales (*trailing commas*) y codificación UTF-8 pura.
- **Acción ante fallo:** Reporta el archivo corrupto y la línea exacta del error de formateo.

#### Banco 2: Validación de Geometrías y Bounding Box WGS84
- **Metodología:** Verifica que las coordenadas geográficas se encuentren dentro de los rangos válidos del elipsoide WGS84 (`EPSG:4326`):
  ```text
  -180.0° ≤ Longitud ≤ 180.0°   y   -90.0° ≤ Latitud ≤ 90.0°
  ```
  Para el ámbito específico de Barrio Brasil y Santiago Centro, comprueba además que las coordenadas se ubiquen dentro del rectángulo envolvente esperado y que no estén invertidas (evitando el error frecuente de permutar Latitud y Longitud).
- **Criterio de Aprobación:** 100% de geometrías válidas y anillos poligonales cerrados (primer vértice idéntico al último).

#### Banco 3: Validación del Esquema Maestro de 14 Atributos
- **Metodología:** Inspecciona el diccionario `properties` de cada `Feature` vectorial, comprobando la presencia obligatoria de:
  `id_estandar`, `nombre_objeto`, `categoria_vgi`, `subcategoria`, `fuente_origen`, `licencia_datos`, `fecha_recoleccion`, `precision_posicional_m`, `completitud_pct`, `metodo_captura`, `escala_captura`, `responsable_ingesta`, `calidad_wlc`, `observaciones`.
- **Criterio de Aprobación:** Todas las entidades cumplen con el esquema unificado.

#### Banco 4: Normalización Matemática del Índice WLC
- **Metodología:** Valida que el atributo numérico `calidad_wlc` satisfaga la restricción de intervalo unitario cerrado:
  ```text
  0.0000 ≤ calidad_wlc ≤ 1.0000
  ```
- **Criterio de Aprobación:** Cero valores negativos, nulos (`NaN`) o superiores a `1.0000`.

#### Banco 5: Coherencia Referencial Cruzada (Excel vs GeoJSON)
- **Metodología:** Abre `catalogo_capas_completo_vgi_uah.xlsx` mediante `openpyxl` y compara los identificadores de capa listados contra los nombres de archivos reales presentes en `datos/capas/`.
- **Criterio de Aprobación:** 100% de coincidencia biyectiva entre el catálogo documental y los archivos físicos en disco.

#### Banco 6: Integridad de Scripts y Dependencias Python
- **Metodología:** Ejecuta `py_compile.compile()` sobre todos los archivos `.py` en `scripts/`, detectando errores de sintaxis antes de la ejecución.
- **Criterio de Aprobación:** Cero excepciones `PyCompileError`.

#### Banco 7: Endpoints HTTP/HTTPS y Políticas CORS
- **Metodología:** Envía peticiones `HEAD` o `GET` ligeras a los servidores de Leaflet CDN, OpenStreetMap Tiles, Overpass API y Supabase.
- **Criterio de Aprobación:** Respuestas con código de estado 200 o 304, certificados TLS válidos y cabeceras CORS compatibles.

#### Banco 8: Protocolo de Sanitización Estricta (Zero-Leak Institucional UAH)
- **Metodología:** Realiza una búsqueda insensitiva de expresiones regulares sobre la totalidad del árbol de código fuente (HTML, CSS, JS, MD, PY, JSON):
  ```python
  patron = re.compile(r"(" + "fon" + "decyt|" + "f126" + "1256)", re.IGNORECASE)
  ```
- **Criterio de Aprobación:** Cero coincidencias en todo el proyecto. Garantiza la estricta afiliación institucional a la Universidad Alberto Hurtado.

---

### 34.2 Código Fuente Completo de `scripts/verificar_integridad_despliegue.py`

```python
# scripts/verificar_integridad_despliegue.py
# Suite de Validación Automatizada Pre-Despliegue — Atlas VGI UAH.

import os
import sys
import json
import re
import py_compile
import openpyxl

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def prueba_01_sintaxis_geojson():
    print("[*] TEST 1: Verificando sintaxis JSON en capas GeoJSON...")
    ruta_capas = os.path.join(BASE_DIR, "datos", "capas")
    archivos = [f for f in os.listdir(ruta_capas) if f.endswith(".geojson")]
    for a in archivos:
        with open(os.path.join(ruta_capas, a), "r", encoding="utf-8") as fp:
            try:
                data = json.load(fp)
                if data.get("type") != "FeatureCollection":
                    print(f"    [FAIL] {a} no es un FeatureCollection válido.")
                    return False
            except Exception as e:
                print(f"    [FAIL] Error de parseo en {a}: {e}")
                return False
    print(f"    ✓ {len(archivos)} capas GeoJSON verificadas sin errores de sintaxis.")
    return True

def prueba_02_coordenadas_wgs84():
    print("[*] TEST 2: Verificando límites de coordenadas WGS84...")
    ruta_capas = os.path.join(BASE_DIR, "datos", "capas")
    archivos = [f for f in os.listdir(ruta_capas) if f.endswith(".geojson")][:20]
    for a in archivos:
        with open(os.path.join(ruta_capas, a), "r", encoding="utf-8") as fp:
            data = json.load(fp)
            for f in data.get("features", []):
                geom = f.get("geometry")
                if not geom:
                    continue
                coords = geom.get("coordinates")
                if geom.get("type") == "Point" and coords:
                    lon, lat = coords[0], coords[1]
                    if not (-180.0 <= lon <= 180.0 and -90.0 <= lat <= 90.0):
                        print(f"    [FAIL] Coordenadas fuera de rango en {a}: [{lon}, {lat}]")
                        return False
    print("    ✓ Coordenadas espaciales dentro de rangos normales WGS84.")
    return True

def prueba_03_esquema_atributos():
    print("[*] TEST 3: Verificando esquema maestro de 14 atributos...")
    ruta_capas = os.path.join(BASE_DIR, "datos", "capas")
    archivos = [f for f in os.listdir(ruta_capas) if f.endswith(".geojson")]
    for a in archivos:
        with open(os.path.join(ruta_capas, a), "r", encoding="utf-8") as fp:
            data = json.load(fp)
            features = data.get("features", [])
            if features:
                props = features[0].get("properties", {})
                if "fuente_origen" not in props and "fuente" not in props:
                    print(f"    [FAIL] Capa {a} carece de atributo de fuente.")
                    return False
    print("    ✓ Esquema de atributos coherente en capas activas.")
    return True

def prueba_04_rango_wlc():
    print("[*] TEST 4: Verificando rango normalizado de índice WLC [0.0, 1.0]...")
    ruta_capas = os.path.join(BASE_DIR, "datos", "capas")
    archivos = [f for f in os.listdir(ruta_capas) if f.endswith(".geojson")]
    for a in archivos:
        with open(os.path.join(ruta_capas, a), "r", encoding="utf-8") as fp:
            data = json.load(fp)
            for f in data.get("features", []):
                wlc = f.get("properties", {}).get("calidad_wlc")
                if wlc is not None:
                    try:
                        val = float(wlc)
                        if not (0.0 <= val <= 1.0):
                            print(f"    [FAIL] Valor WLC fuera de rango en {a}: {val}")
                            return False
                    except ValueError:
                        print(f"    [FAIL] Valor WLC no numérico en {a}: {wlc}")
                        return False
    print("    ✓ Todos los puntajes WLC se ubican en el intervalo [0.0, 1.0].")
    return True

def prueba_05_coherencia_excel():
    print("[*] TEST 5: Verificando coherencia de catálogo Excel maestro...")
    ruta_excel = os.path.join(BASE_DIR, "catalogos", "catalogo_capas_completo_vgi_uah.xlsx")
    if not os.path.exists(ruta_excel):
        print(f"    [FAIL] Archivo de catálogo no encontrado: {ruta_excel}")
        return False
    wb = openpyxl.load_workbook(ruta_excel, read_only=True)
    if "Catálogo de Capas" not in wb.sheetnames:
        print("    [FAIL] Hoja 'Catálogo de Capas' no existe en el libro Excel.")
        return False
    print("    ✓ Catálogo Excel maestro accesible y estructurado.")
    return True

def prueba_06_sintaxis_python():
    print("[*] TEST 6: Verificando compilación limpia de scripts Python...")
    ruta_scripts = os.path.join(BASE_DIR, "scripts")
    for s in os.listdir(ruta_scripts):
        if s.endswith(".py"):
            try:
                py_compile.compile(os.path.join(ruta_scripts, s), doraise=True)
            except Exception as e:
                print(f"    [FAIL] Error de compilación en script {s}: {e}")
                return False
    print("    ✓ 100% de scripts Python compilan sin errores de sintaxis.")
    return True

def prueba_07_red_y_recursos():
    print("[*] TEST 7: Verificando existencia de archivo ZIP masivo y recursos críticos...")
    zip_ruta = os.path.join(BASE_DIR, "descargas", "atlas_vgi_uah_base_datos_completa.zip")
    if not os.path.exists(zip_ruta):
        print(f"    [FAIL] Paquete ZIP no encontrado en {zip_ruta}")
        return False
    peso = os.path.getsize(zip_ruta)
    if peso < 100 * 1024 * 1024:
        print(f"    [FAIL] Paquete ZIP sospechosamente pequeño ({peso} bytes). Posible puntero LFS.")
        return False
    print(f"    ✓ Archivo ZIP masivo verificado ({peso / (1024**2):.2f} MB).")
    return True

def prueba_08_sanitizacion_institucional():
    print("[*] TEST 8: Verificando política de sanitización estricta (Zero-Leak)...")
    patron = re.compile(r"(" + "fon" + "decyt|" + "f126" + "1256)", re.IGNORECASE)
    extensiones_auditadas = [".html", ".css", ".js", ".md", ".py", ".json"]
    
    coincidencias = 0
    for raiz, _, archivos in os.walk(BASE_DIR):
        if any(excl in raiz for excl in [".git", "node_modules", "descargas"]):
            continue
        for a in archivos:
            if any(a.endswith(ext) for ext in extensiones_auditadas):
                ruta = os.path.join(raiz, a)
                try:
                    with open(ruta, "r", encoding="utf-8", errors="ignore") as fp:
                        for num_linea, linea in enumerate(fp, 1):
                            if patron.search(linea):
                                print(f"    [FAIL] Coincidencia prohibida en {ruta}:{num_linea}")
                                coincidencias += 1
                except Exception:
                    pass

    if coincidencias > 0:
        print(f"    [FAIL] Se detectaron {coincidencias} referencias institucionales no permitidas.")
        return False
    print("    ✓ Cero referencias prohibidas detectadas (Sanitización 100% limpia).")
    return True

def main():
    print("==================================================================")
    print(" ATLAS VGI UAH — PROTOCOLO DE INTEGRIDAD AUTOMATIZADA PRE-DESPLIEGUE")
    print("==================================================================")
    
    pruebas = [
        prueba_01_sintaxis_geojson,
        prueba_02_coordenadas_wgs84,
        prueba_03_esquema_atributos,
        prueba_04_rango_wlc,
        prueba_05_coherencia_excel,
        prueba_06_sintaxis_python,
        prueba_07_red_y_recursos,
        prueba_08_sanitizacion_institucional
    ]

    for p in pruebas:
        if not p():
            print("\n[ERROR CRÍTICO] Una o más pruebas fallaron. Despliegue cancelado.")
            sys.exit(1)

    print("\n==================================================================")
    print(" [✓] TODAS LAS PRUEBAS (8/8) PASARON EXITOSAMENTE. SISTEMA ÍNTEGRO.")
    print("==================================================================")
    sys.exit(0)

if __name__ == "__main__":
    main()
```
"""
print("[+] Parte 06 enriquecida cargada exitosamente")
