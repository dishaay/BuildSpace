import api from "./api";

export const getProjects = () =>
    api.get("/api/projects");

export const getProjectById = (id) =>
    api.get(`/api/projects/${id}`);

export const createProject = (data) =>
    api.post("/api/projects", data);

export const updateProject = (id, data) =>
    api.put(`/api/projects/${id}`, data);

export const deleteProject = (id) =>
    api.delete(`/api/projects/${id}`);

export const toggleLike = (id) =>
    api.post(`/api/projects/${id}/like`);

export const toggleBookmark = (projectId) =>
    api.post(`/api/projects/${projectId}/bookmark`);

