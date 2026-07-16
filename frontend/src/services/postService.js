import api from "./api";

export const getPosts = () => api.get("/posts");

export const createPost = (data) => api.post("/posts", data);

export const deletePost = (id) => api.delete(`/posts/${id}`);

export const toggleLikePost = (id) => api.post(`/posts/${id}/like`);