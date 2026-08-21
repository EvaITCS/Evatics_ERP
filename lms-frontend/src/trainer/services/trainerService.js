import api from "../../api/axios";

const BASE_URL = "/api/trainers";
const BATCH_URL = "/api/trainer-batches";
const TASK_URL = "/api/trainer-tasks";

// =========================
// GET ALL TRAINERS (ADMIN)
// =========================
export const getAllTrainers = async () => {
    const { data } = await api.get(BASE_URL);
    return data;
};



// =========================
// GET MY TRAINER DASHBOARD
// =========================
export const getTrainerDashboard = async () => {
    const { data } = await api.get(`${BASE_URL}/dashboard`);
    return data;
};

// =========================
// GET MY STUDENTS
// =========================
export const getTrainerStudents = async () => {
    const { data } = await api.get(`${BASE_URL}/students`);
    return data;
};

// =========================
// GET CURRENT BATCH STUDENTS
// =========================
export const getCurrentStudents = async () => {
    const { data } = await api.get(`${BASE_URL}/current-students`);
    return data;
};

// =========================
// GET MY BATCHES
// =========================
export const getTrainerBatches = async () => {
    const { data } = await api.get(BATCH_URL);
    return data;
};

// =========================
// GET ALL BATCH DETAILS
// =========================
export const getAllBatchDetails = async () => {
    const { data } = await api.get(`${BATCH_URL}/all-batches`);
    return data;
};

// =========================
// GET BATCH SUMMARY
// =========================
export const getBatchSummary = async () => {
    const { data } = await api.get(`${BATCH_URL}/summary`);
    return data;
};

// =========================
// GET BATCH PAGE
// =========================
export const getBatchPage = async () => {
    const { data } = await api.get(`${BATCH_URL}/batch-page`);
    return data;
};

// =========================
// GET STUDENTS OF PARTICULAR BATCH
// =========================
export const getBatchStudents = async (batchId, type) => {
    const { data } = await api.get(
        `${BATCH_URL}/batch/${batchId}/students?type=${type}`
    );
    return data;
};

// =========================
// GET MY TASKS
// =========================
export const getTrainerTasks = async () => {
    const { data } = await api.get(TASK_URL);
    return data;
};

// =========================
// CREATE TASK
// =========================
export const createTrainerTask = async (task) => {
    const { data } = await api.post(TASK_URL, task);
    return data;
};

// =========================
// UPDATE TASK STATUS
// =========================
export const updateTaskStatus = async (taskId, status) => {
    const { data } = await api.put(
        `${TASK_URL}/${taskId}/status?status=${status}`
    );
    return data;
};

// =========================
// EXPORT DEFAULT
// =========================
const trainerService = {
    getAllTrainers,

    getTrainerDashboard,
    getTrainerStudents,
    getCurrentStudents,
    getTrainerBatches,
    getAllBatchDetails,
    getBatchSummary,
    getBatchPage,
    getBatchStudents,
    getTrainerTasks,
    createTrainerTask,
    updateTaskStatus
};

export default trainerService;