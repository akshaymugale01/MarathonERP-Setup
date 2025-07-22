import axios from "axios";
// import { API_BASE_URL } from "../constants/api";

// Get Item from Local storage for dynamic ... save while login
const TOKEN = localStorage.getItem("token");

const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000",
  // baseURL: "http://localhost:3000",
  //   baseURL: "https://marathon.lockated.com",
  baseURL: 'https://testerp-api.lockated.com',

  headers: {
    "Content-Type": "application/json",
  },
  params: {
    token: TOKEN,
  },
});

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   params: {
//     token: TOKEN,
//   },
// });

export default axiosInstance;
