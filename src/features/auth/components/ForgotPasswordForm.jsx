import { useState } from "react";
import { useAuthStore } from "../authStore.js";

export const ForgotPasswordForm = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const { forgotPassword, loading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    const res = await forgotPassword(email.trim());
    if (res.success) {
      onSwitch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-main-blue mb-1.5">
          Correo Electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
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
            <span>Enviando...</span>
          </>
        ) : (
          "Recuperar Contraseña"
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        ¿Recordaste tu contraseña?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-main-blue font-medium hover:text-main-green hover:underline transition-colors"
        >
          Iniciar Sesión
        </button>
      </p>
    </form>
  );
};