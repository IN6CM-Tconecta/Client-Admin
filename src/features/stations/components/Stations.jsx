import { useEffect, useState } from "react";
import { useStationsStore } from "../stationsStore.js";
import { StationModal } from "./StationModal.jsx";

export const Stations = () => {
  const { stations, loading, getStations, changeStatus } = useStationsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    getStations({ status: statusFilter, typeStation: typeFilter });
  }, [statusFilter, typeFilter, getStations]);

  const handleOpenCreate = () => {
    setSelectedStation(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (st) => {
    setSelectedStation(st);
    setModalOpen(true);
  };

  const handleToggleStatus = async (st) => {
    const nextStatus = st.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await changeStatus(st._id || st.stationCode, nextStatus);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">ACTIVE</span>;
      case "INACTIVE":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">INACTIVE</span>;
      case "MAINTENANCE":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">MAINTENANCE</span>;
      case "CLOSED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">CLOSED</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main-blue">Gestión de Estaciones y Paradas</h1>
          <p className="text-gray-500 text-sm">Administración geoespacial de estaciones del sistema</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-main-green hover:bg-[#3da300] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <span>+</span> Nueva Estación
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-pale-blue/30 p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-xs font-bold text-main-blue uppercase">Filtros:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-main-green"
          >
            <option value="">Todos los Estados</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-main-green"
          >
            <option value="">Todos los Tipos</option>
            <option value="CENTRALES">CENTRALES</option>
            <option value="CARRIL LATERAL">CARRIL LATERAL</option>
            <option value="TRASBORDO">TRASBORDO</option>
            <option value="TERMINALES">TERMINALES</option>
          </select>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Total: {stations.length} estaciones encontradas
        </span>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando estaciones...</div>
        ) : stations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron estaciones registradas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-pale-blue/20 text-xs font-bold text-main-blue uppercase">
                  <th className="px-6 py-3">Código</th>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Coordenadas (Lon, Lat)</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {stations.map((st) => (
                  <tr key={st._id || st.stationCode} className="hover:bg-light-green/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-main-blue">
                      {st.stationCode}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {st.name}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                      {st.typeStation}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {st.location?.coordinates
                        ? `${st.location.coordinates[0]}, ${st.location.coordinates[1]}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(st.status)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(st)}
                        className="px-3 py-1 text-xs font-semibold text-main-blue bg-pale-blue/20 hover:bg-pale-blue/40 rounded transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleStatus(st)}
                        className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      >
                        {st.status === "ACTIVE" ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <StationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        station={selectedStation}
      />
    </div>
  );
};
