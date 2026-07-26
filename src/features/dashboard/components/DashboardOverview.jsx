import { useEffect, useState } from "react";
import { getRoads, getStations, getAlerts } from "../../../shared/api/admin.js";

export const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalRoads: 0,
    totalStations: 0,
    totalAlerts: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [roadsRes, stationsRes, alertsRes] = await Promise.allSettled([
          getRoads({ limit: 1 }),
          getStations({ limit: 1 }),
          getAlerts(),
        ]);

        const totalRoads =
          roadsRes.status === "fulfilled"
            ? roadsRes.value?.summary?.totalRoads || 0
            : 0;

        const totalStations =
          stationsRes.status === "fulfilled"
            ? stationsRes.value?.pagination?.totalRecords || 0
            : 0;

        const totalAlerts =
          alertsRes.status === "fulfilled"
            ? alertsRes.value?.total || alertsRes.value?.data?.length || 0
            : 0;

        setStats({
          totalRoads,
          totalStations,
          totalAlerts,
          loading: false,
          error: null,
        });
      } catch (err) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Error al cargar estadísticas del sistema.",
        }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-main-blue">
          Panel de Control T-Conecta
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenido al centro de administración del sistema de transporte público.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Rutas */}
        <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Rutas Registradas</p>
            <h3 className="text-3xl font-extrabold text-main-blue mt-2">
              {stats.loading ? "..." : stats.totalRoads}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-main-blue/10 text-main-blue flex items-center justify-center font-bold text-xl">
            🚌
          </div>
        </div>

        {/* Card 2: Estaciones */}
        <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Estaciones Activas</p>
            <h3 className="text-3xl font-extrabold text-main-green mt-2">
              {stats.loading ? "..." : stats.totalStations}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-main-green/10 text-main-green flex items-center justify-center font-bold text-xl">
            🚏
          </div>
        </div>

        {/* Card 3: Alertas */}
        <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Alertas Operativas</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-2">
              {stats.loading ? "..." : stats.totalAlerts}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">
            ⚠️
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 p-6">
        <h2 className="text-lg font-bold text-main-blue mb-3">
          Resumen del Sistema Integrado
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          TConecta gestiona la infraestructura central de transporte multimodal de la Ciudad de Guatemala.
          Utiliza la barra lateral para administrar rutas (Troncales y Auxiliares TuBus/Transurbano), paradas/estaciones,
          alertas del sistema y cuentas de usuario.
        </p>
      </div>
    </div>
  );
};
