import { NavLink } from 'react-router-dom';
import { PieChart, MapPin, Route as RouteIcon, Bus, AlertTriangle, ShieldCheck, Key, Settings, LogOut } from 'lucide-react';
import logo from '../../../assets/img/logo.png';
import { useAuth } from "../../hooks/useAuth";

export const Sidebar = ({ closeMobileMenu }) => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Resumen', path: '/dashboard', icon: <PieChart size={18} /> },
    { name: 'Estaciones', path: '/estaciones', icon: <MapPin size={18} /> },
    { name: 'Rutas', path: '/rutas', icon: <RouteIcon size={18} /> },
    { name: 'Flotilla (Buses)', path: '/buses', icon: <Bus size={18} /> },
    { name: 'Alertas', path: '/alertas', icon: <AlertTriangle size={18} /> },
    { name: 'Administradores', path: '/usuarios', icon: <ShieldCheck size={18} /> },
    { name: 'Roles y permisos', path: '/roles', icon: <Key size={18} /> },
    { name: 'Configuración', path: '/configuracion', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-full h-full text-white flex flex-col p-6" style={{ background: 'linear-gradient(165deg, #1f1f29 0%, #292935 52%, #1a1a22 100%)' }}>
      <div className="flex justify-center items-center py-4 mb-4">
        <img src={logo} alt="Tconecta Logo" className="h-10 object-contain" />
      </div>
      <p className="text-[11px] font-semibold tracking-widest uppercase text-white/50 mb-2 px-2">Panel Operativo</p>
      
      <nav className="flex-1 overflow-y-auto space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-tc-green/40 border border-tc-green/60 text-white'
                  : 'text-gray-300 hover:bg-tc-green/15 hover:border-tc-green/25 hover:translate-x-1 border border-transparent'
              }`
            }
          >
            {item.icon} {item.name}
          </NavLink>
        ))}
      </nav>

      <button onClick={logout} className="mt-auto flex items-center justify-center gap-2 bg-tc-green text-white px-4 py-3 rounded-xl text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-tc-green/30 transition-all">
        <LogOut size={18} /> Cerrar sesión
      </button>
    </aside>
  );
};