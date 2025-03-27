import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Notifications from "../pages/dashboard_componenets/NotificationsIcon";
import NotificationsIcon from "../pages/dashboard_componenets/NotificationsIcon";


function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    // const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [pageTitle, setPageTitle] = useState("Dashboard");
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        const pageTitles = {
            "/dashboard": "Dashboard",
            "/dashboard/subscriptions": "Subscriptions",
            "/dashboard/hardware": "Hardware",
            "/dashboard/services": "Services",
            "/dashboard/users": "User Management",
            // // Add nested routes
            // "/dashboard/subscriptions/addsubscription": "Add Subscription",
            // "/dashboard/hardware/add_hardware": "Add Hardware",
            // "/dashboard/services/add_resources": "Add Resources",
            // "/dashboard/users/adduser": "Add User"
        };
        
        const matchedRoute = Object.keys(pageTitles)
            .reverse() // Start with most specific routes
            .find(route => location.pathname.includes(route));
        
        setPageTitle(pageTitles[matchedRoute] || "Dashboard");
    }, [location]);

    const handleLogout = () => {
        // Add your logout logic here
        // This could be clearing localStorage, cookies, or calling an API
        localStorage.removeItem("token"); // Example: remove auth token
        navigate("/"); // Redirect to login page
    };

    const toggleLogoutMenu = () => {
        setShowLogout(!showLogout);
    };

    return (
        <div className="bg-white p-4 md:p-6 flex items-center justify-between shadow-md w-full h-15">
            <div className="flex items-center gap-4">
                {/* Dynamic Page Title */}
                <h1 className="text-xl md:text-3xl font-bold whitespace-nowrap ml-12 md:ml-0 text-gray-500">{pageTitle}</h1>
            </div>

            {/* Search and Profile */}
            <div className="flex items-center gap-4">
                {/* Mobile*/}
                {/* <button
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                    className="md:hidden"
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
                {isSearchVisible && (
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white rounded-lg shadow-lg p-2 z-50">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search here..."
                                className="w-full border-none px-3 py-2 text-sm focus:outline-none"
                                autoFocus
                            />
                            <button
                                onClick={() => setIsSearchVisible(false)}
                                className="ml-2 text-gray-600 hover:text-red-500"
                                aria-label="Close Search"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    </div>
                )} */}

                {/*Desktop*/}
                {/* <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Search here"
                        className="border rounded-full py-2 px-6 pr-10 text-base md:text-lg w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg md:text-xl text-gray-600">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </span>
                </div> */}

                {/* notification */}
                <div>
                    
                   <NotificationsIcon/>
                </div>





                {/* Profile Icon with Logout Dropdown */}
                <div className="relative">
                    <div 
                        className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl cursor-pointer"
                        onClick={toggleLogoutMenu}
                    >
                        <div>l</div>
                    </div>
                    
                    {showLogout && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
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