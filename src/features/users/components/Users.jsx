import { useEffect } from "react";
import { useUsersStore } from "../usersStore.js";

export const Users = () => {
  const { users, loading, getUsers } = useUsersStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-main-blue">Usuarios Registrados en el Sistema</h1>
        <p className="text-gray-500 text-sm">Visualización de usuarios y administradores registrados desde Auth-Server</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-pale-blue/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando lista de usuarios...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay usuarios registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-pale-blue/20 text-xs font-bold text-main-blue uppercase">
                  <th className="px-6 py-3">CUI / DPI</th>
                  <th className="px-6 py-3">Correo Electrónico</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Fecha de Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-light-green/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-main-blue">
                      {user.cui || user.CUI}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {user.email || user.Email}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "Admin" || user.Role === "Admin" ? (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-main-blue text-white">
                          ADMIN
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-700">
                          USUARIO
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ?? user.IsActive ? (
                        <span className="px-2 py-0.5 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-full">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-semibold text-rose-800 bg-rose-100 rounded-full">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                      {new Date(user.createdAt || user.CreatedAt).toLocaleDateString("es-GT")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
