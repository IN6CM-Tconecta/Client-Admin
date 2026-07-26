import { useEffect, useState } from "react";
import { getRoads, getStations, getAlerts } from "../../../shared/api/admin.js";
import { axiosAdmin } from "../../../shared/api/api.js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Route, MapPin, Bus, AlertTriangle } from "lucide-react";

export const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalRoads: 0,
    totalStations: 0,
    totalAlerts: 0,
    totalBuses: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [roadsRes, stationsRes, alertsRes, busesRes] = await Promise.allSettled([
          getRoads({ limit: 1 }),
          getStations({ limit: 1, status: 'ACTIVE' }),
          getAlerts(),
          axiosAdmin.get('/buses', { params: { limit: 1 } })
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

        const totalBuses =
          busesRes.status === "fulfilled"
            ? busesRes.value?.data?.summary?.totalBuses || busesRes.value?.data?.data?.length || 0
            : 0;

        setStats({
          totalRoads,
          totalStations,
          totalAlerts,
          totalBuses,
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

  const chartData = [
    { name: "Rutas", value: stats.totalRoads, fill: "#003A70" },
    { name: "Estaciones", value: stats.totalStations, fill: "#84BD00" },
    { name: "Buses", value: stats.totalBuses, fill: "#4F46E5" },
    { name: "Alertas", value: stats.totalAlerts, fill: "#D97706" },
  ];

  const pieColors = ["#003A70", "#84BD00", "#4F46E5", "#D97706"];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Rutas */}
        <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Rutas Registradas</p>
            <h3 className="text-3xl font-extrabold text-main-blue mt-2">
              {stats.loading ? "..." : stats.totalRoads}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-main-blue/10 text-main-blue flex items-center justify-center font-bold text-xl">
            <Route size={24} />
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
            <MapPin size={24} />
          </div>
        </div>

        {/* Card 3: Buses */}
        <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Flota de Buses</p>
            <h3 className="text-3xl font-extrabold text-[#4F46E5] mt-2">
              {stats.loading ? "..." : stats.totalBuses}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center font-bold text-xl">
            <Bus size={24} />
          </div>
        </div>

        {/* Card 4: Alertas */}
        <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">Alertas Operativas</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-2">
              {stats.loading ? "..." : stats.totalAlerts}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">
            <AlertTriangle size={24} />
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
          Utiliza la barra lateral para administrar rutas (Troncales y Auxiliares TuBus/Transurbano), estaciones, la flota de buses y alertas operativas.
        </p>
      </div>

      {/* Charts Section */}
      {!stats.loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 p-6 h-[400px]">
            <h3 className="text-lg font-bold text-main-blue mb-4 text-center">Distribución de Elementos del Sistema</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 p-6 h-[400px]">
            <h3 className="text-lg font-bold text-main-blue mb-4 text-center">Cantidades Totales</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{fill: '#4B5563', fontSize: 12}} />
                <YAxis tick={{fill: '#4B5563', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
