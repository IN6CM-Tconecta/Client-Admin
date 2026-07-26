import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();

  const items = [
    { label: "Resumen", to: "/dashboard" },
    { label: "Rutas (Roads)", to: "/dashboard/roads" },
    { label: "Estaciones", to: "/dashboard/stations" },
    { label: "Alertas Operativas", to: "/dashboard/alerts" },
    { label: "Usuarios", to: "/dashboard/users" },
  ];

  return (
    <aside className="w-60 bg-white min-h-[calc(100vh-4rem)] p-4 shadow-sm border-r border-pale-blue/30">
      <ul className="space-y-2">
        {items.map((item) => {
          const active =
            item.to === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.to);

          return (
            <li key={item.to}>
              <Link
                to={item.to}
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
  );
};