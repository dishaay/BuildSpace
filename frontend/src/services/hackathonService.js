import api from "./api";

export const getHackathons=()=>
    api.get("/api/hackathons");

export const getMyHackathons = async () => {
    return await api.get("/api/hackathons/mine");
};
export const createHackathon=(data)=>
    api.post("/api/hackathons",data);

export const updateHackathon=(id,data)=>
    api.put(`/api/hackathons/${id}`,data);

export const deleteHackathon=(id)=>
    api.delete(`/api/hackathons/${id}`);
export const getHackathonById=(id)=>
    api.get(`/api/hackathons/${id}`);

export const joinHackathon=(id)=>
    api.post(`/api/hackathons/${id}/join`);