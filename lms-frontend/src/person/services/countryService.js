import api from "../../api/axios";

// =========================
// BASE URL
// =========================

const PERSON_BASE_URL = "/api/person";

// =========================
// GET ALL COUNTRIES
// =========================

export const getAllCountries = async () => {

    const response = await api.get(
        `${PERSON_BASE_URL}/countries`
    );

    return response;
};

// =========================
// EXPORT
// =========================

const countryService = {

    getAllCountries

};

export default countryService;