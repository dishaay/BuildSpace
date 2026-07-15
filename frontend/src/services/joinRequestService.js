import api from "./api";

export const getJoinRequests = (hackathonId) =>
  api.get(`/join-requests/${hackathonId}`);

export const requestToJoin = (hackathonId, data) =>
  api.post(`/join-requests/${hackathonId}`, data);

export const acceptRequest = (requestId) =>
  api.put(`/join-requests/accept/${requestId}`);

export const rejectRequest = (requestId) =>
  api.put(`/join-requests/reject/${requestId}`);