import api from "../api/axios";

const studentCredentialService = {

    getAll: () =>
        api.get("/api/counselor/student-credentials")

};

export default studentCredentialService;