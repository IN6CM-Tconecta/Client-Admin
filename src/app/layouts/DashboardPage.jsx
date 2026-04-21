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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 self-start">Mapa de Rutas Transmetro</h2>
                <iframe 
                    src="https://www.google.com/maps/d/embed?mid=1OHKGTQ0nKQ1PNmE30sQIxY_gMR_JTdQ&ehbc=2E312F" 
                    width="100%" 
                    height="600" 
                    className="rounded-lg border-none max-w-5xl"
                    title="Mapa de Rutas"
                ></iframe>
            </div>
        </DashboardContainer>
    );
}