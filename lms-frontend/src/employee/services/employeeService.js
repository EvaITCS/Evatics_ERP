import api from "../../api/axios";

const BASE_URL = "/api/employees";

// =====================================================
// GET ALL EMPLOYEES
// =====================================================
const getAllEmployees = () => {
  return api.get(BASE_URL);
};

// =====================================================
// GET EMPLOYEE BY PERSON ID
// =====================================================
const getEmployeeById = (personId) => {
  return api.get(`${BASE_URL}/${personId}`);
};

// =====================================================
// CREATE EMPLOYEE
// =====================================================
const createEmployee = (employeeData) => {
  return api.post(BASE_URL, employeeData);
};

// =====================================================
// UPDATE EMPLOYEE BY PERSON ID
// =====================================================
const updateEmployee = (personId, employeeData) => {
  return api.put(
      `${BASE_URL}/${personId}`,
      employeeData
  );
};

// =====================================================
// DELETE EMPLOYEE BY PERSON ID
// =====================================================
const deleteEmployee = (personId) => {
  return api.delete(`${BASE_URL}/${personId}`);
};

// =====================================================
// GET COUNSELLORS
// =====================================================
const getCounsellors = () => {
  return api.get(`${BASE_URL}/Counsellors`);
};

// =====================================================
// GET MY PROFILE
// =====================================================
const getMyProfile = () => {
  return api.get(`${BASE_URL}/me`);
};

// =====================================================
// EXPORT
// =====================================================
const employeeService = {
  getAllEmployees,
  getMyProfile,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getCounsellors,
};

export default employeeService;