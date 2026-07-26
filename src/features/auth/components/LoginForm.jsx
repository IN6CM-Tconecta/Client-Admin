import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../authStore.js";

export const LoginForm = () => {
  const [cui, setCui] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cui.trim() || !password.trim()) {
      return;
    }

    const result = await login({ cui: cui.trim(), password });
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-main-blue mb-1.5">
          CUI / DPI de Administrador
        </label>
        <input
          type="text"
          value={cui}
          onChange={(e) => setCui(e.target.value)}
          placeholder="Ingrese su CUI de 13 dígitos"
          required
          className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-main-blue mb-1.5">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-main-green hover:bg-[#3da300] hover:shadow-md text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Iniciando sesión...</span>
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </button>
    </form>
  );
};
