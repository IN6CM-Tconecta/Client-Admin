import { useEffect, useState } from "react";
import { useRoadsStore } from "../roadsStore.js";
import { getAllStations } from "../../../shared/api/admin.js";

export const RoadModal = ({ isOpen, onClose, road }) => {
  const { createRoad, updateRoad } = useRoadsStore();
  const [availableStations, setAvailableStations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    routeCode: "",
    typeRoad: "CENTRALES",
    coordinatesText: "-90.5132, 14.6407\n-90.5188, 14.6350",
    selectedStations: [],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch stations for selection
      getAllStations()
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
          coordinatesText: coords,
          selectedStations: road.stations?.map((s) => s._id || s) || [],
        });
      } else {
        setFormData({
          name: "",
          routeCode: "",
          typeRoad: "CENTRALES",
          coordinatesText: "-90.5132, 14.6407\n-90.5188, 14.6350",
          selectedStations: [],
        });
      }
    }
  }, [isOpen, road]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Parse coordinates lines into [[lon, lat], [lon, lat]]
      const lines = formData.coordinatesText.split("\n").filter((l) => l.trim().length > 0);
      const coordinates = lines.map((line) => {
        const parts = line.split(",").map((p) => parseFloat(p.trim()));
        if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
          throw new Error("Formato de coordenadas inválido. Debe ser: longitud, latitud en cada línea");
        }
        return [parts[0], parts[1]];
      });

      if (coordinates.length < 2) {
        throw new Error("Una ruta debe contener al menos 2 puntos de coordenadas");
      }

      const payload = {
        name: formData.name,
        routeCode: formData.routeCode.toUpperCase(),
        typeRoad: formData.typeRoad,
        coordinates,
        stations: formData.selectedStations,
      };

      let result;
      if (road) {
        result = await updateRoad(road._id, payload);
      } else {
        result = await createRoad(payload);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-pale-blue/30 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-main-blue text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">
            {road ? "Editar Ruta" : "Nueva Ruta de Transporte"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-light-green text-xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
              Nombre de la Ruta
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Linea 1 Trébol - Centro Histórico"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
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
                placeholder="Ej. L1, L12, TUBUS-1"
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

          <div>
            <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
              Coordenadas GeoJSON LineString (Longitud, Latitud por línea)
            </label>
            <textarea
              rows={4}
              required
              value={formData.coordinatesText}
              onChange={(e) => setFormData({ ...formData, coordinatesText: e.target.value })}
              placeholder="-90.5132, 14.6407&#10;-90.5188, 14.6350"
              className="w-full px-3 py-2 text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Mínimo 2 puntos. Formato: `longitud, latitud` en cada renglón.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-main-green hover:bg-[#3da300] rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "Guardando..." : road ? "Actualizar Ruta" : "Crear Ruta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
