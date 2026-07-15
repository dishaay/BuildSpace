import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});
api.interceptors.request.use((config) => {
    console.log("REQUEST:", config.url);

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;

//this file is the heart of the frontend and backened communication