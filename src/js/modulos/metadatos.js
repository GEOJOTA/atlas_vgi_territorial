/*
  metadatos.js
  ------------
  Generador dual de metadatos espaciales estandarizados:
  1. JSON (ISO 19115-1:2014 elementos núcleo)
  2. XML (ISO 19139 / Perfil Nacional de Metadatos IDE Chile - SNIT)
     Directamente importable en GeoNetwork, GeoNode o catálogos institucionales.
*/

const ModuloMetadatos = (() => {

  const CLAVE_ALMACENAMIENTO = 'nodo-geoabierto:fichas-metadatos';

  function construirFicha(datos) {
    const ahora = new Date().toISOString();
    const uuid = 'urn:uuid:' + (crypto.randomUUID ? crypto.randomUUID() : 'vgi-' + Date.now());

    const oeste = parseFloat(datos.oeste) || -70.6675;
    const sur = parseFloat(datos.sur) || -33.4505;
    const este = parseFloat(datos.este) || -70.6565;
    const norte = parseFloat(datos.norte) || -33.4385;

    let sup = null;
    if (typeof ModuloMapa !== 'undefined' && ModuloMapa.calcularSuperficieBbox) {
      sup = ModuloMapa.calcularSuperficieBbox([oeste, sur, este, norte]);
    }

    return {
      estandar: 'ISO 19115-1:2014 / Perfil IDE Chile (SNIT)',
      uuid: uuid,
      fechaCreacion: ahora,
      identificacion: {
        titulo: datos.titulo || 'Catastro VGI Barrio Brasil — Universidad Alberto Hurtado',
        resumen: datos.resumen || 'Capa de datos espaciales voluntarios compilada para la gestión territorial.',
        proposito: datos.proposito || 'Práctica profesional de geografía: evaluación y catálogo de datos VGI.',
        categoriaTema: datos.categoriaTema || 'planningCadastre'
      },
      extensionGeografica: {
        oeste: oeste,
        sur: sur,
        este: este,
        norte: norte,
        superficie_m2: sup ? sup.areaM2 : (datos.superficie_m2 || null),
        superficie_ha: sup ? sup.areaHa : (datos.superficie_ha || null),
        superficie_km2: sup ? sup.areaKm2 : (datos.superficie_km2 || null),
        srs_superficie: sup ? sup.srs : 'EPSG:32719 (WGS 84 / UTM Huso 19 Sur)',
        descripcionTerritorio: datos.descripcionTerritorio || 'Barrio Brasil y Campus Universidad Alberto Hurtado, Santiago Centro, Chile'
      },
      sistemaReferencia: {
        codigo: datos.srs || 'EPSG:4326 (WGS84)',
        oficialNacional: 'EPSG:5361 (SIRGAS-Chile / UTM huso 19 Sur)',
        calculoMetricoSuperficie: 'EPSG:32719 (WGS 84 / UTM Huso 19 Sur)'
      },
      linaje: {
        declaracion: datos.linaje || 'Datos extraídos en vivo desde OpenStreetMap y GBIF vía Overpass QL.',
        fechaConsulta: ahora.slice(0, 10),
        procesamiento: 'Normalización de atributos según taxonomía VGI de 8 categorías y cálculo de superficies métricas en m² (EPSG:32719).'
      },
      restriccionesDeUso: {
        licencia: datos.restricciones || 'Open Database License (ODbL) 1.0 para datos OSM; CC-BY para registros biológicos.',
        acceso: 'Acceso público y libre reutilización con atribución a las fuentes comunitarias.'
      },
      puntoDeContacto: {
        organizacion: datos.contactoOrganizacion || 'Práctica Profesional Geografía 2026 — Universidad Alberto Hurtado',
        persona: datos.contactoPersona || 'GEOJOTA',
        correo: datos.contactoCorreo || 'juanpablolescanovillegas@gmail.com',
        rol: datos.rol || 'custodian'
      },
      mantenimiento: {
        frecuencia: datos.frecuencia || 'asNeeded'
      }
    };
  }

  /**
   * Genera documento XML conforme a ISO 19139 / perfil IDE Chile
   */
  function generarXMLISO19139(ficha) {
    const i = ficha.identificacion;
    const ext = ficha.extensionGeografica;
    const cont = ficha.puntoDeContacto;

    return `<?xml version="1.0" encoding="UTF-8"?>
<gmd:MD_Metadata xmlns:gmd="http://www.isotc211.org/2005/gmd"
                 xmlns:gco="http://www.isotc211.org/2005/gco"
                 xmlns:gml="http://www.opengis.net/gml"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xsi:schemaLocation="http://www.isotc211.org/2005/gmd http://schemas.opengis.net/iso/19139/20060504/gmd/gmd.xsd">
  <gmd:fileIdentifier>
    <gco:CharacterString>${ficha.uuid}</gco:CharacterString>
  </gmd:fileIdentifier>
  <gmd:language>
    <gmd:LanguageCode codeList="http://www.loc.gov/standards/iso639-2/" codeListValue="spa">Español</gmd:LanguageCode>
  </gmd:language>
  <gmd:characterSet>
    <gmd:MD_CharacterSetCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_CharacterSetCode" codeListValue="utf8">UTF-8</gmd:MD_CharacterSetCode>
  </gmd:characterSet>
  <gmd:hierarchyLevel>
    <gmd:MD_ScopeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_ScopeCode" codeListValue="dataset">dataset</gmd:MD_ScopeCode>
  </gmd:hierarchyLevel>
  <gmd:contact>
    <gmd:CI_ResponsibleParty>
      <gmd:individualName><gco:CharacterString>${cont.persona}</gco:CharacterString></gmd:individualName>
      <gmd:organisationName><gco:CharacterString>${cont.organizacion}</gco:CharacterString></gmd:organisationName>
      <gmd:contactInfo>
        <gmd:CI_Contact>
          <gmd:address>
            <gmd:CI_Address>
              <gmd:electronicMailAddress><gco:CharacterString>${cont.correo}</gco:CharacterString></gmd:electronicMailAddress>
            </gmd:CI_Address>
          </gmd:address>
        </gmd:CI_Contact>
      </gmd:contactInfo>
      <gmd:role>
        <gmd:CI_RoleCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_RoleCode" codeListValue="${cont.rol}">${cont.rol}</gmd:CI_RoleCode>
      </gmd:role>
    </gmd:CI_ResponsibleParty>
  </gmd:contact>
  <gmd:dateStamp>
    <gco:Date>${ficha.fechaCreacion.slice(0, 10)}</gco:Date>
  </gmd:dateStamp>
  <gmd:metadataStandardName>
    <gco:CharacterString>Perfil Nacional de Metadatos IDE Chile (ISO 19115:2003 / Cor 1:2006)</gco:CharacterString>
  </gmd:metadataStandardName>
  <gmd:metadataStandardVersion>
    <gco:CharacterString>2.0</gco:CharacterString>
  </gmd:metadataStandardVersion>
  <gmd:referenceSystemInfo>
    <gmd:MD_ReferenceSystem>
      <gmd:referenceSystemIdentifier>
        <gmd:RS_Identifier>
          <gmd:code><gco:CharacterString>${ficha.sistemaReferencia.codigo}</gco:CharacterString></gmd:code>
        </gmd:RS_Identifier>
      </gmd:referenceSystemIdentifier>
    </gmd:MD_ReferenceSystem>
  </gmd:referenceSystemInfo>
  <gmd:identificationInfo>
    <gmd:MD_DataIdentification>
      <gmd:citation>
        <gmd:CI_Citation>
          <gmd:title><gco:CharacterString>${escapeXML(i.titulo)}</gco:CharacterString></gmd:title>
          <gmd:date>
            <gmd:CI_Date>
              <gmd:date><gco:Date>${ficha.fechaCreacion.slice(0, 10)}</gco:Date></gmd:date>
              <gmd:dateType>
                <gmd:CI_DateTypeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_DateTypeCode" codeListValue="creation">creation</gmd:CI_DateTypeCode>
              </gmd:dateType>
            </gmd:CI_Date>
          </gmd:date>
        </gmd:CI_Citation>
      </gmd:citation>
      <gmd:abstract><gco:CharacterString>${escapeXML(i.resumen)}</gco:CharacterString></gmd:abstract>
      <gmd:purpose><gco:CharacterString>${escapeXML(i.proposito)}</gco:CharacterString></gmd:purpose>
      <gmd:resourceConstraints>
        <gmd:MD_LegalConstraints>
          <gmd:useLimitation><gco:CharacterString>${escapeXML(ficha.restriccionesDeUso.licencia)}</gco:CharacterString></gmd:useLimitation>
        </gmd:MD_LegalConstraints>
      </gmd:resourceConstraints>
      <gmd:resourceMaintenance>
        <gmd:MD_MaintenanceInformation>
          <gmd:maintenanceAndUpdateFrequency>
            <gmd:MD_MaintenanceFrequencyCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_MaintenanceFrequencyCode" codeListValue="${ficha.mantenimiento ? ficha.mantenimiento.frecuencia : 'asNeeded'}">${ficha.mantenimiento ? ficha.mantenimiento.frecuencia : 'asNeeded'}</gmd:MD_MaintenanceFrequencyCode>
          </gmd:maintenanceAndUpdateFrequency>
        </gmd:MD_MaintenanceInformation>
      </gmd:resourceMaintenance>
      <gmd:topicCategory>
        <gmd:MD_TopicCategoryCode>${i.categoriaTema}</gmd:MD_TopicCategoryCode>
      </gmd:topicCategory>
      <gmd:extent>
        <gmd:EX_Extent>
          <gmd:description><gco:CharacterString>${escapeXML(ext.descripcionTerritorio)}${ext.superficie_m2 ? ` [Superficie métrica: ${ext.superficie_m2.toLocaleString('es-CL')} m² / ${ext.superficie_ha} ha reprojectada a ${ext.srs_superficie}]` : ''}</gco:CharacterString></gmd:description>
          <gmd:geographicElement>
            <gmd:EX_GeographicBoundingBox>
              <gmd:westBoundLongitude><gco:Decimal>${ext.oeste}</gco:Decimal></gmd:westBoundLongitude>
              <gmd:eastBoundLongitude><gco:Decimal>${ext.este}</gco:Decimal></gmd:eastBoundLongitude>
              <gmd:southBoundLatitude><gco:Decimal>${ext.sur}</gco:Decimal></gmd:southBoundLatitude>
              <gmd:northBoundLatitude><gco:Decimal>${ext.norte}</gco:Decimal></gmd:northBoundLatitude>
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
          <gmd:level><gmd:MD_ScopeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_ScopeCode" codeListValue="dataset">dataset</gmd:MD_ScopeCode></gmd:level>
        </gmd:DQ_Scope>
      </gmd:scope>
      <gmd:lineage>
        <gmd:LI_Lineage>
          <gmd:statement><gco:CharacterString>${escapeXML(ficha.linaje.declaracion)} | Fecha: ${ficha.linaje.fechaConsulta}</gco:CharacterString></gmd:statement>
        </gmd:LI_Lineage>
      </gmd:lineage>
    </gmd:DQ_DataQuality>
  </gmd:dataQualityInfo>
</gmd:MD_Metadata>`;
  }

  function escapeXML(cadena) {
    if (!cadena) return '';
    return String(cadena)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function guardarFichaLocal(ficha) {
    const fichas = JSON.parse(localStorage.getItem(CLAVE_ALMACENAMIENTO) || '[]');
    fichas.push(ficha);
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(fichas));
  }

  function exportarComoArchivoJSON(ficha) {
    const blob = new Blob([JSON.stringify(ficha, null, 2)], { type: 'application/json' });
    descargarBlob(blob, `metadatos-iso19115-${slugify(ficha.identificacion.titulo)}.json`);
  }

  function exportarComoArchivoXML(ficha) {
    const xml = generarXMLISO19139(ficha);
    const blob = new Blob([xml], { type: 'application/xml; charset=utf-8' });
    descargarBlob(blob, `metadatos-iso19139-idechile-${slugify(ficha.identificacion.titulo)}.xml`);
  }

  function descargarBlob(blob, nombreArchivo) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);
  }

  function slugify(texto) {
    return (texto || 'ficha')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 45);
  }

  return {
    construirFicha,
    generarXMLISO19139,
    guardarFichaLocal,
    exportarComoArchivoJSON,
    exportarComoArchivoXML
  };
})();

if (typeof window !== 'undefined') {
  window.ModuloMetadatos = ModuloMetadatos;
}
