import { useEffect, useState } from 'react';
import { getprovidername } from "../../services/allapi";

function View_provider() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await getprovidername();
        console.log(response);
        setProviders(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
        alert("Something went wrong!");
        setLoading(false);
      }
    };
    getdata();
  }, []); // Added empty dependency array to prevent infinite loop

  return (
    <div className="w-full max-w-full mx-auto p-4 ">
      

      {loading ? (
        <div className="text-center py-4">Loading provider data...</div>
      ) : providers.length === 0 ? (
        <div className="text-center py-4">No providers found</div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg ">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">Provider Name</th>
                <th className="py-3 px-4 text-left font-semibold">Contact</th>
                <th className="py-3 px-4 text-left font-semibold">Email</th>
                <th className="py-3 px-4 text-left font-semibold">Website</th>
                <th className="py-3 px-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-l text-blue-500 ">{provider.providerName}</td>
                  <td className="py-3 px-4 text-l">{provider.providerContact}</td>
                  <td className="py-3 px-4 text-l">{provider.providerEmail}</td>
                  <td className="py-3 px-4 text-l">
                    <a 
                      href={provider.websiteLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {new URL(provider.websiteLink).hostname}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex space-x-2">
                     
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-xs font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default View_provider;