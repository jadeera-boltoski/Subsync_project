import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faNewspaper,
  faMicrochip,
  faUsers,
  faTools,
  faBars,
  faXmark,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../assets/logo.png";

function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth >= 1024) setIsMobileMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: faHouse, exact: true },
    { name: "Subscriptions", path: "/dashboard/subscriptions", icon: faNewspaper, exact: false },
    { name: "Hardware", path: "/dashboard/hardware", icon: faMicrochip, exact: false },
    { name: "Customer Services", path: "/dashboard/services", icon: faTools, exact: false },
    { name: "User Management", path: "/dashboard/users", icon: faUsers, exact: false },
    { name: "Masters", path: "/dashboard/masters", icon: faTable, exact: false }
  ];

  // Function to determine if menu item is active based solely on URL
  const isMenuActive = (itemPath, exactMatch = false) => {
    const currentPath = location.pathname;
    
    if (exactMatch) {
      // For dashboard, only highlight when it's exactly /dashboard
      return currentPath === itemPath;
    } else {
      // For other items, check if the current path contains this menu item's path
      // This handles nested routes like /dashboard/subscriptions/add
      return currentPath.startsWith(itemPath) && currentPath !== "/dashboard";
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleMobileMenu} className="p-2 bg-slate-900 text-white rounded-md">
          <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} className="text-xs" />
        </button>
      </div>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-opacity-50 z-40" />}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-slate-900 text-white z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6">
          <div className="flex items-center mb-10">
            <img src={Logo} alt="SUBSYNC" className="h-8 pl-4" />
            <div className="ml-3">
              <div className="text-xl font-bold">SUBSYNC</div>
              <div className="text-xs">Simplify. Optimize. Grow.</div>
            </div>
          </div>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={toggleMobileMenu}
                className={`flex items-center p-3 rounded-lg text-base cursor-pointer transition ${
                  isMenuActive(item.path, item.exact) 
                    ? "bg-teal-500 text-white" 
                    : "hover:bg-slate-800 text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3 text-lg" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet Sidebar */}
      <div className="w-20 bg-slate-900 text-white h-screen p-4 hidden md:block lg:hidden">
        <div className="flex justify-center mb-10">
          <img src={Logo} alt="SUBSYNC" className="h-10" />
        </div>
        <div className="space-y-8 flex flex-col items-center">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center p-3 rounded-lg text-lg cursor-pointer transition w-12 h-12 ${
                isMenuActive(item.path, item.exact) 
                  ? "bg-teal-500 text-white" 
                  : "hover:bg-slate-800 text-gray-300"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="text-xl" />
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="w-80 bg-slate-900 text-white h-screen p-6 hidden lg:block">
        <div className="flex items-center mb-10">
          <img src={Logo} alt="SUBSYNC" className="h-10" />
          <div className="ml-3">
            <div className="text-2xl font-bold">SUBSYNC</div>
            <div className="text-sm">Simplify. Optimize. Grow.</div>
          </div>
        </div>
        <div className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-4 rounded-lg text-lg cursor-pointer transition ${
                isMenuActive(item.path, item.exact) 
                  ? "bg-teal-500 text-white" 
                  : "hover:bg-slate-800 text-gray-300"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="mr-4 text-xl" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;