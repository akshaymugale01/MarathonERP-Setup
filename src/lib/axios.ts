import axios from "axios";
// import { API_BASE_URL } from "../constants/api";

// Get Item from Local storage for dynamic ... save while login
const TOKEN = "653002727bac82324277efbb6279fcf97683048e44a7a839";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "http://localhost:3000",

  //   baseURL: "https://marathon.lockated.com",

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
