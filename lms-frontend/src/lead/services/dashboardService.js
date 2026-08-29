import api from "../../api/axios";

// =====================================
// LEAD ANALYTICS
// =====================================

export const getLeadAnalytics = async (
    fromDate,
    toDate,
    employeePersonId
) => {

  const response = await api.get(
      "/api/dashboard/lead-analytics",
      {
        params: {
          fromDate: fromDate || null,
          toDate: toDate || null,
          employeePersonId: employeePersonId || null,
        },
      }
  );

  return response.data;
};


// =====================================
// DASHBOARD STATS
// =====================================

export const getDashboardStats = async () => {

  const role =
      localStorage.getItem("role");


  // =====================================
  // ADMIN
  // =====================================

  if (role === "ADMIN") {

    const response =
        await api.get(
            "/api/dashboard/admin"
        );

    return response.data;
  }


  // =====================================
  // COUNSELLOR
  // =====================================

  if (role === "COUNSELLOR") {

    const response =
        await api.get(
            "/api/dashboard/counsellor"
        );

    return response.data;
  }


  // =====================================
  // EMPLOYEE
  // =====================================

  if (role === "EMPLOYEE") {

    const employeeId =
        localStorage.getItem("employeeId");

    const response =
        await api.get(
            `/api/dashboard/employee/${employeeId}`
        );

    return response.data;
  }


  return {};
};