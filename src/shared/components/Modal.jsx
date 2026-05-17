import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscuro con blur */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Contenedor del Modal */}
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${sizeMap[size]} max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn z-10`}>
        
        {/* Encabezado */}
        <div className="flex items-center justify-between p-6 border-b border-tc-line bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-tc-red hover:bg-red-50 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Contenido dinámico */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};