import { useEffect, useState } from "react";
import { useBusesStore } from "../busesStore.js";
import { axiosAdmin } from "../../../shared/api/api.js";
import { X } from "lucide-react";

export const BusModal = ({ isOpen, onClose, bus }) => {
  const { buses, createBus, updateBus } = useBusesStore();
  const [availableRoads, setAvailableRoads] = useState([]);
  const [formData, setFormData] = useState({
    busNumber: "",
    licensePlate: "",
    capacity: 80,
    assignedRoad: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Cargar rutas para el dropdown
  useEffect(() => {
    if (isOpen) {
      axiosAdmin.get("/roads")
        .then((res) => {
          if (res.data && res.data.data) {
            setAvailableRoads(res.data.data);
          }
        })
        .catch(() => setAvailableRoads([]));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (bus) {
        setFormData({
          busNumber: bus.busNumber || "",
          licensePlate: bus.licensePlate || "",
          capacity: bus.capacity || 80,
          assignedRoad: bus.assignedRoad?._id || bus.assignedRoad || "",
        });
      } else {
        setFormData({
          busNumber: "",
          licensePlate: "",
          capacity: 80,
          assignedRoad: "",
        });
      }
    }
  }, [isOpen, bus]);

  // Autogenerar código de bus para nuevos buses
  useEffect(() => {
    if (isOpen && !bus && buses.length >= 0) {
      let maxNumber = 0;
      buses.forEach(b => {
        if (b.busNumber && b.busNumber.startsWith("BUS-")) {
          const num = parseInt(b.busNumber.substring(4), 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      });
      setFormData(prev => ({ ...prev, busNumber: `BUS-${maxNumber + 1}` }));
    }
  }, [isOpen, bus, buses]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        busNumber: formData.busNumber.toUpperCase(),
        licensePlate: formData.licensePlate.toUpperCase(),
        capacity: Number(formData.capacity),
        assignedRoad: formData.assignedRoad || null,
      };

      let result;
      if (bus) {
        result = await updateBus(bus._id, payload);
      } else {
        result = await createBus(payload);
      }

      if (result.success) {
        onClose();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-pale-blue/30 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-main-blue text-white px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">
            {bus ? "Editar Bus" : "Nuevo Bus"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-light-green transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form id="bus-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                Número / Código de Bus
              </label>
              <input
                type="text"
                required
                disabled={Boolean(bus)}
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                placeholder="Ej. BUS-1"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none uppercase disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                Placa (Guatemala)
              </label>
              <input
                type="text"
                required
                disabled={Boolean(bus)}
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                placeholder="Ej. U0123BCC o C456DEF"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none uppercase disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-400 mt-1">Formato: Letra (U,C,P) + 3 o 4 Números + 3 Letras</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                Capacidad de Pasajeros
              </label>
              <input
                type="number"
                required
                disabled={Boolean(bus)}
                min={10}
                max={200}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                Asignar a Ruta (Opcional)
              </label>
              <select
                value={formData.assignedRoad}
                onChange={(e) => setFormData({ ...formData, assignedRoad: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
              >
                <option value="">-- Sin ruta asignada --</option>
                {availableRoads.map((road) => (
                  <option key={road._id} value={road._id}>
                    {road.routeCode} - {road.name}
                  </option>
                ))}
              </select>
            </div>
            
          </form>
        </div>

        {/* Footer */}
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
            form="bus-form"
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-white bg-main-green hover:bg-[#3da300] rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? "Guardando..." : bus ? "Actualizar Bus" : "Crear Bus"}
          </button>
        </div>
      </div>
    </div>
  );
};
