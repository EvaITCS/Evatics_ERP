// holidayService.js

import api from "../../api/axios";

const BASE_URL = "/api/holidays";

const getAllHolidays = () => {

    return api.get(
        BASE_URL
    );
};

const getHolidayById = (holidayId) => {

    return api.get(
        `${BASE_URL}/${holidayId}`
    );
};

const createHoliday = (holidayData) => {

    return api.post(
        BASE_URL,
        holidayData
    );
};

const updateHoliday = (
    holidayId,
    holidayData
) => {

    return api.put(
        `${BASE_URL}/${holidayId}`,
        holidayData
    );
};

const deleteHoliday = (holidayId) => {

    return api.delete(
        `${BASE_URL}/${holidayId}`
    );
};

const holidayService = {

    getAllHolidays,
    getHolidayById,
    createHoliday,
    updateHoliday,
    deleteHoliday
};

export default holidayService;