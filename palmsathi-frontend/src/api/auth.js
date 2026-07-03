import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const registerFarmer = (data) => API.post("/auth/register", data);
export const sendOTP = (phone) => API.post("/auth/send-otp", { phone });
export const verifyOTP = (phone, otp) => API.post("/auth/verify-otp", { phone, otp });
export const getProfile = () => API.get("/auth/profile");

export default API;