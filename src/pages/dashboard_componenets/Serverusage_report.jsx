import { useEffect, useState } from 'react';
import Serverusage from './Serverusage'
import { getserverusage_report } from '../../services/allapi';
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';

const Serverusage_report = () => {
  // Sample data - replace with your actual API call
  const [serverData, setServerData] = useState([]);
  const navigate=useNavigate()

  useEffect(()=>{
    const getdata=async()=>{
      const response=await getserverusage_report()
      console.log(response);
      setServerData(response)
    }
    getdata()
  },[])

  // State to control what data to show
  const [reportType, setReportType] = useState('overview'); // 'overview', 'server', or 'resource'
  const [expandedServer, setExpandedServer] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Function to get progress bar color based on usage percentage
  const getProgressBarColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 75) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  // Function to properly format CSV fields
  const formatCSVField = (value) => {
    // Convert to string and handle null/undefined
    const str = value ? String(value) : '';
    
    // If the field contains commas, quotes, or newlines, wrap in quotes and escape any quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    
    // For dates, ensure they're wrapped in quotes
    if (str.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return `"${str}"`;
    }
    
    return str;
  };

  // Function to generate CSV content
  const generateCSV = () => {
    if (reportType === 'server') {
      // Generate CSV for server overview
      const headers = [
        'Server ID', 
        'Server Name', 
        'Server Type', 
        'Total Capacity', 
        'Used Capacity', 
        'Remaining Capacity', 
        'Usage Percentage'
      ];
      
      let csvContent = headers.join(',') + '\n';
      
      serverData.forEach(server => {
        const row = [
          formatCSVField(server.id),
          formatCSVField(server.server_name),
          formatCSVField(server.server_type),
          formatCSVField(server.server_capacity),
          formatCSVField(server.used_capacity),
          formatCSVField(server.remaining_capacity),
          formatCSVField(server.usage_percentage)
        ];
        csvContent += row.join(',') + '\n';
      });
      
      return csvContent;
    } else {
      // Generate CSV for detailed resource report
      const headers = [
        'Server ID',
        'Server Name',
        'Server Type',
        'Server Capacity',
        'Server Usage',
        'Resource Name',
        'Resource Type',
        'Storage Capacity',
        'Status',
        'Hosting Type',
        'Hosting Location',
        'Billing Cycle',
        'Cost',
        'Next Payment Date',
        'Provisioned Date',
        'Last Updated Date'
      ];
      
      let csvContent = headers.join(',') + '\n';
      
      serverData.forEach(server => {
        server.resources.forEach(resource => {
          const row = [
            formatCSVField(server.id),
            formatCSVField(server.server_name),
            formatCSVField(server.server_type),
            formatCSVField(server.server_capacity),
            formatCSVField(server.usage_percentage),
            formatCSVField(resource.resource_name),
            formatCSVField(resource.resource_type),
            formatCSVField(resource.storage_capacity),
            formatCSVField(resource.status),
            formatCSVField(resource.hosting_type),
            formatCSVField(resource.hosting_location),
            formatCSVField(resource.billing_cycle),
            formatCSVField(resource.resource_cost),
            formatCSVField(resource.next_payment_date),
            formatCSVField(resource.provisioned_date),
            formatCSVField(resource.last_updated_date)
          ];
          csvContent += row.join(',') + '\n';
        });
      });
      
      return csvContent;
    }
  };

  // Function to handle download
  const handleDownload = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const filename = reportType === 'server' 
      ? 'server_usage_report.csv' 
      : 'resource_usage_report.csv';
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle server expansion in detailed view
  const toggleServerExpansion = (serverId) => {
    if (expandedServer === serverId) {
      setExpandedServer(null);
    } else {
      setExpandedServer(serverId);
    }
  };

  // Get current data for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  
  // Get current rows based on the view type
  const getCurrentRows = () => {
    if (reportType === 'server') {
      return serverData.slice(indexOfFirstRow, indexOfLastRow);
    } else if (reportType === 'resource') {
      // Flatten the resources array for pagination
      const flattenedResources = serverData.flatMap(server => 
        server.resources.map(resource => ({
          ...resource,
          server_id: server.id,
          server_name: server.server_name
        }))
      );
      return flattenedResources.slice(indexOfFirstRow, indexOfLastRow);
    }
    return [];
  };

  // Calculate total pages
  const calculateTotalPages = () => {
    if (reportType === 'server') {
      return Math.ceil(serverData.length / rowsPerPage);
    } else if (reportType === 'resource') {
      const totalResources = serverData.reduce((total, server) => 
        total + server.resources.length, 0);
      return Math.ceil(totalResources / rowsPerPage);
    }
    return 0;
  };

  // Pagination component
  const Pagination = () => {
    const totalPages = calculateTotalPages();
    
    const handlePrevious = () => {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    };
    
    const handleNext = () => {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };
    
    return (
      <div className="flex justify-between items-center mt-4 px-2">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, reportType === 'server' ? serverData.length : serverData.reduce((total, server) => total + server.resources.length, 0))} of {reportType === 'server' ? serverData.length : serverData.reduce((total, server) => total + server.resources.length, 0)} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Previous
          </button>
          <div className="px-3 py-1 bg-gray-100 rounded">
            Page {currentPage} of {totalPages || 1}
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm text-gray-600 pl-3 mb-2">
  <div
    onClick={() => navigate(-1)}
    className="hover:text-blue-600 hover:underline cursor-pointer"
  >
    Dashboard
  </div>
  <div className="mx-1">&gt;</div>
  <div className="text-blue-600">server usage Report</div>
</div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-950 text-white text-center py-4">
          <h1 className="text-2xl font-bold">SERVER & RESOURCE USAGE REPORT</h1>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center ">
            <div className="flex items-center">
              <label className="mr-2 font-medium">Report type:</label>
              <select 
                value={reportType} 
                onChange={(e) => {
                  setReportType(e.target.value);
                  setCurrentPage(1); // Reset to first page when changing report type
                }}
                className="border rounded p-2"
              >
                <option value="overview">Usage Overview</option>
                <option value="server">Server Table</option>
                <option value="resource">Detailed Resources</option>
              </select>
            </div>

            {reportType !== 'overview' && (
              <button 
                onClick={handleDownload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download CSV
              </button>
            )}
          </div>
        </div>

        {reportType === 'overview' ? (
          // Server Usage Overview with Progress Bars
          <div>
            <Serverusage/>
          </div>
        ) : reportType === 'server' ? (
          // Server Overview Table with Pagination
          <div className="px-6 pb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">Server ID</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Server Name</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Server Type</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Total Capacity</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Used Capacity</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Remaining</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentRows().map((server, index) => (
                    <tr key={server.id} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                      <td className="border border-gray-200 px-4 py-2">{server.id}</td>
                      <td className="border border-gray-200 px-4 py-2">{server.server_name}</td>
                      <td className="border border-gray-200 px-4 py-2">{server.server_type}</td>
                      <td className="border border-gray-200 px-4 py-2">{server.server_capacity}</td>
                      <td className="border border-gray-200 px-4 py-2">{server.used_capacity}</td>
                      <td className="border border-gray-200 px-4 py-2">{server.remaining_capacity}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex items-center">
                          <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden mr-2">
                            <div 
                              className={`h-full ${getProgressBarColor(server.usage_percentage_value)}`}
                              style={{ width: server.usage_percentage }}
                            />
                          </div>
                          <span>{server.usage_percentage}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination Controls for Server Table */}
              {reportType === 'server' && serverData.length > 0 && (
                <Pagination />
              )}
            </div>
          </div>
        ) : (
          // Enhanced Resource Details Section with Pagination
          <div className="px-6 pb-6">
            <div className="mb-6">
              {serverData.map((server) => (
                <div key={server.id} className="rounded-lg overflow-hidden">
                  {/* Server Details - Expanded View */}
                  {expandedServer === server.id && (
                    <div className="p-4 bg-blue-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-3 rounded shadow-sm">
                          <h4 className="font-medium text-blue-800 mb-1">Server Details</h4>
                          <div className="text-sm">
                            <p><span className="font-medium">ID:</span> {server.id}</p>
                            <p><span className="font-medium">Name:</span> {server.server_name}</p>
                            <p><span className="font-medium">Type:</span> {server.server_type}</p>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <h4 className="font-medium text-blue-800 mb-1">Capacity Information</h4>
                          <div className="text-sm">
                            <p><span className="font-medium">Total Capacity:</span> {server.server_capacity}</p>
                            <p><span className="font-medium">Used:</span> {server.used_capacity}</p>
                            <p><span className="font-medium">Remaining:</span> {server.remaining_capacity}</p>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <h4 className="font-medium text-blue-800 mb-1">Usage Statistics</h4>
                          <div className="text-sm">
                            <p><span className="font-medium">Usage:</span> {server.usage_percentage}</p>
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mt-2">
                              <div 
                                className={`h-full ${getProgressBarColor(server.usage_percentage_value)}`}
                                style={{ width: server.usage_percentage }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary Resource Table with Pagination */}
            <div className="overflow-x-auto mt-4">
              <h3 className="font-bold text-lg mb-2">Resource Summary</h3>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-200 px-3 py-2 text-left">Server</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Resource</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Type</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Status</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Capacity</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentRows().map((resource, index) => (
                    <tr 
                      key={`${resource.server_id}-${index}`}
                      className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}
                      onClick={() => toggleServerExpansion(resource.server_id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="border border-gray-200 px-3 py-2">{resource.server_name}</td>
                      <td className="border border-gray-200 px-3 py-2">{resource.resource_name}</td>
                      <td className="border border-gray-200 px-3 py-2">{resource.resource_type}</td>
                      <td className="border border-gray-200 px-3 py-2">
                        <span className={`py-1 rounded text-xs ${
                          resource.status === "Active" ? 'bg-green-100 text-green-800 px-2' : 'px-1 bg-red-100 text-gray-800'
                        }`}>
                          {resource.status}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-3 py-2">{resource.storage_capacity}</td>
                      <td className="border border-gray-200 px-3 py-2 text-right">{resource.resource_cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination Controls for Resource Table */}
              {reportType === 'resource' && serverData.length > 0 && (
                <Pagination />
              )}
            </div>
          </div>
        )}
        
        <div className="bg-gray-100 p-4 text-sm text-gray-600">
          <p className="mb-1">* Report generated on {format(new Date(), "dd-MM-yyyy")}</p>
          <p>* Storage values shown in GB</p>
        </div>
      </div>
    </div>
  );
};

export default Serverusage_report;