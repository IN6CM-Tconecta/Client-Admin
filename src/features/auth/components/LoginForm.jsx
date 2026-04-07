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