import { useState } from "react";
import { LoginForm } from "../components/LoginForm.jsx";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm.jsx";
import imgLogo from "../../../assets/img/Logo_T_Conecta.png";

export const AuthPage = () => {
  const [isForgot, setIsForgot] = useState(false);

  const handleBackToLogin = () => {
    setIsForgot(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-[0_4px_20px_0_rgba(24,1,169,0.1)] border border-pale-blue/30 p-6 md:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={imgLogo}
            alt="T-Conecta"
            className="h-24 w-auto drop-shadow-sm"
          />
        </div>

        {/* Encabezado Dinámico */}
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-main-blue mb-2">
            {isForgot ? "Recuperar Contraseña" : "Bienvenido de Nuevo"}
          </h1>

          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {isForgot
              ? "Ingresa tu correo para recuperar tu contraseña"
              : "Ingresa a tu cuenta de administrador de T-Conecta"}
          </p>
        </div>

        {/* Formulario Dinámico */}
        {isForgot ? (
          <ForgotPasswordForm onSwitch={handleBackToLogin} />
        ) : (
          <LoginForm />
        )}

        {/* Opciones de navegación al final del card */}
        {!isForgot && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsForgot(true)}
              className="text-sm text-gray-500 hover:text-main-green transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
