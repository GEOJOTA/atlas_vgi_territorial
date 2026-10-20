# -*- coding: utf-8 -*-
import os

BASE_DIR = "/Users/geojplescano/Programas/Práctica profesional 2026 S2/nodo-geoabierto"

with open(os.path.join(BASE_DIR, "scripts", "manual_p03_modelos_calidad_metadatos.py"), "w", encoding="utf-8") as f:
    f.write(r'''# -*- coding: utf-8 -*-
"""
scripts/manual_p03_modelos_calidad_metadatos.py
Capítulos 15 al 19: Modelamiento Matemático de Calidad ISO 19157 (WLC v2.0), Metadatos ISO 19115/19139, Catálogos y Diccionario Territorial.
"""

PARTE_03 = r"""# PARTE III: MODELAMIENTO MATEMÁTICO DE CALIDAD, METADATOS Y ESTÁNDARES INTERNACIONALES

---

## 15. Modelo Cuantitativo de Calidad Espacial ISO 19157 (Weighted Linear Combination - WLC v2.0)

La evaluación de la calidad de la información geográfica en el Atlas VGI no responde a impresiones subjetivas ni a estimaciones cualitativas informales. Por el contrario, se fundamenta en un **modelo computacional multicriterio ponderado (*Weighted Linear Combination* - WLC)** desarrollado específicamente bajo los lineamientos metodológicos de las normas internacionales **ISO 19157:2013 (Data Quality)** e **ISO 19157-1:2023 (General Requirements)**.

```text
┌────────────────────────────────────────────────────────────────────────┐
│             ESTRUCTURA DEL MODELO COMPUTACIONAL DUAL WLC v2.0          │
├────────────────────────────────────────────────────────────────────────┤
│                      ÍNDICE GLOBAL DE CALIDAD (IGV)                    │
│                                   │                                    │
│         ┌─────────────────────────┴─────────────────────────┐          │
│         ▼                                                   ▼          │
│  PILAR CUANTITATIVO ESPACIAL (50%)           PILAR CUALITATIVO (50%)   │
│  • Consistencia Topológica (30%)             • Metadatos Núcleo (30%)  │
│  • Completitud Tabular (25%)                 • Linaje y Legal (25%)    │
│  • Integridad Posicional (20%)               • Conformidad ISO (20%)   │
│  • Estructura y Esquema (15%)                • Resolución Espacial(15%)│
│  • Granularidad Geométrica (10%)             • Accesibilidad (10%)     │
└────────────────────────────────────────────────────────────────────────┘
```

```mermaid
flowchart TD
    IGV["Índice Global de Calidad VGI (IGV)"]
    CUANT["Pilar Cuantitativo Espacial (50%)"]
    CUAL["Pilar Cualitativo de Metadatos (50%)"]

    IGV --> CUANT
    IGV --> CUAL

    subgraph CUANTITATIVO["Dimensiones Cuantitativas ISO 19157"]
        C1["C1: Consistencia Topológica (30%)"]
        C2["C2: Completitud Tabular (25%)"]
        C3["C3: Integridad Posicional (20%)"]
        C4["C4: Estructura y Esquema (15%)"]
        C5["C5: Granularidad Geométrica (10%)"]
    end

    subgraph CUALITATIVO["Dimensiones Cualitativas ISO 19115"]
        M1["M1: Metadatos Núcleo (30%)"]
        M2["M2: Linaje y Respaldo Legal (25%)"]
        M3["M3: Conformidad Normativa ISO (20%)"]
        M4["M4: Resolución Espacial y Escala (15%)"]
        M5["M5: Accesibilidad y Licenciamiento (10%)"]
    end

    CUANT --> C1
    CUANT --> C2
    CUANT --> C3
    CUANT --> C4
    CUANT --> C5

    CUAL --> M1
    CUAL --> M2
    CUAL --> M3
    CUAL --> M4
    CUAL --> M5
```

### 15.1. Formulación Matemática Canónica
El Índice Global de Calidad Geográfica ($IGV$) de cada capa cartográfica se define como la combinación lineal equilibrada de dos pilares ortogonales ponderados equitativamente al 50%:

$$
IGV = 0.50 \cdot P_{\text{cuantitativo}} + 0.50 \cdot P_{\text{cualitativo}}
$$

Donde el **Pilar Cuantitativo Espacial** ($P_{\text{cuantitativo}} \in [0, 100]$) evalúa las propiedades geométricas y la completitud del archivo GeoJSON:

$$
P_{\text{cuantitativo}} = w_{c1} \cdot C_{\text{topo}} + w_{c2} \cdot C_{\text{comp}} + w_{c3} \cdot C_{\text{pos}} + w_{c4} \cdot C_{\text{estruc}} + w_{c5} \cdot C_{\text{gran}}
$$

Con el vector de ponderadores cuantitativos normalizado a la unidad:

$$
\mathbf{w}_c = [0.30, 0.25, 0.20, 0.15, 0.10], \quad \sum_{i=1}^{5} w_{ci} = 1.00
$$

Y el **Pilar Cualitativo de Metadatos** ($P_{\text{cualitativo}} \in [0, 100]$) evalúa el cumplimiento normativo de la gobernanza de datos conforme al estándar ISO 19115-1:2014:

$$
P_{\text{cualitativo}} = w_{m1} \cdot M_{\text{core}} + w_{m2} \cdot M_{\text{linaje}} + w_{m3} \cdot M_{\text{conf}} + w_{m4} \cdot M_{\text{res}} + w_{m5} \cdot M_{\text{acc}}
$$

Con el vector de ponderadores cualitativos normalizado a la unidad:

$$
\mathbf{w}_m = [0.30, 0.25, 0.20, 0.15, 0.10], \quad \sum_{j=1}^{5} w_{mj} = 1.00
$$

### 15.2. Desglose Algorítmico y Fórmulas de las 10 Dimensiones de Calidad

#### Dimensión 1: Consistencia Topológica OGC ($C_{\text{topo}}$ — Peso 30% en Pilar 1)
Evalúa que las geometrías respeten los axiomas de la especificación *OGC Simple Feature Access* (ISO 19125-1). En el caso de polígonos, verifica que el primer y último vértice sean idénticos (anillo cerrado), que no existan auto-intersecciones en bordes (*kinks* o lazos en ocho) y que los orificios interiores se encuentren estrictamente contenidos en la cáscara exterior (*exterior ring*):

$$
C_{\text{topo}} = \left( 1 - \frac{N_{\text{inválidas}} + N_{\text{colapsadas}}}{N_{\text{total}}} \right) \times 100
$$

Donde $N_{\text{inválidas}}$ se calcula mediante la función booleana `ST_IsValid(geom)` en PostGIS o `shapely.validation.explain_validity()` en Python.

#### Dimensión 2: Completitud Tabular de Atributos ($C_{\text{comp}}$ — Peso 25% en Pilar 1)
Mide la ausencia de valores nulos (`null`), indefinidos (`undefined`) o cadenas de caracteres vacías (`""` o `" "`) en los campos informativos de la tabla de atributos:

$$
C_{\text{comp}} = \left( \frac{\sum_{i=1}^N \sum_{j=1}^K \mathbb{I}(a_{ij} \neq \emptyset)}{N \cdot K} \right) \times 100
$$

Donde $N$ es el total de entidades, $K$ es el número de campos evaluados y $\mathbb{I}$ es la función indicatriz que asigna $1$ si la celda contiene un dato válido y $0$ si es nulo.

#### Dimensión 3: Integridad Posicional Geodésica ($C_{\text{pos}}$ — Peso 20% en Pilar 1)
Verifica que las coordenadas de los vértices se ubiquen estrictamente dentro del ámbito territorial legítimo (Bounding Box de la Región Metropolitana de Santiago: $[-71.72, -34.30, -69.75, -32.92]$), penalizando severamente valores fuera de rango o coordenadas invertidas (Lat/Lon en lugar de Lon/Lat):

$$
C_{\text{pos}} = \left( \frac{V_{\text{dentro-bbox}}}{V_{\text{total-vértices}}} \right) \times 100
$$

#### Dimensión 4: Estructura y Esquema Normalizado ($C_{\text{estruc}}$ — Peso 15% en Pilar 1)
Evalúa la adopción del esquema maestro de los **14 atributos ISO obligatorios** en el objeto `properties` de cada Feature, verificando que los identificadores `id_atlas` sean unívocos y no presenten colisiones de clave primaria:

$$
C_{\text{estruc}} = \left( \frac{14 - N_{\text{campos-faltantes}}}{14} \right) \times 100 \times \left( \frac{U_{\text{ids-únicos}}}{N_{\text{total}}} \right)
$$

#### Dimensión 5: Granularidad y Micro-Slivers ($C_{\text{gran}}$ — Peso 10% en Pilar 1)
Detecta y penaliza polígonos degenerados (*slivers*) de área despreciable resultantes de errores de digitalización o intersecciones defectuosas (polígonos con área $< 0.5 \text{ m}^2$ o líneas de longitud nula):

$$
C_{\text{gran}} = \left( 1 - \frac{N_{\text{slivers}}}{N_{\text{polígonos}}} \right) \times 100
$$

#### Dimensión 6: Metadatos Núcleo ISO 19115 ($M_{\text{core}}$ — Peso 30% en Pilar 2)
Audita la presencia de los 10 campos indispensables del perfil básico ISO 19115-1:2014: título formal, resumen descriptivo, fecha de publicación, sistema de referencia (EPSG), tipo de representación espacial, palabras clave temáticas, extensión geográfica BBox, punto de contacto institucional, frecuencia de mantenimiento y formato de distribución.

#### Dimensión 7: Linaje Metodológico y Legal ($M_{\text{linaje}}$ — Peso 25% en Pilar 2)
Verifica la presencia explícita de la declaración de procedencia (*lineage statement*), los pasos de transformación espacial aplicados, la cita bibliográfica normalizada bajo norma APA 7ª edición y la base legal de reutilización (Ley N° 20.285 de Transparencia, licencia ODbL 1.0 o CC BY-SA 4.0).

#### Dimensión 8: Conformidad Normativa con Esquemas XML ($M_{\text{conf}}$ — Peso 20% en Pilar 2)
Evalúa la validación sintáctica del metadato contra los esquemas XSD de la norma ISO 19139:2007 (`gmd:MD_Metadata`), garantizando que la ficha pueda ser cosechada por catálogos CSW institucionales (GeoNetwork, GeoNode o IDE Chile).

#### Dimensión 9: Resolución Espacial y Escala Equivalente ($M_{\text{res}}$ — Peso 15% en Pilar 2)
Verifica la declaración formal de la escala cartográfica equivalente de captura (ej. 1:1.000, 1:5.000) o la distancia de muestreo terrestre (GSD), evitando que usuarios utilicen datos a escalas para las cuales no fueron diseñados.

#### Dimensión 10: Accesibilidad Operativa y Enlaces Web ($M_{\text{acc}}$ — Peso 10% en Pilar 2)
Comprueba mediante solicitudes HTTP automatizadas (`HEAD` o `GET`) que los enlaces declarados en el metadato (URL del geoservicio de origen, enlace de descarga GeoJSON y documentación) respondan con código `HTTP 200 OK` y no presenten barreras arancelarias ni muros de registro.

### 15.3. Rangos y Certificación Formal de Calidad
De acuerdo al puntaje global obtenido en el modelo WLC v2.0, las capas se certifican en cuatro categorías normativas:

| Rango Numérico ($IGV$) | Grado de Calidad | Dictamen Técnico y Aptitud de Uso |
| :---: | :---: | :--- |
| **$IGV \ge 95.00\%$** | **Grado A+ (Excelente)** | **Aptitud Total:** Apta para modelamiento normativo vinculante, toma de decisiones comunales y publicación científica de alto impacto. |
| **$90.00\% \le IGV < 95.00\%$** | **Grado A (Muy Bueno)** | **Aptitud Operativa:** Apta para planificación territorial general, diagnósticos barriales y análisis espacial multiescalar. |
| **$80.00\% \le IGV < 90.00\%$** | **Grado B (Aceptable)** | **Aptitud Condicionada:** Requiere curatoría de atributos o densificación de vértices antes de su uso en análisis espacial avanzado. |
| **$IGV < 80.00\%$** | **Grado C (Deficiente)** | **No Apta:** Datos con inconsistencias topológicas severas o ausencia de metadatos; bloqueada para producción cartográfica. |

---

## 16. Correlaciones Estadísticas, Sensibilidad y Ranking de Metacalidad

### 16.1. Matriz de Correlación Lineal de Pearson ($r$)
Para verificar la independencia ortogonal entre las 5 dimensiones cuantitativas y las 5 dimensiones cualitativas del modelo WLC v2.0, se calculó la matriz de coeficientes de correlación de Pearson ($r$) sobre las 131 capas cartográficas, preservada en [`docs/correlacion_dimensiones_calidad.csv`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/docs/correlacion_dimensiones_calidad.csv):

$$
r_{xy} = \frac{\sum_{i=1}^n (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^n (x_i - \bar{x})^2} \sqrt{\sum_{i=1}^n (y_i - \bar{y})^2}}
$$

* **Hallazgo Clave 1 (Ortogonalidad Cuantitativa vs. Cualitativa):** La correlación promedio entre las dimensiones del Pilar 1 (geometría) y las del Pilar 2 (metadatos) es de $r = 0.22$, lo que demuestra que un archivo GeoJSON puede ser geométricamente perfecto (topología 100%) pero carecer de linaje y metadatos, o viceversa. Esto justifica plenamente la ponderación al 50% de ambos pilares.
* **Hallazgo Clave 2 (Completitud vs. Linaje):** Existe una correlación positiva moderada ($r = 0.58$) entre la completitud de atributos y la calidad del linaje, indicando que las instituciones que documentan formalmente sus metodologías tienden a generar tablas de atributos más completas.

### 16.2. Dictamen Global de la Base de Datos del Atlas VGI
* **Índice Global de Calidad (IGV Promedio):** **95.41%** (Certificación Grado A+ Excelente).
* **Puntaje Promedio Pilar Cuantitativo Espacial:** **96.72%**.
* **Puntaje Promedio Pilar Cualitativo de Metadatos:** **94.10%**.
* **Distribución de Grados:**
  - Grado A+ (Excelente): **118 capas (90.1%)**.
  - Grado A (Muy Bueno): **13 capas (9.9%)**.
  - Grados B o C: **0 capas (0.0%)**.

---

## 17. Perfil de Metadatos Espaciales ISO 19115-1:2014 e Implementación XML ISO 19139:2007

Para permitir que los datos del Atlas VGI sean interoperables con servidores de catálogo GeoNetwork institucionales y con la Infraestructura de Datos Geoespaciales de Chile (SNIT / IDE Chile), se definió un perfil estricto de metadatos organizado en **7 paquetes normativos**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│             LOS 7 PAQUETES NORMATIVOS DEL PERFIL ISO 19115-1:2014      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. MD_IdentificationInfo  ──> Identificación, Título, Resumen, BBox    │
│ 2. MD_Constraints         ──> Base legal, Licenciamiento (ODbL, CC)    │
│ 3. DQ_DataQuality         ──> Linaje metodológico y reporte ISO 19157 │
│ 4. MD_MaintenanceInfo     ──> Frecuencia de actualización              │
│ 5. MD_SpatialRepresInfo   ──> Vectorial OGC Simple Features            │
│ 6. MD_ReferenceSystemInfo ──> EPSG:4326 (WGS84)                        │
│ 7. CI_ResponsibleParty    ──> Departamento de Geografía UAH (Custodio) │
└────────────────────────────────────────────────────────────────────────┘
```

### 17.1. Plantilla Canónica XML conforme a ISO 19139:2007
A continuación se reproduce el fragmento XML validable que genera el Módulo 08 del Atlas para exportación directa hacia geoportales oficiales:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd"
                 xmlns:gco="http://www.isotc211.org/2005/gco"
                 xmlns:gml="http://www.opengis.net/gml"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  
  <gmd:fileIdentifier>
    <gco:CharacterString>cl-uah-geo-vgi-atlas-2026-cat01</gco:CharacterString>
  </gmd:fileIdentifier>
  
  <gmd:language>
    <gco:CharacterString>spa</gco:CharacterString>
  </gmd:language>
  
  <gmd:characterSet>
    <gmd:MD_CharacterSetCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_CharacterSetCode" codeListValue="utf8"/>
  </gmd:characterSet>
  
  <gmd:contact>
    <gmd:CI_ResponsibleParty>
      <gmd:individualName>
        <gco:CharacterString>Juan Pablo Lescano Villegas</gco:CharacterString>
      </gmd:individualName>
      <gmd:organisationName>
        <gco:CharacterString>Universidad Alberto Hurtado - Departamento de Geografía</gco:CharacterString>
      </gmd:organisationName>
      <gmd:positionName>
        <gco:CharacterString>Desarrollador Líder SIG y Analista VGI</gco:CharacterString>
      </gmd:positionName>
      <gmd:contactInfo>
        <gmd:CI_Contact>
          <gmd:address>
            <gmd:CI_Address>
              <gmd:electronicMailAddress>
                <gco:CharacterString>juanpablolescanovillegas@gmail.com</gco:CharacterString>
              </gmd:electronicMailAddress>
            </gmd:CI_Address>
          </gmd:address>
        </gmd:CI_Contact>
      </gmd:contactInfo>
      <gmd:role>
        <gmd:CI_RoleCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_RoleCode" codeListValue="pointOfContact"/>
      </gmd:role>
    </gmd:CI_ResponsibleParty>
  </gmd:contact>
  
  <gmd:dateStamp>
    <gco:Date>2026-10-20</gco:Date>
  </gmd:dateStamp>
  
  <gmd:identificationInfo>
    <gmd:MD_DataIdentification>
      <gmd:citation>
        <gmd:CI_Citation>
          <gmd:title>
            <gco:CharacterString>CAT-01: Educación y Equipamiento Formativo VGI — Barrio Brasil</gco:CharacterString>
          </gmd:title>
          <gmd:date>
            <gmd:CI_Date>
              <gmd:date>
                <gco:Date>2026-09-24</gco:Date>
              </gmd:date>
              <gmd:dateType>
                <gmd:CI_DateTypeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_DateTypeCode" codeListValue="publication"/>
              </gmd:dateType>
            </gmd:CI_Date>
          </gmd:date>
        </gmd:CI_Citation>
      </gmd:citation>
      <gmd:abstract>
        <gco:CharacterString>Capa vectorial comunitaria que compila establecimientos escolares, sedes universitarias (UAH) y bibliotecas públicas en Barrio Brasil, normalizada a EPSG:4326 con 14 atributos maestros ISO.</gco:CharacterString>
      </gmd:abstract>
      <gmd:extent>
        <gmd:EX_Extent>
          <gmd:geographicElement>
            <gmd:EX_GeographicBoundingBox>
              <gmd:westBoundLongitude><gco:Decimal>-70.6720</gco:Decimal></gmd:westBoundLongitude>
              <gmd:eastBoundLongitude><gco:Decimal>-70.6580</gco:Decimal></gmd:eastBoundLongitude>
              <gmd:southBoundLatitude><gco:Decimal>-33.4505</gco:Decimal></gmd:southBoundLatitude>
              <gmd:northBoundLatitude><gco:Decimal>-33.4350</gco:Decimal></gmd:northBoundLatitude>
            </gmd:EX_GeographicBoundingBox>
          </gmd:geographicElement>
        </gmd:EX_Extent>
      </gmd:extent>
    </gmd:MD_DataIdentification>
  </gmd:identificationInfo>
  
  <gmd:dataQualityInfo>
    <gmd:DQ_DataQuality>
      <gmd:scope>
        <gmd:DQ_Scope>
          <gmd:level>
            <gmd:MD_ScopeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_ScopeCode" codeListValue="dataset"/>
          </gmd:level>
        </gmd:DQ_Scope>
      </gmd:scope>
      <gmd:lineage>
        <gmd:LI_Lineage>
          <gmd:statement>
            <gco:CharacterString>Extracción mediante Overpass QL desde OpenStreetMap, depuración topológica con Shapely y validación bajo el modelo WLC v2.0 (IGV 96.8%).</gco:CharacterString>
          </gmd:statement>
        </gmd:LI_Lineage>
      </gmd:lineage>
    </gmd:DQ_DataQuality>
  </gmd:dataQualityInfo>
  
</gmd:MD_Metadata>
```

---

## 18. Catálogos Maestros OpenXML (.xlsx) y Archivos Consolidados CSV

El Atlas desacopla de forma absoluta las bases de datos espaciales de los catálogos de metadatos tabulares, permitiendo a investigadores de cualquier disciplina inspeccionar el sistema en software ofimático estándar:

### 18.1. Los 4 Libros Maestros OpenXML (`.xlsx`)
1. **`docs/categorias_tematicas_osm.xlsx` (52.5 KB):** Contiene 11 hojas estructuradas (Resumen General + Hojas CAT-01 a CAT-10). Define códigos unívocos, nombres en español, etiquetas primarias y secundarias de OSM, pesos de habitabilidad y criterios de verificación comunitaria.
2. **`docs/catalogo_fuentes_vgi.xlsx` (37.4 KB):** Ficha exhaustiva de las **131 capas** del Atlas a lo largo de 24 columnas normalizadas: ID de capa, institución, ministerio, endpoint WFS/REST, total de entidades, sistema geodésico, fecha de captura, cita APA 7ª ed. y puntaje de calidad IGV.
3. **`docs/perfil_metadatos_vgi.xlsx` (30.6 KB):** Matriz de parametrización de los 7 paquetes normativos de la norma ISO 19115-1:2014 con definición de obligatoriedad, cardinalidad OGC y mapeo XSD ISO 19139.
4. **`docs/catalogo_diccionario_territorial_140.xlsx`:** Catálogo estructurado de los 140 descriptores conceptuales y normativos del Atlas.

### 18.2. Los Archivos Consolidados CSV UTF-8
* **`data/bip_inversiones_santiago.csv` (3.73 MB):** Catálogo masivo de iniciativas del Banco Integrado de Proyectos (BIP) del MIDESO para Santiago Centro, con montos de inversión, etapas (Diseño, Ejecución, Operación) y georreferenciación.
* **`docs/correlacion_dimensiones_calidad.csv` (837 bytes):** Matriz simétrica $10 \times 10$ de coeficientes de correlación de Pearson del modelo WLC v2.0.
* **`docs/wlc_metacalidad_ranking.csv` (29.5 KB):** Tabla ordenada de las 131 capas con puntajes cuantitativos, cualitativos y grado asignado (A+, A, B o C).
* **`data/resumen_catastro_vgi.csv` (168 KB):** Conteo agregado de nodos, vías y relaciones activas por categoría en Barrio Brasil.

---

## 19. Diccionario Territorial Interactivo: Los 140 Descriptores Normativos y Etiquetas OSM

El Módulo 07 ([`src/js/modulos/diccionario.js`](file:///Users/geojplescano/Programas/Práctica%20profesional%202026%20S2/nodo-geoabierto/src/js/modulos/diccionario.js)) articula un repositorio conceptual de **140 descriptores territoriales** que homologan la jerga legal de la Ordenanza General de Urbanismo y Construcciones (OGUC) y el Plan Regulador Comunal (PRC) con las etiquetas colaborativas de OpenStreetMap.

A continuación se expone una muestra representativa de los descriptores más significativos de la base:

| N° | Término Estandarizado | Categoría Temática | Definición Conceptual y Operativa | Marco Normativo | Etiqueta OSM Equivalente | Capa Atlas Relacionada |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **001** | **Cité Residencial** | Morfología Urbana | Conjunto de viviendas continuas de baja altura emplazadas a lo largo de un pasaje interior común con acceso único a la vía pública. | Ley 21.442 / OGUC | `building=cité` / `building:cité=yes` | `cat09_edificaciones_vgi` |
| **002** | **Zona Típica (ZT)** | Patrimonio Barrial | Agrupación de bienes inmuebles urbanos que constituyen una unidad de interés histórico, estético o cultural protegida por ley. | Ley 17.288 (Art. 29) | `heritage=2` / `heritage:operator=CMN` | `minvu_patrimonio` |
| **003** | **Inmueble de Conservación Histórica** | Patrimonio Barrial | Edificación destacada por su valor patrimonial individual, declarada en el Plan Regulador Comunal. | LGUC Art. 60 / PRC Santiago | `historic=building` / `heritage=yes` | `prc_zonificacion_santiago` |
| **004** | **Rampa Peatonal PMR** | Inclusión Urbana | Rebaje de solera en cruces peatonales para permitir el desplazamiento autónomo de personas en sillas de ruedas. | OGUC Art. 2.2.8 | `highway=crossing` + `kerb=lowered` | `cat07_accesibilidad_vgi` |
| **005** | **Pavimento Podotáctil** | Inclusión Urbana | Superficie con relieve texturizado (guía o botones) que orienta a personas con discapacidad visual en aceras. | OGUC Art. 2.2.8 | `tactile_paving=yes` | `cat07_accesibilidad_vgi` |
| **006** | **Semáforo Acústico** | Movilidad Urbana | Controlador de cruce semaforizado equipado con pulsador sonoro para no videntes. | Manual de Señalización MTT | `traffic_signals:sound=yes` | `red_semaforos_uoct_rm` |
| **007** | **Punto Limpio Comunitario** | Medio Ambiente | Instalación destinada a la recepción selectiva y acopio transitorio de residuos reciclables (plásticos, vidrios, papeles). | Ley 20.920 (REP) | `amenity=recycling` | `subdere_rsd_sitios_disposicion`|
| **008** | **Arbolado Viario Significativo** | Medio Ambiente | Árbol emplazado en bien nacional de uso público con copa superior a 5 metros que provee sombra y microclima. | Ordenanza Municipal de Aseo | `natural=tree` + `denotation=urban` | `cat08_biodiversidad_vgi` |
| **009** | **Ciclovía Segregada** | Movilidad Activa | Vía ciclista delimitada físicamente mediante segregadores respecto al tránsito vehicular motorizado. | Ley 21.088 (Ley de Convivencia) | `highway=cycleway` + `segregated=yes`| `cat04_ciclovias_vgi` |
| **010** | **Manzana Censal Urbana** | Demografía Social | Unidad mínima de recolección estadística censal delimitada por calles o accidentes geográficos continuos. | INE Censo 2024 | `boundary=census` / `place=block` | `ide_censo2024_manzanas` |

---
"""
print("[+] Parte 03 enriquecida cargada exitosamente")
''')

print("[✓] Creado exitosamente scripts/manual_p03_modelos_calidad_metadatos.py")
