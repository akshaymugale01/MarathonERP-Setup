import axios from "axios";


// Get Item from Local storage for dynamic ... save while login
const TOKEN = "653002727bac82324277efbb6279fcf97683048e44a7a839";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", 
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    token: TOKEN, 
  },
});

export default axiosInstance;
