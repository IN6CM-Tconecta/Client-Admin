import { useEffect, useState, useRef } from "react";
import { useRoadsStore } from "../roadsStore.js";
import { getAllStations } from "../../../shared/api/admin.js";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { X, MapPin } from "lucide-react";

const BlueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const RedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const RoadModal = ({ isOpen, onClose, road }) => {
  const { roads, createRoad, updateRoad } = useRoadsStore();
  const [availableStations, setAvailableStations] = useState([]);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const isFirstRender = useRef(true);
  
  const [formData, setFormData] = useState({
    name: "",
    routeCode: "",
    typeRoad: "CENTRALES",
    originStationId: "",
    destinationStationId: "",
    coordinatesText: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Inicializar estado del modal
  useEffect(() => {
    if (isOpen) {
      isFirstRender.current = true;
      getAllStations({ status: 'ACTIVE' })
        .then((res) => setAvailableStations(res.data || []))
        .catch(() => setAvailableStations([]));

      if (road) {
        const coords = road.path?.coordinates
          ? road.path.coordinates.map((c) => c.join(", ")).join("\n")
          : "";
          
        setFormData({
          name: road.name || "",
          routeCode: road.routeCode || "",
          typeRoad: road.typeRoad || "CENTRALES",
          originStationId: road.stations && road.stations.length >= 1 ? (road.stations[0]._id || road.stations[0]) : "",
          destinationStationId: road.stations && road.stations.length >= 2 ? (road.stations[road.stations.length - 1]._id || road.stations[road.stations.length - 1]) : "",
          coordinatesText: coords,
        });
      } else {
        setFormData({
          name: "",
          routeCode: "",
          typeRoad: "CENTRALES",
          originStationId: "",
          destinationStationId: "",
          coordinatesText: "",
        });
      }
    }
  }, [isOpen, road]);

  // Autogenerar código de ruta cuando cambia el tipo
  useEffect(() => {
    if (isOpen && roads.length >= 0) {
      let prefix = "L";
      if (formData.typeRoad === "EXPRESS") prefix = "EXP-";
      if (formData.typeRoad === "RELEVOS") prefix = "TUBUS-";

      if (!formData.routeCode.startsWith(prefix)) {
        const matchingRoads = roads.filter(r => r.routeCode && r.routeCode.startsWith(prefix));
        let maxNumber = 0;
        matchingRoads.forEach(r => {
          const numStr = r.routeCode.substring(prefix.length);
          const num = parseInt(numStr, 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        });
        const nextNumber = maxNumber + 1;
        setFormData(prev => ({ ...prev, routeCode: `${prefix}${nextNumber}` }));
      }
    }
  }, [isOpen, formData.typeRoad, roads]);

  // Autocalcular ruta cuando se seleccionan origen y destino
  useEffect(() => {
    const calculateRoute = async () => {
      // Evitar autocalcular al abrir el modal si estamos editando (ya tiene coordenadas)
      if (isFirstRender.current && road) {
        isFirstRender.current = false;
        return; 
      }
      isFirstRender.current = false;

      if (!formData.originStationId || !formData.destinationStationId) return;

      if (formData.originStationId === formData.destinationStationId) {
        alert("La estación de origen y destino no pueden ser la misma.");
        setFormData(prev => ({ ...prev, destinationStationId: "", coordinatesText: "", name: "" }));
        return;
      }

      const origin = availableStations.find(s => s._id === formData.originStationId);
      const dest = availableStations.find(s => s._id === formData.destinationStationId);

      if (!origin || !dest) return;

      const originCoords = origin.location?.coordinates;
      const destCoords = dest.location?.coordinates;

      if (!originCoords || !destCoords) {
        alert("Las estaciones seleccionadas no tienen coordenadas válidas.");
        return;
      }

      setCalculatingRoute(true);
      try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoords[0]},${originCoords[1]};${destCoords[0]},${destCoords[1]}?overview=full&geometries=geojson`;
        const res = await fetch(osrmUrl);
        const data = await res.json();
        
        let coordsString = "";
        if (data && data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates;
          coordsString = coords.map(c => `${c[0].toFixed(6)}, ${c[1].toFixed(6)}`).join("\n");
        } else {
          // Fallback a línea recta si falla OSRM
          coordsString = `${originCoords[0]}, ${originCoords[1]}\n${destCoords[0]}, ${destCoords[1]}`;
        }

        let prefix = "Línea";
        if (formData.typeRoad === "EXPRESS") prefix = "Express";
        if (formData.typeRoad === "RELEVOS") prefix = "TuBus";
        
        const generatedName = `${prefix}: ${origin.name} - ${dest.name}`;

        setFormData(prev => ({
          ...prev,
          coordinatesText: coordsString,
          name: generatedName
        }));

      } catch (error) {
        console.error("OSRM Error:", error);
        alert("Hubo un error al calcular la ruta en OSRM.");
      } finally {
        setCalculatingRoute(false);
      }
    };

    calculateRoute();
  }, [formData.originStationId, formData.destinationStationId, formData.typeRoad, availableStations]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (formData.originStationId === formData.destinationStationId) {
        throw new Error("El origen y destino no pueden ser iguales.");
      }

      const lines = formData.coordinatesText.split("\n").filter((l) => l.trim().length > 0);
      const coordinates = lines.map((line) => {
        const parts = line.split(",").map((p) => parseFloat(p.trim()));
        if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
          throw new Error("Formato de coordenadas inválido.");
        }
        return [parts[0], parts[1]];
      });

      if (coordinates.length < 2) {
        throw new Error("Se requiere calcular la ruta entre las estaciones primero.");
      }

      // Validación de ruta duplicada
      const existingRoute = roads.find(r => 
        r.stations?.length >= 2 &&
        (r.stations[0]._id || r.stations[0]) === formData.originStationId &&
        (r.stations[r.stations.length - 1]._id || r.stations[r.stations.length - 1]) === formData.destinationStationId &&
        r._id !== road?._id
      );

      if (existingRoute && existingRoute.routeCode.toUpperCase() === formData.routeCode.toUpperCase()) {
        throw new Error("Esta ruta ya existe (misma conexión de estaciones con este código). Usa un código diferente si deseas crear un servicio paralelo.");
      }

      const payload = {
        name: formData.name,
        routeCode: formData.routeCode.toUpperCase(),
        typeRoad: formData.typeRoad,
        coordinates,
        stations: [formData.originStationId, formData.destinationStationId], // Guardar las paradas
      };

      let result;
      if (road) {
        result = await updateRoad(road._id, payload);
      } else {
        result = await createRoad(payload);
      }

      if (result.success) {
        onClose();
      } else {
        alert(result.message || "Error al guardar");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const parsedPoints = formData.coordinatesText
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .map(line => {
       const parts = line.split(",").map((p) => parseFloat(p.trim()));
       if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
         return [parts[1], parts[0]]; 
       }
       return null;
    })
    .filter(p => p !== null);

  const centerLat = parsedPoints.length > 0 ? parsedPoints[0][0] : 14.6407;
  const centerLng = parsedPoints.length > 0 ? parsedPoints[0][1] : -90.5132;

  const renderMarkers = () => {
    if (parsedPoints.length === 0) return null;
    if (parsedPoints.length === 1) {
      return <Marker position={parsedPoints[0]} icon={BlueIcon} />;
    }
    
    const origin = parsedPoints[0];
    const destination = parsedPoints[parsedPoints.length - 1];
    
    return (
      <>
        <Marker position={origin} icon={BlueIcon} />
        <Marker position={destination} icon={RedIcon} />
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-pale-blue/30 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-main-blue text-white px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">
            {road ? "Editar Ruta" : "Nueva Ruta (Conexión de Estaciones)"}
          </h3>
          <button onClick={onClose} className="text-white hover:text-light-green transition-colors"><X size={24} /></button>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-6">
          <form id="road-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* ESTACIONES (COMBO BOXES) */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-4">
              <h4 className="text-sm font-bold text-main-blue uppercase">Configuración de Tramos</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 flex items-center gap-1">
                    <MapPin size={14} className="text-green-500" /> Estación de Origen
                  </label>
                  <select
                    required
                    value={formData.originStationId}
                    onChange={(e) => setFormData({ ...formData, originStationId: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
                  >
                    <option value="">-- Selecciona una estación --</option>
                    {availableStations.map(s => (
                      <option key={s._id} value={s._id}>{s.stationCode} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 flex items-center gap-1">
                    <MapPin size={14} className="text-red-500" /> Estación de Destino
                  </label>
                  <select
                    required
                    value={formData.destinationStationId}
                    onChange={(e) => setFormData({ ...formData, destinationStationId: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
                  >
                    <option value="">-- Selecciona una estación --</option>
                    {availableStations.map(s => (
                      <option key={s._id} value={s._id} disabled={s._id === formData.originStationId}>
                        {s.stationCode} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                Nombre Generado de la Ruta
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="El nombre se genera automáticamente al elegir las estaciones..."
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none font-semibold text-main-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                  Código de Ruta
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(road)}
                  value={formData.routeCode}
                  onChange={(e) => setFormData({ ...formData, routeCode: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none uppercase disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                  Tipo de Ruta
                </label>
                <select
                  value={formData.typeRoad}
                  onChange={(e) => setFormData({ ...formData, typeRoad: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
                >
                  <option value="CENTRALES">CENTRALES (Troncal)</option>
                  <option value="EXPRESS">EXPRESS (Directo)</option>
                  <option value="RELEVOS">RELEVOS / ALIMENTADORA (TuBus/Transurbano)</option>
                </select>
              </div>
            </div>

            {/* Oculto a menos que se quiera depurar, pero lo dejamos readonly */}
            <div className="hidden">
              <textarea
                value={formData.coordinatesText}
                readOnly
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1 flex items-center justify-between">
                <span>Trazado Inteligente en el Mapa</span>
                {calculatingRoute && <span className="text-main-green animate-pulse">Generando ruta por calles...</span>}
              </label>
              <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm z-0 relative">
                <MapContainer
                  key={`${centerLat}-${centerLng}`} // Fuerza re-render para centrar
                  center={[centerLat, centerLng]}
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                  maxBounds={[[13.73, -92.23], [17.82, -88.22]]}
                  maxBoundsViscosity={1.0}
                  minZoom={7}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {renderMarkers()}
                  {parsedPoints.length >= 2 && (
                    <Polyline positions={parsedPoints} color="#1E3A8A" weight={5} opacity={0.8} />
                  )}
                </MapContainer>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="road-form"
            disabled={submitting || parsedPoints.length < 2 || calculatingRoute}
            className="px-4 py-2 text-sm font-semibold text-white bg-main-green hover:bg-[#3da300] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Guardando..." : road ? "Actualizar Ruta" : "Crear Ruta"}
          </button>
        </div>
      </div>
    </div>
  );
};
