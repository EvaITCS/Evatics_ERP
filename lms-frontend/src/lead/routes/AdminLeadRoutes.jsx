import { Route } from "react-router-dom";
import RejectedLeadsReportPage
from "../pages/RejectedLeadsReportPage";

import DashboardPage from "../pages/DashboardPage";
import LeadsPage from "../pages/LeadsPage";
import AddLeadPage from "../pages/AddLeadPage";
import InterestedLeadsPage from "../pages/InterestedLeadsPage";
import ReEngagementPage from "../pages/ReEngagementPage";
import ConvertedLeadsPage from "../pages/ConvertedLeadsPage";
import AdminContractPage from "../../student/pages/AdminContractPage";
import LeadImportPage from "../pages/LeadImportPage";
import LeadDetailPage from "../pages/LeadDetailsPage";
import LeadAnalyticsPage from "../pages/LeadAnalyticsPage";
import AdminDropRequestsPage from "../../trainer/pages/AdminDropRequestsPage";
import StudentSupportPage from "../pages/StudentSupportPage";

import ProgramRoutes from "../../program/routes/ProgramRoutes";
import BatchRoutes from "../../batch/routes/BatchRoutes";

import AdminApplicationList from "../pages/AdminApplicationList";
import AdminApplicationDetails from "../pages/AdminApplicationDetails";
import AdminStudentList from "../pages/AdminStudentList";
import ProfileChangeRequestsPage from "../../student/pages/ProfileChangeRequestsPage";

import CounselorStudentApplicationForm from "../pages/CounselorStudentApplicationForm";
import StudentCredentials from "../pages/StudentCredentials";
import MyStudents from "../pages/MyStudents";
import CounselorApplicationDetails from "../pages/CounselorApplicationDetails"; 

import ChangePasswordPage from "../../auth/pages/ChangePasswordPage";
import LockedUsersPage from "../../security/pages/LockedUsersPage";
import NotificationsPage from "../pages/NotificationsPage";
const AdminLeadRoutes = (
<>
{/* Dashboard */}
<Route
index
element={<DashboardPage />}
/>


    {/* Leads */}
    <Route
        path="all-leads"
        element={<LeadsPage />}
    />

    <Route
        path="add-lead"
        element={<AddLeadPage />}
    />

    <Route
        path="interested"
        element={<InterestedLeadsPage />}
    />

    <Route
        path="re-engagement"
        element={<ReEngagementPage />}
    />

    <Route
        path="converted"
        element={<ConvertedLeadsPage />}
    />

    <Route
        path="lead/:id"
        element={<LeadDetailPage />}
    />



    {/* Applications */}
    <Route
        path="applications"
        element={<AdminApplicationList />}
    />
    <Route
        path="notifications"
        element={<NotificationsPage />}
    />
    <Route
        path="applications/:id"
        element={<AdminApplicationDetails />}
    />
<Route
    path="drop-requests"
    element={<AdminDropRequestsPage />}
/>
    {/* Programs */}
    <Route
        path="programs/*"
        element={<ProgramRoutes />}
    />

    {/* Batches */}
    <Route
        path="batches/*"
        element={<BatchRoutes />}
    />

    {/* Analytics */}
    <Route
        path="lead-analytics"
        element={<LeadAnalyticsPage />}
    />

    {/* Lead Import */}
    <Route
        path="lead-import"
        element={<LeadImportPage />}
    />

    <Route
    path="lead-import/report/:importJobId"
    element={<RejectedLeadsReportPage />}
/>

<Route

 path="students"
 element={<AdminStudentList />}
/>

<Route
    path="profile-change-requests"
    element={<ProfileChangeRequestsPage />}
/>

 <Route
    path="change-password"
    element={<ChangePasswordPage />}
/>

<Route path="student-application/:candidateId" element={<CounselorStudentApplicationForm />} />
    <Route path="student-support" element={<StudentSupportPage />} />

<Route path="student-credentials" element={<StudentCredentials />} />

<Route path="my-students" element={<MyStudents />} />
    <Route
        path="contracts"
        element={<AdminContractPage />}
    />
<Route path="application/:id" element={<CounselorApplicationDetails />}  />

<Route path="/admin/locked-users" element={<LockedUsersPage />} />
      
</>


);

export default AdminLeadRoutes;