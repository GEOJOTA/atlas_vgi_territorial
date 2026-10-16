# Atlas de Información Geográfica Voluntaria y Gestión Territorial (Atlas VGI — UAH)

[![Estado del Proyecto](https://img.shields.io/badge/Estado-Producci%C3%B3n_2026-10b981?style=for-the-badge)](https://github.com/santiagogeografia454-sketch/Visualizador-barrio-brasil)
[![Capas Integradas](https://img.shields.io/badge/Capas_Integradas-131_(121_Oficiales_%2B_10_VGI)-38bdf8?style=for-the-badge)](#estructura-de-datos-y-m%C3%B3dulos)
[![Diccionario de Datos](https://img.shields.io/badge/Diccionario-140_Descriptores_T%C3%A9cnicos-f59e0b?style=for-the-badge)](#documentaci%C3%B3n-y-manuales)
[![Fondecyt Regular](https://img.shields.io/badge/Fondecyt_Regular-N%C2%B0_1261256_(Geograf%C3%ADa_UAH)-a855f7?style=for-the-badge)](#cr%C3%A9ditos-institucionales)

Plataforma web abierta desarrollada en el marco del **Proyecto Fondecyt Regular N° 1261256** del **Departamento de Geografía de la Universidad Alberto Hurtado (Chile)**.

El sistema integra cartografía oficial del Estado de Chile con Información Geográfica Voluntaria (VGI) para el análisis espacial, auditoría normativa y gestión territorial del **Barrio Brasil**, la **Comuna de Santiago** y la **Región Metropolitana**.

---

## Documentación Técnica y Manuales

1. 📘 **[Manual de Uso (`MANUAL_USO.md`)](MANUAL_USO.md)**:  
   Guía operativa de los 10 módulos (`00` al `09`), filtros espaciales, evaluación normativa (PRC/OGUC e historial de modificaciones en Barrio Brasil 1990–2024), Índice de Calidad VGI (ICV) dinámico, 5 dimensiones analíticas y 7 Storyboards territoriales.
2. 🛠️ **[Manual de Actualización y Mantención Técnica (`MANUAL_ACTUALIZACION_ATLAS.md`)](MANUAL_ACTUALIZACION_ATLAS.md)**:  
   Protocolo técnico integral para modificar el sistema, mantener la base de datos dual (`.geojson` + `.gpkg`), integrar nuevas capas en 6 pasos, editar indicadores/storyboards, incorporar los ajustes finales de validación de usuarios y desplegar a producción.
3. 🏗️ **[Arquitectura Técnica (`docs/ARQUITECTURA.md`)](docs/ARQUITECTURA.md)** y **[Protocolo de Integridad y Despliegue (`PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md`)](PROTOCOL_INTEGRIDAD_Y_DESPLIEGUE.md)**.

---

## Estructura de Datos y Módulos (`00` al `09`)

El Atlas integra **131 capas geográficas operativas** en coordenadas `EPSG:4326` (WGS84 / SIRGAS-Chile) y **140 descriptores documentados** en su Diccionario de Datos:
- **121 Capas Oficiales del Estado de Chile**: IDE Chile, MINVU (PRC, PRMS, ZCH/ICH, Cités), INE (Censo 2024), MTT/DTPM/UOCT, MDSF (RSH / BiDat), SUBDERE (13 capas del Catastro Nacional de Residuos Sólidos Domiciliarios 2024 con sus geodatabases `.gpkg` originales), MMA, SERNAGEOMIN, CMN, MINSAL y SII.
- **10 Categorías Colaborativas VGI**: Levantamientos de OpenStreetMap (OSM) y registros de biodiversidad de GBIF / iNaturalist.

### Módulos de la Plataforma
- **`00` · Visor para la gestión territorial**: Mapa interactivo 2D/3D, buscador de las 131 capas, cálculo en tiempo real del **Índice de Calidad VGI (ICV)** e **Inspector Normativo (Certificado CIN-VGI)** con acceso directo al expediente histórico de modificaciones al PRC de Santiago (1990–2024).
- **`01` · Consultas Overpass**: Extracción en vivo desde OpenStreetMap mediante plantillas temáticas y código Overpass QL.
- **`02` · Calidad & ICV**: Evaluación multicriterio bajo norma ISO 19157, series históricas ohsome API (HeiGIT) y control de cambios OSMCha.
- **`03` · Biodiversidad GBIF**: Ocurrencias biológicas de flora, fauna y funga urbana validadas en GBIF e iNaturalist.
- **`04` · Cartografía uMap**: Integración de lienzos colaborativos uMap para talleres participativos y validación comunitaria.
- **`05` · Metadatos ISO 19115**: Generación y exportación de fichas formales de metadatos en formatos XML (ISO 19139) y JSON.
- **`06` · Diccionario de Datos (131 Capas / 140 Descriptores)**: Definición técnica de atributos por capa, incluyendo los diccionarios nativos de columnas `.gpkg` de SUBDERE RSD 2024.
- **`07` · Licencias & Catálogos**: Marco jurídico (ODbL 1.0, CC-BY 4.0, Ley N° 20.285, Ley N° 19.628) y descarga de matrices en Excel (`.xlsx`).
- **`08` · Manual de Uso y Actualización**: Documentación interactiva integrada en la plataforma (Manual de Uso + Manual de Actualización Técnica).
- **`09` · Indicadores & Storyboards**: Clasificación de las 131 capas en **5 Dimensiones Analíticas** (*Sociodemográfica*, *Socioeconómica*, *Socioambiental*, *Sociosanitaria* y *Sociourbana*) y **7 Storyboards territoriales del Barrio Brasil**.

---

## Ejecución Local y Verificación Pre-Despliegue

1. **Servidor local de desarrollo:**
   ```bash
   cd src
   python -m http.server 8080
   ```
   Acceder a `http://localhost:8080`.

2. **Scripts de verificación automatizada (desde la raíz):**
   ```bash
   python scripts/verificar_conteo_capas.py
   python scripts/verificar_integridad_despliegue.py
   python scripts/analisis_metacalidad.py
   ```

---

## Créditos Institucionales

- **Proyecto:** Fondecyt Regular N° 1261256 (*"Calidad y gobernanza de la Información Geográfica Voluntaria para la gestión urbana integrada"*).
- **Institución:** Departamento de Geografía · Facultad de Ciencias Sociales · Universidad Alberto Hurtado (Santiago de Chile).
