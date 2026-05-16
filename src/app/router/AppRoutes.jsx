import {Route, Routes} from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage";
import { DashboardPage } from "../layouts/DashboardPage";
 
export const AppRoutes = ()=> {
 
    return (
        <Routes>
            {/* PÚBLICAS*/}
            <Route path="/" element={<AuthPage />}/>

            {/* PROTEGIDO POR ROLE */}
            <Route path="/dashboard" element={<DashboardPage />}/>
        </Routes>
    );
}