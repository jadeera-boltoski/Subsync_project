import { useEffect, useState } from 'react';
import { get_hardware } from '../../services/allapi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const View_hardware = ({ data, limit }) => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [devicesPerPage] = useState(9);

  // filter
  const [typeFilter, setTypeFilter] = useState('all');
  const [manufacturerFilter, setManufacturerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);

 




  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await get_hardware();
        console.log("hardware", response);
        setDevices(response);
      } catch (error) {
        console.error("Error fetching hardware:", error);
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, []); 

  // If limit is provided, use it directly; otherwise, use pagination
  const allData = data || devices;

  // Apply filters only when no limit is set
  useEffect(() => {
    // If limit is provided, just set filteredItems to all data
    if (limit) {
      setFilteredItems(allData);
      return;
    }
    
    let result = [...allData];

    if (typeFilter !== 'all') {
      result = result.filter(item => item.hardware_type === typeFilter);
    }

    // Manufacturer filter
    if (manufacturerFilter !== 'all') {
      result = result.filter(item => item.manufacturer === manufacturerFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }
    

    setFilteredItems(result);
    // first pagil filterd data sett chaythu
    setCurrentPage(1); 
  },[allData, typeFilter, manufacturerFilter, statusFilter, limit]);



  const displayedData = limit 
  ? allData.slice(0, limit) // When limit is provided, show from allData without filtering
  : filteredItems.slice((currentPage - 1) * devicesPerPage, currentPage * devicesPerPage);

 // Only calculate pagination if no limit is provided
  const totalPages = limit ? 1 : Math.ceil(filteredItems.length / devicesPerPage);

  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewDetails=(device)=>{
    navigate('/dashboard/hardware/view_hardwaredetails', { state: { device } });
  }

  const hardwareTypes = ['all', ...new Set(allData.map(device => device.hardware_type))];
  const manufacturers = ['all', ...new Set(allData.map(device => device.manufacturer))];
  const statuses = ['all', ...new Set(allData.map(device => device.status))];

  return (
    <div className="w-full">
      <h1 className="font-bold text-l mb-2 ml-1 text-gray-500">All Hardware Details</h1>
      {!limit&&(
      <div>
        <div className="mb-4 flex space-x-4">
          <div>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-blue-200"
            >
              {hardwareTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          <div className="">
            
            <select
              id="manufacturerFilter"
              value={manufacturerFilter}
              onChange={(e) => setManufacturerFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-blue-200"
            >
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer} value={manufacturer}>
                  {manufacturer === 'all' ? 'All Manufacturers' : manufacturer}
                </option>
              ))}
            </select>
          </div>
          
          <div className="">
           
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-blue-200"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-4">Loading hardware data...</div>
      ) : allData.length === 0 ? (
        <div className="text-center py-4">No hardware found</div>
      ) : (
        <>
          {/* Main table showing summary information */}
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-3 px-4 text-left font-semibold">Type</th>
                  <th className="py-3 px-4 text-left font-semibold">Manufacturer</th>
                  <th className="py-3 px-4 text-left font-semibold">Model Number</th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                  <th className="py-3 px-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedData.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{device.hardware_type}</td>
                    <td className="py-3 px-4 text-sm">{device.manufacturer}</td>
                    <td className="py-3 px-4 text-sm">{device.model_number}</td>
                    <td className={`py-3 px-4 text-sm capitalize ${
                      device.status === "Active" ? "text-green-600" : "text-red-600"
                    }`}>
                      {device.status}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                         onClick={() => handleViewDetails(device)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls - only show if there's no limit and more than one page */}
          {!limit && totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 px-2">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * devicesPerPage + 1}-{Math.min(currentPage * devicesPerPage, allData.length)} of {allData.length} devices
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === number + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// PropTypes Validation
View_hardware.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      hardware_type: PropTypes.string.isRequired,
      manufacturer: PropTypes.string.isRequired,
      model_number: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    })
  ),
  limit: PropTypes.number, // limit is optional
};

// Default Props
View_hardware.defaultProps = {
  data: null, // Use API data if no data provided
  limit: null, // Show all rows if no limit is provided
};

export default View_hardware;