// import React from 'react'
import { useState, useEffect } from "react";
import { Bell } from "lucide-react"; // Notification Icon
import { useNavigate } from "react-router-dom";


const NotificationsIcon = () => {
  const [notificationCount, setNotificationCount] = useState(3); // Initial dummy notifications
  const navigate=useNavigate()
  
  // Function to simulate new notifications
  const simulateNotifications = () => {
    setTimeout(() => {
      const newCount = notificationCount + Math.floor(Math.random() * 3); // Add 1-3 notifications randomly
      setNotificationCount(newCount);
    }, 5000); // Every 5 seconds
  };

  useEffect(() => {
    const interval = setInterval(() => {
      simulateNotifications();
    }, 5000); // Simulating new notifications every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationCount]); // Re-run when count changes

  return (
    <div className="flex justify-center items-center  bg-gray-100" >
      <div className="relative cursor-pointer" onClick={()=>{navigate("/dashboard/notifications")}}>
        <Bell size={30} />
        {notificationCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold  px-1 rounded-full">
            {notificationCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationsIcon;
