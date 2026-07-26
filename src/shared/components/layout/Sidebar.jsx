import { Link, useLocation } from "react-router-dom";

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();

  const items = [
    { label: "Resumen", to: "/dashboard" },
    { label: "Estaciones", to: "/dashboard/stations" },
    { label: "Rutas", to: "/dashboard/roads" },
    { label: "Gestión de Buses", to: "/dashboard/buses" },
    { label: "Alertas Operativas", to: "/dashboard/alerts" },
    { label: "Usuarios", to: "/dashboard/users" },
  ];

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white min-h-[calc(100vh-4rem)] md:min-h-0 p-4 shadow-2xl md:shadow-sm border-r border-pale-blue/30 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden px-2">
          <span className="font-bold text-main-blue text-lg">Menú Principal</span>
          <button 
            onClick={closeSidebar}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <ul className="space-y-2 flex-1 overflow-y-auto">
          {items.map((item) => {
            const active =
              item.to === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.to);

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={closeSidebar}
                  className={`block px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    active
                      ? "bg-light-green/30 text-main-blue font-bold border-l-4 border-main-green"
                      : "text-main-blue hover:bg-light-green/20 hover:text-main-green"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};