/*
    LoginForm.jsx: Este componente representa el formulario de inicio de sesión.
*/
export const LoginForm = () => {
    return (
        <form className="space-y-5">
            <div>
                <label htmlFor="block text-sm medium 
                text-main-blue mb-1.5 font-medium block">
                    Email o Usuario
                </label>

                <input className="w-full px-3 py-2.5 text-sm
                bg-gray-50 border border-gray-200 rounded-lg
                focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none transition-all"></input>
            </div>

            <div>
                <label className="block text-sm font-medium
                text-main-blue mb-1.5">
                    Contraseña
                </label>
                    
                <input className="w-full px-3 py-2.5 text-sm
                bg-gray-50 border border-gray-200 rounded-lg
                focus:bg-white focus:ring-2 focus:ring-main-green/50 focus:border-main-green outline-none transition-all"></input>
            </div>

            <button className="w-full bg-main-green
            hover:bg-[#3da300] hover:shadow-md text-white font-semibold py-2.5
            px-4 rounded-lg transition-all duration-200
            text-sm">
                Iniciar Sesión
            </button>
            
        </form>
    );
};

