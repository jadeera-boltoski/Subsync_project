import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import Customerpiechart from "./service_pages/Customerpiechart";
import Serverusage from "./dashboard_componenets/Serverusage";
import View_customers from "./service_pages/View_customers";
import View_resources from "./service_pages/View_resources";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../Redux/slices/dashboardSlice";


function Services() {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const location = useLocation();
  const newPage = location.pathname;

  const dispatch = useDispatch();

  const {

    total_active_customers,
    total_resources,
    loading,
    error
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);



  if (loading) return <p className='text-center'>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    if (click) setClick(false);
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-6" onClick={handleClickOutside}>
      {newPage === "/dashboard/services" && (
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">

            <div className="relative inline-block z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering handleClickOutside
                  setClick(!click);
                }}
                className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white font-semibold text-base sm:text-lg rounded hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-md"
                aria-expanded={click}
                aria-haspopup="true"
              >
                +Add
              </button>
              {click && (
                <div className="absolute left-0 top-full mt-2 w-40 sm:w-48 bg-amber-300 shadow-lg rounded-lg z-30">
                  <ul className="py-1 text-gray-700">
                    <li
                      className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                      onClick={() => {
                        setClick(false);
                        navigate("/dashboard/services/add_resources");
                      }}
                    >
                      Add Resource
                    </li>
                    <li
                      className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                      onClick={() => {
                        setClick(false);
                        navigate("/dashboard/services/add_customers");
                      }}
                    >
                      Add Customer
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Main dashboard grid - more responsive layout */}
          <div className="mt-2">
            {/* cols 4 aynu 3 aaki */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Customer Distribution */}
              {/* <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md h-auto">
                <h2 className="font-bold text-sm sm:text-base mb-6 sm:mb-12 ml-1 text-gray-500">Customer Distribution</h2>
                <div className="w-full h-48 sm:h-60">
                  <Customerpiechart />
                </div>
              </div> */}

              {/* Server Usage - spans 2 columns on larger screens */}
              <div className="bg-white rounded-lg shadow-md h-auto sm:col-span-2">
              <h6 className='font-bold text-s text-blue-400 ml-auto mt-2 mb-4 cursor-default ' onClick={() => navigate("/dashboard/server_usage")}>View Report of Server Usage</h6> 
                <Serverusage />
              </div>

              {/* Metrics Cards - spans full width on mobile, 2 columns on tablet, 1 column on desktop */}
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md sm:col-span-2 lg:col-span-1">
                <h2 className="font-bold text-sm sm:text-base mb-4 sm:mb-6 ml-1 text-gray-500">Additional Metrics</h2>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {/* Box 1: Active Customers */}
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200" onClick={()=>{navigate('/dashboard/services/view_allcustomers')}}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Total Active Customers</p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-700">{total_active_customers}</p>
                      </div>
                      <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Box 2: Total Resources */}
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200" onClick={()=>{navigate('/dashboard/services/view_resources')}}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Total Resources</p>
                        <p className="text-xl sm:text-2xl font-bold text-purple-700">{total_resources}</p>
                      </div>
                      <div className="bg-purple-100 p-1.5 sm:p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Box 3: Warning */}
                  {/* <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200"   onClick={()=>{navigate('/dashboard/notifications')}}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Critical Warnings</p>
                        <p className="text-xl sm:text-2xl font-bold text-red-700">3</p>
                      </div>
                      <div className="bg-red-100 p-1.5 sm:p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section - More responsive layout */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-3 sm:mt-4">
            {/* Customer details */}
            {/* Customer details */}
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
              <div className="flex justify-end items-center mb-2">
                <button
                  className="text-xs sm:text-sm font-bold text-blue-500 hover:text-blue-700 transition-colors"
                  onClick={() => navigate('/dashboard/services/view_customers')}
                >
                  View all customer details
                </button>
              </div>
              <div className="overflow-x-auto">
                <View_customers limit={4} />
              </div>
            </div>


            {/* Resources details */}
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
              <div className="flex justify-end items-center mb-2">
                <button
                  className="text-xs sm:text-sm font-bold text-blue-500 hover:text-blue-700 transition-colors"
                  onClick={() => navigate('/dashboard/services/view_resources')}
                >
                  View all Resources details
                </button>
              </div>
              <div className="overflow-x-auto">
                <View_resources limit={4} />
              </div>
            </div>
          </div>
        </div>

      )}
      <Outlet />
    </div>
  );
}

export default Services;