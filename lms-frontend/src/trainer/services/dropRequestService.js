import api from "../../api/axios";

const BASE_URL = "/trainer/drop-requests";


// =========================================================
// TRAINER - CREATE DROP REQUEST
// =========================================================

export const createDropRequest = async (
    studentBatchId,
    data
) => {

  const response = await api.post(
      `/api/trainer-batches/drop-student/${studentBatchId}`,
      data
  );

  return response;
};


// =========================================================
// ADMIN - ASSIGN COUNSELLOR
// =========================================================

export const assignCOUNSELLOR = async (
    dropRequestId,
    adminPersonId,
    data
) => {

  const response = await api.put(
      `${BASE_URL}/${dropRequestId}/assign/${adminPersonId}`,
      data
  );

  return response;
};


// =========================================================
// COUNSELLOR - SUBMIT RECOMMENDATION
// =========================================================

export const submitRecommendation = async (
    dropRequestId,
    counselorPersonId,
    data
) => {

  const response = await api.put(
      `${BASE_URL}/${dropRequestId}/recommendation/${counselorPersonId}`,
      data
  );

  return response;
};


// =========================================================
// ADMIN - APPROVE / REJECT
// =========================================================

export const adminDecision = async (
    dropRequestId,
    adminPersonId,
    data
) => {

  const response = await api.put(
      `${BASE_URL}/${dropRequestId}/decision/${adminPersonId}`,
      data
  );

  return response;
};


// =========================================================
// TRAINER REQUESTS
// =========================================================

export const getTrainerRequests = async (
    trainerPersonId
) => {

  const response = await api.get(
      `${BASE_URL}/trainer/${trainerPersonId}`
  );

  return response;
};


// =========================================================
// COUNSELLOR REQUESTS
// =========================================================

export const getCOUNSELLORRequests = async (
    counselorPersonId
) => {

  const response = await api.get(
      `${BASE_URL}/counselor/${counselorPersonId}`
  );

  return response;
};


// =========================================================
// ADMIN - PENDING REQUESTS
// =========================================================

export const getPendingRequests = async () => {

  const response = await api.get(
      `${BASE_URL}/pending`
  );

  return response;
};


// =========================================================
// SINGLE REQUEST
// =========================================================

export const getRequest = async (
    dropRequestId
) => {

  const response = await api.get(
      `${BASE_URL}/${dropRequestId}`
  );

  return response;
};


// =========================================================
// EXPORT SERVICE
// =========================================================

const dropRequestService = {

  createDropRequest,

  assignCOUNSELLOR,

  submitRecommendation,

  adminDecision,

  getTrainerRequests,

  getCOUNSELLORRequests,

  getPendingRequests,

  getRequest,

};

export default dropRequestService;