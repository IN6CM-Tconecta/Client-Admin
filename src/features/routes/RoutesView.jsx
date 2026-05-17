import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useRoutesStore } from './store/routesStore';
import { DataTable } from '../../shared/components/DataTable';
import { obfuscateId } from '../../shared/utils/formatters';

export const RoutesView = () => {
  const { routes, loading, fetchRoutes } = useRoutesStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  // Filtrado local básico para el buscador
  const filteredRoutes = routes.filter(route => 
    route.routeCode?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    route.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: '_id', label: 'ID Interno', render: (row) => <span className="font-mono text-tc-muted">{obfuscateId(row._id)}</span> },
    { key: 'routeCode', label: 'Código de Ruta', render: (row) => <strong className="text-gray-900">{row.routeCode}</strong> },
    { key: 'name', label: 'Nombre' },
    { key: 'typeRoad', label: 'Tipo' },
    { key: 'serviceType', label: 'Sistema' },
    { 
      key: 'status', 
      label: 'Estado', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
          row.status === 'ACTIVE' ? 'bg-[#e8f9ef] text-[#19804b]' : 
          row.status === 'MAINTENANCE' ? 'bg-[#fff4e5] text-[#b7791f]' : 'bg-[#ffeaea] text-[#b72828]'
        }`}>
          {row.status}
        </span>
      ) 
    }
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Rutas</h2>
          <p className="text-tc-muted text-sm mt-1">Administra las rutas, tipos de servicio y estado de cada recorrido.</p>
        </div>
        <button className="bg-gradient-to-r from-tc-blue to-tc-secondary text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-tc-blue/30 hover:-translate-y-0.5 transition-all">
          <Plus size={18} /> Nueva Ruta
        </button>
      </header>

      {/* KPI Automáticos */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-tc-line rounded-xl p-4 shadow-sm">
          <span className="text-xs text-tc-muted">Total Rutas</span>
          <strong className="block text-2xl text-gray-900 mt-1">{routes.length}</strong>
        </div>
        <div className="bg-white border border-tc-line rounded-xl p-4 shadow-sm">
          <span className="text-xs text-tc-muted">Transmetro</span>
          <strong className="block text-2xl text-gray-900 mt-1">{routes.filter(route => route.serviceType === 'TRANSMETRO').length}</strong>
        </div>
        <div className="bg-white border border-tc-line rounded-xl p-4 shadow-sm">
          <span className="text-xs text-tc-muted">En Mantenimiento</span>
          <strong className="block text-2xl text-gray-900 mt-1">{routes.filter(route => route.status === 'MAINTENANCE').length}</strong>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredRoutes} 
        searchTerm={searchTerm} 
        onSearch={setSearchTerm} 
        loading={loading} 
        searchPlaceholder="Buscar por código o nombre..."
      />
    </div>
  );
};