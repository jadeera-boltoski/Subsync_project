import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refresh");

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const isTokenExpired = checkIfTokenIsExpired(token);

        if (isTokenExpired && refreshToken) {
          // Token expired, attempt to refresh
          const response = await axios.post(
            "http://192.168.251.108:8000/api/token/refresh/",
            { refresh: refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.status === 200) {
            localStorage.setItem("token", response.data.access); // FIXED: Correct response structure
            setIsAuthenticated(true);
          } else {
            // Refresh failed, clear storage and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            setIsAuthenticated(false);
          }
        } else if (!isTokenExpired) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  // Function to check if token is expired
  const checkIfTokenIsExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;