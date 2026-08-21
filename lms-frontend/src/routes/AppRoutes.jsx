import { Routes, Route, Navigate } from "react-router-dom";

// =====================================
// RESOURCE
// =====================================
import ResourceLayout from "../resource/layouts/ResourceLayout";
import ResourceRoutes from "../resource/routes/ResourceRoutes";

// =====================================
// AUTH
// =====================================
import AuthRoutes from "../auth/routes/AuthRoutes";
import ProtectedRoute from "../auth/ProtectedRoute";

// =====================================
// LEAD
// =====================================
import AdminLeadRoutes from "../lead/routes/AdminLeadRoutes";
import CounsellorLeadRoutes from "../lead/routes/CounsellorLeadRoutes";

// =====================================
// EMPLOYEE
// =====================================
import AdminEmployeeRoutes from "../employee/routes/AdminEmployeeRoutes";
import EmployeeSelfRoutes from "../employee/routes/EmployeeSelfRoutes";

// =====================================
// ATTENDANCE
// =====================================
// import AdminAttendanceRoutes from "../attendance/routes/AdminAttendanceRoutes";
// import COUNSELLORAttendanceRoutes from "../attendance/routes/COUNSELLORAttendanceRoutes";
// import EmployeeAttendanceRoutes from "../attendance/routes/EmployeeAttendanceRoutes";

// =====================================
// CANDIDATE
// =====================================
import CandidateRoutes from "../candidate/routes/CandidateRoutes";

// =====================================
// LAYOUTS
// =====================================
import AdminLayout from "../layouts/AdminLayout";
import COUNSELLORLayout from "../layouts/COUNSELLORLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// =====================================
// STUDENT
// =====================================
import StudentRoutes from "../student/routes/StudentRoutes";
import ApplicationLandingPage from "../student/pages/ApplicationLandingPage";

// =====================================
// TRAINER
// =====================================
import TrainerRoutes from "../trainer/routes/TrainerRoutes";


function AppRoutes() {
    return (
        <Routes>

            {/* ===================================== */}
            {/* PUBLIC ROUTES */}
            {/* ===================================== */}

            {AuthRoutes}

            {/* Application Landing */}
            <Route
                path="/application/start/:token"
                element={<ApplicationLandingPage />}
            />


            {/* ===================================== */}
            {/* ADMIN ROUTES */}
            {/* ===================================== */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >

                {/* Lead Module */}
                {AdminLeadRoutes}

                {/* Employee Module */}
                {AdminEmployeeRoutes}

                {/* Attendance Module */}
                {/* {AdminAttendanceRoutes} */}

            </Route>


            {/* ===================================== */}
            {/* ADMIN RESOURCES */}
            {/* ===================================== */}
            {/*
                Admin authentication required,
                but AdminLayout is NOT used.

                Therefore:
                ❌ Admin Sidebar
                ❌ Admin Navbar
                ✅ Resource page only
            */}

            {/* ===================================== */}
            {/* ADMIN RESOURCE ROUTES */}
            {/* NO ADMIN NAVBAR / SIDEBAR */}
            {/* ===================================== */}

            <Route
                path="/admin/resource/*"
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <ResourceLayout />
                    </ProtectedRoute>
                }
            >
                {ResourceRoutes}
            </Route>


            {/* ===================================== */}
            {/* COUNSELLOR ROUTES */}
            {/* ===================================== */}

            <Route
                path="/COUNSELLOR"
                element={
                    <ProtectedRoute allowedRole="COUNSELLOR">
                        <COUNSELLORLayout />
                    </ProtectedRoute>
                }
            >

                {/* Dashboard + Lead Module */}
                {CounsellorLeadRoutes}

                {/* Attendance */}
                {/* {COUNSELLORAttendanceRoutes} */}

            </Route>


            {/* ===================================== */}
            {/* EMPLOYEE ROUTES */}
            {/* ===================================== */}

            <Route
                path="/employee"
                element={
                    <ProtectedRoute allowedRole="EMPLOYEE">
                        <EmployeeLayout />
                    </ProtectedRoute>
                }
            >

                {EmployeeSelfRoutes}

                {/* Attendance */}
                {/* {EmployeeAttendanceRoutes} */}

            </Route>


            {/* ===================================== */}
            {/* STUDENT ROUTES */}
            {/* ===================================== */}

            <Route
                path="/student/*"
                element={
                    <ProtectedRoute allowedRole={["STUDENT", "LEAD"]}>
                        <StudentRoutes />
                    </ProtectedRoute>
                }
            />


            {/* ===================================== */}
            {/* CANDIDATE ROUTES */}
            {/* ===================================== */}

            <Route
                path="/candidate/*"
                element={
                    <ProtectedRoute allowedRole="CANDIDATE">
                        <CandidateRoutes />
                    </ProtectedRoute>
                }
            />


            {/* ===================================== */}
            {/* TRAINER ROUTES */}
            {/* ===================================== */}

            <Route
                path="/trainer/*"
                element={
                    <ProtectedRoute allowedRole="TRAINER">
                        <TrainerRoutes />
                    </ProtectedRoute>
                }
            />


            {/* ===================================== */}
            {/* FALLBACK */}
            {/* ===================================== */}

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default AppRoutes;