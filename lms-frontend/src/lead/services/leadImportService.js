import api from "../../api/axios";

// =====================================
// UPLOAD EXCEL
// =====================================

export const uploadLeadFile = async (formData) => {
    const response = await api.post("/api/lead-import/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

// =====================================
// GET COUNSELLORS
// =====================================

export const getCounsellors = async () => {
    const response = await api.get("/api/lead-import/counselors");
    return response.data;
};

// =====================================
// GET IMPORT REPORT
// =====================================

export const getImportReport = async (importJobId) => {
    const response = await api.get(
        `/api/lead-import/report/${importJobId}`
    );

    return response.data;
};

// =====================================
// GET IMPORT SUMMARY
// =====================================

export const getImportSummary = async (importJobId) => {
    const response = await api.get(
        `/api/lead-import/summary/${importJobId}`
    );

    return response.data;
};

// =====================================
// GET CURRENT IMPORT JOB
// =====================================

export const getCurrentImportJob = async () => {
    const response = await api.get("/api/lead-import/current");
    return response.data;
};