// import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useState } from 'react';
import { format } from "date-fns";

const View_resourcedetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resource = location.state?.resource;
  console.log("resources", resource);

  const [edit, setEdit] = useState(false);

  const formik = useFormik({
    initialValues: {
      // last_updated_date: resource?.last_updated_date || '',
      // payment_method: resource.customer.payment_method || '',
      last_payment_date: resource?.last_updated_date || '',
      storage_capacity: resource?.storage_capacity || '',
      resource_cost: resource?.resource_cost || ''
    },
    onSubmit: async (values) => {
      console.log("Resource update values:", values);
      // Handle form submission logic here
    }
  });

  const handleEdit = () => {
    setEdit(!edit);
  };

  // Calculate days remaining until next payment
  const calculateDaysRemaining = (nextDate) => {
    const next = new Date(nextDate);
    const today = new Date();
    const diffTime = next - today;
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

  // // Format price with commas and two decimal places
  // const formatPrice = (price) => {
  //   return parseFloat(price).toLocaleString('en-US', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2
  //   });
  // };

  return (
    <div className='flex'>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Resource Details</h3>
        </div>

        <div className="p-6">
          <div className="mb-6 border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{resource.resource_name}</h2>
                <p className="text-gray-600">{formatBillingCycle(resource.billing_cycle)} Plan</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                  {resource.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resource Information */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Resource Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {resource.resource_name}</p>
                <p><span className="font-medium">Type:</span> {resource.resource_type}</p>
                <p><span className="font-medium">Hosting Type:</span> {resource.hosting_type}</p>
                <p><span className="font-medium">Storage Capacity:</span> {resource.storage_capacity}</p>
                <p><span className="font-medium">Resource Cost:</span> ₹{resource.resource_cost}</p>
                {/* {formatPrice(resource.resource_cost)} */}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Customer Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Customer Name:</span> {resource?.customer?.customer_name}</p>
                <p><span className="font-medium">Email:</span> <a href={`mailto:${resource?.customer?.email}`} className="text-blue-500 hover:underline">{resource?.customer?.email}</a></p>
                <p><span className="font-medium">Phone:</span> {resource?.customer?.contact_phone}</p>
                <p><span className="font-medium">Type:</span> {resource?.customer?.customer_type}</p>
              </div>
            </div>

            {/* Date Information */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Date Information</h4>
              <div className="space-y-2">
                
                <p><span className="font-medium">Provisioned Date:</span>{format(new Date(resource.provisioned_date), "dd-MM-yyyy")}</p>
                <p><span className="font-medium">Last Payment Date:</span>{format(new Date(resource.last_updated_date), "dd-MM-yyyy")}</p>
                
                <p><span className="font-medium">Next Payment Date:</span>{format(new Date(resource.next_payment_date), "dd-MM-yyyy")}</p>
                {calculateDaysRemaining(resource.next_payment_date) > 0 && calculateDaysRemaining(resource.next_payment_date) < 10 ? (
                  <p className="mt-2">
                    <span className="font-medium">Days Until Next Payment:</span>
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      {calculateDaysRemaining(resource.next_payment_date)} days
                    </span>
                  </p>
                ) : (
                  <p>
                  <span className="font-medium">Current Resource State:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                    {resource.status}
                  </span>
                </p>
                )}
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Billing Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Billing Cycle:</span> {formatBillingCycle(resource.billing_cycle)}</p>
                {/* <p><span className="font-medium">Last Payment Date:</span> {resource.last_updated_date}</p> */}
                <p><span className="font-medium">Payment Method:</span> {resource?.customer?.payment_method}</p>
                {/* <p> <span className="font-medium">Last Payment Date:</span>{" "}
                  {resource.customer.last_payment_date ?
                    resource.customer.last_payment_date.split('-').reverse().join('-') :
                    "Not available"}</p> */}
               
              </div>
            </div>
          </div>

          {/* Server Information */}
          <div className="mt-6 bg-gray-50 p-4 rounded">
            {/* <h4 className="font-medium text-gray-700 mb-3">Server Information</h4> */}
            <div className="space-y-2">
              {/* <p><span className="font-medium">Server ID:</span> {resource.server}</p> */}

            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <button
            onClick={() => navigate('/dashboard/services/view_resources')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2">
            Back
          </button>
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {edit && (
        <div className='w-2/5 bg-white rounded-lg mt-4 shadow-xl p-6 ml-4 max-h-[90vh] overflow-y-auto transition-all duration-300'>
          <h3 className="text-xl font-semibold mb-6 border-b pb-3">Edit Resource Details</h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              {/* <div>
                <label htmlFor="last_updated_date" className="block text-sm font-medium text-gray-700 mb-1">Date Last maintenance was performed </label>
                <input
                  type="date"
                  name="last_updated_date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.last_updated_date}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}
              <div>
                <label htmlFor="last_payment_date" className="block text-sm font-medium text-gray-700 mb-1">Last Updated date</label>
                <input
                  type="date"
                  name="last_payment_date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.last_payment_date}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <input
                  type="text"
                  name="payment_method"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.payment_method}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}
              <div>
                <label htmlFor="resource_cost" className="block text-sm font-medium text-gray-700 mb-1">cost</label>
                <input
                  type="number"
                  name="resource_cost"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.resource_cost}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>
                <label htmlFor="storage_capacity" className="block text-sm font-medium text-gray-700 mb-1">Storage Capacity</label>
                <input
                  type="text"
                  name="storage_capacity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.storage_capacity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default View_resourcedetails;