// shiftService.js

import api from "../../api/axios";

const BASE_URL = "/api/shifts";

const getAllShifts = () => {

    return api.get(
        BASE_URL
    );
};

const getShiftById = (shiftId) => {

    return api.get(
        `${BASE_URL}/${shiftId}`
    );
};

const createShift = (shiftData) => {

    return api.post(
        BASE_URL,
        shiftData
    );
};

const updateShift = (
    shiftId,
    shiftData
) => {

    return api.put(
        `${BASE_URL}/${shiftId}`,
        shiftData
    );
};

const deleteShift = (shiftId) => {

    return api.delete(
        `${BASE_URL}/${shiftId}`
    );
};

const shiftService = {

    getAllShifts,
    getShiftById,
    createShift,
    updateShift,
    deleteShift
};

export default shiftService;