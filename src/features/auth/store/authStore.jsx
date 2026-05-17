import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { loginRequest, registerAdminRequest, recoverPasswordRequest } from '../../../shared/api/auth';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      loading: false,

      login: async (credentials) => {
        set({ loading: true });
        try {
          const { data } = await loginRequest(credentials);
          
          if (data.role !== 'Admin') {
            toast.error("Acceso denegado: Se requiere rol de Administrador");
            set({ loading: false });
            return false;
          }

          set({ user: { id: data.userId }, token: data.token, role: data.role, loading: false });
          toast.success("¡Bienvenido al panel!");
          return true;
        } catch (error) {
          const msg = error.response?.data?.message || "CUI o contraseña incorrectos.";
          toast.error(msg);
          set({ loading: false });
          return false;
        }
      },

      registerAdmin: async (userData) => {
        set({ loading: true });
        try {
          await registerAdminRequest(userData);
          toast.success("Administrador registrado correctamente.");
          set({ loading: false });
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Error al registrar el administrador");
          set({ loading: false });
          return false;
        }
      },

      recoverPassword: async (email) => {
        set({ loading: true });
        try {
          await recoverPasswordRequest({ Email: email });
          toast.success("Si el correo existe, se enviará un enlace de recuperación.");
          set({ loading: false });
          return true;
        } catch (error) {
          toast.error("Error al procesar la solicitud.");
          set({ loading: false });
          return false;
        }
      },

      logout: () => set({ user: null, token: null, role: null })
    }),
    { name: "transmetro-admin-auth" }
  )
);