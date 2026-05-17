import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginView } from '../../features/auth/LoginView';
import { DashboardView } from '../../features/dashboard/DashboardView';
import { StationsView } from '../../features/stations/StationsView';
import { BusesView } from '../../features/buses/BusesView';
import { RegisterView } from '../../features/auth/RegisterView';
import { RecoverView } from '../../features/auth/RecoverView';
import { AlertsView } from '../../features/alerts/AlertsView';

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginView />} />
        <Route path="/registro" element={<RegisterView />} />
        <Route path="/recuperar" element={<RecoverView />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="estaciones" element={<StationsView />} />
          <Route path="buses" element={<BusesView />} />
          <Route path="alertas" element={<AlertsView />} />
          {/* Aquí irían las rutas para buses, alertas, usuarios, etc. */}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};