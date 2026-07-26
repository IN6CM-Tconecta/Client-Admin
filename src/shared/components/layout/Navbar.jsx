import { useNavigate } from "react-router-dom";
import imgLogo from "../../../assets/img/Logo_T_Conecta.png";
import { useAuthStore } from "../../../features/auth/authStore.js";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const initial = user?.cui ? user.cui.charAt(0).toUpperCase() : "A";

  return (
    <nav className="bg-white shadow-[0_4px_20px_0_rgba(24,1,169,0.05)] sticky top-0 z-50 border-b border-pale-blue/30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo + título */}
        <div className="flex items-center gap-3">
          <img
            src={imgLogo}
            alt="T-Conecta Logo"
            className="h-10 md:h-12 w-auto object-contain drop-shadow-sm"
          />

          <h1 className="font-bold text-main-blue text-lg tracking-tight">
            T-Conecta Admin
          </h1>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-main-blue">
              Admin {user?.cui ? `(${user.cui})` : ""}
            </span>
            <span className="text-xs text-gray-500">Administrador de Sistema</span>
          </div>

          <div
            title="Usuario Administrador"
            className="w-10 h-10 rounded-full bg-light-green/30 border-2 border-main-green flex items-center justify-center text-main-blue font-bold cursor-default shadow-sm"
          >
            {initial}
          </div>

          <button
            onClick={handleLogout}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};
