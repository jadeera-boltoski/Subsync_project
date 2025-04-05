// import React from 'react'
import { Card, CardContent } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import View_hardware from "./Hardware_pages/View_hardware";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDashboardData } from "../Redux/slices/dashboardSlice";


function Hardware() {
  const location = useLocation();
  const isAddinghardware = location.pathname === "/dashboard/hardware";
  const navigate = useNavigate();

  const dispatch = useDispatch();
  
  const  { 
    total_active_hardware, 
    warranty_expiring,
    maintenance_due,
    hardware_cost,
    loading, 
    error 
  }= useSelector((state) => state.dashboard);
  console.log("🔍 Redux Dashboard State:", useSelector((state) => state.dashboard));

  useEffect(() => {
      dispatch(fetchDashboardData());
    }, [dispatch]);

   
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
  
  const statusData = [
    {
      label: 'Total Active Hardware',
      value: total_active_hardware,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
      // route:'/dashboard/hardware/view_hardware'
    },
    {
      label: 'Warranty Expiring Soon',
      value: warranty_expiring,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500'
    },
    {
      label: 'Maintenance Due',
      value: maintenance_due,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    },
    {
      label: 'Yearly spending',
      value: `₹${hardware_cost}`,
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    }
  ];
  
  return (
    <div className="container max-w-full px-4">
      {isAddinghardware && (
        <div>

           
            <div className="flex justify-center md:justify-start mb-2">
            <button
              onClick={() => { navigate('/dashboard/hardware/add_hardware') }}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white font-semibold text-lg sm:text-xl rounded hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-md"
            >
              Add New Hardware
            </button>
          </div>





         
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
            {statusData.map((item, index) => (
              <Card key={index} className="w-full">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className={`w-2 h-8 mr-4 ${item.color}`}></div>
                    <div>
                      <p className="text-sm md:text-base text-gray-600">{item.label}</p>
                      <p className={`text-xl md:text-2xl font-bold ${item.textColor}`}>{item.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
        
          
          {/* Hardware view  */}

         <div>
          <h1 className="text-end mr-6 font-bold text-blue-500" onClick={()=>{navigate('view_hardware')}}>View All Hardware</h1>
            <div className="">
              <View_hardware limit={7} />
            </div>
         </div>
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default Hardware;