import api from "../../api/axios";


// =====================================================
// BASE URL
// =====================================================

const BASE_URL = "/api/leave-types";


// =====================================================
// GET ALL LEAVE TYPES
// AUTHENTICATED USERS
// Used by Apply Leave page.
// =====================================================

const getAllLeaveTypes = () => {

    return api.get(
        BASE_URL
    );
};


// =====================================================
// GET LEAVE TYPE BY ID
// AUTHENTICATED USERS
// =====================================================

const getLeaveTypeById = (leaveTypeId) => {

    if (!leaveTypeId) {

        throw new Error(
            "Leave type ID is required."
        );
    }

    return api.get(
        `${BASE_URL}/${leaveTypeId}`
    );
};


// =====================================================
// CREATE LEAVE TYPE
// ADMIN ONLY
// =====================================================

const createLeaveType = (leaveTypeData) => {

    return api.post(
        BASE_URL,
        leaveTypeData
    );
};


// =====================================================
// UPDATE LEAVE TYPE
// ADMIN ONLY
// =====================================================

const updateLeaveType = (
    leaveTypeId,
    leaveTypeData
) => {

    if (!leaveTypeId) {

        throw new Error(
            "Leave type ID is required."
        );
    }

    return api.put(
        `${BASE_URL}/${leaveTypeId}`,
        leaveTypeData
    );
};


// =====================================================
// DELETE LEAVE TYPE
// ADMIN ONLY
// =====================================================

const deleteLeaveType = (leaveTypeId) => {

    if (!leaveTypeId) {

        throw new Error(
            "Leave type ID is required."
        );
    }

    return api.delete(
        `${BASE_URL}/${leaveTypeId}`
    );
};


// =====================================================
// EXPORT
// =====================================================

const leaveTypeService = {

    getAllLeaveTypes,

    getLeaveTypeById,

    createLeaveType,

    updateLeaveType,

    deleteLeaveType

};


export default leaveTypeService;