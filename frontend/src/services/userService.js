import api from "./api";

export const getProfile = () => api.get("/api/users/profile");

export const updateProfile = (data) =>
    api.put("/api/users/profile", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const getUsers = () =>
    api.get("/api/users");

export const getUserById = (id) =>
    api.get(`/api/users/${id}`);
export const getGithubContributions = (username) => api.get(`/api/users/github/${username}/contributions`);
