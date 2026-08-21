import api from "../../api/axios";


// ======================================================
// TODAY REMINDERS
// ======================================================

export const todayReminders = async (role) => {

  const url =
      role === "ADMIN"
          ? "/api/reminders/today"
          : "/api/reminders/today/my";


  const response =
      await api.get(url);


  return response.data;
};


// ======================================================
// PENDING FOLLOWUPS
// ======================================================

export const pendingFollowups = async (role) => {

  const url =
      role === "ADMIN"
          ? "/api/reminders/pending/all"
          : "/api/reminders/pending";


  const response =
      await api.get(url);


  return response.data;
};


// ======================================================
// ALIAS
//
// PendingFollowupsPage.jsx mein hum
// getPendingFollowups() use kar rahe hain.
//
// Isliye ye alias rakha hai.
// ======================================================

export const getPendingFollowups = async () => {

  const role =
      localStorage.getItem("role");


  return pendingFollowups(role);
};


// ======================================================
// TODAY ALIAS
// ======================================================

export const getTodayReminders = async () => {

  const role =
      localStorage.getItem("role");


  return todayReminders(role);
};


// ======================================================
// OVERDUE REMINDERS
// ======================================================

export const overdueReminders = async (role) => {

  const url =
      role === "ADMIN"
          ? "/api/reminders/overdue/all"
          : "/api/reminders/overdue";


  const response =
      await api.get(url);


  return response.data;
};


// ======================================================
// OVERDUE ALIAS
// ======================================================

export const getOverdueReminders = async () => {

  const role =
      localStorage.getItem("role");


  return overdueReminders(role);
};


// ======================================================
// COMPLETE REMINDER
// ======================================================

export const completeReminder = async (
    reminderId
) => {

  if (!reminderId) {

    throw new Error(
        "Reminder ID is required"
    );

  }


  const response =
      await api.put(
          `/api/reminders/${reminderId}/complete`
      );


  return response.data;
};