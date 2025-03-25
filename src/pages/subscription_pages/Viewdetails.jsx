// import React from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import Edit_subscription from './Edit_subscription';
import { useFormik } from 'formik';
import { deleteSubscription, updateSubscription } from '../../services/allapi';
import { subscriptionValidationSchema } from '../../validation/yup';


const Viewdetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract subscription data from location state
  const subscription = location.state?.subscription;
  const [edit, SetEdit] = useState(false);

  const formik = useFormik({
    initialValues: {
      id:subscription.id,
      version: subscription.software_version || '',
      autoRenewal: subscription.auto_renewal|| false,
      numberOfUsers: subscription.software_no_of_users || 1,
      // paymentStatus: subscription.payment_status || 'unpaid',
      // nextPaymentDate: subscription.next_payment_date || '',
      cost: subscription.cost || 0
    },
    validationSchema: subscriptionValidationSchema,
    onSubmit: async (values) => {
      try {
        console.log("edit response",values);
        
        // Call API to update subscription
        const response = await updateSubscription(values);
        console.log(response);
        if (response.status === 200) {
          alert(response.message);
          SetEdit(false)
          // Optionally refresh the subscription data or navigate
          navigate('/dashboard/subscriptions/Viewdetails', { 
            state: { message: 'Subscription updated successfully' } 
          });
        } else {
          alert(response.message || 'Failed to update subscription');
        }
      } catch (error) {
        console.error('Update failed:', error);
        alert('An error occurred while updating the subscription');
      }
    }
  });
  console.log(formik.autoRenewal);
  


  // If no subscription data is found, handle gracefully
  if (!subscription) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600 mb-4">No subscription data available</p>
        <button
          onClick={() => navigate('/dashboard/subscriptions')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Subscriptions
        </button>
      </div>
    );
  }

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
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format payment status with appropriate color
  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle close button click
  const handleClose = () => {
    navigate('/dashboard/subscriptions');
  };

  const handledelete = async () => {
    const response = await deleteSubscription(subscription.id)
    console.log(response);
    if (response.status == 200) {
      alert(response.message)
      navigate("/dashboard/subscriptions/Viewsubscription")
    } else {
      alert("something went wrong")
    }

  };


  // Render subscription-specific details based on category
  const renderCategorySpecificDetails = () => {
    switch (subscription.subscription_category.toLowerCase()) {
      case 'software':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Software Details</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Software ID:</span> {subscription.software_id}</p>
              <p><span className="font-medium">Version:</span> {subscription.software_version}</p>
              <p><span className="font-medium">Number of users:</span> {subscription.software_no_of_users}</p>
              <p><span className="font-medium">Auto Renewal:</span> {subscription.auto_renewal ? 'Yes' : 'No'}</p>
            </div>
          </div>
        );

      case 'server':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Server Details</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Server ID:</span> {subscription.server_id}</p>
              <p><span className="font-medium">Server Type:</span> {subscription.server_type}</p>
              <p><span className="font-medium">Server Capacity:</span> {subscription.server_capacity}</p>
              <p><span className="font-medium">Auto Renewal:</span> {subscription.auto_renewal ? 'Yes' : 'No'}</p>
            </div>
          </div>
        );

      case 'domain':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Domain Details</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Domain ID:</span> {subscription.domain_id}</p>
              <p><span className="font-medium">Domain Type:</span> {subscription.domain_type}</p>
              {subscription.ssl_certification !== undefined && (
                <p><span className="font-medium">SSL Certificate:</span> {subscription.ssl_certification ? 'Yes' : 'No'}</p>
              )}
              {subscription.ssl_expiry_date && (
                <p><span className="font-medium">SSL Expiry:</span> {subscription.ssl_expiry_date}</p>
              )}
              {subscription.whois_protection !== undefined && (
                <p><span className="font-medium">WHOIS Protection:</span> {subscription.whois_protection ? 'Yes' : 'No'}</p>
              )}
              {subscription.name_servers && (
                <p><span className="font-medium">Name Servers:</span> {subscription.name_servers}</p>
              )}
              {subscription.hosting_provider && (
                <p><span className="font-medium">Hosting Provider:</span> {subscription.hosting_provider}</p>
              )}
              <p><span className="font-medium">Auto Renewal:</span> {subscription.auto_renewal ? 'Yes' : 'No'}</p>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Utility Details</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Billing ID:</span> {subscription.billingid}</p>
              <p><span className="font-medium">Consumer Number:</span> {subscription.consumer_no}</p>
              <p><span className="font-medium">Utility Type:</span> {subscription.utility_type}</p>
              <p><span className="font-medium">Auto Renewal:</span> {subscription.auto_renewal ? 'Yes' : 'No'}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Subscription Details</h4>
            <div className="space-y-2">
              <p><span className="font-medium">ID:</span> {subscription.id}</p>
              <p><span className="font-medium">Auto Renewal:</span> {subscription.auto_renewal ? 'Yes' : 'No'}</p>
            </div>
          </div>
        );
    }
  };

  // Get category-specific title or default to subscription name
  const getSubscriptionTitle = () => {
    switch (subscription.subscription_category.toLowerCase()) {
      case 'software':
        return subscription.name || 'Software Subscription';
      case 'server':
        return subscription.name || 'Server Subscription';
      case 'domain':
        return subscription.name || 'Domain Subscription';
      case 'billing':
        return subscription.name || 'Utility Bill';
      default:
        return subscription.name || 'Subscription';
    }
  };


  const handleedit = () => {
    SetEdit("true")
  }

  return (
    <div className='grid grid-cols-2 gap-2'>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Subscription Details</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Subscription Header */}
          <div className="mb-6 border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{getSubscriptionTitle()}</h2>
                <p className="text-gray-600">{subscription.subscription_category}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Provider Information */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Provider Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Provider:</span> {subscription.providerName}</p>
                <p><span className="font-medium">Contact:</span> {subscription.providerContact}</p>
                <p><span className="font-medium">Email:</span> <a href={`mailto:${subscription.providerEmail}`} className="text-blue-500 hover:underline">{subscription.providerEmail}</a></p>
                <p><span className="font-medium">Website:</span> <a href={subscription.websiteLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{subscription.websiteLink}</a></p>
              </div>
            </div>

            {/* Category-specific details */}
            {renderCategorySpecificDetails()}

            {/* Billing Information */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Billing Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Cost:</span> £{parseFloat(subscription.cost).toLocaleString('en-UK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><span className="font-medium">Billing Cycle:</span> {subscription.billing_cycle.charAt(0).toUpperCase() + subscription.billing_cycle.slice(1)}</p>
                <p><span className="font-medium">Next Payment:</span> {subscription.next_payment_date}</p>
                <p>
                  <span className="font-medium">Payment Status:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(subscription.payment_status)}`}>
                    {subscription.payment_status}
                  </span>
                </p>
              </div>
            </div>

            {/* Date Information */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Subscription Dates</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Start Date:</span> {subscription.start_date}</p>
                <p><span className="font-medium">End Date:</span> {subscription.end_date}</p>
                {calculateDaysRemaining(subscription.end_date) > 0 ? (
                  <p className="mt-2">
                    <span className="font-medium">Time Remaining:</span>
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      {calculateDaysRemaining(subscription.end_date)} days
                    </span>
                  </p>
                ) : (
                  <p className="mt-2">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}
      `}>
                      {subscription.status}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <button
            onClick={handleClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
          >
            Close
          </button>
          <button
            onClick={() => { handleedit() }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Subscription
          </button>

          <button
            onClick={() => { handledelete() }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 ml-2 rounded"
          >
            Delete
          </button>
        </div>



      </div>


      {edit && (
        <div>
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Edit Subscription Details</h3>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Version */}
              <div>
                <label htmlFor="version" className="block text-gray-700 font-medium mb-2">
                  Version
                </label>
                <input
                  id="version"
                  name="version"
                  type="text"
                  value={formik.values.version}
                  onChange={formik.handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formik.touched.version && formik.errors.version && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.version}</p>
                )}
              </div>

              {/* Auto Renewal */}
              <div className="flex items-center">
                <label htmlFor="autoRenewal" className="mr-2 text-gray-700 font-medium">
                  Auto Renewal
                </label>
                <input
                  id="autoRenewal"
                  name="autoRenewal"
                  type="checkbox"
                  checked={formik.values.autoRenewal}
                  onChange={formik.handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              {/* Number of Users */}
              <div>
                <label htmlFor="numberOfUsers" className="block text-gray-700 font-medium mb-2">
                  Number of Users
                </label>
                <input
                  id="numberOfUsers"
                  name="numberOfUsers"
                  type="number"
                  value={formik.values.numberOfUsers}
                  onChange={formik.handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formik.touched.numberOfUsers && formik.errors.numberOfUsers && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.numberOfUsers}</p>
                )}
              </div>

              {/* Payment Status */}
              {/* <div>
                <label htmlFor="paymentStatus" className="block text-gray-700 font-medium mb-2">
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formik.values.paymentStatus}
                  onChange={formik.handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
                {formik.touched.paymentStatus && formik.errors.paymentStatus && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.paymentStatus}</p>
                )}
              </div> */}

              {/* Next Payment Date */}
              {/* <div>
                <label htmlFor="nextPaymentDate" className="block text-gray-700 font-medium mb-2">
                  Next Payment Date
                </label>
                <input
                  id="nextPaymentDate"
                  name="nextPaymentDate"
                  type="date"
                  value={formik.values.nextPaymentDate}
                  onChange={formik.handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formik.touched.nextPaymentDate && formik.errors.nextPaymentDate && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.nextPaymentDate}</p>
                )}
              </div> */}

              {/* Cost */}
              <div>
                <label htmlFor="cost" className="block text-gray-700 font-medium mb-2">
                  Cost (£)
                </label>
                <input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  value={formik.values.cost}
                  onChange={formik.handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formik.touched.cost && formik.errors.cost && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.cost}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => SetEdit(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>

  );
};

export default Viewdetails;