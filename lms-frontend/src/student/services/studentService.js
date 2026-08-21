import api from "../../api/axios";

const studentService = {

    // ==========================================
    // STUDENT DASHBOARD
    // ==========================================

    getDashboard: () =>
        api.get("/student/dashboard"),


    // ==========================================
    // MY BATCH
    // ==========================================

    getMyBatch: () =>
        api.get("/student/my-batch"),


    // ==========================================
    // STUDENT PROFILE
    // ==========================================

    getProfile: () =>
        api.get("/student/profile"),


    // ==========================================
    // STUDENT APPLICATION
    // ==========================================

    getApplication: () =>
        api.get("/student/application"),


    // ==========================================
    // APPLICATION STAGE
    // ==========================================

    updateApplicationStage: (applicationStage) =>
        api.put(
            "/student/application-stage",
            {
                applicationStage
            }
        ),


    // ==========================================
    // STUDENT SUPPORT
    // ==========================================

    sendSupportTicket: (data) =>
        api.post(
            "/student/support",
            data
        ),


    // ==========================================
    // PROFILE CHANGE REQUESTS
    // ==========================================

    // Admin / Counsellor
    // Get all PENDING profile change requests

   getPendingProfileChangeRequests: () =>
    api.get("/api/student/profile-change-requests/pending"),


    // Student
    // Get student's own profile change requests

   getCandidateProfileChangeRequests: (candidatePersonId) =>
    api.get(
        `/api/student/profile-change-requests/candidate/${candidatePersonId}`
    ),


    // Admin / Counsellor
    // Approve / Reject request

reviewProfileChangeRequest: (
    requestId,
    data
) =>
    api.put(
        `/api/student/profile-change-requests/${requestId}/review`,
        data
    ),

    getPendingProfileChangeDocument: requestId =>
    api.get(
        `/api/student/profile-change-requests/${requestId}/document`,
        {
            responseType: "blob"
        }
    ),


    // ==========================================
    // LOGOUT
    // ==========================================

    logout: () => {

        localStorage.clear();

        window.location.href = "/";
    }

    

};


export default studentService;