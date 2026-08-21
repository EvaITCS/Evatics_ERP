import api from "../../api/axios";


// =====================================================
// RESET FOLLOW-UP CYCLE
// SAME COUNSELLOR
// =====================================================

export const resetFollowupCycle = async (personId) => {

    if (!personId) {
        throw new Error("Person ID is required.");
    }

    const response = await api.put(
        `/api/admin/followup-escalations/${personId}/reset`
    );

    return response.data;
};


// =====================================================
// REASSIGN COUNSELLOR
// =====================================================

export const reassignCounsellor = async (
    notificationId,
    employeePersonId
) => {

    if (!notificationId) {
        throw new Error("Notification ID is required.");
    }

    if (!employeePersonId) {
        throw new Error("Counsellor is required.");
    }

    const response = await api.put(
        `/api/admin/followup-escalations/${notificationId}/reassign`,
        {
            employeePersonId
        }
    );

    return response.data;
};