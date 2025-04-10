import { useFormik } from 'formik';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { deletecustomer, editcustomer } from '../../services/allapi';
import { format } from "date-fns";

const View_customerdetails = () => {
  const navigate = useNavigate();


  const location = useLocation()

  const customer = location.state?.customer;
  console.log("dfdf", customer);

  const formik = useFormik({
    initialValues: {
      customer:customer?.id||'',
      customer_name: customer?.customer_name || '',
      customer_email: customer?.customer_email || '',
      customer_phone: customer?.customer_phone || '',
      customer_type: customer?.customer_type || '',
      billingCycle: customer?.billingCycle || '',
      startDate: customer?.startDate || '',
      endDate: customer?.endDate || '',
      lastPaymentDate: customer?.lastPaymentDate || '',
      cost: customer?.cost || '',
      paymentMethod: customer?.paymentMethod || '',
      resources: customer?.resources || []
    },
    onSubmit: async (values) => {
      console.log("hello jadeera", values);
           try {
             const response = await editcustomer(values)
             console.log(response);
             if(response.status==200){
                // const updateddevice = await getSingledevice(devices.id);
              //  setdevice(updateddevice);
               alert(response.message)
             }
             else{
               alert(response.message)
             }
             
             
           } catch (error) {
             console.error("Error deleting hardware:", error);
             alert("Something went wrong!");
           }

    }

  })

  // Calculate days remaining until subscription ends
  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


  // const getStatusColor = (status) => {
  //   switch (status.toLowerCase()) {
  //     case 'active':
  //       return 'bg-green-100 text-green-800';
  //     case 'inactive':
  //       return 'bg-red-100 text-red-800';
  //     case 'pending':
  //       return 'bg-yellow-100 text-yellow-800';
  //     case 'expired':
  //       return 'bg-gray-100 text-gray-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

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
  const [edit, setedit] = useState(false)
  const handleedit = () => {
    setedit(!edit)
  }

  const handledelete = async () => {
    const confirmChange = window.confirm("you need to delete this customer details?")
    if (confirmChange) {
      const response = await deletecustomer(customer.id)
      console.log(response);
      if (response.status == 200) {
        alert(response.message)
        navigate("/dashboard/services/view_allcustomers")
      } else {
        alert(response.message)
      } // Stop the category change if the user cancels
    }
  }

  return (
    <div >
      <div className="flex items-center text-sm text-gray-600 pl-1 mb-2">
        <div
          onClick={() => navigate("/dashboard/services")}
          className="hover:text-blue-600 hover:underline cursor-pointer"
        >
          Customer service Dashboard
        </div>
        <div className="mx-1">&gt;</div>

        <div
          onClick={() => navigate('/dashboard/services/view_customers')}
          className="hover:text-blue-600 hover:underline cursor-pointer"
        >
          Customer List
        </div>
        <div className="mx-1">&gt;</div>

        <div className="text-blue-600">View Details of {customer.customer_name}</div>
      </div>
      <div className='flex'>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-full max-h-[90vh] overflow-y-auto m-4">
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h3 className="text-lg font-semibold">customer Details</h3>
          </div>

          <div className="p-6">

            <div className="mb-6 border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{customer.customer_name}</h2>
                  <p className="text-gray-600">{formatBillingCycle(customer.billingCycle)} Plan</p>
                </div>
                {/* <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </div> */}
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
                  {/* <p><span className="font-medium">Type:</span> {customer.customer_type}</p> */}
                </div>
              </div>

              {/* Subscription Details */}
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium text-gray-700 mb-3">Subscription Details</h4>
                <div className="space-y-2">
                  {/* <p><span className="font-medium">Subscription ID:</span> {subscription.id}</p> */}
                  <p><span className="font-medium">Billing Cycle:</span> {formatBillingCycle(customer.billingCycle)}</p>
                  <p><span className="font-medium">Cost:</span> ₹{formatPrice(customer.cost)}</p>
                  <p><span className="font-medium">Payment Method:</span> {customer.paymentMethod.replace('_', ' ')}</p>
                </div>
              </div>

              {/* Date Information */}
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium text-gray-700 mb-3">Date Information</h4>
                <div className="space-y-2">

                  <p><span className="font-medium">Service start Date:</span>{format(new Date(customer.startDate), "dd-MM-yyyy")}</p>
                  <p><span className="font-medium">Service end Date:</span>{format(new Date(customer.endDate), "dd-MM-yyyy")}
                  </p>
                  {customer.lastPaymentDate && (
                    <p><span className="font-medium">Last Payment Date:</span> {format(new Date(customer?.lastPaymentDate), "dd-MM-yyyy")}</p>)}

                  {calculateDaysRemaining(customer.endDate) > 0 && calculateDaysRemaining(customer.endDate) < 10 ? (
                    <p className="mt-2">
                      <span className="font-medium">Days Remaining:</span>
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                        {calculateDaysRemaining(customer.endDate)} days
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2">
                      <span className="font-medium">customer service Status:</span>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${customer.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : customer.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : customer.status === 'Inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800' // Default fallback
                          }`}
                      >
                        {customer.status}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Status Information */}
              {/* <div className="bg-gray-50 p-4 rounded"> */}
              {/* <h4 className="font-medium text-gray-700 mb-3">Status Information</h4> */}
              {/* <div className="space-y-2"> */}
              {/* <p>
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </p> */}
              {/* <p><span className="font-medium">Customer ID:</span> {customer.id}</p> */}
              {/* </div> */}
              {/* </div>   */}
              {/* Resources Section */}
              <div className="mt-6 bg-gray-50 p-4 rounded">
                <h4 className="font-medium text-gray-700 mb-3">Resources</h4>
                {customer.resources ? (
                  <ul className="list-disc pl-5">
                    {customer.resources.map((resource, index) => (
                      <li key={index}>
                        {/* The error is likely here - resource might be an object instead of a string */}
                        {typeof resource === 'object'
                          ? resource.resource_name || JSON.stringify(resource)
                          : resource}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No resources assigned to this customer.</p>
                )}
              </div>
            </div>
          </div>



          <div className="border-t px-6 py-4 flex justify-end">
            <button
              onClick={() => navigate('/dashboard/services/view_allcustomers')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
            >
              Back
            </button>
            <button
              onClick={handleedit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={handledelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
        {edit && (
          <div className='w-3/5 bg-white rounded-lg shadow-xl p-6 ml-4 max-h-[90vh] overflow-y-auto transition-all duration-300 mt-4'>
            <h3 className="text-xl font-semibold mb-6 border-b pb-3">Edit Customer Details</h3>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <div className="mb-4">
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customer_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customer_name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="customer_email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customer_email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="customer_phone"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customer_phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
{/* 
                <div className="mb-4">
                  <label htmlFor="customer_type" className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                  <input
                    type="text"
                    name="customer_type"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customer_type}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div> */}

                <div className="mb-4">
                  <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                  <select
                    name="billingCycle"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.billingCycle}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a billing cycle</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Service start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.startDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Service End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.endDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="lastPaymentDate" className="block text-sm font-medium text-gray-700 mb-1">Last Payment Date</label>
                  <input
                    type="date"
                    name="lastPaymentDate"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastPaymentDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                  <input
                    type="number"
                    name="cost"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cost}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.paymentMethod}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a payment method</option>
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="Bank_Transfer">Bank Transfer</option>
                    <option value="Prepaid_Cards">Gift Cards & Prepaid Cards</option>
                    <option value="Cash_Payments">Cash Payments (For offline or manual renewals)</option>
                  </select>
                </div>

                {/* <div className="mb-4">
                  <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-1">Resources</label>
                  <textarea
                    name="resources"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.resources||''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                  {/* <p className="text-xs text-gray-500 mt-1">Enter resources in JSON format: [{"resource_name":"Resource 1"},{"resource_name":"Resource 2"}]</p> */}
                {/* </div> */}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleedit}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                     {formik.isSubmitting ? 'Updating...' : ' Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default View_customerdetails;
