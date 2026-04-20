import { useState } from "react";
import { LoginForm } from "../components/LoginForm";

/*
  AuthPage.jsx: Este componente representa la página de autenticación, 
  que incluye tanto el formulario de inicio de sesión como el de recuperación de contraseña.
*/
const AuthPage = () => {
  //* Estados para controlar qué formulario mostrar
  // isLogin: controla si se muestra el formulario de inicio de sesión
  const [isLogin, setIsLogin] = useState(true);
  // isForgot: controla si se muestra el formulario de recuperación de contraseña
  const [isForgot, setIsForgot] = useState(false);

  // Función para volver al login desde cualquier estado
  const handleBackToLogin = () => {
    setIsForgot(false);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-[0_4px_20px_0_rgba(24,1,169,0.1)] border border-pale-blue/30 p-6 md:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/src/assets/img/Logo_T_Conecta.png"
            alt="T-Conecta"
            className="h-24 w-auto drop-shadow-sm"
          />
        </div>

        {/* Encabezado Dinámico */}
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-main-blue mb-2">
            {/* Esta función controla el título dinámico del formulario */}
            {isForgot
              ? "Recuperar Contraseña"
              : isLogin
                ? "Bienvenido de Nuevo"
                : "Crear Cuenta"}
          </h1>

          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {/* Esta función controla el subtítulo dinámico del formulario */}
            {isForgot
              ? "Ingresa tu correo para recuperar tu contraseña"
              : isLogin
                ? "Ingresa a tu cuenta de administrador de T-Conecta"
                : "Regístrate como administrador de T-Conecta"}
          </p>
        </div>

        {/* Formulario Dinámico */}
        {isForgot ? (
          <div className="space-y-4">
            {/* Aquí puedes crear un componente ForgotPasswordForm o poner el input directamente */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-main-blue mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none transition-all"
                placeholder="tu@correo.com"
              />
            </div>
            <button className="w-full bg-main-green text-white py-2.5 rounded-lg font-semibold hover:bg-[#3da300] hover:shadow-md transition-all duration-200 text-sm">
              Recuperar Contraseña
            </button>
          </div>
        ) : (
          <LoginForm />
        )}

        {/* Opciones de navegación al final del card */}
        <div className="mt-8 text-center space-y-3">
          {/* Esta función controla la navegación entre formularios */}
          {isForgot ? (
            <button
              onClick={handleBackToLogin}
              className="text-sm text-main-blue hover:text-main-green hover:underline font-medium transition-colors"
            >
              ¿Recordaste tu contraseña? Inicia Sesión
            </button>
          ) : (
            <>
              {isLogin && (
                <button
                  onClick={() => setIsForgot(true)}
                  className="block w-full text-sm text-gray-500 hover:text-main-green transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}

              <p className="text-sm text-gray-500">
                {/* Esta función controla el mensaje de navegación entre formularios */}
                {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-main-blue hover:text-main-green hover:underline font-medium transition-colors"
                >
                  {isLogin ? "Regístrate" : "Iniciar Sesión"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export { AuthPage };
