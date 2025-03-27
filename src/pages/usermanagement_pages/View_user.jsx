import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getuser, setuser } from '../../services/allapi';

function View_user() {
    const navigate=useNavigate()
    const [users, setUsers] = useState([]);
    const toggleActiveStatus = async(id) => {
        const userToToggle = users.find(user => user.id === id);
        const confirmMessage = userToToggle.is_active
            ? `Are you sure you want to deactivate ${userToToggle.username}?`
            : `Are you sure you want to activate ${userToToggle.username}?`;
    
        if (window.confirm(confirmMessage)) {
            
            try {
                const response = await setuser(id, {
                    is_active: !userToToggle.is_active
                });
                console.log(response);
                if(response.status==200){
                    setUsers(users.map(user => 
                        user.id === id 
                            ? { ...user, is_active: !user.is_active } 
                            : user
                    ));
                }else{
                    alert("something went wrong")
                }
                

               
            } catch (error) {
                console.error('Failed to update user status:', error);
                // Optionally show error to user
            }
        }

    };


    useEffect(()=>{
        const getdata=async()=>{
            const response = await getuser()
            console.log(response);
            
                setUsers(response.data)
            
            
        }
        getdata()
    },[])

    return (


        <div className=" w-full max-w-full mx-auto">

            <button
                // onClick={(e) => {
                //     e.stopPropagation(); // Prevent triggering handleClickOutside
                //     // setClick(!click);
                //     navigate("/adduser")
                // }}
                onClick={()=>navigate('/dashboard/users/adduser')}
                className="w-full sm:w-auto px-2 sm:px-6 py-1 sm:py-3 bg-blue-500 text-white font-semibold text-lg sm:text-xl rounded hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-md"
            >
                +Add user
            </button>


            <h1 className="text-xl font-semibold mb-2 mt-4 text-gray-900">User Details</h1>

            <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-3 mb-2 px-4 text-start mt-5 bg-gray-500">
                    <div className="py-2">Name</div>
                    <div className="py-2">Email</div>
                    <div className="py-2">Status</div>

                </div>

                {/* Table Body */}
                {users.map((user, index) => (
                    <div
                        key={index}
                        className={` grid grid-cols-3 text-start mb-1 px-4 py-4 bg-white   `}
                    >
                        <div className="flex items-start justify-start">
                            <span className="text-blue-500">{user.username}</span>
                        </div>

                        <div>{user.email}</div>

                        <div className="flex items-start justify-start">
                            <div className="w-10 mr-2 relative">
                                <div className={`w-10 h-5 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-gray-300'} flex items-center p-1 cursor-pointer`} onClick={() => toggleActiveStatus(user.id)}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${user.is_active ? 'translate-x-4' : ''}`}></div>
                                </div>
                            </div>
                            <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default View_user;