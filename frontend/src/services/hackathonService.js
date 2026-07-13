import api from "./api";

export const getHackathons=()=>
    api.get("/hackathons");

export const createHackathon=(data)=>
    api.post("/hackathons",data);

export const updateHackathon=(id,data)=>
    api.put(`/hackathons/${id}`,data);

export const deleteHackathon=(id)=>
    api.delete(`/hackathons/${id}`);