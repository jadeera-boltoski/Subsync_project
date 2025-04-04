import { useFormik } from 'formik';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Deletehardware, edithardware } from '../../services/allapi';
import { format } from "date-fns";

const View_hardwareDetails = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const [check, setcheck] = useState(false)


  const device = location.state?.device;
  console.log("dfdf", device);


  const formik = useFormik({
    initialValues: {
      id:device?.id,
      last_service_date: device?.services?.[0]?.last_service_date || '',
      service_cost: device?.services?.[0]?.service_cost || '',
      status: device?.status || '',
      assigned_department: device?.assigned_department || '',
      notes: device?.notes || '',
    },
    onSubmit: async (values) => {
      console.log("hello jadeera", values);
      try {
        const response = await edithardware(values)
        console.log(response);
        if(response.status==200){
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


  // Calculate days remaining until warranty ends
  const calculateWarrantyDaysRemaining = (endDate) => {
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
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render device-specific details based on type
  const renderDeviceSpecificDetails = () => {
    console.log(device.hardware_type.toLowerCase());

    switch (device.hardware_type.toLowerCase()) {

      // case 'on-premise server':
      case 'desktop':
      case 'laptop':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Laptop Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Processor:</span> {device.computer.cpu}</p>
              <p><span className="font-medium">RAM:</span> {device.computer.ram}</p>
              <p><span className="font-medium">Storage:</span> {device.computer?.storage}</p>
{/* 
              {device.hardware_type.toLowerCase() === "on-premise server" && (
                <p><span className="font-medium">Operating System:</span> {device?.computer.os}</p>
                <p><span className="font-medium">Server Name:</span> {device.computer.os}</p>
              )} */}

            </div>
          </div>
        );

      case 'mobile phone':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Mobile Device Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">IMEI Number:</span> {device?.portable_device?.imei_number}</p>
              <p><span className="font-medium">OS Version:</span> {device?.portable_device?.os_version}</p>
              <p><span className="font-medium">Storage:</span> {device?.portable_device?.storage}</p>

            </div>
          </div>
        );



      case 'air conditioner':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Mobile Device Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">BTU Rating:</span> {device?.air_conditioner?.btu_rating}</p>
              <p><span className="font-medium">Energy Efficiency Rating:</span> {device?.air_conditioner?.energy_rating}</p>


            </div>
          </div>
        );

      case 'network device':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Network Device Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Throughput:</span> {device?.network_device?.throughput}</p>
              <p><span className="font-medium">IP Address:</span> {device?.network_device?.ip_address}</p>
              <p><span className="font-medium">Device name:</span> {device?.network_device?.name_specification}</p>

            </div>
          </div>
        );

      case 'tablet':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Tablet Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">OS Version:</span> {device.portable_device.os_version}</p>
              <p><span className="font-medium">Storage:</span> {device.portable_device.storage}</p>
            </div>
          </div>
        );


      case 'printer':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Printer Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Print Technology:</span> {device.printer.print_technology}</p>
              <p><span className="font-medium">Print Speed:</span> {device.printer.print_speed}</p>
              <p><span className="font-medium">Connectivity:</span> {device.printer.connectivity}</p>
            </div>
          </div>
        );

      case 'scanner':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Printer Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Scan Resolution:</span> {device.printer_type}</p>
              <p><span className="font-medium">Scan Type:</span> {device.cartridge_model}</p>
              <p><span className="font-medium">Connectivity:</span> {device.connectivity}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Device Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Model:</span> {device.model}</p>
              <p><span className="font-medium">Serial Number:</span> {device.serial_number}</p>
            </div>
          </div>
        );
    }
  };

  const handleedit = () => {
    setcheck(!check)
  }
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmChange = window.confirm("Are you sure you want to delete this hardware?");
    if (!confirmChange) return;

    setIsDeleting(true); // Show loading state

    try {
      const response = await Deletehardware(device.id);
      console.log("Response:", response);

      if (response.status === 200) {
        // alert("Hardware deleted successfully!");
        alert(response.message)
        navigate("/dashboard/hardware/view_hardware");
      } else {
        alert(response.message)
        // alert("Failed to delete hardware.");
      }
    } catch (error) {
      console.error("Error deleting hardware:", error);
      alert("Something went wrong!");
    } finally {
      setIsDeleting(false); // Reset loading state
    }
  };



  return (
    <div className='flex'>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-full px-12 py-12 max-h-[90vh] overflow-y-auto ">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Hardware Details</h3>

        </div>

        <div className="p-6">
          {/* Device Header */}
          <div className="mb-6 border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{device.hardware_type}</h2>
                <p className="text-gray-600">{device.hardware_type} - {device.model_number}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Basic Information</h4>
              <div className="space-y-2">

                <p><span className="font-medium">Manufacturer:</span> {device.manufacturer}</p>
                <p><span className="font-medium">Model:</span> {device.model_number}</p>
                <p><span className="font-medium">Serial Number:</span> {device.serial_number}</p>
              </div>
            </div>

            {/* Assignment Information */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Assignment Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Assigned To:</span> {device.assigned_department}</p>

              </div>
            </div>

            {/* Device-specific details */}
            {renderDeviceSpecificDetails()}

            {/* Purchase Information */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Purchase Information</h4>
              <div className="space-y-2">
                
                <p><span className="font-medium">Purchase Date:</span>{format(new Date(device?.purchase?.purchase_date), "dd-MM-yyyy")}</p>
                <p><span className="font-medium">Purchase Price:</span> ₹{parseFloat(device?.purchase?.purchase_cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><span className="font-medium">Vendor:</span> {device.vendor_name}</p>
                <p><span className="font-medium">Vendor Contact:</span> {device.vendor_contact}</p>
                <p><span className="font-medium">Vendor Email:</span> <a href={`mailto:${device.vendor_email}`} className="text-blue-500 hover:underline">{device.vendor_email}</a></p>
              </div>
            </div>

            {/* Warranty & Maintenance */}
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700 mb-3">Warranty & Maintenance</h4>
              <div className="space-y-2">
             
                <p><span className="font-medium">Warranty End:</span>{format(new Date(device.warranty.warranty_expiry_date), "dd-MM-yyyy")}</p>
                {calculateWarrantyDaysRemaining(device.warranty.warranty_expiry_date) > 0 && calculateWarrantyDaysRemaining(device.warranty.warranty_expiry_date) < 10? (
                  <p className="mt-2">
                    <span className="font-medium">Warranty Remaining:</span>
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      {calculateWarrantyDaysRemaining(device.warranty.warranty_expiry_date)} days
                    </span>
                  </p>
                ) : (
                  <p className="mt-2">
                    {/* <span className="font-medium">Warranty Status:</span> 
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                      Expired
                    </span> */}
                  </p>
                )}
                
                <p><span className="font-medium">Last Maintenance:</span>{format(new Date(device.services[0].last_service_date), "dd-MM-yyyy")}</p>
                <p><span className="font-medium">Next Maintenance:</span>{format(new Date(device.services[0].next_service_date), "dd-MM-yyyy")}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Notes</h4>
            <p className="text-gray-600">{device.notes ? device.notes : "no additional details"}</p>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <button
            onClick={() => navigate('/dashboard/hardware/view_hardware')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
          >
            Back
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
            onClick={handleedit}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting} // Prevent multiple clicks
            className={`px-4 py-2 rounded mr-2 text-white ${isDeleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

        </div>


      </div>
      {check && (
        <div className="w-2/5 bg-white rounded-lg shadow-xl p-6 ml-4 max-h-[90vh] overflow-y-auto transition-all duration-300">
          <h3 className="text-xl font-semibold mb-6 border-b pb-3">Edit Hardware Details</h3>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Basic Information Section */}
            <div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="last_service_date" className="block text-sm font-medium text-gray-700 mb-1">The last maintenance was done on </label>
                  <input
                    type="Date"
                    name="last_service_date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.last_service_date}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor='service_cost' className="block text-sm font-medium text-gray-700 mb-1">Last maintenance cost</label>
                  <input
                    type="text"
                    name='service_cost'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.service_cost}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor='status' className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name='status'
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>
            </div>


            {/* Assignment Information */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Assignment Information</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor='assigned_department' className="block text-sm font-medium text-gray-700 mb-1">Assigned Department</label>
                  <input
                    type="text"
                    name='assigned_department'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.assigned_department}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notes
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Notes</h4>
              <div>
                <textarea
                  name='notes'
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div> */}

            {/* Form Buttons */}
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default View_hardwareDetails;