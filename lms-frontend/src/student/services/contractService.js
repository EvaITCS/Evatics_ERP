import api from "../../api/axios";

const ADMIN_BASE_URL = "/api/admin/contracts";
const STUDENT_BASE_URL = "/api/student/contracts";

export const uploadContract = async (batchId, file) => {
    const formData = new FormData();
    formData.append("batchId", batchId);
    formData.append("file", file);
    return await api.post(ADMIN_BASE_URL, formData);
};

export const getAllContracts = async () => {
    return await api.get(ADMIN_BASE_URL);
};

export const getContractsByBatch = async (batchId) => {
    return await api.get(`${ADMIN_BASE_URL}/batch/${batchId}`);
};

export const getMyContract = async () => {
    return await api.get(`${STUDENT_BASE_URL}/my-contract`);
};

export const signContract = async (candidateContractId, formData) => {
    return await api.post(
        `${STUDENT_BASE_URL}/${candidateContractId}/sign`,
        formData
    );
};

const contractService = {
    uploadContract,
    getAllContracts,
    getContractsByBatch,
    getMyContract,
    signContract
};

export default contractService;