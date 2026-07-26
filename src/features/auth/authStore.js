import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    login as loginRequest,
    forgotPassword as forgotPasswordRequest,
    resetPassword as resetPasswordRequest,
} from "../../shared/api/auth.js";
import toast from "react-hot-toast";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            error: null,
            isLoadingAuth: true,
            isAuthenticated: false,

            checkAuth: () => {
                const token = get().token;
                const user = get().user;
                const isAdmin = user?.role === "Admin";

                if (token && !isAdmin) {
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoadingAuth: false,
                        error: "No tienes permisos de administrador.",
                    });
                    return;
                }

                set({
                    isLoadingAuth: false,
                    isAuthenticated: Boolean(token) && isAdmin,
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
                toast.success("Sesión cerrada correctamente");
            },

            login: async ({ cui, password }) => {
                try {
                    set({ loading: true, error: null });
                    const response = await loginRequest({ cui, password });
                    const data = response.data;

                    if (data?.role !== "Admin") {
                        const message = "No tienes permisos de Administrador para acceder al panel de control.";
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            loading: false,
                            error: message,
                        });
                        toast.error(message);
                        return { success: false, error: message };
                    }

                    const userData = {
                        id: data.userId,
                        cui: cui,
                        role: data.role,
                    };

                    set({
                        user: userData,
                        token: data.token,
                        isAuthenticated: true,
                        loading: false,
                        error: null,
                    });

                    toast.success("¡Bienvenido a T-Conecta Admin!");
                    return { success: true };
                } catch (err) {
                    const message = err.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales.";
                    set({ error: message, loading: false });
                    toast.error(message);
                    return { success: false, error: message };
                }
            },

            forgotPassword: async (email) => {
                try {
                    set({ loading: true, error: null });
                    const response = await forgotPasswordRequest(email);
                    set({ loading: false });
                    toast.success("Se ha enviado la instrucción de recuperación.");
                    return { success: true, data: response.data };
                } catch (err) {
                    const message = err.response?.data?.message || "Error al solicitar recuperación de contraseña.";
                    set({ error: message, loading: false });
                    toast.error(message);
                    return { success: false, error: message };
                }
            },

            resetPassword: async ({ email, token, newPassword }) => {
                try {
                    set({ loading: true, error: null });
                    const response = await resetPasswordRequest({ email, token, newPassword });
                    set({ loading: false });
                    toast.success("Contraseña actualizada exitosamente.");
                    return { success: true, data: response.data };
                } catch (err) {
                    const message = err.response?.data?.message || "Error al restablecer contraseña.";
                    set({ error: message, loading: false });
                    toast.error(message);
                    return { success: false, error: message };
                }
            },
        }),
        {
            name: "tconecta-admin-auth",
        }
    )
);
