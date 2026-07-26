import { create } from "zustand";
import {
    getRoads as fetchRoadsApi,
    createRoad as createRoadApi,
    updateRoad as updateRoadApi,
    changeRoadStatus as changeRoadStatusApi,
} from "../../shared/api/admin.js";
import toast from "react-hot-toast";

export const useRoadsStore = create((set, get) => ({
    roads: [],
    totalRoads: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,

    getRoads: async (queryParams = {}) => {
        try {
            set({ loading: true, error: null });
            const data = await fetchRoadsApi(queryParams);
            set({
                roads: data?.data || [],
                totalRoads: data?.summary?.totalRoads || 0,
                loading: false,
            });
        } catch (err) {
            const msg = err.response?.data?.message || "Error al obtener las rutas";
            set({ error: msg, loading: false });
            toast.error(msg);
        }
    },

    createRoad: async (roadData) => {
        try {
            set({ loading: true, error: null });
            const res = await createRoadApi(roadData);
            toast.success("Ruta creada exitosamente");
            await get().getRoads();
            return { success: true, data: res.data };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al crear la ruta";
            set({ error: msg, loading: false });
            toast.error(msg);
            return { success: false, error: msg };
        }
    },

    updateRoad: async (id, roadData) => {
        try {
            set({ loading: true, error: null });
            const res = await updateRoadApi(id, roadData);
            toast.success("Ruta actualizada exitosamente");
            await get().getRoads();
            return { success: true, data: res.data };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al actualizar la ruta";
            set({ error: msg, loading: false });
            toast.error(msg);
            return { success: false, error: msg };
        }
    },

    changeStatus: async (id, status) => {
        try {
            set({ loading: true, error: null });
            await changeRoadStatusApi(id, status);
            toast.success(`Estado actualizado a ${status}`);
            await get().getRoads();
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al cambiar estado";
            set({ error: msg, loading: false });
            toast.error(msg);
            return { success: false, error: msg };
        }
    },
}));
