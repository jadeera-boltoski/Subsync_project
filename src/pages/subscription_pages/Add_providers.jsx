import { useState } from "react";
import PropTypes from "prop-types";
import { addproviderdetails } from "../../services/allapi";
import { validateprovider } from "../../validation/validatelogin";


function Add_providers({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    providerName: "",
    providerContact: "",
    providerEmail: "",
    websiteLink: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle submission manually
  const handleSubmit = async () => {
    console.log(formData);
    const validationResult=validateprovider(formData)
    if(validationResult.success){
      const response = await addproviderdetails(formData);
      console.log(response);
      if(response.status==201){
        onClose(); 
        alert("successfully added")
      }
      else{
        alert(response.message)
      }
    }
    alert(validationResult.message)
   
    // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className=" flex items-center justify-end fixed inset-0 bg-opacity-50">
      <div className="bg-amber-100 p-12 rounded-lg shadow-lg md:w-150 sm:w-100 bg-blend-saturation  relative">
        {/* Close Button */}
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>
          ✖
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Add New Provider
        </h2>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="providerName" className="block font-medium text-sm">Provider Name:</label>
            <input
              type="text"
              name="providerName"
              id="providerName"
              value={formData.providerName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="providerContact" className="block font-medium text-sm">Provider Contact Number:</label>
            <input
              type="text"
              id="providerContact"
              name="providerContact"
              value={formData.providerContact}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="providerEmail" className="block font-medium text-sm">Provider Email:</label>
            <input
              type="email"
              id="providerEmail"
              name="providerEmail"
              value={formData.providerEmail}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="websiteLink" className="block font-medium text-sm">Website Link:</label>
            <input
              type="url"
              id="websiteLink"
              name="websiteLink"
              value={formData.websiteLink}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Add Provider
          </button>
        </div>
      </div>
    </div>
  );
}

Add_providers.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Add_providers;
