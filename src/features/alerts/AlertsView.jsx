import { useEffect, useState } from 'react';
import { Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAlertsStore } from './store/alertsStore';
import { DataTable } from '../../shared/components/DataTable';
import { obfuscateId } from '../../shared/utils/formatters';
import { AlertModal } from './components/AlertModal';

export const AlertsView = () => {
  const { alerts, loading, fetchAlerts, markAsResolved } = useAlertsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Filtrado local para búsqueda en tiempo real
  const filteredAlerts = alerts.filter(alert => 
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    alert.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: '_id', label: 'ID', render: (row) => <span className="font-mono text-tc-muted">{obfuscateId(row._id)}</span> },
    { key: 'title', label: 'Incidente', render: (row) => (
        <div>
          <strong className="text-gray-900 block">{row.title}</strong>
          <span className="text-xs text-tc-muted line-clamp-1 max-w-xs">{row.description}</span>
        </div>
    )},
    { 
      key: 'typeAlert', 
      label: 'Tipo', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
          row.typeAlert === 'INCIDENT' ? 'bg-[#ffeaea] text-[#b72828]' : 
          row.typeAlert === 'MAINTENANCE' ? 'bg-[#fff4e5] text-[#b7791f]' : 'bg-[#e6f0ff] text-tc-blue'
        }`}>
          {row.typeAlert}
        </span>
      ) 
    },
    { 
      key: 'status', 
      label: 'Estado', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
          row.status === 'ACTIVE' ? 'bg-[#ffeaea] text-[#b72828] border border-[#ffc2c2]' : 'bg-[#e8f9ef] text-[#19804b]'
        }`}>
          {row.status === 'ACTIVE' ? 'ACTIVA' : 'RESUELTA'}
        </span>
      ) 
    },
    { 
      key: 'createdAt', 
      label: 'Fecha', 
      render: (row) => <span className="text-xs text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</span> 
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => (
        row.status === 'ACTIVE' ? (
          <button 
            onClick={() => markAsResolved(row._id)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-tc-line text-gray-700 px-3 py-1.5 rounded-lg hover:bg-[#e8f9ef] hover:text-[#19804b] hover:border-[#a3e5c0] transition-all"
            title="Marcar como Resuelta"
          >
            <CheckCircle size={14} /> Resolver
          </button>
        ) : (
          <span className="text-xs text-gray-400 italic">Cerrada</span>
        )
      )
    }
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <AlertTriangle className="text-tc-red" /> Panel de Alertas
          </h2>
          <p className="text-tc-muted text-sm mt-1">Notificaciones del servicio, bloqueos y mantenimientos en tiempo real.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-tc-blue to-tc-secondary text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-tc-blue/30 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={18} /> Nueva Alerta
        </button>
      </header>

      {/* KPI Automáticos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-tc-line rounded-xl p-4 shadow-sm">
          <span className="text-xs text-tc-muted">Total Alertas (Histórico)</span>
          <strong className="block text-2xl text-gray-900 mt-1">{alerts.length}</strong>
        </div>
        <div className="bg-white border border-tc-line rounded-xl p-4 shadow-sm">
          <span className="text-xs text-tc-muted">Activas Hoy</span>
          <strong className="block text-2xl text-tc-red mt-1">{alerts.filter(a => a.status === 'ACTIVE').length}</strong>
        </div>
        <div className="bg-white border border-tc-line rounded-xl p-4 shadow-sm col-span-2 md:col-span-1">
          <span className="text-xs text-tc-muted">Incidentes Críticos</span>
          <strong className="block text-2xl text-gray-900 mt-1">{alerts.filter(a => a.typeAlert === 'INCIDENT').length}</strong>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredAlerts} 
        searchTerm={searchTerm} 
        onSearch={setSearchTerm} 
        loading={loading} 
        searchPlaceholder="Buscar por título o descripción del incidente..."
      />

      {/* Modal de Creación */}
      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};