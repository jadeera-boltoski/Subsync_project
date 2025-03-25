// import React from 'react'
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getuser_role } from '../services/allapi';
// import View_user from './usermanagement_pages/View_user'



function Usermanagement() {
  const navigate = useNavigate()
  const location = useLocation()


  const isActive = (path) => {
    return location.pathname === path;

  };

  useEffect(() => {
    const getdata = async () => {
      const response = await getuser_role()
      console.log("user", response);

    }
    getdata()
  })
  return (
    <div>
      <div className="flex border-b">
        <div
          className={`p-3 cursor-pointer ${isActive('/dashboard/users') ? 'text-cyan-500 border-b-2 border-cyan-500 font-medium' : 'text-gray-600 hover:text-cyan-500'}`}
          onClick={() => navigate('/dashboard/users')}
        >
          User details
        </div>

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


      {/* {location.pathname=='/dashboard/users'&&(
      <div className='mt-6'><View_user/></div>
     )}  */}


      <div className='mt-4'>
        <Outlet />
      </div>
    </div>
  )
}

export default Usermanagement