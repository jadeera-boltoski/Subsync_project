import { useState } from "react";
import { useFormik } from "formik";
import { validationHardware } from "../../validation/yup";
import { addhardware } from "../../services/allapi";
import { useNavigate } from "react-router-dom";


const deviceSpecificFields = {
  Laptop: ["CPU", "RAM", "Storage"],
  Desktop: ["CPU", "RAM", "Storage"],
  "Mobile Phone": ["OS_Version", "Storage", "IMEI_Number"],
  Tablet: ["OS_Version", "Storage"],
  "Network Device": ["Throughput", "IP_Address"],
  "Air Conditioner": ["BTU_Rating", "EnergyP_Rating"],
  "On-Premise Server": ["CPU", "RAM", "Storage_Configuration", "Operating_System"],
  Printer: ["Print_Technology", "Print_Speed", "Connectivity"],
  Scanner: ["Scan_Resolution", "Scan_Type", "Connectivity"],
  
};

const Add_hardware = () => {
  const navigate=useNavigate()
  const [selectedDevice, setSelectedDevice] = useState("");
  // console.log(selectedDevice);
  
  const [isExtendedWarranty, setIsExtendedWarranty] = useState(false);
  const [deviceFields, setDeviceFields] = useState([]);

  const formik = useFormik({
    initialValues: {
      deviceType: "",
      manufacturer: "",
      model: "",
      serialNumber: "",
      assignedTo: "",
      purchaseDate: "",
      purchasecost:"",
      warrantyExpiryDate: "",
      isExtendedWarranty: false,  // Boolean to indicate if warranty is extended
      extendedWarrantyPeriod: "", // Duration of extended warranty if applicable
      lastServiceDate: "",
      nextServiceDate: "",
      freeServiceUntil: "",
      serviceCost: "",
      serviceProvider: "",
      notes: ""
    },
    validationSchema: validationHardware,
    onSubmit: async(values) => {
      console.log("Form Data:", values);
      const response=await addhardware(values)
      console.log("addhardware",response);
      if(response.status==201){
        alert("New hardware successfully added")
        navigate("view_hardware")
      }
      else{
        alert("something went wrong")
      }

      // Handle form submission here
    }
  });

  // Handle device type change to update both formik state and component state
  const handleDeviceTypeChange = (e) => {
    const deviceType = e.target.value;
    setSelectedDevice(deviceType);
    formik.setFieldValue("deviceType", deviceType);
    
    // Update device-specific fields
    if (deviceType && deviceSpecificFields[deviceType]) {
      setDeviceFields(deviceSpecificFields[deviceType]);
    } else {
      setDeviceFields([]);
    }
  };

  // Handle extended warranty toggle
  const handleExtendedWarrantyChange = (e) => {
    const isChecked = e.target.checked;
    setIsExtendedWarranty(isChecked);
    formik.setFieldValue("isExtendedWarranty", isChecked);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">IT Hardware Inventory Form</h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Common Fields - First Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
            <select
              id="deviceType"
              name="deviceType"

              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              onChange={handleDeviceTypeChange}
              onBlur={formik.handleBlur}
              value={formik.values.deviceType}
            >
              <option value="">Select Device Type</option>
              {Object.keys(deviceSpecificFields).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {formik.touched.deviceType && formik.errors.deviceType ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.deviceType}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
            <input
              id="manufacturer"
              name="manufacturer"
              type="text"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.manufacturer}
            />
            {formik.touched.manufacturer && formik.errors.manufacturer ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.manufacturer}</div>
            ) : null}
          </div>
        </div>

        {/* Common Fields - Second Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              id="model"
              name="model"
              type="text"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.model}
            />
            {formik.touched.model && formik.errors.model ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.model}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input
              id="serialNumber"
              name="serialNumber"
              type="text"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.serialNumber}
            />
            {formik.touched.serialNumber && formik.errors.serialNumber ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.serialNumber}</div>
            ) : null}
          </div>
        </div>

        {/* Purchase Date Field */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
            <input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.purchaseDate}
              max={new Date().toISOString().split('T')[0]}
            />
            {formik.touched.purchaseDate && formik.errors.purchaseDate ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.purchaseDate}</div>
            ) : null}
          </div>
          
          <div>
            <label htmlFor="purchasecost" className="block text-sm font-medium text-gray-700 mb-1">Purchase Cost</label>
            <input
              id="purchasecost"
              name="purchasecost"
              type="number"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.purchasecost}
              max={new Date().toISOString().split('T')[0]}
            />
            {formik.touched.purchasecost && formik.errors.purchasecost ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.purchasecost}</div>
            ) : null}
          </div>




          <div className="col-span-2">
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <select
              id="assignedTo"
              name="assignedTo"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.assignedTo}
            >
              <option value="" disabled>Select Department</option>
              <option value="HR">Human Resources</option>
              <option value="IT">Information Technology</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="other">Other</option>
            </select>
            {formik.touched.assignedTo && formik.errors.assignedTo ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.assignedTo}</div>
            ) : null}
          </div>
        </div>

        {/* Service Information Section */}
        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-3">Service Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="lastServiceDate" className="block text-sm font-medium text-gray-700 mb-1">Last Service Date</label>
              <input
                id="lastServiceDate"
                name="lastServiceDate"
                type="date"
                className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastServiceDate}
                max={new Date().toISOString().split('T')[0]}
              />
              {formik.touched.lastServiceDate && formik.errors.lastServiceDate ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.lastServiceDate}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="nextServiceDate" className="block text-sm font-medium text-gray-700 mb-1">Next Service Date</label>
              <input
                id="nextServiceDate"
                name="nextServiceDate"
                type="date"
                className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nextServiceDate}
                min={new Date().toISOString().split('T')[0]}
              />
              {formik.touched.nextServiceDate && formik.errors.nextServiceDate ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.nextServiceDate}</div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="freeServiceUntil" className="block text-sm font-medium text-gray-700 mb-1">Free Service Until <span className="text-gray-500">(Optional)</span></label>
              <input
                id="freeServiceUntil"
                name="freeServiceUntil"
                type="date"
                className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.freeServiceUntil}
              />
              {formik.touched.freeServiceUntil && formik.errors.freeServiceUntil ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.freeServiceUntil}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="serviceCost" className="block text-sm font-medium text-gray-700 mb-1">Service Cost <span className="text-gray-500">(Optional)</span></label>
              <input
                id="serviceCost"
                name="serviceCost"
                type="number"
                className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.serviceCost}
              />
              {formik.touched.serviceCost && formik.errors.serviceCost ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.serviceCost}</div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="serviceProvider" className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
            <input
              id="serviceProvider"
              name="serviceProvider"
              type="text"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.serviceProvider}
            />
            {formik.touched.serviceProvider && formik.errors.serviceProvider ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.serviceProvider}</div>
            ) : null}
          </div>
        </div>

        {/* Warranty Section */}
        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-3">Warranty Information</h3>
          
          <div className="mb-4">
            <label htmlFor="warrantyExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry Date</label>
            <input
              id="warrantyExpiryDate"
              name="warrantyExpiryDate"
              type="date"
              className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.warrantyExpiryDate}
            />
            {formik.touched.warrantyExpiryDate && formik.errors.warrantyExpiryDate ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.warrantyExpiryDate}</div>
            ) : null}
          </div>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input
                id="isExtendedWarranty"
                name="isExtendedWarranty"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                onChange={handleExtendedWarrantyChange}
                checked={isExtendedWarranty}
              />
              <label htmlFor="isExtendedWarranty" className="ml-2 block text-sm text-gray-700">
                Extended Warranty
              </label>
            </div>
          </div>
          
          {isExtendedWarranty && (
            <div>
              <label htmlFor="extendedWarrantyPeriod" className="block text-sm font-medium text-gray-700 mb-1">Extended Warranty Period</label>
              <select
                id="extendedWarrantyPeriod"
                name="extendedWarrantyPeriod"
                className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.extendedWarrantyPeriod}
              >
                <option value="">Select Period</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="5">5 Years</option>
              </select>
              {formik.touched.extendedWarrantyPeriod && formik.errors.extendedWarrantyPeriod ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.extendedWarrantyPeriod}</div>
              ) : null}
            </div>
          )}
        </div>

        {/* Device-specific fields section */}
        {deviceFields.length > 0 && (
  <div className="border p-4 rounded-md bg-gray-50">
    <h3 className="text-lg font-medium mb-3">Device-Specific Details</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {deviceFields.map((field) => (
        <div key={field}>
          <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
            {field}
          </label>
          <input
            id={field}
            name={field}
            type="text"
            className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[field] || ""}
          />
          {formik.touched[field] && formik.errors[field] && (
            <div className="text-red-500 text-sm mt-1">{formik.errors[field]}</div>
          )}
        </div>
      ))}
    </div>
  </div>
)}

        {/* Notes Section */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.notes}
          ></textarea>
          {formik.touched.notes && formik.errors.notes ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.notes}</div>
          ) : null}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => formik.resetForm()}
          >
            Reset
          </button>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add_hardware;