import axios from "axios";
const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001"
export const axiosInstance = axios.create({
    baseURL: `${url}/api`,
    // baseURL:  "http://localhost:5001/api",
    withCredentials: true
})
