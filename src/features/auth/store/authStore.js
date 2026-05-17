import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { loginRequest, registerRequest, recoverPasswordRequest } from '../../../shared/api/auth';

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
          
          // .NET devuelve los datos con mayúscula inicial
          const role = data.Role || data.role;
          const token = data.Token || data.token;
          const userId = data.UserId || data.userId;

          if (role !== 'Admin') {
            toast.error("Acceso denegado: Se requiere rol de Administrador");
            set({ loading: false });
            return false;
          }

          set({ user: { id: userId, role }, token, role, loading: false });
          toast.success("¡Bienvenido al panel!");
          return true;
        } catch (error) {
          // Si no hay response, es un error de CORS o red
          const msg = error.response?.data?.message || "CUI o contraseña incorrectos (O error de conexión CORS).";
          toast.error(msg);
          set({ loading: false });
          return false;
        }
      },

      register: async (userData) => {
        set({ loading: true });
        try {
          // Usamos el registro normal porque el de admin requiere token previo en el backend
          await registerRequest(userData);
          toast.success("Cuenta registrada correctamente.");
          set({ loading: false });
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Error al registrar la cuenta");
          set({ loading: false });
          return false;
        }
      },

      recoverPassword: async (email) => {
        set({ loading: true });
        try {
          await recoverPasswordRequest({ Email: email });
          toast.success("Enlace de recuperación generado en consola.");
          set({ loading: false });
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Error al procesar la solicitud.");
          set({ loading: false });
          return false;
        }
      },

      logout: () => set({ user: null, token: null, role: null })
    }),
    { 
      name: "transmetro-admin-auth",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);