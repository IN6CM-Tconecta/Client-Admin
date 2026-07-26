import { create } from "zustand";
import {
    getStations as fetchStationsApi,
    createStation as createStationApi,
    updateStation as updateStationApi,
    changeStationStatus as changeStationStatusApi,
} from "../../shared/api/admin.js";
import toast from "react-hot-toast";

export const useStationsStore = create((set, get) => ({
    stations: [],
    totalRecords: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,

    getStations: async (queryParams = {}) => {
        try {
            set({ loading: true, error: null });
            const data = await fetchStationsApi(queryParams);
            set({
                stations: data?.data || [],
                totalRecords: data?.pagination?.totalRecords || data?.data?.length || 0,
                loading: false,
            });
        } catch (err) {
            const msg = err.response?.data?.message || "Error al obtener estaciones";
            set({ error: msg, loading: false });
            toast.error(msg);
        }
    },

    createStation: async (stationData) => {
        try {
            set({ loading: true, error: null });
            const res = await createStationApi(stationData);
            toast.success("Estación creada exitosamente");
            await get().getStations();
            return { success: true, data: res.data };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al crear la estación";
            set({ error: msg, loading: false });
            toast.error(msg);
            return { success: false, error: msg };
        }
    },

    updateStation: async (id, stationData) => {
        try {
            set({ loading: true, error: null });
            const res = await updateStationApi(id, stationData);
            toast.success("Estación actualizada exitosamente");
            await get().getStations();
            return { success: true, data: res.data };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al actualizar estación";
            set({ error: msg, loading: false });
            toast.error(msg);
            return { success: false, error: msg };
        }
    },

    changeStatus: async (id, status) => {
        try {
            set({ loading: true, error: null });
            await changeStationStatusApi(id, status);
            toast.success(`Estado de estación actualizado a ${status}`);
            await get().getStations();
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al cambiar estado";
            set({ error: msg, loading: false });
            toast.error(msg);
            return { success: false, error: msg };
        }
    },
}));
