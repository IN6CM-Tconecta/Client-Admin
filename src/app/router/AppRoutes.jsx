import { Route, Routes, Navigate } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { DashboardPage } from "../layouts/DashboardPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { DashboardOverview } from "../../features/dashboard/components/DashboardOverview.jsx";
import { Roads } from "../../features/roads/components/Roads.jsx";
import { Stations } from "../../features/stations/components/Stations.jsx";
import { Alerts } from "../../features/alerts/components/Alerts.jsx";
import { Users } from "../../features/users/components/Users.jsx";
import { Buses } from "../../features/buses/components/Buses.jsx";
import { useAuthStore } from "../../features/auth/authStore.js";

export const AppRoutes = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <Routes>
            {/* PÚBLICAS Y REDIRECCIÓN /auth */}
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} />
            <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

            {/* PROTEGIDO POR AUTENTICACIÓN */}
            <Route
                path="/dashboard/*"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardOverview />} />
                <Route path="roads" element={<Roads />} />
                <Route path="stations" element={<Stations />} />
                <Route path="buses" element={<Buses />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="users" element={<Users />} />
            </Route>

            {/* COMODÍN */}
            <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
    );
};