import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getuser, setuser } from '../../services/allapi';

function View_user() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Handle responsive design
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            }
        }
    };

    useEffect(()=>{
        const getdata=async()=>{
            const response = await getuser()
            console.log("users",response);
            setUsers(response.data)
        }
        getdata()
    },[])

    // Mobile view rendering
    if (isMobile) {
        return (
            <div className="w-full p-4">
                <button
                    onClick={() => navigate('/dashboard/users/adduser')}
                    className="w-full mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors"
                >
                    + Add User
                </button>

                <h1 className="text-lg font-semibold mb-4 text-gray-900">User Details</h1>

                {users.map((user, index) => (
                    <div 
                        key={index} 
                        className="bg-white shadow rounded-lg p-4 mb-4 border"
                    >
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-blue-500">{user.username}</span>
                            <div className="flex items-center">
                                <div 
                                    className={`w-10 h-5 rounded-full mr-2 ${user.is_active ? 'bg-green-400' : 'bg-gray-300'} flex items-center p-1 cursor-pointer`} 
                                    onClick={() => toggleActiveStatus(user.id)}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${user.is_active ? 'translate-x-4' : ''}`}></div>
                                </div>
                                <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>Email: {user.email}</p>
                            <p>Role: {user.is_superuser ? "Super user" : "Regular"}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Desktop view rendering - updated to match View_hardware table style
    return (
        <div className="w-full max-w-full mx-auto p-4">
            <button
                onClick={() => navigate('/dashboard/users/adduser')}
                className="w-full sm:w-auto px-2 sm:px-6 py-1 sm:py-3 bg-blue-500 text-white font-semibold text-lg sm:text-xl rounded hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-md mb-4"
            >
                + Add User
            </button>

            <h1 className="font-bold text-l mb-2 ml-1 text-gray-500">User Details</h1>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-3 px-4 text-left font-semibold">Name</th>
                            <th className="py-3 px-4 text-left font-semibold">Email</th>
                            <th className="py-3 px-4 text-left font-semibold">Role</th>
                            <th className="py-3 px-4 text-left font-semibold">Status</th>
                            
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-blue-500">{user.username}</td>
                                <td className="py-3 px-4 text-sm">{user.email}</td>
                                <td className="py-3 px-4 text-sm">{user.is_superuser ? "Super user" : "Regular"}</td>
                                <td className="py-3 px-4 text-sm">
                                    <div className="flex items-center">
                                        <div 
                                            className={`w-10 h-5 rounded-full mr-2 ${user.is_active ? 'bg-green-400' : 'bg-gray-300'} flex items-center p-1 cursor-pointer`} 
                                            onClick={() => toggleActiveStatus(user.id)}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${user.is_active ? 'translate-x-4' : ''}`}></div>
                                        </div>
                                        <span className={user.is_active ? "text-green-600" : "text-red-600"}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default View_user;