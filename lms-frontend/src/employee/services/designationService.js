// designationService.js

import api from "../../api/axios";

const BASE_URL = "/api/designations";

const getAllDesignations = () => {

    return api.get(
        BASE_URL
    );
};

const getDesignationById = (designationId) => {

    return api.get(
        `${BASE_URL}/${designationId}`
    );
};

const createDesignation = (designationData) => {

    return api.post(
        BASE_URL,
        designationData
    );
};

const updateDesignation = (
    designationId,
    designationData
) => {

    return api.put(
        `${BASE_URL}/${designationId}`,
        designationData
    );
};

const deleteDesignation = (designationId) => {

    return api.delete(
        `${BASE_URL}/${designationId}`
    );
};

const designationService = {

    getAllDesignations,
    getDesignationById,
    createDesignation,
    updateDesignation,
    deleteDesignation
};

export default designationService;