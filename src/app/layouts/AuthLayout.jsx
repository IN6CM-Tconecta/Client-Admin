import { Outlet } from 'react-router-dom';
import bgFondo from '../../assets/img/fondo.png';

export const AuthLayout = () => {
    return (
        <div 
            className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${bgFondo})` }}
        >
            <div className="w-full flex justify-center animate-fadeIn">
                <Outlet />
            </div>
        </div>
    );
};