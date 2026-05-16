import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../shared/components/layout/Sidebar.jsx';
import { TopBar } from '../../shared/components/layout/TopBar.jsx';

export const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen bg-tc-bg font-sans">
      {/* Overlay para móviles */}
      <div
        className={`fixed inset-0 z-20 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Sidebar (Responsivo) */}
      <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:relative lg:translate-x-0 w-72 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        <TopBar toggleMobileMenu={toggleMobileMenu} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};