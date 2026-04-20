<<<<<<< Updated upstream
import React from 'react';

export const LoginForm = () => {
  return (
    <div className="w-full">
      {/* Título de la tarjeta */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-main-blue mb-3">
          Iniciar Sesión
        </h2>
        {/* Línea verde separadora */}
        <div className="w-full h-0.5 bg-green-500"></div>
      </div>
=======
import { useNavigate } from "react-router-dom";

/*
    LoginForm.jsx: Este componente representa el formulario de inicio de sesión.
*/
export const LoginForm = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Salto directo a la página principal por el momento
        navigate("/dashboard");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="block text-sm medium 
                text-main-blue mb-1.5 font-medium block">
                    Email o Usuario
                </label>
>>>>>>> Stashed changes

      {/* Formulario */}
      <form className="space-y-4">
        {/* Input: Nombre o Correo */}
        <div>
          <label className="block text-sm font-bold text-main-blue mb-1">
            Nombre o Correo
          </label>
          <input 
            type="text" 
            placeholder="Ingrese su usuario" 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-main-blue focus:border-main-blue transition-colors"
          />
        </div>

<<<<<<< Updated upstream
        {/* Input: Contraseña */}
        <div>
          <label className="block text-sm font-bold text-main-blue mb-1">
            Contraseña
          </label>
          <input 
            type="password" 
            placeholder="******" 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-main-blue focus:border-main-blue transition-colors"
          />
        </div>

        {/* Link: Olvidaste contraseña */}
        <div className="flex justify-end pt-1">
          <a href="#" className="text-xs text-gray-500 underline hover:text-main-blue transition-colors">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
=======
            <div>
                <label className="block text-sm font-medium
                text-main-blue mb-1.5">
                    Contraseña
                </label>
                    
                <input type="password" className="w-full px-3 py-2.5 text-sm
                bg-gray-50 border border-gray-200 rounded-lg
                focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none transition-all"></input>
            </div>

            <button type="submit" className="w-full bg-main-green
            hover:bg-[#3da300] hover:shadow-md text-white font-semibold py-2.5
            px-4 rounded-lg transition-all duration-200
            text-sm mt-2">
                Iniciar Sesión
            </button>
            
        </form>
    );
};
>>>>>>> Stashed changes

        {/* --- BOTONES ACTUALIZADOS --- */}
        <div className="pt-4 space-y-3">
          
          {/* Botón Azul (Texto actualizado) */}
          <button 
            type="button" 
            className="w-full bg-main-blue text-white font-semibold py-2.5 rounded-md hover:bg-[#062453] transition-colors text-sm"
          >
            Iniciar Sesión
          </button>
          
          {/* Botón Rojo (Volver) - Lo mantuve ya que no indicaste quitarlo */}
          <button 
            type="button" 
            className="w-full bg-white text-red-600 font-semibold py-2.5 rounded-md border border-red-600 hover:bg-red-50 transition-colors text-sm"
          >
            Volver
          </button>

        </div>
      </form>
    </div>
  );
};