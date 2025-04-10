// import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { format } from "date-fns";
import { validationresource } from '../../validation/yup';
import { deleteresource, getservername, getSingleresources, updateresource } from '../../services/allapi';

const View_resourcedetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resources = location.state?.resource;
  console.log("resourcessssss", resources);
  const [resource, setresource] = useState(resources || {})

  const [edit, setEdit] = useState(false);
  console.log("jadeera", resource?.server?.server_name);

  const formik = useFormik({
    initialValues: {
      resource_name: resource?.resource_name || "",
      resource_type: resource?.resource_type || "",
      storage_capacity: resource?.storage_capacity || "",
      billing_cycle: resource?.billing_cycle || "",
      resource_cost: resource?.resource_cost || "",
      // next_payment_date: "",
      provisioned_date: resource?.provisioned_date || "",
      last_updated_date: resource?.last_updated_date || "",
      payment_method: resource?.payment_method || "",
      // status: "",
      // hosting_type: resource?.hosting_type || "",
      // hosting_location: resource?.server?.server_name || "",
      // hosting_location:resource?.server?.server_name||'',
    },


    // validationSchema: validationresource,
    onSubmit: async (values) => {

      console.log("saving resources", values);

      const response = await updateresource(values)
      console.log("resources", response);
      if (response.status == 200) {
        const updatedresource = await getSingleresources(resource.id);
        console.log("response resoyre", updatedresource);

        setresource(updatedresource);

        setEdit(!edit);
        alert(response.message)
        navigate("/dashboard/services/view_resources_details")
      }
      else {
        alert(response.message.storage_capacity || response.message)
      }
    },
    enableReinitialize: true,
  });
  const [serverLocations, setServerLocations] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (formik.values.hosting_type) {
          const response = await getservername(formik.values.hosting_type);
          console.log("getservername", response);

          if (response && response.servers && Array.isArray(response.servers)) {
            setServerLocations(response.servers);
            formik.setFieldValue("hosting_location", "");
          }

        }
      } catch (error) {
        console.error("Error fetching provider name:", error);
        // You can also update state with error information if needed
      }
    };

    // Call fetchData only if hosting_type is present
    if (formik.values.hosting_type) {
      fetchData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.hosting_type]);

  console.log("heloooooooooo", formik.values.hosting_location);

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

  const handledelete = async () => {
    const confirmChange = window.confirm("Are you sure you want to delete this subscription?");
    if (confirmChange) {
      try {
        const response = await deleteresource(resource.id)
        console.log(response);
        if (response.status == 200) {
          alert(response.message)
          navigate("/dashboard/services/view_resources")
        }
        else {
          alert(response.message)
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert("An error occurred while deleting the subscription");
      }
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
          onClick={() => navigate('/dashboard/services/view_resources')}
          className="hover:text-blue-600 hover:underline cursor-pointer"
        >
          Resource List
        </div>
        <div className="mx-1">&gt;</div>

        <div className="text-blue-600">View Details of {resource.resource_name}</div>
      </div>
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
                {resource?.customer?.customer_name&&(
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Customer Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Customer Name:</span> {resource?.customer?.customer_name}</p>
                    <p><span className="font-medium">Email:</span> <a href={`mailto:${resource?.customer?.email}`} className="text-blue-500 hover:underline">{resource?.customer?.email}</a></p>
                    <p><span className="font-medium">Phone:</span> {resource?.customer?.contact_phone}</p>
                    {/* <p><span className="font-medium">Type:</span> {resource?.customer?.customer_type}</p>  */}
                  </div>
                </div>
                )}
                <h4 className="font-medium text-gray-700 mt-5 mb-3">Server Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Server type:</span> {resource?.server?.server_type}</p>
                  <p><span className="font-medium">Server name:</span> {resource?.server?.server_name}</p>
                </div>
              </div>

              {/* Date Information */}
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium text-gray-700 mb-3">Date Information</h4>
                <div className="space-y-2">

                  <p><span className="font-medium">Provisioned Date:</span>{format(new Date(resource.provisioned_date), "dd-MM-yyyy")}</p>
                  {/* <p><span className="font-medium">Last Payment Date:</span>{format(new Date(resource.last_updated_date), "dd-MM-yyyy")}</p> */}

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
                  <p><span className="font-medium">Payment Method:</span> {resource?.payment_method || "Bank transfer"}</p>
                  <p> <span className="font-medium">Last Payment Date:</span>{" "}
                    {resource?.last_payment_date ?
                      resource?.last_payment_date?.split('-').reverse().join('-') :
                      "Not available"}</p>

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
              onClick={handledelete}
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
                <div>
                  <label htmlFor="resource_name" className="block text-sm font-medium text-gray-700 mb-1">Resource Name:</label>
                  <input
                    type="text"
                    name="resource_name"
                    id="resource_name"
                    value={formik.values.resource_name}
                    onChange={formik.handleChange}

                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {formik.touched.resource_name && formik.errors.resource_name && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.resource_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="resource_type" className="block text-sm font-medium text-gray-700 mb-1">Resource Type:</label>
                  <select
                    name="resource_type"
                    id="resource_type"

                    value={formik.values.resource_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select a type</option>
                    <option value="Web and app hosting">Web & Application Hosting</option>
                    <option value="Database and Storage">Database & Storage</option>
                    <option value="Security and Compliance">Security & Compliance</option>
                    <option value="CI/CD and DevOps">CI/CD & DevOps</option>
                    <option value="Other">Other</option>
                  </select>
                  {formik.touched.resource_type && formik.errors.resource_type && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.resource_type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="storage_capacity" className="block text-sm font-medium text-gray-700 mb-1">Storage Capacity:</label>
                  <input
                    type="text"
                    name="storage_capacity"
                    id="storage_capacity"
                    placeholder="In terms of GB ot TB"
                    value={formik.values.storage_capacity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {formik.touched.storage_capacity && formik.errors.storage_capacity && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.storage_capacity}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="billing_cycle" className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle:</label>
                  <select
                    name="billing_cycle"
                    id="billing_cycle"
                    value={formik.values.billing_cycle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select cycle</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  {formik.touched.billing_cycle && formik.errors.billing_cycle && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.billing_cycle}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="resource_cost" className="block text-sm font-medium text-gray-700 mb-1">Resource Cost:</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="text"
                      name="resource_cost"
                      id="resource_cost"
                      value={formik.values.resource_cost}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-2 pl-7 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {formik.touched.resource_cost && formik.errors.resource_cost && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.resource_cost}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label htmlFor="paymentMethod" className="block mb-1 text-sm">
                    Payment method
                  </label>
                  <select name="paymentMethod" id="paymentMethod"
                    value={formik.values.paymentMethod}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="" disabled selected>--select method--</option>
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="Bank_Transfer">Bank Transfer</option>
                    <option value="Prepaid_Cards">Gift Cards & Prepaid Cards</option>
                    <option value="Cash_Payments">Cash Payments (For offline or manual renewals)</option>
                  </select>

                  {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.paymentMethod}
                    </div>
                  )}
                </div>
                <label htmlFor="provisioned_date" className="block text-sm font-medium text-gray-700 mb-1">Provisioned Date:</label>
                <input
                  type="date"
                  name="provisioned_date"
                  id="provisioned_date"
                  value={formik.values.provisioned_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formik.touched.provisioned_date && formik.errors.provisioned_date && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.provisioned_date}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_updated_date" className="block text-sm font-medium text-gray-700 mb-1">Last Payment Date:</label>
                <input
                  type="date"
                  name="last_updated_date"
                  id="last_updated_date"
                  value={formik.values.last_updated_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formik.touched.last_updated_date && formik.errors.last_updated_date && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.last_updated_date}</p>
                )}
              </div>
              {/* <div>
                <label htmlFor="hosting_type" className="block text-sm font-medium text-gray-700 mb-1">Hosting Type:</label>
                <select
                  name="hosting_type"
                  id="hosting_type"
                  value={formik.values.hosting_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="" selected>Choose a type</option>

                  <option value="inhouse">On-Premise Server</option>
                  <option value="external">External Server</option> */}
                  {/* <option value="cloud"> Cloud Hosting Providers </option> */}

{/* 
                </select>
                {formik.touched.hosting_type && formik.errors.hosting_type && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.hosting_type}</p>
                )}
              </div> */}

              {/* <div>

                <label htmlFor="hosting_location" className="block text-sm font-medium text-gray-700 mb-1">Server Name that resource hosted on:</label>
                <select
                  // type="text"
                  name="hosting_location"
                  id="hosting_location"
                  value={formik.values.hosting_location}
                  onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="" disabled>select</option>

                  {serverLocations.map((server, index) => (
                    <option key={index} value={server?.name || server?.id || server}>
                      {server?.name || server?.id || server}
                    </option>
                  ))}
                </select>
                {formik.touched.hosting_location && formik.errors.hosting_location && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.hosting_location}</p>
                )}
              </div> */}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEdit(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  // disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>




            </form>
          </div >
        )}
      </div >
    </div>
  );
};

export default View_resourcedetails;