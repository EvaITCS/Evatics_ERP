import api from "../../api/axios";

// =====================================
// DASHBOARD
// =====================================

export const getLeadAnalytics = async (fromDate, toDate, userId) => {
  const response = await api.get("/api/dashboard/lead-analytics", {
    params: {
      fromDate,
      toDate,
      userId,
    },
  });

  return response.data;
};

export const getDashboardStats = async () => {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  if (role === "ADMIN") {
    const response = await api.get("/api/dashboard/admin");

    return response.data;
  }

  if (role === "COUNSELLOR") {
    const response = await api.get("/api/dashboard/counsellor");

    return response.data;
  }

  if (role === "EMPLOYEE") {
    const employeeId = localStorage.getItem("employeeId");

    const response = await api.get(`/api/dashboard/employee/${employeeId}`);

    return response.data;
  }

  return {};
};
