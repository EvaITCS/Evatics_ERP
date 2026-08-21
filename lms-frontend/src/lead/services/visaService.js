

import api from "../../api/axios";

// =====================================
// GET ALL VISAS
// =====================================

export const getAllVisas = async () => {

    const response = await api.get(
        "/api/visa-masters"
    );

    return response.data;
};