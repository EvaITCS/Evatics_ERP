import { Route } from "react-router-dom";

import MyProfilePage from "../pages/MyProfilePage";

import ApplyLeavePage from "../pages/ApplyLeavePage";
import MyLeavesPage from "../pages/MyLeavesPage";
import ChangePasswordPage from "../../auth/pages/ChangePasswordPage";
import EmployeeHolidaysPage from "../pages/EmployeeHolidaysPage";

const EmployeeSelfRoutes = (
  <>
    <Route
    index
    element={<MyProfilePage />}
/>
    <Route
      path="profile"
      element={<MyProfilePage />}
    />

    <Route
      path="apply-leave"
      element={<ApplyLeavePage />}
    />

    <Route
      path="leaves"
      element={<MyLeavesPage />}
    />

    <Route
      path="holidays"
      element={<EmployeeHolidaysPage />}


    />
  <Route
    path="change-password"
    element={<ChangePasswordPage />}
/>
  </>
);

export default EmployeeSelfRoutes;