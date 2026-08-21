import api from "../../api/axios";


// =====================================================
// APPLY LEAVE
// Backend expects:
// {
//     personId,
//     leaveTypeId,
//     startDate,
//     endDate,
//     reason
// }
// =====================================================

const applyLeave = (leaveData) => {

    return api.post(
        "/api/employee-leaves",
        leaveData
    );
};


// =====================================================
// GET LEAVES BY EMPLOYEE
// personId is used because Employee is person-centric
// =====================================================

const getLeavesByEmployee = (personId) => {

    if (!personId) {

        throw new Error(
            "Person ID is required."
        );
    }

    return api.get(
        `/api/employee-leaves/employee/${personId}`
    );
};


// =====================================================
// GET ALL LEAVE REQUESTS
// ADMIN
// =====================================================

const getAllLeaveRequests = () => {

    return api.get(
        "/api/employee-leaves"
    );
};


// =====================================================
// APPROVE LEAVE
// Backend identifies approving ADMIN
// from authenticated user.
// No employeeId/personId is required here.
// =====================================================

const approveLeave = (leaveRequestId) => {

    if (!leaveRequestId) {

        throw new Error(
            "Leave request ID is required."
        );
    }

    return api.put(
        `/api/employee-leaves/${leaveRequestId}/approve`
    );
};


// =====================================================
// REJECT LEAVE
// Backend identifies rejecting ADMIN
// from authenticated user.
// =====================================================

const rejectLeave = (leaveRequestId) => {

    if (!leaveRequestId) {

        throw new Error(
            "Leave request ID is required."
        );
    }

    return api.put(
        `/api/employee-leaves/${leaveRequestId}/reject`
    );
};


// =====================================================
// EXPORT
// =====================================================

const employeeLeaveService = {

    applyLeave,

    getLeavesByEmployee,

    getAllLeaveRequests,

    approveLeave,

    rejectLeave

};


export default employeeLeaveService;