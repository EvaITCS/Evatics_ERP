import api from "../api/axios";

const counselorStudentService = {

    // =========================
    // GET MY STUDENTS
    // =========================
    getMyStudents: () =>
        api.get("/api/counselor/my-students")
};

export default counselorStudentService;