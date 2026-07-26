import { useState } from "react";
import { useAlertsStore } from "../alertsStore.js";

export const AlertModal = ({ isOpen, onClose }) => {
  const { createAlert } = useAlertsStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    typeAlert: "INFO",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await createAlert(formData);
      if (result.success) {
        setFormData({ title: "", description: "", typeAlert: "INFO" });
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-pale-blue/30 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-main-blue text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Emitir Nueva Alerta Operativa</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-light-green text-xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
              Título de la Alerta
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej. Retraso en Línea 12 por mantenimiento"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
              Tipo de Alerta
            </label>
            <select
              value={formData.typeAlert}
              onChange={(e) => setFormData({ ...formData, typeAlert: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
            >
              <option value="INFO">INFORMACIÓN (INFO)</option>
              <option value="INCIDENT">INCIDENTE OPERATIVO (INCIDENT)</option>
              <option value="MAINTENANCE">MANTENIMIENTO EN VÍA (MAINTENANCE)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
              Descripción Detallada
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describa el acontecimiento o la indicación para los usuarios..."
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-main-green hover:bg-[#3da300] rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "Publicando..." : "Publicar Alerta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
