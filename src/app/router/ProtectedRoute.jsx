import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';

export const ProtectedRoute = () => {
    
    const { token, role } = useAuthStore();
    
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role !== 'Admin') {
        console.error("Acceso denegado: Se requiere rol de Administrador.");
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};