// workModeService.js

import api from "../../api/axios";

const BASE_URL = "/api/work-modes";

const getAllWorkModes = () => {

    return api.get(
        BASE_URL
    );
};

const getWorkModeById = (modeId) => {

    return api.get(
        `${BASE_URL}/${modeId}`
    );
};

const createWorkMode = (workModeData) => {

    return api.post(
        BASE_URL,
        workModeData
    );
};

const updateWorkMode = (
    modeId,
    workModeData
) => {

    return api.put(
        `${BASE_URL}/${modeId}`,
        workModeData
    );
};

const deleteWorkMode = (modeId) => {

    return api.delete(
        `${BASE_URL}/${modeId}`
    );
};

const workModeService = {

    getAllWorkModes,
    getWorkModeById,
    createWorkMode,
    updateWorkMode,
    deleteWorkMode
};

export default workModeService;