import { create } from 'zustand';
import { getRoutes, createRoute } from '../../../shared/api/admin';
import toast from 'react-hot-toast';

export const useRoutesStore = create((set, get) => ({
  routes: [],
  loading: false,
  
  fetchRoutes: async (params = { limit: 50 }) => {
    set({ loading: true });
    try {
      const res = await getRoutes(params);
      set({ routes: res.data.data, loading: false });
    } catch (error) {
      toast.error("Error al cargar las rutas");
      set({ loading: false });
    }
  },

  addRoute: async (data) => {
    set({ loading: true });
    try {
      await createRoute(data);
      toast.success("Ruta registrada exitosamente");
      await get().fetchRoutes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al registrar la ruta");
      set({ loading: false });
    }
  }
}));