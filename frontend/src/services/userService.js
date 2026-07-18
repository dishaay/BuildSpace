import api from "./api";

export const getProfile = () => api.get("/users/profile");

export const updateProfile = (data) =>
    api.put("/users/profile", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const getUsers = () =>
    api.get("/users");

export const getUserById = (id) =>
    api.get(`/users/${id}`);
export const getGithubContributions = (username) => api.get(`/users/github/${username}/contributions`);
