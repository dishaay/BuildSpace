import api from "./api";

export const getHackathons=()=>
    api.get("/hackathons");

export const getMyHackathons = async () => {
    return await api.get("/hackathons/mine");
};
export const createHackathon=(data)=>
    api.post("/hackathons",data);

export const updateHackathon=(id,data)=>
    api.put(`/hackathons/${id}`,data);

export const deleteHackathon=(id)=>
    api.delete(`/hackathons/${id}`);
export const getHackathonById=(id)=>
    api.get(`/hackathons/${id}`);

export const joinHackathon=(id)=>
    api.post(`/hackathons/${id}/join`);