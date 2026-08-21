import api from "../../api/axios";

const BASE_URL =
    "/api/employee-statuses";

const getAllEmployeeStatuses = () => {

    return api.get(
        BASE_URL
    );
};

const getEmployeeStatusById = (
    employeeStatusId
) => {

    return api.get(
        `${BASE_URL}/${employeeStatusId}`
    );
};

const createEmployeeStatus = (
    statusData
) => {

    return api.post(
        BASE_URL,
        statusData
    );
};

const updateEmployeeStatus = (
    employeeStatusId,
    statusData
) => {

    return api.put(
        `${BASE_URL}/${employeeStatusId}`,
        statusData
    );
};

const deleteEmployeeStatus = (
    employeeStatusId
) => {

    return api.delete(
        `${BASE_URL}/${employeeStatusId}`
    );
};

const employeeStatusService = {

    getAllEmployeeStatuses,
    getEmployeeStatusById,
    createEmployeeStatus,
    updateEmployeeStatus,
    deleteEmployeeStatus
};

export default employeeStatusService;