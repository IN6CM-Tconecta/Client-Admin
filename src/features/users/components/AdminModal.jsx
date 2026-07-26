import { useState } from "react";
import { useUsersStore } from "../usersStore.js";
import { X } from "lucide-react";

export const AdminModal = ({ isOpen, onClose }) => {
  const { createAdmin } = useUsersStore();
  const [formData, setFormData] = useState({
    cui: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await createAdmin(formData);
    
    setSubmitting(false);
    if (result.success) {
      setFormData({ cui: "", email: "", password: "" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-pale-blue/30 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-main-blue text-white px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">
            Registrar Nuevo Administrador
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-light-green transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form id="admin-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                CUI / DPI
              </label>
              <input
                type="text"
                required
                minLength={13}
                maxLength={13}
                pattern="[0-9]+"
                value={formData.cui}
                onChange={(e) => setFormData({ ...formData, cui: e.target.value })}
                placeholder="Ingrese los 13 dígitos del DPI"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ejemplo@transmetro.com"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-main-blue uppercase mb-1">
                Contraseña Temporal
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none"
              />
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="admin-form"
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-white bg-main-green hover:bg-[#3da300] rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? "Guardando..." : "Crear Administrador"}
          </button>
        </div>
      </div>
    </div>
  );
};
