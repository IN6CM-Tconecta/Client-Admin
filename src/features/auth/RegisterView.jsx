import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import logo from '../../assets/img/logo.png';

export const RegisterView = () => {
  const [formData, setFormData] = useState({ CUI: '', Email: '', Password: '' });
  const { registerAdmin, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.CUI.length !== 13) return alert("El CUI debe tener 13 dígitos");
    const success = await registerAdmin(formData);
    if (success) navigate('/login');
  };

  return (
    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-10 flex flex-col justify-center items-center text-center">
      <span className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">Crear Cuenta</span>
      <img src={logo} alt="Tconecta Logo" className="h-14 mb-4" />
      <p className="text-sm text-gray-500 mb-8">Registra tus credenciales autorizadas para administrar la red.</p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative mb-4">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="CUI (13 dígitos)" maxLength="13" required
            value={formData.CUI} onChange={(e) => setFormData({...formData, CUI: e.target.value.replace(/\D/g, '')})}
            className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-tc-blue" />
        </div>
        <div className="relative mb-4">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="email" placeholder="Correo electrónico" required
            value={formData.Email} onChange={(e) => setFormData({...formData, Email: e.target.value})}
            className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-tc-blue" />
        </div>
        <div className="relative mb-6">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="password" placeholder="Contraseña (Mín. 6 caracteres)" minLength="6" required
            value={formData.Password} onChange={(e) => setFormData({...formData, Password: e.target.value})}
            className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-tc-blue" />
        </div>
        <button disabled={loading} className="w-full py-3.5 rounded-full bg-gradient-to-r from-tc-blue to-tc-secondary text-white font-semibold text-sm uppercase flex justify-center hover:shadow-lg transition-all">
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Registrarme'}
        </button>
      </form>
      <p className="mt-8 text-sm text-gray-500">¿Ya tienes cuenta? <Link to="/login" className="text-tc-blue font-semibold hover:underline">Iniciar Sesión</Link></p>
    </div>
  );
};