import axios from "axios";

const Token = (param?: string) => {
    if (param) return param;
    const localStorageToken = localStorage.getItem('MARATHON_TOKEN');
    return localStorageToken || 'bfa5004e7b0175622be8f7e69b37d01290b737f82e078414';
};


const baseUrl = axios.create({
    baseURL: "https://marathon.lockated.com",
    // baseURL: "http://localhost:3001",

    headers: {
        "Content-Type": "application/json",
    },
    params: {
        token: Token(),
    }
})

export default baseUrl;