import api from "../../api/axios";

// =========================
// BASE URL
// =========================

const PERSON_BASE_URL = "/api/person";

// =========================
// GET ALL ADDRESS TYPES
// =========================

export const getAllAddressTypes = async () => {

    const response = await api.get(
        `${PERSON_BASE_URL}/address-types`
    );

    return response;
};

// =========================
// EXPORT
// =========================

const addressTypeService = {

    getAllAddressTypes

};

export default addressTypeService;