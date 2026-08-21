import api from "../../api/axios";

// =====================================
// GET ALL LEAD SOURCES
// =====================================

export const getAllLeadSources = async () => {
    const response = await api.get("/api/lead-sources");
    return response.data;
};

