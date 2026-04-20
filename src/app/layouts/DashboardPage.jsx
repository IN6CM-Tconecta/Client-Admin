import { DashboardContainer } from "../../shared/components/layout/DashboardContainer";

/*
* El DashboardPage es el componente que se renderiza en la ruta "/dashboard". 
* Es el contenedor principal de la página de dashboard, donde se muestran las estadísticas 
* y gráficos relacionados con el rendimiento del sistema. Este componente se encarga de organizar 
* y mostrar los diferentes widgets y componentes que conforman el dashboard, proporcionando una 
* vista general de la información relevante para el usuario. 
*/
export const DashboardPage = () => {
    return(
        <DashboardContainer>
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-pale-blue/30 overflow-hidden flex-1">
                <div className="p-4 border-b border-pale-blue/30 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-main-blue">Visor de Rutas y Estaciones</h2>
                        <p className="text-sm text-gray-500">Supervisión en tiempo real de T-Conecta</p>
                    </div>
                </div>
                <div className="flex-1 w-full bg-gray-100 flex items-center justify-center p-2 relative" style={{ minHeight: "500px" }}>
                    <iframe 
                        src="https://www.google.com/maps/d/embed?mid=1OHKGTQ0nKQ1PNmE30sQIxY_gMR_JTdQ&ehbc=2E312F" 
                        width="100%" 
                        height="100%" 
                        className="rounded-lg shadow-inner absolute inset-0 w-full h-full border-0"
                        title="T-Conecta Public Transport Map"
                    ></iframe>
                </div>
            </div>
        </DashboardContainer>
    );
}