import { useLocation, useNavigate } from 'react-router-dom';

const View_customerdetails = () => {
  const navigate = useNavigate();
  

  const location=useLocation()

  const customer = location.state?.customer;
  console.log("dfdf",customer);

  // Calculate days remaining until subscription ends
  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format status with appropriate color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format billing cycle with proper capitalization
  const formatBillingCycle = (cycle) => {
    return cycle.charAt(0).toUpperCase() + cycle.slice(1);
  };

  // Format price with commas and two decimal places
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
      <div className="flex justify-between items-center border-b px-6 py-4">
        <h3 className="text-lg font-semibold">customer Details</h3>
      </div>
      
      <div className="p-6">
     
        <div className="mb-6 border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">customer #{customer.id}</h2>
              <p className="text-gray-600">{customer.customer_name} - {formatBillingCycle(customer.billingCycle)} Plan</p>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                {customer.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Customer Information</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {customer.customer_name}</p>
              <p><span className="font-medium">Email:</span> <a href={`mailto:${customer.customer_email}`} className="text-blue-500 hover:underline">{customer.customer_email}</a></p>
              <p><span className="font-medium">Phone:</span> {customer.customer_phone}</p>
              <p><span className="font-medium">Type:</span> {customer.customer_type}</p>
            </div>
          </div>
          
          {/* Subscription Details */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Subscription Details</h4>
            <div className="space-y-2">
              {/* <p><span className="font-medium">Subscription ID:</span> {subscription.id}</p> */}
              <p><span className="font-medium">Billing Cycle:</span> {formatBillingCycle(customer.billingCycle)}</p>
              <p><span className="font-medium">Cost:</span> ${formatPrice(customer.cost)}</p>
              <p><span className="font-medium">Payment Method:</span> {customer.paymentMethod.replace('_', ' ')}</p>
            </div>
          </div>
          
          {/* Date Information */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Date Information</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Start Date:</span> {customer.startDate}</p>
              <p><span className="font-medium">End Date:</span> {customer.endDate}</p>
              <p><span className="font-medium">Last Payment Date:</span> {customer.lastPaymentDate}</p>
              {calculateDaysRemaining(customer.endDate) > 0 ? (
                <p className="mt-2">
                  <span className="font-medium">Days Remaining:</span> 
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    {calculateDaysRemaining(customer.endDate)} days
                  </span>
                </p>
              ) : (
                <p className="mt-2">
                  <span className="font-medium">customer Status:</span> 
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                    Expired
                  </span>
                </p>
              )}
            </div>
          </div>
          
          {/* Status Information */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Status Information</h4>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </p>
              <p><span className="font-medium">User ID:</span> {customer.user}</p>
            </div>
          </div>
        </div>
        
        {/* Resources Section */}
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h4 className="font-medium text-gray-700 mb-3">Resources</h4>
          {customer.resources ? (
            <ul className="list-disc pl-5">
              {customer.resources.map((resource, index) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No resources assigned to this customer.</p>
          )}
        </div>
      </div>
      
      <div className="border-t px-6 py-4 flex justify-end">
        <button 
          onClick={() => navigate('/dashboard/subscriptions')}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
        >
          Back
        </button>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Edit
        </button>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Renew Subscription
        </button>
      </div>
    </div>
  );
};

export default View_customerdetails;
