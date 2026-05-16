import { Menu, User } from 'lucide-react';
import tabBg from "../../../assets/img/tab.jpg";
import { useAuth } from "../../hooks/useAuth";

export const TopBar = ({ toggleMobileMenu }) => {
  const { user } = useAuth();

  return (
    <div 
      className="h-20 w-full flex justify-between items-center px-4 md:px-8 shadow-md relative z-10"
      style={{ backgroundImage: `url(${tabBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <button onClick={toggleMobileMenu} className="p-2 text-white bg-black/30 rounded-lg lg:hidden backdrop-blur-sm">
        <Menu size={24} />
      </button>

      {/* Widget de Usuario (Adaptado de Tconecta CSS) */}
      <div className="ml-auto flex items-center gap-3 bg-[rgba(30,181,0,0.9)] px-4 py-1.5 rounded-full backdrop-blur-md border border-white/25 text-white cursor-pointer hover:bg-[rgba(39,179,0,0.8)] transition-all">
        <div className="flex flex-col text-right">
          <span className="text-[13px] font-semibold leading-tight">{user?.email || 'Administrador'}</span>
          <span className="text-[11px] text-white/85">{user?.role || 'Admin Transmetro'}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-white text-tc-blue flex items-center justify-center shadow-md">
          <User size={18} />
        </div>
      </div>
    </div>
  );
};