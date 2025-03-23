import { useEffect, useState } from "react";
import { getserverusage } from "../../services/allapi";

const Serverusage = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await getserverusage();
        setServers(response);
      } catch (error) {
        console.error("Error fetching server data:", error);
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, []);

  // Function to determine progress bar color based on usage percentage
  const getProgressBarColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 75) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  return (
    <div className="w-full p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bold text-l mb-12 ml-1 text-gray-500 ">Server Usage Overview</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading server data...</p>
          </div>
        ) : servers.length === 0 ? (
          <div className="text-center p-4 border rounded">
            <p>No server data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((server, index) => (
              <div 
                key={index} 
                className="bg-white shadow rounded-lg p-4 border border-blue-700 hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg truncate">{server.server_name}</h3>
                  <span className="text-sm font-medium">
                    {server.percentage}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full ${getProgressBarColor(server.percentage)}`} 
                    style={{ width: `${server.percentage}%` }}
                  ></div>
                </div>
                
                <div className="text-sm text-gray-600">
                  {server.used} GB / {server.total} GB
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Serverusage;