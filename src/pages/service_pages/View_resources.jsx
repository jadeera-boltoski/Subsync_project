import { useEffect, useState } from 'react';
import { getallresources } from '../../services/allapi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';


const View_resources = ({ limit }) => {
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resourcesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()

  useEffect(() => {
    const getdata = async () => {
      setLoading(true);
      try {
        const response = await getallresources();
        console.log("hellooo sheee", response);
        const sortedResources = [...response].sort((a, b) => b.id - a.id);
        setResources(sortedResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, []);

  // If limit is provided, use it to slice resources directly
  const displayedResources = limit 
    ? resources.slice(0, limit) 
    : resources.slice((currentPage - 1) * resourcesPerPage, currentPage * resourcesPerPage);

  // Calculate total pages (only needed if no limit is provided)
  const totalPages = limit ? 1 : Math.ceil(resources.length / resourcesPerPage);

  // Pagination functions (only used if no limit is provided)
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

  return (
   <div >
    {!limit&&(
          <div className="flex items-center text-sm text-gray-600 pl-1 mb-2">
          <div
            onClick={() => navigate("/dashboard/services")}
            className="hover:text-blue-600 hover:underline cursor-pointer"
          >
            Customer service Dashboard
          </div>
          <div className="mx-1">&gt;</div>
          <div className="text-blue-600">Resource list</div>
        </div>
        )}
      <div className="w-full">
        <h1 className="font-bold text-l mb-2 ml-1 text-gray-500">Resource Details</h1>
        
        {/* Main table showing summary information */}
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">Resource Name</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-center font-semibold">Cost</th>
                <th className="py-3 px-4 text-left font-semibold">Billing Cycle</th>
                <th className="py-3 px-4 text-left font-semibold">Storage</th>
                <th className="py-3 px-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">Loading resources...</td>
                </tr>
              ) : displayedResources.length > 0 ? (
                displayedResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{resource.resource_name}</td>
                    <td className="py-3 px-4 text-sm capitalize">{resource.resource_type}</td>
                    <td className="py-3 px-4 text-sm text-right">₹{resource.resource_cost}</td>
                    <td className="py-3 px-4 text-sm capitalize">{resource.billing_cycle}</td>
                    <td className="py-3 px-4 text-sm">{resource.storage_capacity}</td>
                    <td className="py-3 px-4 text-sm">
                      <button
                      onClick={()=>{navigate('/dashboard/services/view_resources_details', { state: { resource } })}}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">No resources found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination controls*/}
        {!limit && totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 px-2">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * resourcesPerPage + 1}-{Math.min(currentPage * resourcesPerPage, resources.length)} of {resources.length} resources
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
      </div>
   </div>
  );
};


// ✅ PropTypes Validation
View_resources.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  limit: PropTypes.number, // limit is optional
};

// ✅ Default Props (Optional)
View_resources.defaultProps = {
  limit: null, // Show all rows if no limit is provided
};

export default View_resources;