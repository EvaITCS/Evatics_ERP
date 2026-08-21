import { Routes, Route } from "react-router-dom";

import TrainerDashboardPage from "../pages/TrainerDashboardPage";
import TrainerBatchesPage from "../pages/TrainerBatchesPage";
import CreateTasks from "../pages/CreateTasks"; // Double check your file name case (CreateTask vs CreateTasks)
import ViewTasks from "../pages/ViewTasks";     // Import the missing view task file
import ApplyLeavePage from "../../employee/pages/ApplyLeavePage";
import MyLeavesPage from "../../employee/pages/MyLeavesPage";
import EmployeeHolidaysPage from "../../employee/pages/EmployeeHolidaysPage";
import ChangePasswordPage from "../../auth/pages/ChangePasswordPage";

import TrainerDropRequestsPage from "../pages/TrainerDropRequestsPage";

export default function TrainerRoutes() {
    return (
        <Routes>
            {/* Dashboard Default Route */}
            <Route
                path="/"
                element={<TrainerDashboardPage />}
            />

            {/* Batches Route */}
            <Route
                path="/batches"
                element={<TrainerBatchesPage />}
            />

            {/* FIXED 1: Create Task Route matching Navbar: /trainer/CreateTasks */}
            <Route
                path="/CreateTasks"
                element={<CreateTasks />}
            />

            {/* FIXED 2: View Task Route matching Navbar: /trainer/ViewTasks */}
            <Route
                path="/ViewTasks"
                element={<ViewTasks />}
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




            <Route
    path="/drop-requests"
    element={<TrainerDropRequestsPage />}
/>
        </Routes>
    );
}