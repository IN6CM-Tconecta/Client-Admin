import { create } from 'zustand';
import { axiosAdmin } from '../../shared/api/api.js';

export const useBusesStore = create((set, get) => ({
    buses: [],
    loading: false,
    error: null,

    fetchBuses: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosAdmin.get('/buses', { params });
            if (data.success) {
                set({ buses: data.data, loading: false });
            } else {
                set({ error: data.message, loading: false });
            }
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Error al obtener los buses',
                loading: false 
            });
        }
    },

    createBus: async (busData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosAdmin.post('/buses', busData);
            if (data.success) {
                // Actualizar la lista local
                const currentBuses = get().buses;
                set({ buses: [data.data, ...currentBuses], loading: false });
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            const errData = error.response?.data;
            let msg = errData?.message || 'Error al crear el bus';
            if (errData?.error && Array.isArray(errData.error) && errData.error.length > 0) {
                msg = errData.error[0].message;
            }
            set({ error: msg, loading: false });
            return { success: false, message: msg };
        }
    },

    updateBus: async (id, busData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosAdmin.put(`/buses/${id}`, busData);
            if (data.success) {
                // Actualizar localmente
                const currentBuses = get().buses.map(bus => 
                    bus._id === id ? data.data : bus
                );
                set({ buses: currentBuses, loading: false });
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            const errData = error.response?.data;
            let msg = errData?.message || 'Error al actualizar el bus';
            if (errData?.error && Array.isArray(errData.error) && errData.error.length > 0) {
                msg = errData.error[0].message;
            }
            set({ error: msg, loading: false });
            return { success: false, message: msg };
        }
    },

    changeBusStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosAdmin.patch(`/buses/${id}/status`, { status });
            if (data.success) {
                const currentBuses = get().buses.map(bus => 
                    bus._id === id ? { ...bus, status: data.data.status } : bus
                );
                set({ buses: currentBuses, loading: false });
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al cambiar estado';
            set({ error: msg, loading: false });
            return { success: false, message: msg };
        }
    }
}));
