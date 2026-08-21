import { Routes, Route, Navigate } from "react-router-dom";

import StudentDashboardPage from "../pages/StudentDashboardPage";
import StudentProfilePage from "../pages/StudentProfilePage";
import StudentApplicationPage from "../pages/StudentApplicationPage";
import StudentSupportPage from "../pages/StudentSupportPage";
import MyBatchPage from "../pages/MyBatchPage";
import ChangePasswordPage from "../../auth/pages/ChangePasswordPage";
import StudentMyForm from "../pages/StudentMyForm"; 
import CurriculumPage from "../pages/CurriculumPage";
import BookPage from "../pages/BookPage";
import WeeklyPlanPage from "../pages/WeeklyPlanPage";
import InterviewQuestionsPage from "../pages/InterviewQuestionsPage";
import ApplicationLandingPage from "../pages/ApplicationLandingPage";
import StudentContract from "../pages/StudentContract";
import StudentNotifications from "../pages/StudentNotifications";

export default function StudentRoutes() {
    return (
        <Routes>
            <Route
                index
                element={<Navigate to="dashboard" />}
            />

            <Route
                path="dashboard"
                element={<StudentDashboardPage />}
            />

            <Route
                path="profile"
                element={<StudentProfilePage />}
            />

            <Route
                path="application"
                element={<StudentApplicationPage />}
            />


           
            <Route
                path="my-form"
                element={<StudentMyForm />}
            />

            <Route
                path="curriculum"
                element={<CurriculumPage />}
            />

           <Route
                path="weekly-plan"
                element={<WeeklyPlanPage />}
            />

             <Route
                path="book"
                element={<BookPage />}
            />

            <Route
    path="interview-questions"
    element={<InterviewQuestionsPage />}
/>

            <Route
                path="support"
                element={<StudentSupportPage />}
            />

            <Route
    path="my-batch"
    element={<MyBatchPage/>}
/>

<Route
    path="contract"
    element={<StudentContract />}
/>

<Route
    path="notifications"
    element={<StudentNotifications />}
/>
        </Routes>
    );
}