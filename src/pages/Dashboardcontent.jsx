// import React from 'react';
import { Card, CardContent } from '@mui/material';
import Expenseanalysis from "./dashboard_componenets/Expenseanalysis";
import Serverusage from "./dashboard_componenets/Serverusage";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchDashboardData } from '../Redux/slices/dashboardSlice';



function Dashboardcontent() {
  const navigate=useNavigate()

  const dispatch = useDispatch();

  const  { 
    total_active_subscriptions, 
    total_hardware,
    total_active_customers,
    total_resources,
    loading, 
    error 
  }= useSelector((state) => state.dashboard);
  console.log("🔍 Redux Dashboard State:", useSelector((state) => state.dashboard));

  useEffect(() => {
      dispatch(fetchDashboardData());
    }, [dispatch]);

   
  
    if (loading) return <p className='text-center'>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
  






 
  // Sample data - replace with your actual data
  const statusData = [
    {
      label: "Total Active subscriptions",
      value: total_active_subscriptions,
      color: "bg-green-500",
      textColor: "text-green-700",
      route: "/dashboard/subscriptions/Viewsubscription" 
    },
    {
      label: "Total Hardware Item ",
      value: total_hardware,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      route: "/dashboard/hardware/view_hardware" 
    },
    {
      label: "Total Active Customers",
      value: total_active_customers,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      route: "/dashboard/services/view_customers" 
    },
    {
      label: "Total Hosted Resources",
      value: total_resources,
      color: "bg-orange-400",
      textColor: "text-orange-700",
      route: "/dashboard/services/view_resources"
       
    }
  ];

  return (
    <div className="container max-w-full px-4">
      {/* Status Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusData.map((item, index) => (
          <Card key={index} className="w-full"
          onClick={() => navigate(item.route)}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={` w-2 h-8  ${item.color}`}></div>
                <div className="flex-1">
                  <p className="text-sm ml-4 md:text-base text-gray-600">{item.label}</p>
                  <p onClick={()=>{navigate()}} className={`ml-4 text-xl md:text-2xl font-bold ${item.textColor}`}>
                    {item.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Warning Section */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        <Card className="w-full h-20 bg-red-50 border-red-200 col-span-1 sm:col-span-2 lg:col-span-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-8 mr-4 bg-red-500 "></div>
                <div>
                  <p className="text-sm md:text-base text-gray-600">Critical Warnings</p>
                  <p className="text-xl md:text-2xl font-bold text-red-700">3</p>
                </div>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Analytics Section - Stacks vertically on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full mt-6" >
          
          <Expenseanalysis />
        </div>
        <div className="w-full mt-6" >
          {/* <Customerpiechart/> */}
          <h6 className='font-bold text-s text-blue-400 ml-auto mb-4 cursor-default ' onClick={() => navigate("/dashboard/server_usage")}>View Report of Server Usage</h6> 
          <Serverusage />
          
        </div>
      </div>
    </div>
  );
}

export default Dashboardcontent;