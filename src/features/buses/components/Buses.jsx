import { useEffect, useState } from "react";
import { useBusesStore } from "../busesStore.js";
import { BusModal } from "./BusModal.jsx";

export const Buses = () => {
  const { buses, loading, fetchBuses, changeBusStatus } = useBusesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  const handleCreate = () => {
    setSelectedBus(null);
    setIsModalOpen(true);
  };

  const handleEdit = (bus) => {
    setSelectedBus(bus);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (bus) => {
    const newStatus = bus.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    changeBusStatus(bus._id, newStatus);
  };

  const handleMaintenance = (bus) => {
    changeBusStatus(bus._id, "MAINTENANCE");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-main-blue">Gestión de Flota (Buses)</h1>
          <p className="text-gray-500 text-sm mt-1">Administra los vehículos y asígnalos a rutas operativas.</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-main-green hover:bg-[#3da300] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          + Nuevo Bus
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-pale-blue/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-main-blue border-b border-pale-blue/30">
              <tr>
                <th className="px-6 py-4 font-semibold">Código</th>
                <th className="px-6 py-4 font-semibold">Placa</th>
                <th className="px-6 py-4 font-semibold">Capacidad</th>
                <th className="px-6 py-4 font-semibold">Ruta Asignada</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Cargando flota de buses...
                  </td>
                </tr>
              ) : buses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No hay buses registrados en el sistema.
                  </td>
                </tr>
              ) : (
                buses.map((bus) => (
                  <tr key={bus._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-main-blue">{bus.busNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono text-xs font-bold border border-gray-200">
                        {bus.licensePlate}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {bus.capacity} pax
                    </td>
                    <td className="px-6 py-4">
                      {bus.assignedRoad ? (
                        <span className="text-main-blue font-medium bg-pale-blue/20 px-2 py-1 rounded-md text-xs">
                          {bus.assignedRoad.routeCode}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          bus.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : bus.status === "MAINTENANCE"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {bus.status === "ACTIVE" ? "Operativo" : bus.status === "MAINTENANCE" ? "En Taller" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {bus.status !== "MAINTENANCE" && (
                          <button
                            onClick={() => handleMaintenance(bus)}
                            className="text-xs text-yellow-600 hover:text-yellow-800 bg-yellow-50 px-2 py-1 rounded transition-colors font-medium"
                            title="Enviar a Mantenimiento"
                          >
                            Taller
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStatus(bus)}
                          className={`text-xs px-2 py-1 rounded transition-colors font-medium ${
                            bus.status === "ACTIVE"
                              ? "text-red-600 hover:text-red-800 bg-red-50"
                              : "text-green-600 hover:text-green-800 bg-green-50"
                          }`}
                        >
                          {bus.status === "ACTIVE" ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          onClick={() => handleEdit(bus)}
                          className="text-xs text-main-blue hover:text-blue-800 bg-blue-50 px-2 py-1 rounded transition-colors font-medium"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bus={selectedBus}
      />
    </div>
  );
};
