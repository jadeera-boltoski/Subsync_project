import { useFormik } from "formik"
import { validationCustomerform } from "../../validation/yup"
import { useEffect, useState } from "react";
import { addcustomers, getresources } from "../../services/allapi";
import { useNavigate } from "react-router-dom";

function Add_customers() {
  const [Resources, setResources] = useState()
  const navigate=useNavigate()
  const formik = useFormik({
    initialValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      customer_type: "",
      resource_type: "",
      resource_name: "",
      paymentMethod: "",
      lastPaymentDate: "",
      startDate: "",
      billingCycle: "",
      endDate: "",
      cost: ""
    },
    validationSchema: validationCustomerform,
    onSubmit: async(values) => {
      console.log(values);
      const response= await addcustomers(values)
      console.log(response);
      if(response.status==201){
        alert(response.message)
        navigate("/dashboard/services/view_customers")
      }
      else{
        alert("something went wrong")
      }
      

    }
  })

  useEffect(() => {
    const fetchResources = async () => {
      if (formik.values.resource_type) {
        try {
          const response = await getresources(formik.values.resource_type);
          console.log(response);
          const resourceNames = response.map(item => item.resource_name);
          setResources(resourceNames);
        } catch (error) {
          
          console.error("Error fetching resources:", error);
          setResources([]); // Reset on error
        }
      } else {
        setResources([]); // Reset dropdown if no resource type is selected
      }
    };

    fetchResources(); // Call the function
  }, [formik.values.resource_type]);

  console.log(Resources);
  console.log(formik.errors);
  

  return (
    <div className="px-4 md:px-6">
      <h3 className="text-xl md:text-2xl font-bold text-gray-600 my-4 md:my-6">Add New Customer</h3>

      <div className="bg-white p-4 md:p-6 w-full rounded shadow">
        <div className="w-full">
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
              {/* Left Column - Customer Details */}
              <div className="w-full">
                <h3 className="text-lg md:text-xl font-bold mb-3">Customer Details</h3>

                <div className="mb-4">
                  <label htmlFor="customer_name" className="block mb-1">Customer Name</label>
                  <input type="text" name="customer_name" id="customer_name"
                    value={formik.values.customer_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Name"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {formik.touched.customer_name && formik.errors.customer_name && (
                    <div className="text-red-500 text-xs w-full p-2">
                      {formik.errors.customer_name}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="customer_email" className="block mb-1">Customer Email</label>
                  <input type="text" name="customer_email" id="customer_email"
                    value={formik.values.customer_email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Email"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {formik.touched.customer_email && formik.errors.customer_email && (
                    <div className="text-red-500 text-xs w-full p-2">
                      {formik.errors.customer_email}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="customer_phone" className="block mb-1">Customer Contact Number</label>
                  <input type="text" name="customer_phone" id="customer_phone"
                    value={formik.values.customer_phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Phone"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {formik.touched.customer_phone && formik.errors.customer_phone && (
                    <div className="text-red-500 text-xs w-full p-2">
                      {formik.errors.customer_phone}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="customer_type" className="block mb-1">Customer type</label>
                  <select name="customer_type" id="customer_type"
                    value={formik.values.customer_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">--Choose customer type--</option>
                    <option value="inhouse">Inhouse</option>
                    <option value="inhouse">External</option>
                  </select>
                  {formik.touched.customer_type && formik.errors.customer_type && (
                    <div className="text-red-500 text-xs w-full p-2">
                      {formik.errors.customer_type}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="resource_type" className="block mb-1">Resource type</label>
                  <select name="resource_type" id="resource_type"
                    value={formik.values.resource_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">--Choose resource type--</option>
                    <option value="web_and_app_hosting">Web & Application Hosting</option>
                    <option value="storage">Database & Storage</option>
                    <option value="security">Security & Compliance</option>
                    <option value="ci/cd">CI/CD & DevOps</option>
                    <option value="other">Other</option>
                  </select>
                  {formik.touched.resource_type && formik.errors.resource_type && (
                    <div className="text-red-500 text-xs w-full p-2">
                      {formik.errors.resource_type}
                    </div>  
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="resource_name" className="block mb-1">Resource Name</label>
                  <select name="resource_name" id="resource_name"
                    value={formik.values.resource_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">--select resource--</option>
                    {Resources && Resources.map((resource, index) => (
                      <option key={index} value={resource}>{resource}</option>
                    ))}
                    <option value="add_new">Add New</option>
                  </select>
                  {formik.touched.resource_name && formik.errors.resource_name && (
                    <div className="text-red-500 text-xs w-full p-2">
                      {formik.errors.resource_name}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="block mb-1">
                    Payment method
                  </label>
                  <select name="paymentMethod" id="paymentMethod"
                    value={formik.values.paymentMethod}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="" disabled>--select method--</option>
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="Bank_Transfer">Bank Transfer</option>
                    <option value="Prepaid_Cards">Gift Cards & Prepaid Cards</option>
                    <option value="Cash_Payments">Cash Payments (For offline or manual renewals)</option>
                  </select>
                  {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                    <div className="text-red-500 text-xs w-full p-2">
                      {formik.errors.paymentMethod}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="lastPaymentDate" className="block mb-1">
                    Last payment date:
                  </label>
                  <input
                    type="date"
                    id="lastPaymentDate"
                    name="lastPaymentDate"
                    value={formik.values.lastPaymentDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {formik.touched.lastPaymentDate && formik.errors.lastPaymentDate && (
                    <div className="text-red-500 text-xs w-full p-2">
                      {formik.errors.lastPaymentDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Billing Details */}
              <div className="w-full">
                <h3 className="text-lg md:text-xl font-bold mb-3">Billing Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="startDate" className="block mb-1">
                      Start date:
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {formik.touched.startDate && formik.errors.startDate && (
                      <div className="text-red-500 text-xs w-full p-2">
                        {formik.errors.startDate}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="endDate" className="block mb-1">
                      End date:
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formik.values.endDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {formik.touched.endDate && formik.errors.endDate && (
                      <div className="text-red-500 text-xs w-full p-2">
                        {formik.errors.endDate}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="billingCycle" className="block mb-1">
                      Billing cycle:
                    </label>
                    <select name="billingCycle" id="billingCycle"
                      value={formik.values.billingCycle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="" disabled>-- Select Billing Cycle --</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="semi-annual">Semi-Annual (6 months)</option>
                      <option value="annual">Annual (1 year)</option>
                      <option value="biennial">Biennial (2 years)</option>
                      <option value="triennial">Triennial (3 years)</option>
                    </select>
                    {formik.touched.billingCycle && formik.errors.billingCycle && (
                      <div className="text-red-500 text-xs w-full p-2">
                        {formik.errors.billingCycle}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="cost" className="block mb-1">
                      Cost:
                    </label>
                    <input
                      type="text"
                      pattern="[0-9]*"
                      id="cost"
                      name="cost"
                      value={formik.values.cost}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {formik.touched.cost && formik.errors.cost && (
                      <div className="text-red-500 text-xs w-full p-2">
                        {formik.errors.cost}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 md:mt-8">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full md:w-auto"
              >
                Add Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Add_customers