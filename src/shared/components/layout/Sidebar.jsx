
/*
  Sidebar.jsx: Este componente representa la barra lateral de navegación del panel de administración.
*/

export const Sidebar = () => {
  const items = [
    { label: "Rutas" },
    { label: "Unidades" },
    { label: "Pilotos" },
    { label: "Paradas" },
    { label: "Usuarios" },
  ];
  return (
    <aside className="w-60 bg-white min-h-[calc(100vh-4rem)] p-4 shadow-sm border-r border-pale-blue/30">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <div className="block px-4 py-2.5 rounded-lg font-medium text-main-blue hover:bg-light-green/20 hover:text-main-green cursor-pointer transition-all duration-200">
              {item.label}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};
 