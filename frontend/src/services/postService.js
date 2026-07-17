import api from "./api";

export const getPosts = () => api.get("/posts");

// Accepts { content, imageFiles } — imageFiles is an array of File objects
// from an <input type="file">. Sends multipart/form-data since images are
// real files, not URLs.
export const createPost = ({ content, imageFiles = [] }) => {
  const formData = new FormData();
  formData.append("content", content);
  imageFiles.forEach((file) => formData.append("images", file));
  // No need to set Content-Type manually — axios detects FormData and
  // sets the correct multipart boundary header automatically.
  return api.post("/posts", formData);
};

export const deletePost = (id) => api.delete(`/posts/${id}`);

export const toggleLikePost = (id) => api.post(`/posts/${id}/like`);

export const toggleBookmarkPost = (id) => api.post(`/posts/${id}/bookmark`);

export const getPostComments = (id) => api.get(`/posts/${id}/comments`);
export const getPostById = (id) =>
    api.get(`/posts/${id}`);
export const createPostComment = (id, data) => api.post(`/posts/${id}/comments`, data);