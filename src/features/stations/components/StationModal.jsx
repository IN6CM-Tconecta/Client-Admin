import { useEffect, useState } from "react";
import { useStationsStore } from "../stationsStore.js";

export const StationModal = ({ isOpen, onClose, station }) => {
  const { createStation, updateStation } = useStationsStore();
  const [formData, setFormData] = useState({
    name: "",
    stationCode: "",
    typeStation: "CENTRALES",
    longitude: "-90.5132",
    latitude: "14.6407",
  });
  const [submitting, setSubmitting] = useState(false);

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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const lon = parseFloat(formData.longitude);
      const lat = parseFloat(formData.latitude);

      if (isNaN(lon) || isNaN(lat)) {
        throw new Error("La longitud y latitud deben ser valores numéricos válidos");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-pale-blue/30 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-main-blue text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">
            {station ? "Editar Estación" : "Nueva Estación / Parada"}
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
              Nombre de la Estación
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Estación El Trébol"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
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
                placeholder="Ej. EST-01, EST-12"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none uppercase disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                Tipo de Estación
              </label>
              <select
                value={formData.typeStation}
                onChange={(e) => setFormData({ ...formData, typeStation: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
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
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                Longitud (Lon)
              </label>
              <input
                type="text"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="-90.5132"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                Latitud (Lat)
              </label>
              <input
                type="text"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="14.6407"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
              />
            </div>
          </div>

          {/* Actions */}
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
              {submitting ? "Guardando..." : station ? "Actualizar" : "Crear Estación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
