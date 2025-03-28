import { useLocation, useNavigate } from 'react-router-dom';

const View_hardwareDetails = () => {
  const navigate = useNavigate();
  const location=useLocation()

  const device = location.state?.device;
  console.log("dfdf",device);
  

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
    switch (device.hardware_type.toLowerCase()) {
      case 'laptop':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Laptop Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Processor:</span> {device.processor}</p>
              <p><span className="font-medium">RAM:</span> {device.ram}</p>
              <p><span className="font-medium">Storage:</span> {device.storage}</p>
              <p><span className="font-medium">Operating System:</span> {device.os}</p>
              <p><span className="font-medium">Display Size:</span> {device.display_size}</p>
            </div>
          </div>
        );
      
      case 'smartphone':
      case 'tablet':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Mobile Device Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Carrier:</span> {device.carrier}</p>
              <p><span className="font-medium">Phone Number:</span> {device.phone_number}</p>
              <p><span className="font-medium">IMEI:</span> {device.imei}</p>
              <p><span className="font-medium">Screen Size:</span> {device.screen_size}</p>
              <p><span className="font-medium">Storage:</span> {device.storage}</p>
            </div>
          </div>
        );
      
      case 'monitor':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Monitor Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Size:</span> {device.size}</p>
              <p><span className="font-medium">Resolution:</span> {device.resolution}</p>
              <p><span className="font-medium">Refresh Rate:</span> {device.refresh_rate}</p>
            </div>
          </div>
        );
      
      case 'printer':
        return (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Printer Specifications</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Printer Type:</span> {device.printer_type}</p>
              <p><span className="font-medium">Connectivity:</span> {device.connectivity}</p>
              <p><span className="font-medium">Cartridge Model:</span> {device.cartridge_model}</p>
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

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-full max-h-[90vh] overflow-y-auto m-4">
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
              <p><span className="font-medium">Asset Tag:</span> {device.asset_tag}</p>
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
              {/* <p><span className="font-medium">Department:</span> {device.assigned_department}</p> */}
              {/* <p><span className="font-medium">Location:</span> {device.location}</p> */}
            </div>
          </div>
          
          {/* Device-specific details */}
          {renderDeviceSpecificDetails()}
          
          {/* Purchase Information */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Purchase Information</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Purchase Date:</span> {device.purchase.purchase_date}</p>
              <p><span className="font-medium">Purchase Price:</span> ${parseFloat(device.purchase.purchase_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p><span className="font-medium">Vendor:</span> {device.purchase.vendor}</p>
              {/* <p><span className="font-medium">Vendor Contact:</span> {device.purchase.vendor_contact}</p>
              <p><span className="font-medium">Vendor Email:</span> <a href={`mailto:${device.purchase.vendor_email}`} className="text-blue-500 hover:underline">{device.vendor_email}</a></p> */}
            </div>
          </div>
          
          {/* Warranty & Maintenance */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-gray-700 mb-3">Warranty & Maintenance</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Warranty End:</span> {device.warranty.warranty_expiry_date}</p>
              {calculateWarrantyDaysRemaining(device.warranty.warranty_expiry_date) > 0 ? (
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
              <p><span className="font-medium">Last Maintenance:</span> {device.services.last_service_date}</p>
              <p><span className="font-medium">Next Maintenance:</span> {device.services.next_service_date}</p>
            </div>
          </div>
        </div>
        
        {/* Notes Section */}
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h4 className="font-medium text-gray-700 mb-3">Notes</h4>
          <p className="text-gray-600">{device.notes}</p>
        </div>
      </div>
      
      <div className="border-t px-6 py-4 flex justify-end">
        <button 
          onClick={() => navigate('/dashboard/hardware')}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
        >
          Back
        </button>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Edit
        </button>
      
      </div>
    </div>
  );
};

export default View_hardwareDetails;