import { Route } from "react-router-dom";

// =========================================================
// DASHBOARD
// =========================================================

import DashboardPage from "../pages/DashboardPage";
// =========================================================
// LEAD MANAGEMENT
// =========================================================

import MyLeadsPage from "../pages/MyLeadsPage";
import AddLeadPage from "../pages/AddLeadPage";
import InterestedLeadsPage from "../pages/InterestedLeadsPage";
import ConvertedLeadsPage from "../pages/ConvertedLeadsPage";
import ReEngagementPage from "../pages/ReEngagementPage";
import TodayFollowupsPage from "../pages/TodayFollowupsPage";
import PendingFollowupsPage from "../pages/PendingFollowupsPage";
import NotificationsPage from "../pages/NotificationsPage";
import LeadDetailPage from "../pages/LeadDetailsPage";

// =========================================================
// REVIEW SUMMARY
// =========================================================

import LeadAnalyticsPage from "../pages/LeadAnalyticsPage";

// =========================================================
// STUDENT MANAGEMENT
// =========================================================

import StudentSupportPage from "../pages/StudentSupportPage";
import StudentCredentials from "../pages/StudentCredentials";
import MyStudents from "../pages/MyStudents";
import CounselorStudentApplicationForm from "../pages/CounselorStudentApplicationForm";
import CounselorApplicationDetails from "../pages/CounselorApplicationDetails";

import ProfileChangeRequestsPage from "../../student/pages/ProfileChangeRequestsPage";

// =========================================================
// EMPLOYEE MODULE
// =========================================================

import MyProfilePage from "../../employee/pages/MyProfilePage";
import ApplyLeavePage from "../../employee/pages/ApplyLeavePage";
import MyLeavesPage from "../../employee/pages/MyLeavesPage";
import EmployeeHolidaysPage from "../../employee/pages/EmployeeHolidaysPage";

import ChangePasswordPage from "../../auth/pages/ChangePasswordPage";
import COUNSELLORDropRequestsPage from "../../trainer/pages/ConsultantDropRequestsPage";

const  CounsellorLeadRoutes = (

    <>

        {/* ===================================== */}
        {/* DASHBOARD */}
        {/* ===================================== */}

        <Route
            index
            element={<DashboardPage />}
        />

        {/* ===================================== */}
        {/* LEAD MANAGEMENT */}
        {/* ===================================== */}

        <Route
            path="my-leads"
            element={<MyLeadsPage />}
        />

        <Route
            path="add-lead"
            element={<AddLeadPage />}
        />

        <Route
            path="today-followups"
            element={<TodayFollowupsPage />}
        />

        <Route
            path="pending-followups"
            element={<PendingFollowupsPage />}
        />

        <Route
            path="notifications"
            element={<NotificationsPage />}
        />

        <Route
            path="interested"
            element={<InterestedLeadsPage />}
        />

        <Route
            path="converted"
            element={<ConvertedLeadsPage />}
        />

        <Route
            path="re-engagement"
            element={<ReEngagementPage />}
        />

        <Route
            path="lead/:id"
            element={<LeadDetailPage />}
        />

        {/* ===================================== */}
        {/* REVIEW SUMMARY */}
        {/* ===================================== */}

        <Route
            path="lead-analytics"
            element={<LeadAnalyticsPage />}
        />

        {/* ===================================== */}
        {/* STUDENT MANAGEMENT */}
        {/* ===================================== */}

        <Route
            path="student-support"
            element={<StudentSupportPage />}
        />

        <Route
            path="student-credentials"
            element={<StudentCredentials />}
        />
            <Route
                path="drop-requests"
                element={<COUNSELLORDropRequestsPage />}
            />

        <Route
            path="my-students"
            element={<MyStudents />}
        />

        <Route
            path="application/:id"
            element={<CounselorApplicationDetails />}
        />

        <Route
            path="student-application/:candidateId"
            element={<CounselorStudentApplicationForm />}
        />


<Route
    path="profile-change-requests"
    element={<ProfileChangeRequestsPage />}
/>
        {/* ===================================== */}
        {/* MY ACCOUNT */}
        {/* ===================================== */}

        <Route
            path="profile"
            element={<MyProfilePage />}
        />

        <Route
            path="change-password"
            element={<ChangePasswordPage />}
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

    </>

);

export default CounsellorLeadRoutes;