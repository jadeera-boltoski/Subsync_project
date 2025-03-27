import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,  
  Trash2, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { getrecyclebin } from '../../services/allapi';

const RecycleBin = () => {
  // State for deleted items
  const [deletedItems, setDeletedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state
 
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Selected items for batch operations
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Get type color based on item type
  const getTypeColor = (type) => {
    switch(type) {
      case 'hardware':
        return 'bg-blue-100 text-blue-800';
      case 'subscription':
        return 'bg-purple-100 text-purple-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calculate days remaining until permanent deletion
  // const getDaysRemaining = (deletedAt) => {
  //   const expireDate = new Date(deletedAt);
  //   const today = new Date();
  //   const diffTime = expireDate - today;
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays;
  // };
  
  // Fetch data from API (using mockData for now)
  const fetchDeletedItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulating API call with setTimeout
      // const response = await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve({
      //       status: 200,
      //       data: [
      //         { id: 'hw-1001', name: 'Laptop XPS-15', type: 'hardware', deletedAt: '2025-03-15T10:30:00', deletedBy: 'John Smith', expiresAt: '2025-04-14T10:30:00' },
      //         { id: 'sub-2001', name: 'Premium Plan - Monthly', type: 'subscription', deletedAt: '2025-03-18T14:20:00', deletedBy: 'Sarah Johnson', expiresAt: '2025-04-17T14:20:00' },
      //         { id: 'cust-3001', name: 'Acme Corp.', type: 'customer', deletedAt: '2025-03-10T09:45:00', deletedBy: 'Admin', expiresAt: '2025-04-09T09:45:00' },
      //         { id: 'hw-1002', name: 'Mobile Phone S21', type: 'hardware', deletedAt: '2025-03-16T11:20:00', deletedBy: 'Mike Lee', expiresAt: '2025-04-15T11:20:00' },
      //         { id: 'sub-2002', name: 'Basic Plan - Annual', type: 'subscription', deletedAt: '2025-03-14T16:30:00', deletedBy: 'David Kim', expiresAt: '2025-04-13T16:30:00' },
      //         { id: 'cust-3002', name: 'TechSolutions Inc.', type: 'customer', deletedAt: '2025-03-05T13:15:00', deletedBy: 'Emma Wilson', expiresAt: '2025-04-04T13:15:00' },
      //         { id: 'hw-1003', name: 'Monitor 27" 4K', type: 'hardware', deletedAt: '2025-03-19T09:10:00', deletedBy: 'John Smith', expiresAt: '2025-04-18T09:10:00' },
      //         { id: 'sub-2003', name: 'Enterprise Plan - Quarterly', type: 'subscription', deletedAt: '2025-03-12T15:45:00', deletedBy: 'Lisa Chen', expiresAt: '2025-04-11T15:45:00' },
      //       ]
      //     });
      //   }, 1000);
      // });




    






      const response=await getrecyclebin()
      console.log("recycle bin",response);
      const result = [...response].sort((a, b) => {
        return new Date(b.deletedAt) - new Date(a.deletedAt);
      });
      
      if (response && Array.isArray(result)) {
        setDeletedItems(result);
        setFilteredItems(result);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      setError('Failed to load deleted items. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    fetchDeletedItems();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = [...deletedItems];
    
   
    
    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(item => item.type === typeFilter);
    }
    
    setFilteredItems(result);
    setCurrentPage(1);
  }, [ typeFilter, deletedItems]);
  
  // Calculate pagination - use useMemo to prevent recalculations
  const paginationData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    
    return {
      indexOfLastItem,
      indexOfFirstItem,
      currentItems,
      totalPages
    };
  }, [currentPage, itemsPerPage, filteredItems]);
  
  // Handle select all - only dependent on selectAll change
  useEffect(() => {
    if (selectAll) {
      setSelectedItems(paginationData.currentItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  }, [selectAll, paginationData.currentItems]);
  
  // Reset selectAll when page changes
  useEffect(() => {
    setSelectAll(false);
  }, [currentPage]);
  
  // Handle item selection
  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Restore items
  const handleRestore = async (ids) => {
    // In real implementation, this would be an API call
    console.log('Restoring items:', ids);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove restored items from the list
      const updatedItems = deletedItems.filter(item => !ids.includes(item.id));
      setDeletedItems(updatedItems);
      setSelectedItems(selectedItems.filter(id => !ids.includes(id)));
      
      // Show success message (in a real app)
      alert(`Successfully restored ${ids.length} item(s)`);
    } catch (err) {
      console.error('Error restoring items:', err);
      alert('Failed to restore items. Please try again.');
    }
  };
  
  // Permanently delete items
  const handleDelete = async (ids) => {
    // In real implementation, this would be an API call
    console.log('Permanently deleting items:', ids);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove deleted items from the list
      const updatedItems = deletedItems.filter(item => !ids.includes(item.id));
      setDeletedItems(updatedItems);
      setSelectedItems(selectedItems.filter(id => !ids.includes(id)));
      
      // Show success message (in a real app)
      alert(`Successfully deleted ${ids.length} item(s) permanently`);
    } catch (err) {
      console.error('Error deleting items:', err);
      alert('Failed to delete items. Please try again.');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Refresh data
  const handleRefresh = () => {
    fetchDeletedItems();
  };
  
  // Handle search submit
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   // The search is already handled by the useEffect
  // };
  
  // Destructure pagination data for cleaner code
  const { indexOfLastItem, indexOfFirstItem, currentItems, totalPages } = paginationData;
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">Recycle Bin</h1>
          <p className="text-sm text-gray-500">Items are kept for 30 days before permanent deletion</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          title="Refresh"
        >
          <RefreshCw size={20} className="text-gray-600" />
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6 space-y-4 bg-white p-4 rounded-md shadow-sm border border-gray-200">
        {/* Search bar */}
        {/* <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deleted items..."
            className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type="submit" 
            className="bg-blue-600 p-2 rounded-r text-white border border-blue-600"
          >
            <Search size={20} />
          </button>
        </form> */}
        
        {/* Type filter only */}
        <div className="flex flex-wrap">
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="hardware">Hardware</option>
            <option value="subscription">Subscription</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => handleRestore(selectedItems)}
            disabled={selectedItems.length === 0}
            className={`flex items-center p-2 rounded-md ${selectedItems.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            <RefreshCw size={16} className="mr-1" /> Restore Selected
          </button>
          
          <button 
            onClick={() => handleDelete(selectedItems)}
            disabled={selectedItems.length === 0}
            className={`flex items-center p-2 rounded-md ${selectedItems.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            <Trash2 size={16} className="mr-1" /> Delete Permanently
          </button>
        </div>
        
        <div>
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to empty the recycle bin? This action cannot be undone.")) {
                handleDelete(deletedItems.map(item => item.id));
              }
            }}
            className="p-2 bg-red-100 text-red-700 border border-red-200 rounded-md hover:bg-red-200"
          >
            Empty Recycle Bin
          </button>
        </div>
      </div>
      
      {/* Table or alternate content */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error  ? (
        <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-md p-8 shadow-sm">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2 text-red-600">Error Loading Data</h3>
          <p className="text-center text-gray-700">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )  : (
        <>
          <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 p-3">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={() => setSelectAll(!selectAll)}
                      className="h-4 w-4 accent-blue-600"
                    />
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Name/ID</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Type</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Deleted On</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Deleted By</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Expires In</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => {
                  const daysRemaining = item.expiresAt
                  const expiryClass = 
                    daysRemaining <= 7 ? 'text-red-600 font-medium' : 
                    daysRemaining <= 14 ? 'text-yellow-600' : 
                    'text-gray-600';
                    
                  return (
                    <tr key={item.id} className="hover:bg-blue-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="h-4 w-4 accent-blue-600"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.id}</div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{formatDate(item.deletedAt)}</td>
                      <td className="p-3 text-sm text-gray-600">{item.deletedBy}</td>
                      <td className="p-3 text-sm">
                        <span className={expiryClass}>
                          {daysRemaining} days
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRestore([item.id])}
                          className="text-blue-600 hover:text-blue-800 mr-2 p-1"
                          title="Restore"
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete([item.id])}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete Permanently"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 bg-white p-3 border border-gray-200 rounded-md shadow-sm">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="flex items-center justify-center px-3 py-2">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecycleBin;