import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../Redux/slices/dashboardSlice';
import { fetchSubscriptionData } from '../Redux/slices/subscriptionSlice';
import Expiringsubscription from "./subscription_pages/Expiringsubscription";

const Subscription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAddingSubscription = location.pathname === "/dashboard/subscriptions";
  
  const dispatch = useDispatch();
  const { total_active_subscriptions, expired_count, total_subscription_cost, loading: dashboardLoading, error: dashboardError } = useSelector((state) => state.dashboard);
  const { subscriptions, loading, error } = useSelector((state) => state.subscriptions);
  

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchSubscriptionData());
  }, [dispatch]);

  if (dashboardLoading || loading) return <p>Loading...</p>;
  if (dashboardError || error) return <p>Error: {dashboardError || error}</p>;

  const statusData = [
    { label: "Total Active Subscriptions", value: total_active_subscriptions || 0, color: "bg-green-500", textColor: "text-green-700" },
    { label: "Total Expired Subscriptions", value: expired_count || 0, color: "bg-yellow-500", textColor: "text-yellow-600" },
    { label: "Total Monthly Cost", value: ` ₹${total_subscription_cost}`, color: "bg-blue-500", textColor: "text-blue-700" }
  ];
  const handleViewDetails = (subscription) => {
   
    navigate('/dashboard/subscriptions/Viewdetails', { state: { subscription } });
    
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-2">
      {isAddingSubscription && (
        <div>
          <div className="flex justify-center sm:justify-start">
            <button
              onClick={() => navigate('/dashboard/subscriptions/addsubscription')}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white font-semibold text-lg sm:text-xl rounded hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-md"
            >
              Add New Subscription
            </button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {statusData.map((item, index) => (
              <Card key={index} className="w-full  hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className={`w-2 h-8 mr-4 ${item.color}`}></div>
                    <div className="flex-1">
                      <p className="text-sm md:text-base text-gray-600">{item.label}</p>
                      <p className={`text-xl md:text-2xl font-bold ${item.textColor}`}>{item.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Expiring Subscriptions */}
          <div className="mt-4">
            <Expiringsubscription />
          </div>

          {/* View Subscription Details */}
          <div className="cursor-default">
            <div
              className="flex justify-end mr-4 mb-1 text-blue-500 font-bold cursor-pointer hover:underline"
              onClick={() => navigate('/dashboard/subscriptions/Viewsubscription')}
            >
              <h1>View All Details</h1>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left font-semibold">Category</th>
                    <th className="py-3 px-4 text-left font-semibold">Name</th>
                    <th className="py-3 px-4 text-left font-semibold">Start Date</th>
                    <th className="py-3 px-4 text-left font-semibold">End Date</th>
                    <th className="py-3 px-4 text-left font-semibold">Billing Cycle</th>
                    <th className="py-3 px-4 text-left font-semibold">Provider</th>
                    <th className="py-3 px-4 text-left font-semibold">Cost</th>
                    <th className="py-3 px-4 text-left font-semibold">Status</th>
                    <th className="py-3 px-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.slice(0, 4).map(subscription => (
                    <tr key={subscription.id} className="border-b border-b-gray-300 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{subscription.subscription_category}</td>
                      <td className="py-3 px-4 text-sm">{subscription.name}</td>
                      <td className="py-3 px-4 text-sm">{subscription.start_date}</td>
                      <td className="py-3 px-4 text-sm">{subscription.end_date}</td>
                      <td className="py-3 px-4 text-sm">{subscription.billing_cycle}</td>
                      <td className="py-3 px-4 text-sm">{subscription.providerName}</td>
                      <td className="py-3 px-4 text-sm">{subscription.cost}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {subscription.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <button
                           onClick={() => handleViewDetails(subscription)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Subscription;
