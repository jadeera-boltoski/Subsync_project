// import React from 'react';

import { useEffect } from "react";
import { getnotifications } from "../../services/allapi";

function Notifications() {
  const notifications = [
    {
      id: 1,
      title: 'Scheduled Maintenance',
      message: 'Server maintenance scheduled for March 25, 2025 from 2:00 AM to 4:00 AM UTC.',
      type: 'maintenance',
      icon: '🔧'
    },
    {
      id: 2,
      title: 'Warranty Expiring',
      message: 'Warranty for Router XR-2000 expires in 15 days.',
      type: 'warranty',
      icon: '🛡️'
    },
    {
      id: 3,
      title: 'Subscription Renewal',
      message: 'Your Premium Support Plan will auto-renew on April 10, 2025.',
      type: 'subscription',
      icon: '💳'
    },
    {
      id: 4,
      title: 'Server Down Alert',
      message: 'Database server DB-PROD-03 is currently experiencing downtime.',
      type: 'server',
      icon: '🖥️'
    },
    {
      id: 5,
      title: 'Customer Support Ticket',
      message: 'New support request from ABC Corp regarding network connectivity.',
      type: 'customer',
      icon: '👤'
    }
  ];


  useEffect(()=>{
    const getdata=async()=>{
      const response = await getnotifications() 
      console.log(response);
      
    }
    getdata()
  },[])


  const getTypeStyles = (type) => {
    switch (type) {
      case 'maintenance':
        return 'border-blue-500 bg-blue-50';
      case 'warranty':
        return 'border-green-500 bg-green-50';
      case 'subscription':
        return 'border-purple-500 bg-purple-50';
      case 'server':
        return 'border-red-500 bg-red-50';
      case 'customer':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          {notifications.length} new
        </span>
      </div>
      
      <div className="space-y-4">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`rounded-lg border-l-4 shadow-sm p-4 ${getTypeStyles(notification.type)}`}
          >
            <div className="flex items-start">
              <div className="text-2xl mr-3">{notification.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                    {notification.type}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {notifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No notifications at this time
        </div>
      )}
    </div>
  );
}

export default Notifications;