import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const AuthPage = () => {
  return (
    // Contenedor principal: Ocupa toda la pantalla con fondo gris claro
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      
      {/* --- HEADER (Barra de navegación) --- */}
      <header className="bg-white flex justify-between items-center px-8 py-4 shadow-sm relative">
        <h1 className="text-xl font-bold text-main-blue tracking-wide">
          TRANSMETRO CONECTA
        </h1>
        <button className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
          Inicio
        </button>
        {/* Línea verde gruesa debajo del header */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-green-500"></div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-grow flex items-center justify-center p-4">
        {/* Tarjeta contenedora blanca con animación de entrada */}
        <div className="bg-white w-full max-w-md rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.05)] p-8 border border-gray-100 animate-fadeIn">
          
          {/* Aquí inyectamos el componente del formulario */}
          <LoginForm />

        </div>
      </main>
    </div>
  );
};