import { useEffect, useState } from "react";
import { useAlertsStore } from "../alertsStore.js";
import { AlertModal } from "./AlertModal.jsx";

export const Alerts = () => {
  const { alerts, loading, getAlerts, resolveAlert } = useAlertsStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getAlerts();
  }, [getAlerts]);

  const getTypeBadge = (typeAlert) => {
    switch (typeAlert) {
      case "INCIDENT":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800">🚨 INCIDENTE</span>;
      case "MAINTENANCE":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">🛠️ MANTENIMIENTO</span>;
      case "INFO":
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-sky-100 text-sky-800">ℹ️ INFORMACIÓN</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main-blue">Alertas Operativas del Sistema</h1>
          <p className="text-gray-500 text-sm">Emisión de boletines y gestión de incidentes en tiempo real</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-main-green hover:bg-[#3da300] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <span>+</span> Emitir Alerta
        </button>
      </div>

      {/* Grid of Active Alerts */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-xs">Cargando alertas...</div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-xs">
            No hay alertas activas en el sistema actualmente.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="bg-white rounded-xl shadow-md border border-pale-blue/30 p-5 flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getTypeBadge(alert.typeAlert)}
                    <span className="text-xs text-gray-400 font-mono">
                      {new Date(alert.createdAt).toLocaleString("es-GT")}
                    </span>
                  </div>

                  <h3 className="font-bold text-main-blue text-base mb-2">
                    {alert.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {alert.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    ESTADO: {alert.status}
                  </span>

                  <button
                    onClick={() => resolveAlert(alert._id)}
                    className="px-3 py-1 text-xs font-semibold text-white bg-main-blue hover:opacity-90 rounded transition-colors"
                  >
                    Marcar Resuelta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AlertModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
