// departmentService.js

import api from "../../api/axios";

const BASE_URL = "/api/departments";

const getAllDepartments = () => {

    return api.get(
        BASE_URL
    );
};

const getDepartmentById = (departmentId) => {

    return api.get(
        `${BASE_URL}/${departmentId}`
    );
};

const createDepartment = (departmentData) => {

    return api.post(
        BASE_URL,
        departmentData
    );
};

const updateDepartment = (
    departmentId,
    departmentData
) => {

    return api.put(
        `${BASE_URL}/${departmentId}`,
        departmentData
    );
};

const deleteDepartment = (departmentId) => {

    return api.delete(
        `${BASE_URL}/${departmentId}`
    );
};

const departmentService = {

    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};

export default departmentService;