import { Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import ChangePasswordPage
from "../pages/ChangePasswordPage";

const AuthRoutes = (
  <>
    <Route path="/" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/change-password"
      element={<ChangePasswordPage />}
    />
  </>
);
export default AuthRoutes;