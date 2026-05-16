import { create } from 'zustand';

// Este store de Zustand manejará el estado global de la sesión
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      // ⚠️ SIMULACIÓN TEMPORAL DE LOGIN:
      // Cuando ya tengas conectada la base de datos, aquí harás el Axios.post('/auth/login')
      
      // Credenciales quemadas de prueba (tomadas de tu archivo DataSeeder de Auth Server):
      if (credentials.CUI === '0000000000000' && credentials.Password === 'AdminTransmetro2026!') {
        
        // Simulamos un retraso de red de 1 segundo
        await new Promise(resolve => setTimeout(resolve, 1000));

        set({
          user: { email: 'admin@transmetro.com', role: 'Super Administrador' },
          token: 'token-jwt-simulado-12345',
          role: 'Admin',
          loading: false
        });
        return true;
      } else {
        set({ error: 'CUI o contraseña incorrectos.', loading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Error al conectar con el servidor', loading: false });
      return false;
    }
  },

  logout: () => {
    // Limpiamos el estado global al cerrar sesión
    set({ user: null, token: null, role: null, error: null });
  }
}));