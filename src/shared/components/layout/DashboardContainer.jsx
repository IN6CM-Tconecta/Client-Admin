import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

/* 
    DashboardContainer.jsx: Este componente es el contenedor principal para el panel de administración.
*/
export const DashboardContainer = () => {

    return(
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 
                Navbar
                Aquí se renderiza el componente Navbar, 
                que es la barra de navegación superior del panel de administración.
            */}
            
            <Navbar />

            <div className="flex flex-1">
                {/* Sidebar */}
                {/* 
                    Sidebar
                    Aquí se renderiza el componente Sidebar, 
                    que es la barra lateral de navegación del panel de administración.
                */}

                <Sidebar />

                <main className="flex-1 p-6">
                    {/* 
                        Children
                        Aquí se renderiza el contenido principal del panel de administración, 
                        que se pasará como children al componente DashboardContainer.
                        Contenido del menú
                    */}

                </main>
            </div>
        </div>
    );
}