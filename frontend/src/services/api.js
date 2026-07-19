import axios from "axios";

const api = axios.create({
baseURL: "https://buildspace-backend-w1v9.onrender.com"});
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;

//this file is the heart of the frontend and backened communication