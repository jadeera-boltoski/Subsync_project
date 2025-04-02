import { useState } from "react";
// import { useLocation } from "react-router-dom";

import View_provider from "./masterpages/View_provider";

function Master() {
  // const location = useLocation();
  const [activeTab, setActiveTab] = useState("providers");

  // const isActive = (path) => {
  //   return location.pathname === path;
  // };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto p-4">
     
      <div className="flex border-b border-b-gray-300">
        <div
          className={`p-3 cursor-pointer ${
            activeTab === "providers" 
              ? "text-cyan-500 border-b-2 border-cyan-500 font-medium" 
              : "text-gray-600 hover:text-cyan-500"
          }`}
          onClick={() => handleTabClick("providers")}
        >
          Provider Details
        </div>
        
        
        {/* <div
          className={`p-3 cursor-pointer ${
            activeTab === "subscription" 
              ? "text-cyan-500 border-b-2 border-cyan-500 font-medium" 
              : "text-gray-600 hover:text-cyan-500"
          }`}
          onClick={() => handleTabClick("other")}
        >
          subscription
        </div> */}
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {activeTab === "providers" && (
          <div>
            <div className="justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Provider List</h2>
                <View_provider/>
           </div>
          </div>
        )}






        
        
        {/* {activeTab === "other" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Other Settings</h2>
            <p className="text-gray-500">Other settings content will appear here.</p>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default Master;