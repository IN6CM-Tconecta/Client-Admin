import { useState } from 'react';
import { Loader2, Megaphone } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { useAlertsStore } from '../store/alertsStore';

export const AlertModal = ({ isOpen, onClose }) => {
  const { addAlert, loading } = useAlertsStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    typeAlert: 'INFO'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addAlert(formData);
    if (success) {
      setFormData({ title: '', description: '', typeAlert: 'INFO' }); // Resetear
      onClose(); // Cerrar modal
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publicar Nueva Alerta">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título de la Alerta</label>
          <input 
            type="text" 
            placeholder="Ej. Manifestación en Zona 1" 
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tc-blue transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción Detallada</label>
          <textarea 
            rows="3"
            placeholder="Detalle la situación, áreas afectadas o rutas alternas..." 
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tc-blue transition-all resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo de Alerta</label>
          <select 
            value={formData.typeAlert}
            onChange={(e) => setFormData({ ...formData, typeAlert: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tc-blue transition-all"
          >
            <option value="INFO">Información General (INFO)</option>
            <option value="INCIDENT">Incidente Operativo (INCIDENT)</option>
            <option value="MAINTENANCE">Mantenimiento (MAINTENANCE)</option>
          </select>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-tc-line mt-6">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-tc-blue hover:bg-tc-secondary text-white text-sm font-semibold rounded-xl shadow-lg shadow-tc-blue/25 hover:-translate-y-0.5 transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Megaphone size={18} />}
            {loading ? 'Publicando...' : 'Publicar Alerta'}
          </button>
        </div>

      </form>
    </Modal>
  );
};