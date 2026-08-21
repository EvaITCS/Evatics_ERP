import React, { useEffect, useState } from "react";
import StudentLayout from "../layouts/StudentLayout";
import studentService from "../services/studentService";
import api from "../../api/axios";
import "../styles/weeklyPlan.css";
import { WEEKLY_PLAN, MILESTONES } from "../utils/weeklyPlan";

export default function WeeklyPlanPage() {
    const [student, setStudent] = useState({});
    
    // STEP 1: Current Week State
    const [currentWeek, setCurrentWeek] = useState(1);

    useEffect(() => {
        const fetchStudentProfileAndDashboard = async () => {
            try {
                const email = localStorage.getItem("email");
                
                // 1. Profile API call
                const profileRes = await api.get("/student/profile");
                const masterData = profileRes.data;

                // 2. Dashboard API call
                const dashboardRes = await studentService.getDashboard(email);
                const dashboardData = dashboardRes.data;

                // STEP 2: Week Calculation Logic
                if (dashboardData?.batchStartDateIso) {
                    const start = new Date(dashboardData.batchStartDateIso);
                    const today = new Date();
                    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
                    let week = Math.floor(diffDays / 7) + 1;
                    
                    if (week < 1) week = 1;
                    if (week > 9) week = 9;
                    
                    setCurrentWeek(week);
                }

                if (masterData) {
                    const formattedApplicationNo =
                        masterData.applicationNumber?.startsWith("LEAD-")
                            ? "APP" + masterData.applicationNumber.replace("LEAD-", "")
                            : masterData.applicationNumber || masterData.enrollmentNo || masterData.studentId || "";

                    setStudent({
                        ...masterData,
                        name: masterData.firstName ? `${masterData.firstName} ${masterData.lastName}`.trim() : "Ritika Sonkar",
                        dashboardType: "DETAIL",
                        applicationNumber: formattedApplicationNo,
                        enrollmentNo: formattedApplicationNo,
                        program: dashboardData?.program || dashboardData?.programName || ""
                    });
                }
            } catch (err) {
                console.log("Profile Fetch Error in Weekly Plan Page:", err);
            }
        };

        fetchStudentProfileAndDashboard();
    }, []);

    // STEP 3: Unlock Helper Function
    const isUnlocked = (weekNo) => {
        return weekNo <= currentWeek;
    };

    // Helper function for dynamic week classes
    const getWeekClass = (week) => `week${week}`;

    return (
        <StudentLayout student={student}>
            <div className="weekly-plan-page">
                {/* Header */}
                <div className="weekly-header">
                    <h1>Week-by-Week Plan</h1>
                    <p>
                        Mornings = concepts &amp; live coding with your trainer.
                        Afternoons = hands-on labs building SecureBank.
                    </p>
                </div>

                {/* DYNAMIC WEEKLY PLAN CARDS */}
                {WEEKLY_PLAN.filter((week) => isUnlocked(week.week)).map((week) => (
                    <div
                        key={week.week}
                        className={`week-card ${getWeekClass(week.week)} ${
                            currentWeek === week.week ? "active-week" : ""
                        }`}
                    >
                        <div className="week-top">
                            <span className={`week-badge ${getWeekClass(week.week)}-badge`}>
                                {week.badge}
                            </span>

                            <span className={`phase-badge ${getWeekClass(week.week)}-phase`}>
                                {week.phase}
                            </span>

                            {week.milestone && (
                                <span className="milestone-badge">
                                    🚩 Milestone: {week.milestone}
                                </span>
                            )}
                        </div>

                        <h2 className="week-title">
                            {week.title}
                        </h2>

                        {currentWeek === week.week && (
                            <span className="current-badge">
                                Current Week
                            </span>
                        )}

                        <p className="week-goal">
                            {week.goal}
                        </p>

                        <div className="table-wrapper">
                            <table className="week-table">
                                <thead>
                                    <tr>
                                        <th className="day-column"></th>
                                        <th>Morning — Concept &amp; Live Coding</th>
                                        <th>Afternoon — Lab &amp; SecureBank Build</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {week.days.map((day) => (
                                        <tr key={day.day}>
                                            <td className={`day ${getWeekClass(week.week)}-day`}>
                                                {day.day}
                                            </td>

                                            <td>
                                                {day.morning}
                                            </td>

                                            <td>
                                                {day.afternoon}

                                                {day.interview && (
                                                    <div className={`interview-box ${getWeekClass(week.week)}-interview`}>
                                                        🎤 <strong>Interview Prep Clinic · 30 min</strong> — {day.interview}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {/* DYNAMIC MILESTONE CHECKPOINTS */}
                <div className="milestone-section">
                    <h2 className="milestone-title">Milestone Checkpoints — Know Where You Stand</h2>
                    <p className="milestone-desc">
                        Four checkpoints mark your progress. Each one tells you exactly what
                        you should be able to do on your own by that point — and if you're not
                        there yet, your trainer will work with you to catch up before the next phase.
                    </p>

                    <div className="milestone-grid">
                        {MILESTONES.map((item) => (
                            <div
                                key={item.week}
                                className={`milestone-card ${item.colorClass}`}
                            >
                                <span className="milestone-week">
                                    {item.week}
                                </span>

                                <h3>
                                    {item.title}
                                </h3>

                                <p>
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </StudentLayout>
    );
}