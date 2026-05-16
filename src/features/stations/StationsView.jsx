import { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
// import { useStationsStore } from './store/stationsStore'; // Descomenta cuando conectes el store de Zustand a Axios

export const StationsView = () => {
  // Datos mockeados para el ejemplo visual, aquí conectarías a tu Zustand store:
  // const { stations, fetchStations, createStation } = useStationsStore();
  const [stations, setStations] = useState([
    { id: 1, name: 'Plaza La Reforma', stationCode: 'EST-01', typeStation: 'CENTRALES', status: 'ACTIVE' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Estaciones</h2>
          <p className="text-tc-muted text-sm mt-1">Administra la ubicación, tipo y estado de las paradas.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-tc-blue to-tc-secondary text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-tc-blue/30 hover:-translate-y-0.5 transition-all">
          <Plus size={18} /> Nueva Estación
        </button>
      </header>

      {/* KPIs superiores */}
      <div className="bg-white border border-tc-line p-4 rounded-2xl mb-6 shadow-sm">
        <p className="text-xs text-tc-muted mb-3">Control de infraestructura de paradas.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
           <div className="border border-tc-line rounded-xl p-3"><span className="text-xs text-tc-muted block">Total Estaciones</span><strong className="text-2xl text-gray-900">{stations.length}</strong></div>
           <div className="border border-tc-line rounded-xl p-3"><span className="text-xs text-tc-muted block">Activas</span><strong className="text-2xl text-gray-900">1</strong></div>
           <div className="border border-tc-line rounded-xl p-3"><span className="text-xs text-tc-muted block">En Mantenimiento</span><strong className="text-2xl text-gray-900">0</strong></div>
        </div>
      </div>

      {/* Grid de Tarjetas (Como en el HTML original) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stations.map(st => (
          <article key={st.id} className="bg-white border border-tc-line rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{st.name} <span className="text-tc-muted text-sm font-normal">({st.stationCode})</span></h3>
            <p className="text-sm text-gray-600 mb-3">Tipo: <strong>{st.typeStation}</strong></p>
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${st.status === 'ACTIVE' ? 'bg-[#e8f9ef] text-[#19804b]' : 'bg-[#ffeaea] text-[#b72828]'}`}>
              {st.status}
            </span>
            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-1.5 text-xs font-semibold border border-tc-line bg-white text-gray-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-tc-blue hover:border-blue-200 transition-all">
                <Edit2 size={14} /> Editar
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Lógica del Modal simplificada (Debe moverse a shared/components/Modal.jsx como en BIK) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">Registrar Estación</h2>
            <div className="space-y-3">
              <div><label className="text-xs text-tc-muted">Nombre</label><input type="text" className="w-full border border-tc-line rounded-lg p-2.5 text-sm" placeholder="Ej. Plaza" /></div>
              <div><label className="text-xs text-tc-muted">Código</label><input type="text" className="w-full border border-tc-line rounded-lg p-2.5 text-sm" placeholder="EST-01" /></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-tc-line rounded-lg text-sm font-semibold hover:bg-gray-50">Cancelar</button>
              <button className="px-4 py-2 bg-tc-blue text-white rounded-lg text-sm font-semibold">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};