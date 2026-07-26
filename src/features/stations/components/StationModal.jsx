import { useEffect, useState } from "react";
import { useStationsStore } from "../stationsStore.js";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { X, Search, MapPin } from "lucide-react";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapClickHandler = ({ setFormData, setFetchingName }) => {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);

      setFormData((prev) => ({
        ...prev,
        latitude: String(lat),
        longitude: String(lng),
      }));

      // Obtener nombre con Nominatim
      setFetchingName(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`);
        const data = await res.json();
        const street = data.address?.road || data.address?.suburb || data.address?.city || "Desconocido";
        setFormData((prev) => ({
          ...prev,
          name: prev.name === "" || prev.name.startsWith("Estación") ? `Estación ${street}` : prev.name
        }));
      } catch (error) {
        console.error("Nominatim Error:", error);
      } finally {
        setFetchingName(false);
      }
    },
  });
  return null;
};

const MapCenterUpdater = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 16);
    }
  }, [lat, lng, map]);
  return null;
};

export const StationModal = ({ isOpen, onClose, station }) => {
  const { stations, createStation, updateStation } = useStationsStore();
  const [fetchingName, setFetchingName] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    stationCode: "",
    typeStation: "CENTRALES",
    longitude: "-90.5132",
    latitude: "14.6407",
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (station) {
        const coords = station.location?.coordinates || [-90.5132, 14.6407];
        setFormData({
          name: station.name || "",
          stationCode: station.stationCode || "",
          typeStation: station.typeStation || "CENTRALES",
          longitude: String(coords[0]),
          latitude: String(coords[1]),
        });
      } else {
        setFormData({
          name: "",
          stationCode: "",
          typeStation: "CENTRALES",
          longitude: "-90.5132",
          latitude: "14.6407",
        });
      }
    }
  }, [isOpen, station]);

  // Autogenerar código de estación
  useEffect(() => {
    if (isOpen && !station && stations && stations.length >= 0) {
      let maxNumber = 0;
      stations.forEach(s => {
        if (s.stationCode && s.stationCode.startsWith("EST-")) {
          const numStr = s.stationCode.substring(4);
          const num = parseInt(numStr, 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      });
      setFormData(prev => ({ ...prev, stationCode: `EST-${maxNumber + 1}` }));
    }
  }, [isOpen, station, stations]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const lon = parseFloat(formData.longitude);
      const lat = parseFloat(formData.latitude);

      if (isNaN(lon) || isNaN(lat)) {
        throw new Error("La longitud y latitud deben ser numéricas");
      }

      const payload = {
        name: formData.name,
        stationCode: formData.stationCode.toUpperCase(),
        typeStation: formData.typeStation,
        coordinates: [lon, lat],
      };

      let result;
      if (station) {
        result = await updateStation(station._id, payload);
      } else {
        result = await createStation(payload);
      }

      if (result.success) {
        onClose();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&countrycodes=gt&format=json&limit=5`);
      const data = await response.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("Geocoding error", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = (result) => {
    const lat = parseFloat(result.lat).toFixed(6);
    const lng = parseFloat(result.lon).toFixed(6);
    const nameStr = result.name || result.display_name.split(',')[0];
    setFormData((prev) => ({
      ...prev,
      latitude: String(lat),
      longitude: String(lng),
      name: `Estación ${nameStr}`
    }));
    setSearchResults([]);
    setSearchQuery("");
  };

  const currentLat = parseFloat(formData.latitude) || 14.6407;
  const currentLng = parseFloat(formData.longitude) || -90.5132;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-pale-blue/30 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-main-blue text-white px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">
            {station ? "Editar Estación" : "Nueva Estación"}
          </h3>
          <button onClick={onClose} className="text-white hover:text-light-green transition-colors"><X size={24} /></button>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-6">
          <form id="station-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1 flex justify-between">
                <span>Nombre de la Estación</span>
                {fetchingName && <span className="text-main-green animate-pulse">Obteniendo calle...</span>}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Estación El Trébol"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                  Código de Estación
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(station)}
                  value={formData.stationCode}
                  onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                  placeholder="Ej. EST-1"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none uppercase disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                  Tipo de Estación
                </label>
                <select
                  value={formData.typeStation}
                  onChange={(e) => setFormData({ ...formData, typeStation: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none"
                >
                  <option value="CENTRALES">CENTRALES</option>
                  <option value="CARRIL LATERAL">CARRIL LATERAL</option>
                  <option value="TRASBORDO">TRASBORDO</option>
                  <option value="TERMINALES">TERMINALES</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-main-blue uppercase mb-1">Longitud</label>
                <input type="text" readOnly value={formData.longitude} className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-main-blue uppercase mb-1">Latitud</label>
                <input type="text" readOnly value={formData.latitude} className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">Ubicación en el Mapa</label>
              <p className="text-xs text-gray-500 mb-2">Busca una dirección o haz clic directamente en el mapa para obtener el nombre de la calle y coordenadas.</p>
              
              {/* Buscador de Direcciones */}
              <div className="relative mb-3 flex gap-2">
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch(e);
                      }
                   }}
                   placeholder="Ej. Palacio Nacional..." 
                   className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 outline-none"
                 />
                 <button 
                   type="button" 
                   onClick={handleSearch} 
                   disabled={searching}
                   className="px-4 py-2 bg-light-green/20 text-main-green rounded-lg hover:bg-light-green/40 transition-colors flex items-center justify-center"
                 >
                   {searching ? "..." : <Search size={18} />}
                 </button>
                 
                 {/* Resultados Desplegables */}
                 {searchResults.length > 0 && (
                   <div className="absolute top-full left-0 right-14 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden z-20 max-h-48 overflow-y-auto">
                      {searchResults.map((result, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleSelectResult(result)}
                          className="px-3 py-2 text-xs hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-start gap-2"
                        >
                          <MapPin size={14} className="text-main-green shrink-0 mt-0.5" />
                          <span>{result.display_name}</span>
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200 z-0 relative">
                <MapContainer
                  center={[currentLat, currentLng]}
                  zoom={14}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                  maxBounds={[[13.73, -92.23], [17.82, -88.22]]}
                  maxBoundsViscosity={1.0}
                  minZoom={7}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[currentLat, currentLng]} />
                  <MapClickHandler setFormData={setFormData} setFetchingName={setFetchingName} />
                  <MapCenterUpdater lat={currentLat} lng={currentLng} />
                </MapContainer>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg">Cancelar</button>
          <button type="submit" form="station-form" disabled={submitting} className="px-4 py-2 text-sm font-semibold text-white bg-main-green rounded-lg disabled:opacity-50">
            {submitting ? "Guardando..." : station ? "Actualizar" : "Crear Estación"}
          </button>
        </div>
      </div>
    </div>
  );
};
