import { useFormik } from "formik"
import { validationresource } from "../../validation/yup";
import { useEffect, useState } from "react";
import { addresources, getservername } from "../../services/allapi";
import { useNavigate } from "react-router-dom";



function Add_resources() {
  const navigate=useNavigate()
  const formik = useFormik({
    initialValues: {
      resource_name: "",
      resource_type: "",
      storage_capacity: "",
      billing_cycle: "",
      resource_cost: "",
      // next_payment_date: "",
      provisioned_date: "",
      last_updated_date: "",
      // status: "",
      hosting_type: "",
      hosting_location: ""
    },
    validationSchema: validationresource,
    onSubmit: async(values) => {
      console.log("saving resources",values);

        const response=await addresources(values)
        console.log("resources",response);
        if(response.status==201){
          alert(response.message)
          navigate("/dashboard/services/view_resources")
        }
        else{
          alert(response.message.storage_capacity||response.message)
        }
    }
  });
  console.log(formik.errors);
  
  const [serverLocations, setServerLocations] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (formik.values.hosting_type) {
          const response = await getservername(formik.values.hosting_type);
          console.log("getservername",response);
       
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Add New Resource</h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 gap-8">
          {/* First row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">General Resource Information</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="resource_name" className="block text-sm font-medium text-gray-700 mb-1">Resource Name:</label>
                  <input
                    type="text"
                    name="resource_name"
                    id="resource_name"
                    value={formik.values.resource_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                    <option value="web and app hosting">Web & Application Hosting</option>
                    <option value="storage">Database & Storage</option>
                    <option value="security">Security & Compliance</option>
                    <option value="ci/cd">CI/CD & DevOps</option>
                    <option value="other">Other</option>
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
              </div>
            </div>

            {/* Right column */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Financial & Billing Details</h2>

              <div className="space-y-4">
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

                {/* <div>
                  <label htmlFor="next_payment_date" className="block text-sm font-medium text-gray-700 mb-1">Next Payment Date:</label>
                  <input
                    type="date"
                    name="next_payment_date"
                    id="next_payment_date"
                    value={formik.values.next_payment_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min={new Date().toISOString().split("T")[0]} // Restricts to today & future dates

                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {formik.touched.next_payment_date && formik.errors.next_payment_date && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.next_payment_date}</p>
                  )}
                </div> */}
              </div>
            </div>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Status & Lifecycle Management</h2>

              <div className="space-y-4">
                <div>
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
                  <label htmlFor="last_updated_date" className="block text-sm font-medium text-gray-700 mb-1">Last Updated Date:</label>
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
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                  <select
                    name="status"
                    id="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.status}</p>
                  )}
                </div> */}
              </div>
            </div>

            {/* Right column */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Hosting Information</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="hosting_type" className="block text-sm font-medium text-gray-700 mb-1">Hosting Type:</label>
                  <select
                    name="hosting_type"
                    id="hosting_type"
                    value={formik.values.hosting_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value=""selected>Choose a type</option>
                    
                    <option value="inhouse">On-Premise Server</option>
                    <option value="external">External Server</option>
                    <option value="cloud"> Cloud Hosting Providers </option>
                    
                    
                  </select>
                  {formik.touched.hosting_type && formik.errors.hosting_type && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.hosting_type}</p>
                  )}
                </div>

                <div>

                  <label htmlFor="hosting_location" className="block text-sm font-medium text-gray-700 mb-1">Hosting Location Name:</label>
                  <select
                    // type="text"
                    name="hosting_location"
                    id="hosting_location"
                    value={formik.values.hosting_location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="" selected disabled>select</option>
                    <option value="server 1">server1</option>
                    {serverLocations.map((server, index) => (
                      <option key={index} value={server.name || server.id || server}>
                        {server.name || server.id || server}
                      </option>
                    ))}
                  </select>
                  {formik.touched.hosting_location && formik.errors.hosting_location && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.hosting_location}</p>
                  )}
                </div>

                {/* <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto_renewal"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto_renewal" className="ml-2 block text-sm text-gray-700">
                    Enable Auto-Renewal
                  </label>
                </div> */}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Resource
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Add_resources;