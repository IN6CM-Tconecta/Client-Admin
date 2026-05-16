import { Navigate, Outlet } from 'react-router-dom';
// import { useAuthStore } from '../../features/auth/store/authStore'; // Descomenta esto cuando tengas tu store

export const ProtectedRoute = () => {
    // ESTO ES UN EJEMPLO. Aquí validarás si el usuario tiene un token y un rol válido.
    // const { token, role } = useAuthStore();
    
    // Simulación temporal para que no te dé error y puedas ver el diseño:
    const isAuthenticated = true; 
    const rol = 'Admin';

    // Si no está autenticado, lo expulsa al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado pero no es administrador, lo expulsa
    if (rol !== 'Admin') {
        console.error("Acceso denegado: Rol no administrativo detectado.");
        return <Navigate to="/login" replace />;
    }

    // Si todo está bien, renderiza la ruta hija (el AdminLayout y sus vistas)
    return <Outlet />;
};