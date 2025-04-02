  import { useEffect, useState } from 'react';
  import { getcustomers } from '../../services/allapi';
  import PropTypes from 'prop-types';
  import { useNavigate } from 'react-router-dom';


  const View_customers = ({ data, limit }) => {
    const navigate=useNavigate()
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage] = useState(9);


    // filter customer
    const [nameFilter, setnameFilter] = useState('all');
    const [filteredcustomers, setfilteredcustomers] = useState([]);
    

    useEffect(() => {
      const getdata = async () => {
        try {
          const response = await getcustomers();
          console.log("customers", response);
          setCustomers(response);
          
        } catch (error) {
          console.error("Error fetching customers:", error);
        } finally {
          setLoading(false);
        }
      };
      getdata();
    }, []); // Empty dependency array to run only once

    // If limit is provided, use it directly; otherwise, use pagination
    const allData = data || customers;




    useEffect(() => {
      // Apply filtering
      if (allData.length > 0) {
        if (nameFilter === 'all') {
          setfilteredcustomers(allData);
        } else {
          const filtered = allData.filter(item => item.customer_name === nameFilter);
          setfilteredcustomers(filtered);
        }
        
        // Reset to first page whenever the data changes
        setCurrentPage(1);
      } else {
        setfilteredcustomers([]);
      }
    }, [customers, data, nameFilter, allData]);
    

    const displayedData = limit 
    ? allData.slice(0, limit) // When limit is provided, show from allData without filtering
    : filteredcustomers.slice((currentPage - 1) * customersPerPage, currentPage * customersPerPage);

    // Only calculate pagination if no limit is provided
    const totalPages = limit ? 1 : Math.ceil(filteredcustomers.length / customersPerPage);

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
    const handleViewDetails=(customer)=>{
      console.log("Customer being passed:", customer); 
      navigate('/dashboard/services/View_customerdetails', { state: { customer } });
    }



    const uniqueCustomerNames = ['all', ...new Set(allData.map(customer => customer.customer_name))];


    return (
      <div className="w-full">
          {!limit && (
          <div className="mb-4 flex">
          <div>
            <select
              id="nameFilter"
              value={nameFilter}
              onChange={(e) => setnameFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-blue-200"
            >
              {uniqueCustomerNames.map((name) => (
                <option key={name} value={name}>
                  {name === 'all' ? 'All Customers' : name}
                </option>
              ))}
            </select>
          </div>
        </div>
        )}


        <h1 className="font-bold text-l mb-2 ml-1 text-gray-500">Customer Details</h1>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-4">Loading customer data...</div>
        ) : allData.length === 0 ? (
          <div className="text-center py-4">No customers found</div>
        ) : (
          <>
            {/* Main table showing summary information */}
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left font-semibold">Customer Name</th>
                    <th className="py-3 px-4 text-left font-semibold">Email</th>
                    <th className="py-3 px-4 text-left font-semibold">Status</th>
                    <th className="py-3 px-4 text-left font-semibold">Cost</th>
                    <th className="py-3 px-4 text-left font-semibold">End Date</th>
                    <th className="py-3 px-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedData.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{customer.customer_name}</td>
                      <td className="py-3 px-4 text-sm">{customer.customer_email}</td>
                      <td className="py-3 px-4 text-sm capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">£{customer.cost}</td>
                      <td className="py-3 px-4 text-sm">{customer.endDate}</td>
                      <td className="py-3 px-4 text-sm">
                        <button
                        onClick={() => handleViewDetails(customer)}
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
                  Showing {(currentPage - 1) * customersPerPage + 1}-{Math.min(currentPage * customersPerPage, allData.length)} of {allData.length} customers
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

  // ✅ PropTypes Validation
  View_customers.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        customer_name: PropTypes.string.isRequired,
        customer_email: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        endDate: PropTypes.string
      })
    ),
    limit: PropTypes.number, // limit is optional
  };

  // ✅ Default Props (Optional)
  View_customers.defaultProps = {
    data: null, // Use API data if no data provided
    limit: null, // Show all rows if no limit is provided
  };

  export default View_customers;