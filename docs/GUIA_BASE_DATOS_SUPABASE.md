# Guía de Integración y Uso: Base de Datos Espacial Gratuita, Permanente y Open Source (Supabase PostGIS)

Esta guía detalla el procedimiento para activar, poblar y conectar la base de datos geoespacial del **Atlas VGI Barrio Brasil / UAH** utilizando **Supabase (PostgreSQL 17+ con extensión espacial PostGIS 3.3)**.

---

## 1. ¿Por qué Supabase (PostgreSQL + PostGIS)?

1. **100% Código Abierto (Open Source):**
   - Motor relacional **PostgreSQL 17.6** estándar de la industria.
   - Extensión espacial **PostGIS 3.3** (el estándar internacional para SIG, análisis territorial e índices espaciales R-Tree / GIST).
2. **Totalmente Gratuito y Permanente:**
   - Plan *Free Tier* de por vida sin necesidad de tarjeta de crédito ni periodos de prueba limitados (a diferencia de pruebas de 14 o 30 días de otros proveedores).
   - Incluye **500 MB de base de datos relacional** y **1 GB de almacenamiento de objetos (Storage CDN)**.
3. **Resuelve el Desafío de Tamaño en Netlify:**
   - Permite alojar los más de **630 MB de capas GeoJSON** en Supabase Storage CDN y PostGIS, liberando a Netlify de empaquetar archivos pesados en sus funciones serverless.
4. **Arquitectura con Fallback Transparente:**
   - Si no se configuran credenciales o falla la conexión a internet, el Atlas **sigue funcionando al 100% de forma autónoma** consumiendo los archivos locales en `data/`.

---

## 2. Paso a Paso: Creación del Proyecto en Supabase (2 minutos)

1. Ingresa a **[https://supabase.com](https://supabase.com)** y haz clic en **"Start your project"**.
2. Inicia sesión con tu cuenta de **GitHub** (gratuito y directo).
3. Haz clic en **"New Project"**:
   - **Name:** `atlas-vgi-uah`
   - **Database Password:** Elige una contraseña segura y guárdala.
   - **Region:** Selecciona `South America (São Paulo)` o `East US (North Virginia)` para menor latencia desde Chile.
   - **Pricing Plan:** Selecciona **Free Plan** ($0/mes).
4. Haz clic en **"Create new project"**. Espera ~60 segundos mientras se aprovisiona tu base de datos PostgreSQL.

---

## 3. Despliegue del Esquema Espacial PostGIS

1. En el panel izquierdo de tu proyecto Supabase, dirígete a **SQL Editor**.
2. Haz clic en **"New query"**.
3. Abre y copia el contenido del archivo:
   [`scripts/db/01_schema_postgis.sql`](../scripts/db/01_schema_postgis.sql)
4. Pégalo en el editor y presiona **"Run"** (Ctrl+Enter o botón verde).
   - Esto habilitará la extensión **PostGIS**.
   - Creará las tablas `public.capas_metadata` y `public.capas_entidades`.
   - Creará los índices espaciales `GIST` y la función RPC `fn_obtener_capa_bbox`.
   - Configurará las políticas de seguridad Row Level Security (RLS) para lectura pública anónima.

5. En una nueva pestaña del SQL Editor, copia y ejecuta el archivo:
   [`scripts/db/02_seed_metadata.sql`](../scripts/db/02_seed_metadata.sql)
   - Esto insertará los metadatos completos y normalizados de las **111 capas oficiales del Estado** con citas APA, instituciones, categorías y conteos oficiales.

---

## 4. Creación del Storage Bucket para los Archivos GeoJSON

1. En el menú lateral de Supabase, ve a **Storage**.
2. Haz clic en **"New Bucket"**:
   - **Bucket name:** `atlas-geojson`
   - **Public bucket:** **ACTIVADO (On)** *(Crucial para que el mapa Leaflet descargue las capas vía CDN)*.
3. Haz clic en **"Save"**.

---

## 5. Carga de Datos Espaciales e Ingesta Masiva

Dispones de dos pipelines automatizados en Python para la ingesta de datos:

### 5.1 Subida al Bucket de Almacenamiento CDN (`scripts/subir_base_datos_supabase.py`)
Sube todos los archivos GeoJSON al bucket público para descarga directa:
```bash
export SUPABASE_URL="https://[TU-PROYECTO].supabase.co"
export SUPABASE_KEY="TU_SERVICE_ROLE_KEY"

python3 scripts/subir_base_datos_supabase.py --upload-storage
```
*Sube los 180 archivos GeoJSON con verificación criptográfica de integridad SHA256.*

### 5.2 Vectorización e Inserción Masiva en PostGIS (`scripts/cargar_entidades_postgis.py`)
Inserta directamente las entidades vectoriales en la tabla `public.capas_entidades` de PostgreSQL mediante conexión directa SSL:
```bash
python3 scripts/cargar_entidades_postgis.py
```
*Carga **129.262 entidades espaciales** con geometrías 2D validadas (`ST_Force2D`) e índices R-Tree `GIST`, permitiendo consultas espaciales por Bbox en milisegundos.*

---

## 6. Conexión del Atlas VGI con la Base de Datos

Tienes dos formas de conectar el Atlas con Supabase:

### Opción A: Directamente desde la Interfaz Web (Recomendado)
1. Abre el Atlas VGI en tu navegador.
2. En el panel lateral derecho (*"Manifold & Telemetría"*), haz clic en la pestaña **"⚡ BD PostGIS"**.
3. Pega tu **Supabase URL** y tu **Supabase Anon Key** (llave pública anónima `anon` de lectura).
4. Haz clic en **"Conectar BD"**.
5. Verás cómo el indicador cambia a: **`🟢 PostGIS Activo`**. Las credenciales se conservarán en tu navegador para futuras sesiones.

### Opción B: Mediante `src/js/config.js`
Edita `src/js/config.js` y asigna tus credenciales en el bloque `base_datos`:
```javascript
base_datos: {
  proveedor: 'supabase',
  url: 'https://TU_PROYECTO.supabase.co',
  anon_key: 'TU_ANON_PUBLIC_KEY',
  storage_bucket: 'atlas-geojson',
  modo: 'auto'
}
```

---

## 7. Mantenimiento Anti-Pausa Permanente (Keep-Alive)

Los proyectos del plan gratuito de Supabase se pausan automáticamente si no reciben peticiones durante 7 días consecutivos.

Para que tu base de datos **dure en el tiempo de forma permanente y nunca se suspenda**:
1. Ya hemos configurado la acción automatizada en [`.github/workflows/supabase_keepalive.yml`](../.github/workflows/supabase_keepalive.yml).
2. En tu repositorio de GitHub (`https://github.com/GEOJOTA/atlas_vgi_uah`), ve a **Settings** -> **Secrets and variables** -> **Actions**.
3. Añade dos secretos del repositorio:
   - `SUPABASE_URL`: La URL de tu proyecto Supabase (`https://[TU-PROYECTO].supabase.co`).
   - `SUPABASE_ANON_KEY`: La clave anónima pública de tu proyecto.
4. El workflow de GitHub se ejecutará automáticamente **cada 3 días**, realizando una consulta ligera de telemetría que mantendrá la base de datos despierta de por vida a costo \$0.

---

*Atlas VGI Barrio Brasil — Escuela de Geografía, Universidad Alberto Hurtado (2026).*
