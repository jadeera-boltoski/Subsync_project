import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get_hardware } from "../../services/allapi";

// import React from "react";


const devices = [
  { id: 1, name: "Laptop X1", type: "Laptop", manufacturer: "Brand A", status: "Active" },
  { id: 2, name: "Smartphone Y2", type: "Smartphone", manufacturer: "Brand B", status: "Inactive" },
  { id: 3, name: "Tablet Z3", type: "Tablet", manufacturer: "Brand C", status: "Active" },
  { id: 4, name: "Monitor W4", type: "Monitor", manufacturer: "Brand D", status: "Active" },
];





const View_hardware = () => {
  const navigate=useNavigate()
  
  
  
  useEffect(()=>{
    
    const getdata=async()=>{
      const response=await get_hardware()
      console.log("hardwaew",response);
      
    }
    getdata()
  },[])

  return (
    <div className="w-full">
       <h1 className="font-bold text-l mb-2 ml-1  text-gray-500">All Hardware Details</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full  bg-white ">
          <thead>
            <tr className="bg-gray-100">
              <th className=" py-3 px-4 text-left font-semibold">Name</th>
              <th className=" py-3 px-4 text-left font-semibold">Type</th>
              <th className="py-3 px-4 text-left font-semibold">Manufacturer</th>
              <th className=" py-3 px-4 text-left font-semibold">Status</th>
              <th className=" py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {devices.map((device) => (
              <tr key={device.id} className=" hover:bg-gray-50">
                <td className=" py-3 px-4 text-sm">{device.name}</td>
                <td className="py-3 px-4 text-sm">{device.type}</td>
                <td className=" py-3 px-4 text-sm">{device.manufacturer}</td>
                <td className={` py-3 px-4 text-sm ${device.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                  {device.status}
                </td>
                <td className=" px-3 py-1">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs font-medium" onClick={()=>{navigate("/dashboard/hardware/view_hardwaredetails")}}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default View_hardware;
