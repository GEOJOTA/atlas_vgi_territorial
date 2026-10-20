# Atlas de Información Geográfica Voluntaria para la Gestión Territorial (Atlas VGI · UAH)

[![Estado del Proyecto](https://img.shields.io/badge/Estado-Producci%C3%B3n_2026-10b981?style=for-the-badge)](https://github.com/santiagogeografia454-sketch/Visualizador-barrio-brasil)
[![Capas Integradas](https://img.shields.io/badge/Capas_Integradas-131_(121_Oficiales_%2B_10_VGI)-38bdf8?style=for-the-badge)](#estructura-de-datos-y-módulos-01-al-10)
[![Diccionario de Datos](https://img.shields.io/badge/Diccionario-140_Descriptores_T%C3%A9cnicos-f59e0b?style=for-the-badge)](#documentación-técnica-y-manuales)
[![Investigación Territorial](https://img.shields.io/badge/Geografía UAH_Regular-N%C2%B0_1261256_(Geograf%C3%ADa_UAH)-a855f7?style=for-the-badge)](#créditos-institucionales)

Plataforma web abierta desarrollada en el marco del **Proyecto Investigación Cartográfica UAH** del **Departamento de Geografía de la Universidad Alberto Hurtado (Chile)**.

El sistema articula la cartografía oficial del Estado de Chile con Información Geográfica Voluntaria (*Volunteered Geographic Information*, VGI; Goodchild, 2007; Haklay, 2010) para el diagnóstico espacial, la evaluación normativa y la gestión territorial del **Barrio Brasil**, el entorno del Campus Universidad Alberto Hurtado, la **Comuna de Santiago** y la **Región Metropolitana**.

---

## 🧭 Índice de Contenidos

1. [Documentación Técnica y Manuales](#documentación-técnica-y-manuales)
2. [Estructura de Datos y Módulos (01 al 10)](#estructura-de-datos-y-módulos-01-al-10)
   - [Módulos Funcionales de la Plataforma](#módulos-funcionales-de-la-plataforma)
3. [Despliegue Local y Auditoría Pre-Despliegue](#despliegue-local-y-auditoría-pre-despliegue)
4. [Créditos Institucionales](#créditos-institucionales)

---

## Documentación Técnica y Manuales

1. 🛠️ **[Manual de Actualización, Arquitectura, Integridad y Contribución Técnica (`MANUAL_ACTUALIZACION_ATLAS.md`)](MANUAL_ACTUALIZACION_ATLAS.md)**:  
   **Documento maestro universal de operaciones y mantención.** Detalla la arquitectura de software, la sincronización simétrica entre carpetas (`src/data/` y `data/`), el almacenamiento en `EPSG:4326`, el módulo de reproyección métrica (`EPSG:32719` en `src/js/modulos/geodesia.js`) y los **15 procedimientos estandarizados** para modificar cualquier detalle del Atlas (incorporación de capas oficiales/VGI, storyboards, Inspector Normativo, metadatos, diccionario, estilos visuales y despliegue a producción). Accesible idénticamente desde [`CONTRIBUTING.md`](CONTRIBUTING.md), [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) y [`PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md`](PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md).
2. 📘 **[Manual de Uso (`MANUAL_USO.md`)](MANUAL_USO.md)**:  
   Guía de operación de los 10 módulos funcionales (`01` al `10`), filtros espaciales, evaluación normativa (PRC/OGUC y expediente histórico 1990–2024), Índice de Calidad VGI (ICV) dinámico, 5 dimensiones analíticas y 9 storyboards territoriales con modal HD interactivo.
3. 📚 **[Trazabilidad Académica (`docs/TRAZABILIDAD_ACADEMICA.md`)](docs/TRAZABILIDAD_ACADEMICA.md)** y **[Bibliografía Consolidada APA 7ª Ed. (`docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md`)](docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md)**:  
   Sustento epistemológico, justificación metodológica de la reproyección cartográfica oficial (**ISO 19111 / EPSG:32719**), modelo de auditoría de MetaCalidad (**ISO 19115 / ISO 19157**) y aparato crítico de 125 referencias bibliográficas.

---

## Estructura de Datos y Módulos (01 al 10)

El Atlas integra **131 coberturas geográficas operativas** en coordenadas `EPSG:4326` (WGS84 / SIRGAS-Chile) y **140 descriptores documentados** en su Diccionario de Datos (ISO 19110:2016):
- **121 Capas Oficiales del Estado de Chile**: IDE Chile, MINVU (PRC, PRMS, ZCH/ICH, Cités), INE (Censo 2024), MTT/DTPM/UOCT, MDSF (RSH / BiDat), SUBDERE (13 capas del Catastro Nacional de Residuos Sólidos Domiciliarios 2024 junto con sus geodatabases `.gpkg` originales), MMA, SERNAGEOMIN, CMN, MINSAL y SII.
- **10 Categorías Colaborativas VGI**: Levantamientos comunitarios en OpenStreetMap (OSM) y registros de biodiversidad en GBIF / iNaturalist.

### Módulos Funcionales de la Plataforma
- **`01` · Visor y Atlas VGI**: Lienzo cartográfico 2D/3D con las 131 coberturas, cálculo en tiempo real del **Índice de Calidad VGI (ICV)**, importación local de archivos espaciales e **Inspector Normativo (Certificado CIN-VGI)** con acceso directo al expediente histórico de modificaciones al PRC de Santiago (1990–2024).
- **`02` · Consultas Overpass**: Extracción en tiempo real desde OpenStreetMap mediante plantillas temáticas y lenguaje Overpass QL.
- **`03` · Biodiversidad GBIF**: Ocurrencias biológicas de flora, fauna y funga urbana validadas en GBIF e iNaturalist bajo estándar Darwin Core.
- **`04` · Cartografía UMAP**: Integración de lienzos colaborativos uMap orientados a talleres participativos y validación comunitaria en terreno.
- **`05` · Indicadores y Storyboards**: Clasificación de las 131 capas en **5 Dimensiones Analíticas** (*Sociodemográfica*, *Socioeconómica*, *Socioambiental*, *Sociosanitaria* y *Sociourbana*) y **9 Storyboards territoriales** con indicadores cuantitativos y visor modal (*pop-up*) HD interactivo para la ampliación de imágenes y gráficos.
- **`06` · Calidad e ICV**: Evaluación cuantitativa multicriterio bajo norma ISO 19157, series históricas con la API ohsome (HeiGIT) y auditoría de conjuntos de cambios con OSMCha.
- **`07` · Manual de uso y Actualización**: Centro documental interactivo embebido en la aplicación web (Manual de Uso, Manual de Actualización Técnica y Catálogo general).
- **`08` · Metadatos ISO 19115**: Generación y exportación de fichas formales de metadatos espaciales en esquemas XML (ISO 19139) y JSON.
- **`09` · Diccionario (131 capas)**: Especificación técnica de los 140 descriptores de atributos (ISO 19110:2016), incluyendo los diccionarios nativos de columnas de las bases GeoPackage de SUBDERE RSD 2024.
- **`10` · Licencias y Catálogos**: Marco jurídico abierto (ODbL 1.0, CC BY-SA 4.0, GNU AGPLv3, Leyes Nº 20.285 y 19.628) y descarga directa de catálogos y matrices en formato Excel (`.xlsx`).

---

## Despliegue Local y Auditoría Pre-Despliegue

1. **Inicialización del servidor local:**
   ```bash
   cd src
   python -m http.server 8080
   ```
   El sistema se sirve localmente en `http://localhost:8080`.

2. **Ejecución de scripts de comprobación pre-despliegue (desde la raíz):**
   ```bash
   python scripts/verificar_conteo_capas.py
   python scripts/verificar_integridad_despliegue.py
   python scripts/analisis_metacalidad.py
   ```

---

## Créditos Institucionales

- **Proyecto:** Investigación Cartográfica UAH (*"Calidad y gobernanza de la Información Geográfica Voluntaria para la gestión urbana integrada"*).
- **Institución:** Departamento de Geografía · Facultad de Ciencias Sociales · Universidad Alberto Hurtado (Santiago de Chile).
