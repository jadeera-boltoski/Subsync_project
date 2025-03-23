import axios from "axios";

export const commonRequest = async (method, url, body = null, requiresAuth = true) => {
  try {
    // Retrieve token only if authentication is required
    const token = requiresAuth ? localStorage.getItem("token") : null;
    console.log(token);
    
    let reqConfig = {
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }) // Add JWT token only if available
      },
    };
 console.log(body);
 
    if (body && method !== "GET") {
      reqConfig.data = body;
    }

    console.log("Request Config:", reqConfig);
    
    const response = await axios(reqConfig);
    return response.data;
  } catch (err) {
    console.error("API request error:", err);

    return {
      status: err.response?.status,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};
