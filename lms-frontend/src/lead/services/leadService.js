import api from "../../api/axios";

// =====================================
// GET ALL LEADS
// =====================================

export const getAllLeads = async () => {
  const response = await api.get("/api/leads");
  return response.data;
};


// =====================================
// GET MY LEADS
// =====================================

export const getMyLeads = async () => {
  const response = await api.get("/api/leads/my-leads");
  return response.data;
};


// =====================================
// GET RE-ENGAGEMENT LEADS
// =====================================

export const getReEngagementLeads = async () => {

  const role = localStorage.getItem("role");

  const endpoint =
      role === "ADMIN"
          ? "/api/leads/re-engagement"
          : "/api/leads/my-re-engagement";

  const response = await api.get(endpoint);

  return response.data;
};


// =====================================
// GET LEAD BY ID
// =====================================

export const getLeadById = async (personId) => {

  const response = await api.get(
      `/api/leads/${personId}`
  );

  return response.data;
};


// =====================================
// CREATE LEAD
// =====================================

export const createLead = async (lead) => {

  const response = await api.post(
      "/api/leads",
      lead
  );

  return response.data;
};


// =====================================
// UPDATE LEAD STATUS
// =====================================

export const updateLeadStatus = async (
    personId,
    status
) => {

  const response = await api.put(
      `/api/leads/${personId}/status`,
      {
        leadStatusId: status
      }
  );

  return response.data;
};


// =====================================
// ARCHIVE LEAD
// =====================================

export const archiveLead = async (personId) => {

  const response = await api.put(
      `/api/leads/${personId}/archive`
  );

  return response.data;
};


// =====================================
// SEARCH LEADS
// =====================================

export const searchLeads = async (keyword) => {

  const response = await api.get(
      "/api/leads/search",
      {
        params: {
          keyword
        }
      }
  );

  return response.data;
};


// =====================================
// FILTER LEADS BY STATUS
// =====================================

export const filterLeadsByStatus = async (status) => {

  const response = await api.get(
      `/api/leads/status/${status}`
  );

  return response.data;
};


// =====================================
// FILTER MY LEADS BY STATUS
// =====================================

export const filterMyLeadsByStatus = async (status) => {

  const response = await api.get(
      `/api/leads/my-leads/status/${status}`
  );

  return response.data;
};


// =====================================
// ASSIGN LEAD
// =====================================

export const assignLead = async (
    personId,
    employeePersonId
) => {

  const response = await api.put(
      `/api/leads/${personId}/assign/${employeePersonId}`
  );

  return response.data;
};


// =====================================
// ADVANCED FILTER
// =====================================

export const filterLeads = async (filters = {}) => {

  const params = {
    counsellorPersonId:
        filters.counsellorPersonId || null,

    keyword:
        filters.keyword?.trim() || null,

    status:
        filters.status || null,

    priority:
        filters.priority || null,

    fromDate:
        filters.fromDate || null,

    toDate:
        filters.toDate || null
  };

  const response = await api.get(
      "/api/leads/filter",
      {
        params
      }
  );

  return response.data;
};


// =====================================
// FILTER INTERESTED LEADS
// =====================================

export const filterInterestedLeads = async (
    filters = {}
) => {

  return filterLeads({
    ...filters,
    status: "INTERESTED"
  });
};


// =====================================
// FILTER CONVERTED LEADS
// =====================================

export const filterConvertedLeads = async (
    filters = {}
) => {

  return filterLeads({
    ...filters,
    status: "CONVERTED"
  });
};


// =====================================
// FILTER RE-ENGAGEMENT LEADS
// =====================================

export const filterReEngagementLeads = async (
    filters = {}
) => {

  return filterLeads({
    ...filters,
    status: "RE_ENGAGEMENT"
  });
};