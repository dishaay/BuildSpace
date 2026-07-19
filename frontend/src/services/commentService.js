import api from "./api";

export const createComment = (projectId, data) =>
    api.post(`/api/comments/${projectId}`, data);

export const getComments = (projectId) =>
    api.get(`/api/comments/${projectId}`);

export const deleteComment = (commentId) =>
    api.delete(`/api/comments/${commentId}`);