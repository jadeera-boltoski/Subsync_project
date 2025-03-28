// import React from 'react'
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getuser_role } from '../services/allapi';
// import View_user from './usermanagement_pages/View_user'



function Usermanagement() {
  const navigate = useNavigate()
  const location = useLocation()


  const isActive = (path) => {
    return location.pathname === path;

  };

  const [check, setCheck] = useState()
  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await getuser_role();
        console.log("user", response);

        // Set the check state based on is_superuser
        setCheck(response.is_superuser || false);
        if (location.pathname === '/dashboard/users') {
          if (response.is_superuser) {
            navigate('/dashboard/users/viewuser');
          } else {
            navigate('/dashboard/users/recyclebin');
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        // Optionally set a default value or handle error
        setCheck(false);
      }
    
      
    }
    getdata()
  },[])

  return (
    <div>
      <div className="flex border-b border-b-gray-300">

        {check && (
          <div
            className={`p-3 cursor-pointer ${isActive('/dashboard/users/viewuser') ? 'text-cyan-500 border-b-2 border-cyan-500 font-medium' : 'text-gray-600 hover:text-cyan-500'}`}
            onClick={() => navigate('/dashboard/users/viewuser')}
          >
            User details
          </div>
        )}

        <div
          className={`p-3 cursor-pointer ${isActive('/dashboard/users/recyclebin') ? 'text-cyan-500 border-b-2 border-cyan-500 font-medium' : 'text-gray-600 hover:text-cyan-500'}`}
          onClick={() => navigate('/dashboard/users/recyclebin')}
        >
          Recycle bin
        </div>

        <div
          className={`p-3 cursor-pointer ${isActive('/dashboard/users/changepassword') ? 'text-cyan-500 border-b-2 border-cyan-500 font-medium' : 'text-gray-600 hover:text-cyan-500'}`}
          onClick={() => navigate('/dashboard/users/changepassword')}
        >
          Change password
        </div>
      </div>



      <div className='mt-4'>
        <Outlet />
      </div>
    </div>
  )
}

export default Usermanagement