import { create } from 'zustand';
import { getAlerts, createAlert, resolveAlert } from '../../../shared/api/admin';
import toast from 'react-hot-toast';

export const useAlertsStore = create((set, get) => ({
  alerts: [],
  loading: false,

  fetchAlerts: async () => {
    set({ loading: true });
    try {
      const res = await getAlerts();
      // El backend devuelve { data: [...] }
      set({ alerts: res.data.data || [], loading: false });
    } catch (error) {
      toast.error("Error al cargar las alertas activas");
      set({ loading: false });
    }
  },

  addAlert: async (data) => {
    set({ loading: true });
    try {
      await createAlert(data);
      toast.success("Alerta publicada exitosamente");
      await get().fetchAlerts(); // Refrescar la tabla
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al publicar la alerta");
      set({ loading: false });
      return false;
    }
  },

  markAsResolved: async (id) => {
    set({ loading: true });
    try {
      await resolveAlert(id);
      toast.success("La alerta ha sido marcada como resuelta");
      await get().fetchAlerts(); // Refrescar la tabla
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al actualizar la alerta");
      set({ loading: false });
    }
  }
}));