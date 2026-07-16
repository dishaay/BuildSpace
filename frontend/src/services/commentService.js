import api from "./api";

export const createComment = (projectId, data) =>
    api.post(`/comments/${projectId}`, data);

export const getComments = (projectId) =>
    api.get(`/comments/${projectId}`);

export const deleteComment = (commentId) =>
    api.delete(`/comments/${commentId}`);