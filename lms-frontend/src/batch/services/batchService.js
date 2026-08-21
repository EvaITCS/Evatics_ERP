// src/batch/services/batchService.js

import api from "../../api/axios";

// =========================
// BASE URL
// =========================

const BASE_URL = "/api/batches";

// =========================
// CREATE BATCH
// =========================

export const createBatch = async (data) => {

    const response = await api.post(
        BASE_URL,
        data
    );

    return response;
};

// =========================
// GET ALL BATCHES
// =========================

export const getAllBatches = async () => {

    const response = await api.get(
        BASE_URL
    );

    return response;
};

// =========================
// GET SINGLE BATCH DETAILS
// =========================

export const getBatchDetails = async (
    batchId
) => {

    const response = await api.get(
        `${BASE_URL}/${batchId}`
    );

    return response;
};

// =========================
// UPDATE BATCH
// =========================

export const updateBatch = async (
    batchId,
    data
) => {

    const response = await api.put(
        `${BASE_URL}/${batchId}`,
        data
    );

    return response;
};





// =========================
// DASHBOARD
// =========================

export const getBatchDashboard =
    async () => {

        const response =
            await api.get(
                `${BASE_URL}/dashboard`
            );

        return response;
    };

// =========================
// PROGRAMS
// =========================



    export const getActivePrograms =
    async () => {

        const response =
            await api.get(
                "/api/programs/active"
            );

        return response;
    };

// =========================
// TRAINERS
// =========================

export const getAllTrainers =
    async () => {

        const response =
            await api.get(
                `${BASE_URL}/trainers`
            );

        return response;
    };

// =========================
// ASSIGN TRAINER
// =========================

export const assignTrainer =
    async (data) => {

        const response =
            await api.post(
                `${BASE_URL}/assign-trainer`,
                data
            );

        return response;
    };

// =========================
// GENERATE BATCH CODE
// =========================

export const generateBatchCode =
    async (programId) => {

        const response =
            await api.get(
                `${BASE_URL}/generate-code/${programId}`
            );

        return response;
    };

    export const getAvailableTrainers = async () => {

    const response = await api.get(
        "/api/batches/trainers/available"
    );

    return response;
};

export const getAvailableTrainersForEdit = async (batchId) => {

    const response = await api.get(
        `/api/batches/trainers/available/${batchId}`
    );

    return response;
};

// =========================
// EXPORT
// =========================

const batchService = {

    createBatch,
    getAllBatches,
    getBatchDetails,
    updateBatch,


    assignTrainer,
    getAllTrainers,

    getBatchDashboard,

    getActivePrograms,

    generateBatchCode
};

export default batchService;