import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Dashboard() {
    const location = useLocation();
    const [message, setMessage] = useState("");
    
    useEffect(() => {
        if (location.state && location.state.message) {
            setMessage(location.state.message);
            
            // Hide message after 3 seconds
            setTimeout(() => setMessage(""), 1000);
        }
    }, [location]);
    
    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Sidebar - hidden on mobile, assumes Sidebar component handles its own responsiveness */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-gray-200 w-full overflow-hidden">
                {/* Header */}
                <Header />
                
                {/* Dashboard Content */}
                <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                    
                    <div className="h-full">
                        <Outlet />
                    </div>
                    
                    {/* Popup Message */}
                    {message && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-20">
                            <div className="text-green-500 font-light font-serif text-center p-4 md:p-8 rounded-lg text-xl md:text-2xl bg-white bg-opacity-95 shadow-lg mx-4">
                                {message}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;