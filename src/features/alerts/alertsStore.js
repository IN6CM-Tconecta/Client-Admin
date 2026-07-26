import { create } from "zustand";
import {
    getAlerts as fetchAlertsApi,
    createAlert as createAlertApi,
    resolveAlert as resolveAlertApi,
} from "../../shared/api/admin.js";
import toast from "react-hot-toast";

export const useAlertsStore = create((set, get) => ({
    alerts: [],
    loading: false,
    error: null,

    getAlerts: async () => {
        try {
            set({ loading: true, error: null });
            const data = await fetchAlertsApi();
            set({
                alerts: data?.data || [],
                loading: false,
            });
        } catch (err) {
            const msg = err.response?.data?.message || "Error al obtener alertas";
            set({ error: msg, loading: false });
            toast.error(msg);
        }
    },

    createAlert: async (alertData) => {
        try {
            set({ loading: true, error: null });
            const res = await createAlertApi(alertData);
            toast.success("Alerta publicada exitosamente");
            await get().getAlerts();
            return { success: true, data: res.data };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al crear alerta";
            set({ error: msg, loading: false });
            toast.error(msg);
            return { success: false, error: msg };
        }
    },

    resolveAlert: async (id) => {
        try {
            set({ loading: true, error: null });
            await resolveAlertApi(id, "RESOLVED");
            toast.success("Alerta marcada como resuelta");
            await get().getAlerts();
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al resolver la alerta";
            set({ error: msg, loading: false });
            toast.error(msg);
            return { success: false, error: msg };
        }
    },
}));
