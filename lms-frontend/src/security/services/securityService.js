// src/security/services/securityService.js

import api from "../../api/axios";

const securityService = {

    // ===============================
    // GET LOCKED USERS
    // ===============================
    getLockedUsers: async () => {

        const response = await api.get("/api/users/locked");

        return response.data;
    },

    // ===============================
    // UNLOCK USER
    // ===============================
    unlockUser: async (userId) => {

        const response = await api.post(
            `/api/users/unlock/${userId}`
        );

        return response.data;
    }

};

export default securityService;