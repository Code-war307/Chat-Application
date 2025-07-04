import axios from "axios";
const url = process.env.BACKEND_URL
export const axiosInstance = axios.create({
    baseURL: `${url}/api`,
})