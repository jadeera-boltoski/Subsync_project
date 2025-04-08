import { useFormik } from 'formik';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Deletehardware, edithardware, getSingledevice } from '../../services/allapi';
import { format } from "date-fns";

const View_hardwareDetails = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const [check, setcheck] = useState(false)

  
  const devices = location.state?.device;
  console.log("dfdf", devices);
  const [device, setdevice] = useState(devices || {});


  const formik = useFormik({
    initialValues: {
      id: device?.id,
      // Basic Information
      hardware_type: device?.hardware_type || '',
      manufacturer: device?.manufacturer || '',
      model_number: device?.model_number || '',
      serial_number: device?.serial_number || '',
      status: device?.status || '',
      
      // Assignment Information
      assigned_department: device?.assigned_department || '',
      
      // Purchase Information
      purchase_date: device?.purchase?.purchase_date || '',
      purchase_cost: device?.purchase?.purchase_cost || '',
      vendor_name: device?.vendor_name || '',
      vendor_contact: device?.vendor_contact || '',
      vendor_email: device?.vendor_email || '',
      
      // Warranty Information
      warranty_expiry_date: device?.warranty?.warranty_expiry_date || '',
      
      // Maintenance Information
      last_service_date: device?.services?.[0]?.last_service_date || '',
      next_service_date: device?.services?.[0]?.next_service_date || '',
      service_cost: device?.services?.[0]?.service_cost || '',
      
      // Device-specific fields (will conditionally render based on device type)
      // Computer specs
      cpu: device?.computer?.cpu || '',
      ram: device?.computer?.ram || '',
      storage: device?.computer?.storage || '',
      
      // Portable device specs
      imei_number: device?.portable_device?.imei_number || '',
      os_version: device?.portable_device?.os_version || '',
      portable_storage: device?.portable_device?.storage || '',
      
      // Air conditioner specs
      btu_rating: device?.air_conditioner?.btu_rating || '',
      energy_rating: device?.air_conditioner?.energy_rating || '',
      
      // Network device specs
      throughput: device?.network_device?.throughput || '',
      ip_address: device?.network_device?.ip_address || '',
      name_specification: device?.network_device?.name_specification || '',
      
      // Printer specs
      print_technology: device?.printer?.print_technology || '',
      print_speed: device?.printer?.print_speed || '',
      connectivity: device?.printer?.connectivity || '',
      
      // Notes
      notes: device?.notes || '',
    },
    onSubmit: async (values) => {
      console.log("hello jadeera", values);
      try {
        const response = await edithardware(values)
        console.log(response);
        if(response.status==200){
           const updateddevice = await getSingledevice(devices.id);
          setdevice(updateddevice);
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

  const renderDeviceSpecificFormFields = () => {
    switch (formik.values.hardware_type.toLowerCase()) {
      case 'desktop':
      case 'laptop':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 mb-3">Computer Specifications</h4>
            <div>
              <label htmlFor="cpu" className="block text-sm font-medium text-gray-700 mb-1">Processor</label>
              <input
                type="text"
                id="cpu"
                name="cpu"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.cpu}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="ram" className="block text-sm font-medium text-gray-700 mb-1">RAM</label>
              <input
                type="text"
                id="ram"
                name="ram"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ram}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
              <input
                type="text"
                id="storage"
                name="storage"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.storage}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'mobile phone':
      case 'tablet':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 mb-3">Mobile Device Specifications</h4>
            <div>
              <label htmlFor="imei_number" className="block text-sm font-medium text-gray-700 mb-1">IMEI Number</label>
              <input
                type="text"
                id="imei_number"
                name="imei_number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.imei_number}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="os_version" className="block text-sm font-medium text-gray-700 mb-1">OS Version</label>
              <input
                type="text"
                id="os_version"
                name="os_version"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.os_version}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="portable_storage" className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
              <input
                type="text"
                id="portable_storage"
                name="portable_storage"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.portable_storage}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'air conditioner':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 mb-3">Air Conditioner Specifications</h4>
            <div>
              <label htmlFor="btu_rating" className="block text-sm font-medium text-gray-700 mb-1">BTU Rating</label>
              <input
                type="text"
                id="btu_rating"
                name="btu_rating"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.btu_rating}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="energy_rating" className="block text-sm font-medium text-gray-700 mb-1">Energy Efficiency Rating</label>
              <input
                type="text"
                id="energy_rating"
                name="energy_rating"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.energy_rating}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'network device':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 mb-3">Network Device Specifications</h4>
            <div>
              <label htmlFor="throughput" className="block text-sm font-medium text-gray-700 mb-1">Throughput</label>
              <input
                type="text"
                id="throughput"
                name="throughput"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.throughput}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="ip_address" className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
              <input
                type="text"
                id="ip_address"
                name="ip_address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ip_address}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="name_specification" className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
              <input
                type="text"
                id="name_specification"
                name="name_specification"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name_specification}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'printer':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 mb-3">Printer Specifications</h4>
            <div>
              <label htmlFor="print_technology" className="block text-sm font-medium text-gray-700 mb-1">Print Technology</label>
              <input
                type="text"
                id="print_technology"
                name="print_technology"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.print_technology}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="print_speed" className="block text-sm font-medium text-gray-700 mb-1">Print Speed</label>
              <input
                type="text"
                id="print_speed"
                name="print_speed"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.print_speed}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="connectivity" className="block text-sm font-medium text-gray-700 mb-1">Connectivity</label>
              <input
                type="text"
                id="connectivity"
                name="connectivity"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.connectivity}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };





  // Render device-specific details based on type
  const renderDeviceSpecificDetails = () => {
    console.log(device.hardware_type.toLowerCase());

    switch (device.hardware_type.toLowerCase()) {

      case 'on-premise server':
      case 'desktop':
      case 'laptop':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Laptop Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Processor:</span> {device.computer.cpu}</p>
              <p><span className="font-medium">RAM:</span> {device.computer.ram}</p>
              <p><span className="font-medium">Storage:</span> {device.computer?.storage}</p>
              
              {/* "On-Premise Server": ["Server_Name", "CPU", "RAM", "Storage", "Operating_System"], */}
              {device.hardware_type.toLowerCase() === "on-premise server" && (
              <div>
                  <p><span className="font-medium">Operating System:</span> {device?.computer.operating_system}</p>
                  <p><span className="font-medium">Server Name:</span> {device.computer.hardware_server_name}</p>
              </div>
              )}

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
    <div >
      <div className="flex items-center text-sm text-gray-600 pl-1 mb-2">
    <div
        onClick={() => navigate('/dashboard/hardware')}
        className="hover:text-blue-600 hover:underline cursor-pointer"
    >
        Dashboard
    </div>
    <div className="mx-1">&gt;</div>
    
    <div
        onClick={() => navigate('/dashboard/hardware/view_hardware')}
        className="hover:text-blue-600 hover:underline cursor-pointer"
    >
        Hardware list
    </div>
    <div className="mx-1">&gt;</div>
    
    <div className="text-blue-600">View Details of {device.hardware_type}</div>
</div>

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
          <div className="w-3/5 bg-white rounded-lg shadow-xl p-6 ml-4 max-h-[90vh] overflow-y-auto transition-all duration-300">
            <h3 className="text-xl font-semibold mb-6 border-b pb-3">Edit Hardware Details</h3>
  
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
                {/* Basic Information Section */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Basic Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                      <input
                        type="text"
                        id="manufacturer"
                        name="manufacturer"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.manufacturer}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="model_number" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input
                        type="text"
                        id="model_number"
                        name="model_number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.model_number}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                      <input
                        type="text"
                        id="serial_number"
                        name="serial_number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.serial_number}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Hardware Status</label>
                      <select
                        id="status"
                        name="status"
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
                      <label htmlFor="assigned_department" className="block text-sm font-medium text-gray-700 mb-1">Assigned Department</label>
                     <select
                id="assigned_department"
                name="assigned_department"
                className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.assigned_department}
              >
                <option value="" disabled>Select Department</option>
                <option value="HR">Human Resources</option>
                <option value="IT">Information Technology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.assigned_department && formik.errors.assigned_department ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.assigned_department}</div>
              ) : null}
                    </div>
                  </div>
                </div>
  
                {/* Device-specific form fields */}
                {renderDeviceSpecificFormFields()}
  
                {/* Purchase Information */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Purchase Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                      <input
                        type="date"
                        id="purchase_date"
                        name="purchase_date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.purchase_date}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="purchase_cost" className="block text-sm font-medium text-gray-700 mb-1">Purchase Cost</label>
                      <input
                        type="text"
                        id="purchase_cost"
                        name="purchase_cost"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.purchase_cost}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="vendor_name" className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                      <input
                        type="text"
                        id="vendor_name"
                        name="vendor_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.vendor_name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="vendor_contact" className="block text-sm font-medium text-gray-700 mb-1">Vendor Contact</label>
                      <input
                        type="text"
                        id="vendor_contact"
                        name="vendor_contact"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.vendor_contact}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="vendor_email" className="block text-sm font-medium text-gray-700 mb-1">Vendor Email</label>
                      <input
                        type="email"
                        id="vendor_email"
                        name="vendor_email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.vendor_email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
  
                {/* Warranty & Maintenance */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Warranty & Maintenance</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="warranty_expiry_date" className="block text-sm font-medium text-gray-700 mb-1">Warranty End Date</label>
                      <input
                        type="date"
                        id="warranty_expiry_date"
                        name="warranty_expiry_date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.warranty_expiry_date}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="last_service_date" className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance Date</label>
                      <input
                        type="date"
                        id="last_service_date"
                        name="last_service_date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.last_service_date}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* <div>
                      <label htmlFor="next_service_date" className="block text-sm font-medium text-gray-700 mb-1">Next Maintenance Date</label>
                      <input
                        type="date"
                        id="next_service_date"
                        name="next_service_date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.next_service_date}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div> */}
                    <div>
                      <label htmlFor="service_cost" className="block text-sm font-medium text-gray-700 mb-1">Maintenance Cost</label>
                      <input
                        type="text"
                        id="service_cost"
                        name="service_cost"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.service_cost}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
  
                {/* Notes */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Notes</h4>
                  <div>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
  
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
                    {formik.isSubmitting ? 'Updating...' : ' Save Changes'}
                   
                  </button>
                </div>
              </form>
          </div>
        )}
  
      </div>
    </div>
  );
};

export default View_hardwareDetails;