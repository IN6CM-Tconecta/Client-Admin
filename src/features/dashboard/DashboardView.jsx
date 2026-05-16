import { MapPin, Route, Bus, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardView = () => {
  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Operativo</h2>
          <p className="text-tc-muted text-sm mt-1">Gestiona estaciones, rutas, buses y alertas de la red.</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-white border border-tc-line text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">Ambiente: Producción</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Estaciones Activas', value: '124' },
          { label: 'Rutas Operativas', value: '18' },
          { label: 'Buses en Servicio', value: '342' },
          { label: 'Alertas Abiertas', value: '3' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-tc-line rounded-2xl p-5 shadow-sm">
            <span className="text-xs text-tc-muted">{stat.label}</span>
            <strong className="block mt-2 text-3xl font-bold text-gray-900">{stat.value}</strong>
          </div>
        ))}
      </div>

      {/* Vistas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Gestión de Estaciones', desc: 'Administra la ubicación, tipo y estado de todas las paradas.', icon: MapPin, path: '/estaciones' },
          { title: 'Gestión de Rutas', desc: 'Configura trayectos y define el tipo de servicio.', icon: Route, path: '/rutas' },
          { title: 'Control de Flotilla', desc: 'Registra unidades y vincula cada bus a las líneas.', icon: Bus, path: '/buses' },
          { title: 'Panel de Alertas', desc: 'Publica incidentes o mantenimientos en tiempo real.', icon: AlertTriangle, path: '/alertas' }
        ].map((view, i) => (
          <div key={i} className="bg-white border border-tc-line rounded-2xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
            <view.icon size={24} className="text-tc-blue" />
            <h3 className="text-lg font-bold text-gray-900">{view.title}</h3>
            <p className="text-sm text-tc-muted flex-1">{view.desc}</p>
            <Link to={view.path} className="inline-flex items-center gap-2 text-sm font-semibold border border-tc-line w-fit px-4 py-2 rounded-xl hover:bg-tc-blue/5 hover:text-tc-blue hover:border-tc-blue/30 transition-all">
              Ir a la vista <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};