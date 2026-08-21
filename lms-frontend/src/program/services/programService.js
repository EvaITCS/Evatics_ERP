import api from "../../api/axios";

export const createProgram = (data) => {
    return api.post("/api/programs", data);
};

export const getAllPrograms = () => {
    return api.get("/api/programs");
};

export const getActivePrograms = () => {
    return api.get("/api/programs/active");
};

export const getInactivePrograms = () => {
    return api.get("/api/programs/inactive");
};

export const getProgramById = (id) => {
    return api.get(`/api/programs/${id}`);
};

export const updateProgram = (id, data) => {
    return api.put(`/api/programs/${id}`, data);
};

export const deleteProgram = (id) => {
    return api.delete(`/api/programs/${id}`);
};