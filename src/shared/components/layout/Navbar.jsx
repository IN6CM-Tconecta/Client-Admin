import imgLogo from "../../../assets/img/Logo_T_Conecta.png";


/*
  Navbar.jsx: Este componente representa la barra de navegación superior de la aplicación.
*/
export const Navbar = () => {
  return (
    <nav className="bg-white shadow-[0_4px_20px_0_rgba(24,1,169,0.05)] sticky top-0 z-50 border-b border-pale-blue/30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo + título */}
        <div className="flex items-center gap-3">
          <img
            src={imgLogo}
            alt="T-Conecta Logo"
            className="h-10 md:h-12 w-auto object-contain drop-shadow-sm"
          />

          <h1 className="font-bold text-main-blue text-lg tracking-tight">
            T-Conecta Admin
          </h1>
        </div>

        {/* Avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-light-green/30 border-2 border-main-green flex items-center justify-center text-main-blue font-bold cursor-pointer hover:bg-light-green/50 transition-colors" >
          A
        </div>
      </div>
    </nav>
  );
};
