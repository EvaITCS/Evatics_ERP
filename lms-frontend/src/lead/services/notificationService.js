import api from "../../api/axios";


// =====================================
// COMPLETE NOTIFICATION PAGE
// =====================================

export const getNotificationPage = async () => {
    const response = await api.get(
        "/api/reminders/notifications"
    );

    return response.data;
};
// =====================================
// GET MY NOTIFICATIONS
// =====================================

export const getMyNotifications = async () => {
    const response = await api.get(
        "/api/notifications/my"
    );

    return response.data;
};

// =====================================
// GET UNREAD NOTIFICATIONS
// =====================================

export const getUnreadNotifications = async () => {
    const response = await api.get(
        "/api/notifications/unread"
    );

    return response.data;
};

// =====================================
// GET UNREAD COUNT
// =====================================

export const getUnreadNotificationCount = async () => {
    const response = await api.get(
        "/api/notifications/unread-count"
    );

    return response.data;
};

// =====================================
// MARK NOTIFICATION AS READ
// =====================================

export const markNotificationAsRead = async (notificationId) => {
    const response = await api.put(
        `/api/notifications/${notificationId}/read`
    );

    return response.data;
};