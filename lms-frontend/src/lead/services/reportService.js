import api from "../../api/axios";

export const getTodaySummary = async () => {

    const response =
        await api.get(
            "/api/dashboard/today-summary"
        );

    return response.data;
};

export const getWeeklySummary = async () => {

    const response =
        await api.get(
            "/api/dashboard/weekly-summary"
        );

    return response.data;
};

export const getMonthlySummary = async () => {

    const response =
        await api.get(
            "/api/dashboard/monthly-summary"
        );

    return response.data;
};

export const getYearlySummary = async () => {

    const response =
        await api.get(
            "/api/dashboard/yearly-summary"
        );

    return response.data;
};