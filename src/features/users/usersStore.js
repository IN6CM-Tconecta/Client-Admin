import { create } from "zustand";
import { getAllUsers as fetchUsersApi } from "../../shared/api/auth.js";
import toast from "react-hot-toast";

export const useUsersStore = create((set) => ({
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
}));
