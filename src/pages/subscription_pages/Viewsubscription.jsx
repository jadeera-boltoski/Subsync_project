import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { getsubscription } from "../../services/allapi";
import { format } from "date-fns";

function Viewsubscription() {
  const [subscriptions, setSubscriptions] = useState([])
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)


  const location = useLocation(); // Add this import at the top

  // Get initial filter from navigation state if available
  const initialStatusFilter = location.state?.initialStatusFilter || 'all';


  // filter subscription
  const [categoryFilter, setcategoryFilter] = useState('all');
  const [statusFilter, setstatusFilter] = useState(initialStatusFilter);

  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);


  useEffect(() => {
    const fetchdata = async () => {
      try {
        const result = await getsubscription(); // Fetch data
        console.log(result);
        // const sortedResources = [...result].sort((a, b) => b.start_date - a.start_date);
        // setSubscriptions(sortedResources)
        const sortedResources = [...result].sort((a, b) => {
          // Convert string dates to Date objects for proper comparison
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          
          // Sort in descending order (newest first)
          return dateB - dateA;
        });
        setSubscriptions(sortedResources);
        setFilteredSubscriptions(sortedResources);
      } catch (error) {
        console.error("Error fetching provider name:", error);
        setError(error)
      }
    };

    fetchdata();
  }, []);

  console.log(subscriptions);
  console.log(error);

  // apply filter
  useEffect(() => {
    if (subscriptions.length === 0) return;

    let result = [...subscriptions];
    // Type filter
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.subscription_category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }

    setFilteredSubscriptions(result);
    setCurrentPage(1);
  }, [categoryFilter, subscriptions, statusFilter]);

  const uniqueCategories = subscriptions.length > 0
    ? ['all', ...new Set(subscriptions.map(item => item.subscription_category))]
    : ['all'];

  const uniqueStatus = subscriptions.length > 0
    ? ['all', ...new Set(subscriptions.map(item => item.status))]
    : ['all'];




  // Get current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredSubscriptions.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredSubscriptions.length / rowsPerPage);

  const handleViewDetails = (subscription) => {

    navigate('/dashboard/subscriptions/Viewdetails', { state: { subscription } });

  };

  return (

    <div className="w-full">
       <div className="flex items-center text-sm text-gray-600 pl-1 mb-2">
        <div
          onClick={() => navigate(-1)}
          className="hover:text-blue-600 hover:underline cursor-pointer"
        >
          Subscription Dashboard
        </div>
        <div className="mx-1">&gt;</div>
        <div className="text-blue-600">Subscription list</div>
      </div>
      <div className="flex gap-4">
        <div className="mb-4">
          <select
            id="typeFilter"
            value={categoryFilter}
            onChange={(e) => setcategoryFilter(e.target.value)}
            className="mt-1 block w-45 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-blue-200"
          >
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 ">
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setstatusFilter(e.target.value)}
            className="mt-1 block w-45 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-blue-200"
          >
            {uniqueStatus.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All status' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">Error loading subscriptions: {error.message}</div>}
      <h1 className="font-bold text-l mb-2 ml-1 text-gray-500">All Subscriptions Details</h1>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700 gap-2">
              <th className="py-3 px-4 text-left font-semibold">Category</th>
              <th className="py-3 px-4 text-left font-semibold">Name</th>
              <th className="py-3 px-4 text-left font-semibold">Start Date</th>
              <th className="py-3 px-4 text-left font-semibold">Renewal Date</th>
              <th className="py-3 px-4 text-left font-semibold">Billing Cycle</th>
              <th className="py-3 px-4 text-left font-semibold">Provider</th>
              <th className="py-3 px-6 text-left font-semibold">Cost</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
              <th className="py-3 px-6 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRows.map(subscription => (
              // {tableData.slice(0, limit ? parseInt(limit) : tableData.length).map((item, index) => (
              <tr key={subscription.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">{subscription.subscription_category}</td>
                <td className="py-3 px-4 text-sm">{subscription.name}</td>
                <td className="py-3 px-4 text-sm">{format(new Date(subscription.start_date), "dd-MM-yyyy")}</td>
                {/* <td className="py-3 px-4 text-sm">{subscription.end_date
                  ? format(new Date(subscription.end_date), "dd-MM-yyyy")
                  : "life long"}</td> */}
                <td className="py-3 px-4 text-sm"> {format(new Date(subscription.next_payment_date), "dd-MM-yyyy")}</td>
                   {/* {subscription.next_payment_date && (
                    <p><span className="font-medium">Next Payment:</span> {format(new Date(subscription.next_payment_date), "dd-MM-yyyy")}</p>
                  )} */}
                <td className="py-3 px-4 text-sm">{subscription.billing_cycle}</td>
                <td className="py-3 px-4 text-sm">{subscription.providerName}</td>
                <td className="py-3 px-4 text-sm text-right">{subscription.cost}</td>
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
          Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredSubscriptions.length)} of {filteredSubscriptions.length} entries
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