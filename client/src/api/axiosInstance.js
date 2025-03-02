import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",  // Your backend URL
});

// Request interceptor to attach token to the headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get the access token from localStorage first, then sessionStorage
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
