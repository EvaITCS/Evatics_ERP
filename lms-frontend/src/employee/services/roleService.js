import api from "../../api/axios";

const BASE_URL = "/api/roles";

const getAllRoles = () => {
    return api.get(BASE_URL);
};

const roleService = {
    getAllRoles
};

export default roleService;