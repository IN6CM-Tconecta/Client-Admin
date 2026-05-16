import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import logo from '../../assets/img/logo.png';

export const LoginView = () => {
  const [formData, setFormData] = useState({ CUI: '', Password: '' });
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) navigate('/dashboard');
  };

  return (
    // Redujimos el ancho (max-w-md = 448px) y quitamos el flex-row
    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Contenedor Único - Formulario */}
      <div className="p-10 md:p-12 flex flex-col justify-center items-center text-center">
        <span className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">Bienvenido a</span>
        
        <img src={logo} alt="Tconecta Logo" className="h-14 mb-4" />
        
        <p className="text-sm text-gray-500 mb-8">
          Inicia sesión para administrar estaciones, rutas y alertas de tu red de transporte público.
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 w-full p-2 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative mb-5">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Usuario o correo" 
              value={formData.CUI}
              onChange={(e) => setFormData({...formData, CUI: e.target.value})}
              className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-tc-blue focus:ring-1 focus:ring-tc-blue transition-all"
              required 
            />
          </div>

          <div className="relative mb-2">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={formData.Password}
              onChange={(e) => setFormData({...formData, Password: e.target.value})}
              className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-tc-blue focus:ring-1 focus:ring-tc-blue transition-all"
              required 
            />
          </div>

          <div className="text-right mb-6">
             <Link to="/recuperar" className="text-xs text-gray-400 hover:text-tc-blue transition-colors">
               ¿Olvidaste tu contraseña?
             </Link>
          </div>

          <button 
            disabled={loading} 
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-tc-blue to-tc-secondary text-white font-semibold text-sm uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-lg hover:shadow-tc-blue/30 transition-all flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500">
          ¿No tienes acceso? <Link to="/registro" className="text-tc-blue font-semibold hover:underline">Registrarme</Link>
        </p>
      </div>
    </div>
  );
};