import { create } from 'zustand';
import { getStations, createStation } from '../../../shared/api/admin';
import toast from 'react-hot-toast';

export const useStationsStore = create((set, get) => ({
  stations: [],
  loading: false,
  
  fetchStations: async (params = { limit: 50 }) => {
    set({ loading: true });
    try {
      const res = await getStations(params);
      set({ stations: res.data.data, loading: false });
    } catch (error) {
      toast.error("Error al cargar las estaciones");
      set({ loading: false });
    }
  },

  addStation: async (data) => {
    set({ loading: true });
    try {
      await createStation(data);
      toast.success("Estación registrada exitosamente");
      await get().fetchStations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al registrar la estación");
      set({ loading: false });
    }
  }
}));