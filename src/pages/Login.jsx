import { useEffect, useState } from 'react';
import { adddetails } from '../services/allapi';
import loginImage from '../assets/login.jpg';
import { validateForm } from '../validation/validatelogin';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react'; // Import eye icons

function Login() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility
    
    useEffect(() => {
        localStorage.removeItem("token"); // Clear token when accessing the login page
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(''); // Clear previous error
        setLoginSuccess(''); // Clear previous success
        setLoading(true);
        const validationResult = validateForm(formData);
        if (validationResult.success) {
            try {
                const response = await adddetails(formData);
                console.log(response);
                if(response.token && response.refresh){
                    localStorage.setItem("token", response.token); // Store JWT
                    localStorage.setItem("refresh", response.refresh);
                    console.log(localStorage);
                }

                if (response.status === 200) {
                    setLoginSuccess(response.message);
                    console.log(loginSuccess);
                    navigate("/dashboard",{ state: { message: response.message } })
                } else {
                    console.log("inside else");
                    setLoginError(response.message);
                    setLoading(false);
                }
            } catch (error) {
                console.log("insidde catch");
                console.error('Login failed:', error);
                setLoading(false);
            }
        } else {
            setLoginError(validationResult.message);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 md:px-0">
            <div className="bg-white rounded-xl shadow-[0_10px_50px_-12px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.3)] transition-shadow duration-300 overflow-hidden w-full md:w-[1000px] mx-auto flex flex-wrap min-h-[500px] md:min-h-[500px]">
                {/* Left side - Login Form */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-16 flex items-center">
                    <div className="w-full max-w-md mx-auto">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-10 text-gray-800 text-center md:text-left">Sign in to Subsync!</h2>

                        {loginError && (
                            <div className="mb-6 p-3 bg-red-50 ">
                                <p className="text-red-600 text-sm font-poppins text-center">{loginError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
                            <div className="space-y-4 md:space-y-5">
                                <div>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="EMAIL"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 md:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm md:text-base`}
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="PASSWORD"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 md:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm md:text-base pr-10`}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                <div className="text-center md:text-left text-blue-600 hover:text-blue-800 text-sm font-poppins cursor-pointer" onClick={() => navigate("/forgot-password")}>
                                    Forget password?
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-2.5 md:py-3 px-4 bg-navy-800 hover:bg-navy-900 text-white font-medium rounded-md transition duration-200 font-poppins text-sm md:text-base"
                                    style={{ backgroundColor: '#1a2942' }}
                                >
                                    {loading ? (
                                        <span className="flex text-center justify-center">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            login...
                                        </span>
                                    ) : (
                                        "SIGN IN"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right side - Illustration */}
                <div className="hidden md:flex w-full md:w-1/2 bg-gray-50 pt-4 pb-12 px-16 items-center justify-center">
                    <div className="max-w-md relative">
                        <img
                            src={loginImage}
                            alt="Business illustration"
                            className="w-full h-auto rounded-lg"
                        />
                        <p className="absolute -bottom-4 left-0 right-0 text-center text-lg text-gray-700 font-[Sanchez] italic tracking-[0.25em] font-bold leading-relaxed">
                            Accelerating Growth and Efficiency in 2025
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login