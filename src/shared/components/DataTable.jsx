import { Search } from 'lucide-react';

export const DataTable = ({ columns, data, searchPlaceholder = 'Buscar...', searchTerm, onSearch, loading }) => {
  return (
    <div className="bg-white rounded-2xl border border-tc-line overflow-hidden shadow-sm">
      {/* Buscador */}
      <div className="p-4 border-b border-tc-line">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-tc-blue outline-none transition-all"
          />
        </div>
      </div>

      {/*Tabla tradicional en desktop*/}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-tc-line">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-tc-line">
            {loading ? (
              <tr><td colSpan={columns.length} className="p-6 text-center text-sm text-gray-400">Cargando...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length} className="p-6 text-center text-sm text-gray-400">No se encontraron registros.</td></tr>
            ) : (
              data.map((row, i) => (
                <tr key={row._id || i} className="hover:bg-gray-50/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/*Tarjetas en el modo móvil*/}
      <div className="md:hidden divide-y divide-tc-line">
        {loading ? (
           <div className="p-6 text-center text-sm text-gray-400">Cargando...</div>
        ) : data.length === 0 ? (
           <div className="p-6 text-center text-sm text-gray-400">No se encontraron registros.</div>
        ) : (
          data.map((row, i) => (
            <div key={row._id || i} className="p-4 flex flex-col gap-3 hover:bg-gray-50/30 transition-colors">
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-500">{col.label}:</span>
                  <span className="text-gray-800 text-right">{col.render ? col.render(row) : row[col.key]}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};