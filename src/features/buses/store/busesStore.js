import { create } from 'zustand';
import { getBuses, createBus } from '../../../shared/api/admin';
import toast from 'react-hot-toast';

export const useBusesStore = create((set, get) => ({
  buses: [],
  loading: false,
  
  fetchBuses: async (params = { limit: 50 }) => {
    set({ loading: true });
    try {
      const res = await getBuses(params);
      set({ buses: res.data.data, loading: false });
    } catch (error) {
      toast.error("Error al cargar los buses");
      set({ loading: false });
    }
  },

  addBus: async (data) => {
    set({ loading: true });
    try {
      await createBus(data);
      toast.success("Bus registrado exitosamente");
      await get().fetchBuses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al registrar el bus");
      set({ loading: false });
    }
  }
}));