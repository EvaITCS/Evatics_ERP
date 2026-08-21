import api from "../../api/axios";

// =====================================
// CONVERT LEAD
// =====================================

export const convertLead = async (personId) => {
  const response = await api.put(`/api/lead-conversion/${personId}/convert`);

  return response.data;
};

// =====================================
// INSERT LEAD
// =====================================

export const insertLead = async (personId) => {
  const response = await api.put(`/api/lead-conversion/${personId}/insert`);

  return response.data;
};

// =====================================
// ARCHIVE LEAD
// =====================================

export const archiveLeadConversion = async (personId) => {
  const response = await api.put(`/api/lead-conversion/${personId}/archive`);

  return response.data;
};
