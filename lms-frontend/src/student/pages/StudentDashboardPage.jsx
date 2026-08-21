import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import studentService from "../services/studentService";
import StudentLayout from "../layouts/StudentLayout";
import "../styles/student.css";
import { WEEKLY_PLAN } from "../utils/weeklyPlan";
import ApplicationJourney from "../components/Applicationjourney";

export default function StudentDashboardPage() {
    const [data, setData] = useState(null);
    const [currentWeek, setCurrentWeek] = useState(1);

    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const navigate = useNavigate();

    // =========================================================
    // FETCH STUDENT DASHBOARD
    // =========================================================
    useEffect(() => {
        const email = localStorage.getItem("email");

        studentService
            .getDashboard(email)
            .then(res => {
                console.log(res.data);
                setData(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    // =========================================================
    // CURRENT WEEK
    // =========================================================
    useEffect(() => {
        if (data?.batchStartDateIso) {
            const start = new Date(data.batchStartDateIso);
            const today = new Date();

            const diffDays = Math.floor(
                (today - start) / (1000 * 60 * 60 * 24)
            );

            let week = Math.floor(diffDays / 7) + 1;

            if (week < 1) week = 1;
            if (week > 9) week = 9;

            setCurrentWeek(week);
        }
    }, [data]);

    // =========================================================
    // COUNTDOWN
    // =========================================================
    useEffect(() => {
        if (!data?.batchStartDate) return;

        const target = new Date(data.batchStartDateIso);

        const timer = setInterval(() => {
            const now = new Date();

            const diff = target.getTime() - now.getTime();

            if (diff <= 0) {
                clearInterval(timer);

                setCountdown({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                });

                return;
            }

            setCountdown({
                days: Math.floor(
                    diff / (1000 * 60 * 60 * 24)
                ),
                hours: Math.floor(
                    (diff / (1000 * 60 * 60)) % 24
                ),
                minutes: Math.floor(
                    (diff / (1000 * 60)) % 60
                ),
                seconds: Math.floor(
                    (diff / 1000) % 60
                )
            });

        }, 1000);

        return () => clearInterval(timer);

    }, [data]);

    // =========================================================
    // WEEKLY PLAN
    // =========================================================
    const currentWeekData = WEEKLY_PLAN.find(
        w => w.week === currentWeek
    );

    const dayNames = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri"
    ];

    const todayName =
        dayNames[new Date().getDay()];

    const todayData =
        currentWeekData?.days.find(
            d => d.day === todayName
        ) || currentWeekData?.days[0];

    // =========================================================
    // BASIC DASHBOARD - HIGH LEVEL WEEK OVERVIEW
    // =========================================================
    const overviewWeeks = WEEKLY_PLAN
        .filter(week => week.week >= 1 && week.week <= 3)
        .map(week => ({
            week: week.week,
            title: week.title
        }));

    // =========================================================
    // LOADING
    // =========================================================
    if (!data) {
        return <h2>Loading...</h2>;
    }

    const basic =
        data.dashboardType === "BASIC";

    const waiting =
        data.dashboardType === "WAITING_BATCH";

    const training =
        data.dashboardType === "TRAINING";

        const isFormSubmitted =
    data?.applicationStage?.toUpperCase() === "SUBMITTED";

    return (
        <StudentLayout student={data}>

            {/* =====================================================
                BASIC DASHBOARD
            ===================================================== */}
            {basic ? (

                <div
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto",
                        padding: "30px 25px 50px",
                        boxSizing: "border-box"
                    }}
                >

                    {/* =================================================
                        APPLICATION JOURNEY
                    ================================================= */}
                    <div className="student-card">
                        <ApplicationJourney data={data} />
                    </div>
                </div>


            ) : waiting ? (

                /* =====================================================
                   WAITING BATCH
                   UNCHANGED
                ===================================================== */

                <div className="waiting-dashboard">

                    <div
                        style={{
                            maxWidth: "1000px",
                            margin: "0 auto",
                            padding: "10px 20px 30px",
                            boxSizing: "border-box"
                        }}
                    >

                        {/* Hero Banner Card */}
                        <div
                            style={{
                                background:
            "linear-gradient(135deg, #f3f6fb 0%, #f5f6f9 100%) padding-box, linear-gradient(135deg, #0d3298, #2563eb) border-box",
        border: "2px solid transparent",
                                color: "#ffffff",
                                borderRadius: "10px",
                                padding: "20px 24px",
                                textAlign: "center",
                                
                                marginTop:"20px" ,
                                boxShadow:
                                    "0 12px 30px rgba(0, 45, 98, 0.18)"
                            }}
                        >

                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "26px",
                                    fontWeight: "600",
                                    letterSpacing: "-0.5px",
                                    lineHeight: "1.3",
                                    color: "black"
                                }}
                            >
                                Welcome to{" "}
                                <span
                                    style={{
                                        color: "#dc2626"
                                    }}
                                >
                                    EVA
                                </span>
                                <span
                                    style={{
                                        color: "#2563eb"
                                    }}
                                >
                                    IT
                                </span>{" "}
                                Consulting Services LLC
                            </h1>

                            <p
                                style={{
                                    marginTop: "16px",
                                    marginBottom: 0,
                                    fontSize: "15px",
                                    lineHeight: "1.7",
                                    maxWidth: "640px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    opacity: 0.95,
                                    fontWeight: "400",
                                    color: "black"
                                }}
                            >
                                Congratulations on your enrollment!
                                <br />
                                <br />
                                Your learning journey is about to begin.
                                Get ready to build real-world projects,
                                learn from industry professionals, and
                                transform your skills over the next few
                                weeks.
                            </p>

                        </div>


                        {/* Batch Info & Compact Days Left Grid */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(260px, 1fr))",
                                gap: "16px",
                                marginTop: "20px"
                            }}
                        >

                            {/* Batch Start Date Card */}
                            <div
                                style={{
                                    background: "#ffffff",
                                    borderRadius: "12px",
                                    padding: "16px 20px",
                                    textAlign: "center",
                                    boxShadow:
                                        "0 4px 12px rgba(0, 0, 0, 0.05)",
                                    border:
                                        "1px solid #f1f5f9",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: "15px",
                                        color: "#323942",
                                        marginBottom: "6px",
                                        fontWeight: "500",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    <span>📅</span>
                                    Batch Start Date
                                </div>

                                <div
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "500",
                                        color: "#002D62",
                                        lineHeight: "1.2"
                                    }}
                                >
                                    {data.batchStartDate}
                                </div>

                            </div>


                            {/* Days Left Card */}
                            <div
                                style={{
                                    background: "#ffffff",
                                    borderRadius: "12px",
                                    padding: "16px 20px",
                                    textAlign: "center",
                                    boxShadow:
                                        "0 4px 12px rgba(0, 0, 0, 0.05)",
                                    border:
                                        "1px solid #f1f5f9",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: "15px",
                                        color: "#323942",
                                        marginBottom: "6px",
                                        fontWeight: "500",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    <span>⏳</span>
                                    Journey Begins In
                                </div>

                                <div
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#002D62",
                                        lineHeight: "1.2"
                                    }}
                                >
                                    {countdown.days} Days Left
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


            ) : training ? (

                /* =====================================================
                   TRAINING
                   UNCHANGED
                ===================================================== */

                <div className="training-dashboard">

                    {/* Hero */}
                    <div className="training-hero"style={{marginTop:"15px"}}>

                        <div>

                            <span className="hero-label">
                                CURRENT TRAINING
                            </span>

                            <h1>
                                You're currently in{" "}
                                <span>
                                    Week {currentWeek}
                                </span>
                            </h1>

                            <p>
                                Keep building momentum. Complete this
                                week's concepts and labs before moving
                                to the next phase.
                            </p>

                        </div>

                        <div className="week-chip">
                            Week {currentWeek} / 9
                        </div>

                    </div>


                    {/* Current Week */}
                    <div className="training-card">

                        <div className="card-header">

                            <div>

                                <span className="card-label">
                                    CURRENT WEEK
                                </span>

                                <h2>
                                    {currentWeekData?.title}
                                </h2>

                            </div>

                        </div>

                        <p className="week-goal">
                            {currentWeekData?.goal}
                        </p>

                        <div className="topic-list">

                            {currentWeekData?.days.map(
                                (item) => (

                                    <div
                                        key={item.day}
                                        className="topic"
                                    >
                                        {item.day}
                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* Today's Learning */}
                    <div className="training-card">

                        <div className="card-header">

                            <div>

                                <span className="card-label">
                                    TODAY'S LEARNING
                                </span>

                                <h2>
                                    {todayData?.day}
                                </h2>

                            </div>

                        </div>

                        <div className="today-grid">

                            <div className="session-card">

                                <h3>
                                    Morning Session
                                </h3>

                                <ul>

                                    {todayData?.morning
                                        ?.split(/[,;—]/)
                                        .map(item =>
                                            item.trim()
                                        )
                                        .filter(Boolean)
                                        .map(
                                            (item, index) => (
                                                <li
                                                    key={index}
                                                >
                                                    {item}
                                                </li>
                                            )
                                        )}

                                </ul>

                            </div>


                            <div className="session-card">

                                <h3>
                                    Afternoon Lab
                                </h3>

                                <ul>

                                    {todayData?.afternoon
                                        ?.split(/[,;—]/)
                                        .map(item =>
                                            item.trim()
                                        )
                                        .filter(Boolean)
                                        .map(
                                            (item, index) => (
                                                <li
                                                    key={index}
                                                >
                                                    {item}
                                                </li>
                                            )
                                        )}

                                </ul>

                            </div>

                        </div>

                    </div>

                </div>


            ) : (

                <div>
                    Unknown Dashboard
                </div>

            )}

        </StudentLayout>
    );
}