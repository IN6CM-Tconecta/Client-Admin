import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import logo from '../../assets/img/logo.png';

export const RecoverView = () => {
  const [email, setEmail] = useState('');
  const { recoverPassword, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await recoverPassword(email);
    if (success) navigate('/login');
  };

  return (
    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-10 flex flex-col justify-center items-center text-center relative">
      <Link to="/login" className="absolute top-6 left-6 text-gray-400 hover:text-tc-blue transition-colors">
        <ArrowLeft size={24} />
      </Link>

      <span className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1 mt-4">Recuperar Acceso</span>
      <img src={logo} alt="Tconecta Logo" className="h-14 mb-4" />
      <p className="text-sm text-gray-500 mb-8 px-4">Ingresa tu correo electrónico asociado a la plataforma para generar un enlace de restablecimiento de contraseña temporal.</p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative mb-6">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="email" placeholder="Correo electrónico corporativo" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-tc-blue" />
        </div>
        
        <button disabled={loading} className="w-full py-3.5 rounded-full bg-gradient-to-r from-tc-blue to-tc-secondary text-white font-semibold text-sm uppercase tracking-wide flex justify-center hover:-translate-y-0.5 hover:shadow-lg transition-all">
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Generar Enlace'}
        </button>
      </form>
    </div>
  );
};