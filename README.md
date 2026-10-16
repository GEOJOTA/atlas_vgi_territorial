# Atlas de Información Geográfica Voluntaria para la Gestión Territorial (Atlas VGI · UAH)

[![Estado del Proyecto](https://img.shields.io/badge/Estado-Producci%C3%B3n_2026-10b981?style=for-the-badge)](https://github.com/santiagogeografia454-sketch/Visualizador-barrio-brasil)
[![Capas Integradas](https://img.shields.io/badge/Capas_Integradas-131_(121_Oficiales_%2B_10_VGI)-38bdf8?style=for-the-badge)](#estructura-de-datos-y-módulos-00-al-09)
[![Diccionario de Datos](https://img.shields.io/badge/Diccionario-140_Descriptores_T%C3%A9cnicos-f59e0b?style=for-the-badge)](#documentación-técnica-y-manuales)
[![Fondecyt Regular](https://img.shields.io/badge/Fondecyt_Regular-N%C2%B0_1261256_(Geograf%C3%ADa_UAH)-a855f7?style=for-the-badge)](#créditos-institucionales)

Plataforma web abierta desarrollada en el marco del **Proyecto Fondecyt Regular N° 1261256** del **Departamento de Geografía de la Universidad Alberto Hurtado (Chile)**.

El sistema articula cartografía oficial del Estado de Chile con Información Geográfica Voluntaria (*Volunteered Geographic Information*, VGI; Goodchild, 2007; Haklay, 2010) para el diagnóstico espacial, la evaluación normativa y la gestión territorial del **Barrio Brasil**, el entorno del Campus Universidad Alberto Hurtado, la **Comuna de Santiago** y la **Región Metropolitana**.

---

## 🧭 Índice de Contenidos

1. [Documentación Técnica y Manuales](#documentación-técnica-y-manuales)
2. [Estructura de Datos y Módulos (00 al 09)](#estructura-de-datos-y-módulos-00-al-09)
   - [Módulos Funcionales de la Plataforma](#módulos-funcionales-de-la-plataforma)
3. [Despliegue Local y Auditoría Pre-Despliegue](#despliegue-local-y-auditoría-pre-despliegue)
4. [Créditos Institucionales](#créditos-institucionales)

---

## Documentación Técnica y Manuales

1. 📘 **[Manual de Uso (`MANUAL_USO.md`)](MANUAL_USO.md)**:  
   Sistematización operativa de los 10 módulos (`00` al `09`), filtros espaciales, evaluación normativa (PRC/OGUC e historial de modificaciones en Barrio Brasil 1990–2024), Índice de Calidad VGI (ICV) dinámico, 5 dimensiones analíticas y 7 Storyboards territoriales.
2. 🛠️ **[Manual de Actualización, Arquitectura, Integridad y Contribución Técnica (`MANUAL_ACTUALIZACION_ATLAS.md`)](MANUAL_ACTUALIZACION_ATLAS.md)**:  
   Documento maestro exhaustivo y unificado que integra la arquitectura técnica del sistema, el protocolo de integridad y despliegue, las vías de contribución comunitaria y el protocolo secuencial para administrar la base de datos dual (`.geojson` + `.gpkg`), incorporar nuevas coberturas en 6 etapas, actualizar indicadores/storyboards y publicar en producción. Accesible idénticamente desde [`CONTRIBUTING.md`](CONTRIBUTING.md), [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) y [`PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md`](PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md).
3. 📚 **[Trazabilidad Académica (`docs/TRAZABILIDAD_ACADEMICA.md`)](docs/TRAZABILIDAD_ACADEMICA.md)** y **[Bibliografía Consolidada APA 7ª Ed. (`docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md`)](docs/BIBLIOGRAFIA_SEMINARIO_Y_ATLAS.md)**:  
   Sustento epistemológico, formulación geodésica (`EPSG:32719`), auditoría de MetaCalidad (**ISO 19115 / ISO 19157**) y aparato crítico de 125 referencias.

---

## Estructura de Datos y Módulos (00 al 09)

El Atlas integra **131 coberturas geográficas operativas** en coordenadas `EPSG:4326` (WGS84 / SIRGAS-Chile) y **140 descriptores documentados** en su Diccionario de Datos (ISO 19110:2016):
- **121 Capas Oficiales del Estado de Chile**: IDE Chile, MINVU (PRC, PRMS, ZCH/ICH, Cités), INE (Censo 2024), MTT/DTPM/UOCT, MDSF (RSH / BiDat), SUBDERE (13 capas del Catastro Nacional de Residuos Sólidos Domiciliarios 2024 junto con sus geodatabases `.gpkg` originales), MMA, SERNAGEOMIN, CMN, MINSAL y SII.
- **10 Categorías Colaborativas VGI**: Levantamientos comunitarios en OpenStreetMap (OSM) y registros de biodiversidad en GBIF / iNaturalist.

### Módulos Funcionales de la Plataforma
- **`00` · Visor para la gestión territorial**: Lienzo cartográfico 2D/3D, buscador de las 131 coberturas, cálculo en tiempo real del **Índice de Calidad VGI (ICV)** e **Inspector Normativo (Certificado CIN-VGI)** con acceso directo al expediente histórico de modificaciones al PRC de Santiago (1990–2024).
- **`01` · Consultas Overpass**: Extracción en tiempo real desde OpenStreetMap mediante plantillas temáticas y lenguaje Overpass QL.
- **`02` · Calidad & ICV**: Evaluación multicriterio bajo norma ISO 19157, series históricas ohsome API (HeiGIT) y auditoría de cambios OSMCha.
- **`03` · Biodiversidad GBIF**: Ocurrencias biológicas de flora, fauna y funga urbana validadas en GBIF e iNaturalist bajo estándar Darwin Core.
- **`04` · Cartografía uMap**: Integración de lienzos colaborativos uMap orientados a talleres participativos y validación comunitaria.
- **`05` · Metadatos ISO 19115**: Generación y exportación de fichas formales de metadatos en formatos XML (ISO 19139) y JSON.
- **`06` · Diccionario de Datos (131 Capas / 140 Descriptores)**: Especificación técnica de atributos por cobertura, incluyendo los diccionarios nativos de columnas `.gpkg` de SUBDERE RSD 2024.
- **`07` · Licencias & Catálogos**: Marco jurídico (ODbL 1.0, CC BY-SA 4.0, GNU AGPLv3, Ley N° 20.285, Ley N° 19.628) y descarga de matrices en formato Excel (`.xlsx`).
- **`08` · Manual de Uso y Actualización**: Documentación interactiva integrada en la plataforma (Manual de Uso, Manual de Actualización Técnica y Bibliografía APA 7ª ed.).
- **`09` · Indicadores & Storyboards**: Clasificación de las 131 capas en **5 Dimensiones Analíticas** (*Sociodemográfica*, *Socioeconómica*, *Socioambiental*, *Sociosanitaria* y *Sociourbana*) y **7 Storyboards territoriales del Barrio Brasil**.

---

## Despliegue Local y Auditoría Pre-Despliegue

1. **Inicialización del servidor local:**
   ```bash
   cd src
   python -m http.server 8080
   ```
   El sistema se sirve localmente en `http://localhost:8080`.

2. **Ejecución de scripts de verificación (desde la raíz):**
   ```bash
   python scripts/verificar_conteo_capas.py
   python scripts/verificar_integridad_despliegue.py
   python scripts/analisis_metacalidad.py
   ```

---

## Créditos Institucionales

- **Proyecto:** Fondecyt Regular N° 1261256 (*"Calidad y gobernanza de la Información Geográfica Voluntaria para la gestión urbana integrada"*).
- **Institución:** Departamento de Geografía · Facultad de Ciencias Sociales · Universidad Alberto Hurtado (Santiago de Chile).
