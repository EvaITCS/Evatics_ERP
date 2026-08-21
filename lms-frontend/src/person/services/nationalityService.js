import api from "../../api/axios";

// =========================
// BASE URL
// =========================

const PERSON_BASE_URL = "/api/person";

// =========================
// GET ALL NATIONALITIES
// =========================

export const getAllNationalities = async () => {

    const response = await api.get(
        `${PERSON_BASE_URL}/nationalities`
    );

    return response;
};

// =========================
// EXPORT
// =========================

const nationalityService = {

    getAllNationalities

};

export default nationalityService;