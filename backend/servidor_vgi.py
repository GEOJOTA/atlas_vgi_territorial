#!/usr/bin/env python3
"""
backend/servidor_vgi.py
-----------------------
Servidor backend local para el Atlas de Información Geográfica Voluntaria.
Permite ejecutar la plataforma en local sirviendo la interfaz web y resolviendo
las peticiones a /api/consulta y /api/calidad con reintentos en servidores espejo,
soporte SSL para macOS y caché en disco.

No requiere pip install (utiliza únicamente la biblioteca estándar de Python 3).

Uso:
  python3 backend/servidor_vgi.py
  # Abre automáticamente: http://localhost:8000
"""

import os
import sys
import json
import ssl
import urllib.request
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import hashlib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(BASE_DIR, "src")
DATA_DIR = os.path.join(BASE_DIR, "data")
CACHE_DIR = os.path.join(DATA_DIR, "cache_consultas")
os.makedirs(CACHE_DIR, exist_ok=True)

PUERTO = 8000

OVERPASS_ESPEJOS = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://z.overpass-api.de/api/interpreter"
]

try:
    SSL_CTX = ssl._create_unverified_context()
except Exception:
    SSL_CTX = None

class ManejadorVGI(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SRC_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path == "/api/consulta":
            self.manejar_consulta()
        elif self.path == "/api/calidad":
            self.manejar_calidad()
        else:
            self.send_error(404, "Endpoint de API no encontrado")

    def do_GET(self):
        # Servir datos estáticos adicionales de data/ o docs/ si se solicitan
        if self.path.startswith("/data/"):
            archivo = os.path.join(BASE_DIR, self.path.lstrip("/"))
            if os.path.isfile(archivo):
                self.servir_archivo_externo(archivo, "application/geo+json")
                return
        elif self.path.startswith("/docs/"):
            archivo = os.path.join(BASE_DIR, self.path.lstrip("/"))
            if os.path.isfile(archivo):
                self.servir_archivo_externo(archivo, "application/octet-stream")
                return
        elif self.path == "/api/estado":
            self.responder_json(200, {
                "estado": "operativo",
                "servidor": "Atlas VGI Backend Local (Python 3)",
                "puerto": PUERTO,
                "endpoints_espejo_overpass": len(OVERPASS_ESPEJOS),
                "cache_activa": True
            })
            return

        super().do_GET()

    def servir_archivo_externo(self, ruta, mime_type):
        try:
            with open(ruta, "rb") as f:
                contenido = f.read()
            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(len(contenido)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(contenido)
        except Exception as e:
            self.send_error(500, f"Error leyendo archivo: {e}")

    def responder_json(self, status, objeto):
        cuerpo = json.dumps(objeto, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(cuerpo)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(cuerpo)

    def leer_body_json(self):
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0:
            return {}
        try:
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            return {}

    def manejar_consulta(self):
        body = self.leer_body_json()
        bbox = body.get("bbox")
        if not bbox or len(bbox) != 4:
            self.responder_json(400, {"error": "Se requiere bbox [oeste, sur, este, norte]"})
            return

        oeste, sur, este, norte = bbox
        bbox_str = f"{sur},{oeste},{norte},{este}"

        clave = body.get("clave", "")
        valor = body.get("valor", "")
        operador = body.get("operador", "=")
        entidad = body.get("entidad", "nwr")
        ql_custom = body.get("queryPersonalizada", "")

        if ql_custom:
            cuerpo_ql = ql_custom.replace("{{bbox}}", bbox_str)
        else:
            if clave and valor:
                if operador == "~":
                    filtro = f'["{clave}"~"{valor}"]'
                elif operador == "!=":
                    filtro = f'["{clave}"!="{valor}"]'
                else:
                    filtro = f'["{clave}"="{valor}"]'
            elif clave:
                filtro = f'["{clave}"]'
            else:
                filtro = '["amenity"]'
            cuerpo_ql = f"{entidad}{filtro}({bbox_str});"

        query_overpass = f"""
        [out:json][timeout:35];
        (
          {cuerpo_ql}
        );
        out center tags qt 350;
        """

        # Verificar caché en disco
        clave_cache = hashlib.md5(query_overpass.encode("utf-8")).hexdigest()
        archivo_cache = os.path.join(CACHE_DIR, f"{clave_cache}.json")

        if os.path.isfile(archivo_cache):
            try:
                with open(archivo_cache, "r", encoding="utf-8") as f:
                    datos_cache = json.load(f)
                self.responder_json(200, {
                    "ok": True,
                    "desdeCache": True,
                    "total": datos_cache.get("total", 0),
                    "geojson": datos_cache.get("geojson", {}),
                    "servidor": "Caché local"
                })
                return
            except Exception:
                pass

        # Consultar espejos
        data_encoded = urllib.parse.urlencode({"data": query_overpass}).encode("utf-8")
        elementos = None
        servidor_usado = None

        for srv in OVERPASS_ESPEJOS:
            try:
                req = urllib.request.Request(
                    srv,
                    data=data_encoded,
                    headers={"User-Agent": "AtlasVGI-LocalBackend/1.0"}
                )
                with urllib.request.urlopen(req, timeout=40, context=SSL_CTX) as res:
                    if res.status == 200:
                        data = json.loads(res.read().decode("utf-8"))
                        elementos = data.get("elements", [])
                        servidor_usado = srv
                        break
            except Exception as e:
                print(f"[!] Falló espejo {srv}: {e}")
                continue

        if elementos is None:
            self.responder_json(502, {"ok": False, "error": "Overpass temporalmente no disponible en todos los espejos"})
            return

        geojson = self.elementos_a_geojson(elementos, body.get("nombreConsulta", "personalizada"))

        # Guardar en caché
        try:
            with open(archivo_cache, "w", encoding="utf-8") as f:
                json.dump({"total": len(elementos), "geojson": geojson}, f, ensure_ascii=False)
        except Exception:
            pass

        self.responder_json(200, {
            "ok": True,
            "desdeCache": False,
            "servidor": servidor_usado,
            "total": len(elementos),
            "geojson": geojson,
            "consulta": query_overpass
        })

    def manejar_calidad(self):
        body = self.leer_body_json()
        bbox = body.get("bbox")
        filtro = body.get("filtro", "building=* and type:way")

        if not bbox or len(bbox) != 4:
            self.responder_json(400, {"error": "Bbox requerido"})
            return

        base = "https://api.ohsome.org/v1"
        bboxes_str = ",".join(str(x) for x in bbox)

        try:
            # Obtener fecha máxima
            meta_req = urllib.request.Request(f"{base}/metadata", headers={"User-Agent": "AtlasVGI/1.0"})
            with urllib.request.urlopen(meta_req, timeout=15, context=SSL_CTX) as res:
                meta = json.loads(res.read().decode("utf-8"))
                fecha_fin = meta.get("extractRegion", {}).get("temporalExtent", {}).get("toTimestamp", "2026-06-01")[:10]
        except Exception:
            fecha_fin = "2026-06-01"

        anio_fin = int(fecha_fin[:4])
        ventana = f"{anio_fin - 5}-01-01/{fecha_fin}/P1Y"

        def post_ohsome(endpoint, time_param):
            p = urllib.parse.urlencode({
                "bboxes": bboxes_str,
                "filter": filtro,
                "time": time_param
            }).encode("utf-8")
            req = urllib.request.Request(f"{base}{endpoint}", data=p, headers={"User-Agent": "AtlasVGI/1.0"})
            with urllib.request.urlopen(req, timeout=25, context=SSL_CTX) as res:
                return json.loads(res.read().decode("utf-8"))

        try:
            f_lower = filtro.lower()
            tipo_geo = "punto"
            if any(k in f_lower for k in ["highway", "cycleway", "footway", "waterway", "path"]):
                tipo_geo = "linea"
            elif any(k in f_lower for k in ["building", "leisure", "landuse"]):
                tipo_geo = "poligono"

            conteo = post_ohsome("/elements/count", fecha_fin)
            usuarios = post_ohsome("/users/count", ventana)
            serie = post_ohsome("/elements/count", ventana)

            res_especial = None
            if tipo_geo == "linea":
                try:
                    res_especial = post_ohsome("/elements/length", fecha_fin)
                except Exception:
                    pass
            elif tipo_geo == "poligono":
                try:
                    res_especial = post_ohsome("/elements/area", fecha_fin)
                except Exception:
                    pass

            res_contrib = None
            try:
                res_contrib = post_ohsome("/contributions/count", ventana)
            except Exception:
                pass

            elem_ahora = int(conteo.get("result", [{}])[0].get("value", 0))

            oeste, sur, este, norte = bbox
            km_lat = 111.32
            lat_media = ((sur + norte) / 2) * 3.14159265 / 180
            km_lon = 111.32 * abs(lat_media)
            area_calc = abs(este - oeste) * 111.32 * abs(norte - sur) * 111.32

            metrica_geom = None
            if tipo_geo == "linea" and res_especial and res_especial.get("result"):
                val_m = res_especial["result"][0].get("value", 0)
                metrica_geom = {"tipo": "longitud", "etiqueta": "Longitud de red trazada", "valorKm": round(val_m / 1000, 2), "unidad": "km"}
            elif tipo_geo == "poligono" and res_especial and res_especial.get("result"):
                val_m2 = res_especial["result"][0].get("value", 0)
                metrica_geom = {"tipo": "superficie", "etiqueta": "Superficie total cubierta", "valorM2": round(val_m2), "valorKm2": round(val_m2 / 1000000, 4), "unidad": "m²"}

            lista_usr = [{"fecha": (r.get("fromTimestamp") or r.get("timestamp") or "")[:10], "valor": int(r.get("value", 0))} for r in usuarios.get("result", [])]
            lista_contrib = [{"fecha": (r.get("fromTimestamp") or r.get("timestamp") or "")[:10], "valor": int(r.get("value", 0))} for r in (res_contrib.get("result", []) if res_contrib else [])]
            ult_usr = lista_usr[-1]["valor"] if lista_usr else 0
            ult_ctb = lista_contrib[-1]["valor"] if lista_contrib else 0
            ratio = round(ult_ctb / ult_usr, 1) if ult_usr > 0 else None

            self.responder_json(200, {
                "ok": True,
                "fechaCorte": fecha_fin,
                "tipoGeometria": tipo_geo,
                "elementosAhora": elem_ahora,
                "metricaGeometrica": metrica_geom,
                "densidad": round(elem_ahora / area_calc, 2) if area_calc > 0 else None,
                "areaKm2": round(area_calc, 3),
                "ratioContribucionPorUsuario": ratio,
                "usuariosPorAnio": lista_usr,
                "elementosPorAnio": [{"fecha": (r.get("fromTimestamp") or r.get("timestamp") or "")[:10], "valor": int(r.get("value", 0))} for r in serie.get("result", [])],
                "contribucionesPorAnio": lista_contrib,
                "referencias": [
                    {"autor": "HeiGIT / Heidelberg University", "url": "https://docs.ohsome.org/ohsome-api/v1/"},
                    {"autor": "Raifer et al. (2019)", "doi": "10.1186/s40965-019-0061-3"}
                ]
            })
        except Exception as e:
            self.responder_json(500, {"ok": False, "error": str(e)})

    def elementos_a_geojson(self, elementos, nombre):
        features = []
        for el in elementos:
            lat = el.get("lat") or (el.get("center", {}).get("lat") if "center" in el else None)
            lon = el.get("lon") or (el.get("center", {}).get("lon") if "center" in el else None)
            if not lat or not lon:
                continue
            tags = el.get("tags", {})
            nom = tags.get("name") or tags.get("name:es") or "Sin denominación"
            subtipo = tags.get("amenity") or tags.get("shop") or tags.get("highway") or tags.get("historic") or "Elemento VGI"
            features.append({
                "type": "Feature",
                "id": f"{el.get('type')}/{el.get('id')}",
                "geometry": {"type": "Point", "coordinates": [lon, lat]},
                "properties": {
                    "id_vgi": f"OSM/{el.get('type')}/{el.get('id')}",
                    "subtipo": subtipo,
                    "nombre": nom,
                    "operador": tags.get("operator"),
                    "direccion": f"{tags.get('addr:street', '')} {tags.get('addr:housenumber', '')}".strip() or None,
                    "accesibilidad": tags.get("wheelchair"),
                    "fuente": "OpenStreetMap",
                    "licencia": "ODbL 1.0",
                    "tags": tags
                }
            })
        return {
            "type": "FeatureCollection",
            "name": f"Consulta_{nombre}",
            "features": features
        }

def iniciar():
    os.chdir(SRC_DIR)
    servidor = HTTPServer(("127.0.0.1", PUERTO), ManejadorVGI)
    print("==========================================================================")
    print("   ATLAS DE INFORMACIÓN GEOGRÁFICA VOLUNTARIA — BACKEND LOCAL OPERATIVO")
    print("==========================================================================")
    print(f"[*] Servidor web y API disponible en: http://localhost:{PUERTO}")
    print(f"[*] API /api/consulta: Consultas espaciales Overpass activas")
    print(f"[*] API /api/calidad: Métricas históricas ohsome activas")
    print(f"[*] Caché de consultas en: {CACHE_DIR}")
    print("Presiona Ctrl+C para detener el servidor.\n")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Deteniendo servidor...")
        servidor.server_close()

if __name__ == "__main__":
    iniciar()
