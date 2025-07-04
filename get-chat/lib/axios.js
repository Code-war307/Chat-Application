import axios from "axios";
const url = process.env.BACKEND_URL || "http://localhost:5001"
export const axiosInstance = axios.create({
    baseURL: `${url}/api`,
})