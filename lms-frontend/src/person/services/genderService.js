import api from "../../api/axios";

// =========================
// BASE URL
// =========================

const PERSON_BASE_URL = "/api/person";

// =========================
// GET ALL GENDERS
// =========================

export const getAllGenders = async () => {

    const response = await api.get(
        `${PERSON_BASE_URL}/genders`
    );

    return response;
};

// =========================
// EXPORT
// =========================

const genderService = {

    getAllGenders

};

export default genderService;