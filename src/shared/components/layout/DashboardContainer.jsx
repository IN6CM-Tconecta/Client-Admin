import { useState } from "react";
import { Navbar } from "./Navbar.jsx";
import { Sidebar } from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

export const DashboardContainer = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return(
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar onMenuClick={toggleSidebar} />
            <div className="flex flex-1 relative overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}