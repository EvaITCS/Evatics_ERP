import api from "../../api/axios";

// =====================================
// GET COUNSELLOR FOLLOWUPS
// =====================================

export const getFollowups = async () => {
  const response = await api.get("/api/followups/my-followups");

  return response.data;
};

// =====================================
// CREATE FOLLOWUP
// =====================================

export const createFollowup = async (followup) => {
  const response = await api.post("/api/followups", followup);

  return response.data;
};

// =====================================
// PENDING FOLLOWUPS
// =====================================

export const pendingFollowups = async () => {
  const response = await api.get("/api/followups/pending");

  return response.data;
};

// =====================================
// LEAD FOLLOWUPS
// =====================================

export const getLeadFollowups = async (personId) => {
  const response = await api.get(`/api/followups/lead/${personId}`);

  return response.data;
};
