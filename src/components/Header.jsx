import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import NotificationsIcon from "../pages/dashboard_componenets/NotificationsIcon";
import { getuser_role } from "../services/allapi";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [pageTitle, setPageTitle] = useState("Dashboard");
    const [showLogout, setShowLogout] = useState(false);
    const [user, setUser] = useState({
        username: '',
        email: '',
        is_superuser: false
    });

    useEffect(() => {
        const pageTitles = {
            "/dashboard": "Dashboard",
            "/dashboard/subscriptions": "Subscriptions",
            "/dashboard/hardware": "Hardware",
            "/dashboard/services": "Services",
            "/dashboard/users": "User Management",
        };

        const matchedRoute = Object.keys(pageTitles)
            .reverse()
            .find(route => location.pathname.includes(route));

        setPageTitle(pageTitles[matchedRoute] || "Dashboard");
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const toggleLogoutMenu = () => {
        setShowLogout(!showLogout);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await getuser_role();
                console.log("user profile", response);
                setUser({
                    username: response.username || '',
                    email: response.email || '',
                    is_superuser: response.is_superuser || false
                });
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
        fetchUserProfile();
    }, []);

  

    // Get the first letter of the username and convert to uppercase
    const initial = user.username ? user.username.charAt(0).toUpperCase() : '?';

    return (
        <div className="bg-white p-4 md:p-6 flex items-center justify-between shadow-md w-full h-15">
            <div className="flex items-center gap-4">
                <h1 className="text-xl md:text-3xl font-bold whitespace-nowrap ml-12 md:ml-0 text-gray-500">
                    {pageTitle}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* <div>
                    <NotificationsIcon />
                </div> */}

                <div className="relative">
                    <div
                        className="w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white text-l md:text-2xl cursor-pointer bg-blue-400"
                        onClick={toggleLogoutMenu}
                    >
                            {initial}
                        
                    </div>

                    {showLogout && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">
                            <div className="px-4 py-2 border-b mb-1">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {user.username || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.email || 'No email'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.is_superuser ? "Super User" : "Regular User"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;