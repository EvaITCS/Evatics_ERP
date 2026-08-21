import api from "../../api/axios";

// =========================
// BASE URL
// =========================

const PERSON_BASE_URL = "/api/person";

// =========================
// GET ALL CONTACT TYPES
// =========================

export const getAllContactTypes = async () => {

    const response = await api.get(
        `${PERSON_BASE_URL}/contact-types`
    );

    return response;
};

// =========================
// EXPORT
// =========================

const contactTypeService = {

    getAllContactTypes

};

export default contactTypeService;