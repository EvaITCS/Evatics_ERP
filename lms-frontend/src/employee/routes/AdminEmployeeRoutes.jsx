import { Route } from "react-router-dom";

import EmployeeListPage from "../pages/EmployeeListPage";

import AddEmployeePage from "../pages/AddEmployeePage";
import EmployeeDetailsPage from "../pages/EmployeeDetailsPage";
import UpdateEmployeePage from "../pages/UpdateEmployeePage";

import EmployeeLeavePage from "../pages/EmployeeLeavePage";
import EmployeeDocumentsPage from "../pages/EmployeeDocumentsPage";


import DepartmentsPage from "../pages/DepartmentsPage";
import DesignationsPage from "../pages/DesignationsPage";
// import EmploymentTypesPage from "../pages/EmploymentTypesPage";
import EmployeeStatusesPage from "../pages/EmployeeStatusesPage";

import LeaveTypesPage from "../pages/LeaveTypesPage";

import HolidaysPage from "../pages/HolidaysPage";
import ShiftsPage from "../pages/ShiftsPage";
import LocationsPage from "../pages/LocationsPage";
import WorkModesPage from "../pages/WorkModesPage";

const AdminEmployeeRoutes = (
  <>
    {/* <Route  path="employees/dashboard"
      element={<EmployeeDashboardPage />}
    />*/}
   

    <Route
      path="employees"
      element={<EmployeeListPage />}
    />

    <Route
      path="employees/add"
      element={<AddEmployeePage />}
    />

    <Route
      path="employees/update/:personId"
      element={<UpdateEmployeePage />}
    />

    <Route
      path="employees/:personId"
      element={<EmployeeDetailsPage />}
    />

    <Route
      path="employee-leaves"
      element={<EmployeeLeavePage />}
    />
<Route
    path="employees/:employeeId/documents"
    element={<EmployeeDocumentsPage />}
/>
  


    <Route
      path="departments"
      element={<DepartmentsPage />}
    />

    <Route
      path="designations"
      element={<DesignationsPage />}
    />

    {/*<Route*/}
    {/*  path="employment-types"*/}
    {/*  element={<EmploymentTypesPage />}*/}
    {/*/>*/}

    <Route
      path="employee-statuses"
      element={<EmployeeStatusesPage />}
    />

    <Route
      path="leave-types"
      element={<LeaveTypesPage />}
    />

    <Route
      path="shifts"
      element={<ShiftsPage />}
    />

    <Route
      path="locations"
      element={<LocationsPage />}
    />

    <Route
      path="work-modes"
      element={<WorkModesPage />}
    />

    <Route
      path="holidays"
      element={<HolidaysPage />}
    />
  </>
);

export default AdminEmployeeRoutes;