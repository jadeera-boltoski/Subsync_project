import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getsubscription } from "../../services/allapi";

function Viewsubscription() {
  const [subscriptions, setSubscriptions] = useState([])
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)
  
 

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const result = await getsubscription(); // Fetch data
        console.log(result);
        const sortedResources = [...result].sort((a, b) => b.id - a.id);
        setSubscriptions(sortedResources)
      } catch (error) {
        console.error("Error fetching provider name:", error);
        setError(error)
      }
    };

    fetchdata();
  }, []);

  console.log(subscriptions);
  console.log(error);

  // Get current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = subscriptions.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(subscriptions.length / rowsPerPage);

  const handleViewDetails = (subscription) => {
   
    navigate('/dashboard/subscriptions/Viewdetails', { state: { subscription } });
    
  };

  return (
    <div className="w-full">
      <h1 className="font-bold text-l mb-2 ml-1 text-gray-500">All Subscriptions Details</h1>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700 gap-2">
              <th className="py-3 px-4 text-left font-semibold">Category</th>
              <th className="py-3 px-4 text-left font-semibold">Name</th>
              <th className="py-3 px-4 text-left font-semibold">Start Date</th>
              <th className="py-3 px-4 text-left font-semibold">End Date</th>
              <th className="py-3 px-4 text-left font-semibold">Billing Cycle</th>
              <th className="py-3 px-4 text-left font-semibold">Provider</th>
              <th className="py-3 px-4 text-left font-semibold">Cost</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRows.map(subscription => (
              // {tableData.slice(0, limit ? parseInt(limit) : tableData.length).map((item, index) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{subscription.subscription_category}</td>
                    <td className="py-3 px-4 text-sm">{subscription.name}</td>
                    <td className="py-3 px-4 text-sm">{subscription.start_date}</td>
                    <td className="py-3 px-4 text-sm">{subscription.end_date}</td>
                    <td className="py-3 px-4 text-sm">{subscription.billing_cycle}</td>
                    <td className="py-3 px-4 text-sm">{subscription.providerName}</td>
                    <td className="py-3 px-4 text-sm">{subscription.cost}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${subscription.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleViewDetails(subscription)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                  //  ))}
                ))
              }
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, subscriptions.length)} of {subscriptions.length} entries
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Viewsubscription