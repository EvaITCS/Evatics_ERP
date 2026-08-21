import api from "../../api/axios";

export const getCounsellors = async () => {
  const response = await api.get("/api/employees/Counsellors");
  return response.data;
};

export const changePassword = async (payload) => {
  const response = await api.post("/api/users/change-password", payload);

  return response.data;
};

// ==========================================
// Invitation Password Change
// ==========================================

export const changePasswordByInvitation = async (payload) => {
  const response = await api.post("/application/change-password", payload);

  return response.data;
};
