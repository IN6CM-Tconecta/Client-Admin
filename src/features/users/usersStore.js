import { create } from "zustand";
import { getAllUsers as fetchUsersApi, registerAdmin } from "../../shared/api/auth.js";
import toast from "react-hot-toast";

export const useUsersStore = create((set, get) => ({
    users: [],
    loading: false,
    error: null,

    getUsers: async () => {
        try {
            set({ loading: true, error: null });
            const data = await fetchUsersApi();
            set({
                users: data || [],
                loading: false,
            });
        } catch (err) {
            const msg = err.response?.data?.message || "Error al obtener la lista de usuarios";
            set({ error: msg, loading: false });
            toast.error(msg);
        }
    },

    createAdmin: async (adminData) => {
        try {
            set({ loading: true, error: null });
            const response = await registerAdmin(adminData);
            toast.success("Administrador creado exitosamente.");
            // Refrescar lista
            await get().getUsers();
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al crear administrador";
            set({ error: msg, loading: false });
            toast.error(msg);
            return { success: false, message: msg };
        }
    }
}));
