import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import "../styles/sidebar.css";

export default function StudentSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const [learningOpen, setLearningOpen] = useState(false);

    // 1. LocalStorage se initial state read karein taaki navigation ke time API wait na karna pade
    const [dashboardType, setDashboardType] = useState(() => {
        return localStorage.getItem("dashboardType") || "BASIC";
    });

    // Step 1: Stage Fetching from API
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const res = await api.get("/student/dashboard");
                const currentType = res.data.dashboardType || "BASIC";
                
                setDashboardType(currentType);
                // Type ko localStorage me save karein
                localStorage.setItem("dashboardType", currentType);
            } catch (e) {
                console.log("Error fetching dashboard:", e);
            }
        };

        loadDashboard();
    }, []);

    // Step 2: Define Stage-wise Menu Structures
    const basicMenu = [
        ["Dashboard", "/student/dashboard"],
        // ["My Form", "/student/my-form"]
    ];

    const basicProfileMenu = [
        ["My Application", "/student/application"]
        // ["Contract", "/student/contract"]
    ];

    const waitingBatchMenu = [
        ["Dashboard", "/student/dashboard"],
        ["My Profile", "/student/profile"],
        ["My Batch", "/student/my-batch"],
        ["Signed Contract", "/student/contract"],
        ["Support", "/student/support"]
    ];

    const trainingMenu = [
        ["Dashboard", "/student/dashboard"],
        ["My Profile", "/student/profile"],
        ["My Batch", "/student/my-batch"],
    ["Signed Contract", "/student/contract"],
        ["Support", "/student/support"]
    ];

    const waitingLearningMenu = [
        ["Curriculum", "/student/curriculum"]
    ];

    const trainingLearningMenu = [
        ["Curriculum", "/student/curriculum"],
        ["Weekly Plan", "/student/weekly-plan"],
        ["Book", "/student/book"],
        ["Interview Questions", "/student/interview-questions"]
    ];

    // Step 3: Dynamic Menu Selection Logic
    let menu = [];
    let learningMenu = [];

    switch (dashboardType) {
        case "WAITING_BATCH":
            menu = waitingBatchMenu;
            learningMenu = waitingLearningMenu;
            break;

        case "TRAINING":
        case "PLACEMENT":
            menu = trainingMenu;
            learningMenu = trainingLearningMenu;
            break;

        case "BASIC":
        default:
            menu = basicMenu;
            learningMenu = waitingLearningMenu;
            break;
    }

    // Step 4: Auto-expand Profile dropdown ONLY when route changes to a profile page
    useEffect(() => {
        if (dashboardType === "BASIC") {
            const isProfileActive = basicProfileMenu.some(
                subItem => location.pathname === subItem[1]
            );
            if (isProfileActive) {
                setProfileOpen(true);
            }
        } else {
            setProfileOpen(false); // Agar BASIC nahi hai toh force close rakhein
        }
    }, [location.pathname, dashboardType]);

    // Step 5: Auto-expand Learning Zone dropdown
    useEffect(() => {
        const isLearningActive = learningMenu.some(
            subItem => location.pathname === subItem[1]
        );
        if (isLearningActive) {
            setLearningOpen(true);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (e) {
            console.log(e);
        } finally {
            localStorage.clear();
            navigate("/");
        }
    };

    return (
        <div className={`student-sidebar ${isOpen ? "open" : "collapsed"}`}>
            {/* Header */}
            <div className="sidebar-header-zone">
                <button
                    className="sidebar-hamburger"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </button>

                <h2 className="sidebar-logo-text">
                    EVAITCS ERP
                </h2>
            </div>

            {/* Menu List */}
            <ul className="sidebar-menu-list">
                {/* 1. Main Navigation Items */}
                {menu.map((item, i) => {
                    const isActive = location.pathname === item[1];

                    return (
                        <li key={i} className="sidebar-menu-item">
                            <button
                                className={`sidebar-btn ${isActive ? "active" : ""}`}
                                onClick={() => navigate(item[1])}
                            >
                                {item[0]}
                            </button>
                        </li>
                    );
                })}

                {/* 2. Profile Dropdown (Only for BASIC Dashboard) */}
                {dashboardType === "BASIC" && (
                    <li className="sidebar-menu-item">
                        <button
                            className="sidebar-btn learning-btn"
                            onClick={() => setProfileOpen((prev) => !prev)}
                        >
                            <span>Profile</span>
                            <span className={profileOpen ? "arrow rotate" : "arrow"}>
                                ▼
                            </span>
                        </button>

                        {profileOpen && (
                            <ul className="learning-submenu">
                                {basicProfileMenu.map((subItem, index) => {
                                    const active = location.pathname === subItem[1];
                                    return (
                                        <li key={index} className="sidebar-menu-item submenu-item">
                                            <button
                                                className={`sidebar-btn submenu-btn ${active ? "active" : ""}`}
                                                onClick={() => navigate(subItem[1])}
                                            >
                                                {subItem[0]}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                )}

                {/* 3. Learning Zone Dropdown */}
                {learningMenu.length > 0 && (
                    <li className="sidebar-menu-item">
                        <button
                            className="sidebar-btn learning-btn"
                            onClick={() => setLearningOpen((prev) => !prev)}
                        >
                            <span>Learning Zone</span>
                            <span className={learningOpen ? "arrow rotate" : "arrow"}>
                                ▼
                            </span>
                        </button>

                        {learningOpen && (
                            <ul className="learning-submenu">
                                {learningMenu.map((subItem, index) => {
                                    const active = location.pathname === subItem[1];
                                    return (
                                        <li key={index} className="sidebar-menu-item submenu-item">
                                            <button
                                                className={`sidebar-btn submenu-btn ${active ? "active" : ""}`}
                                                onClick={() => navigate(subItem[1])}
                                            >
                                                {subItem[0]}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                )}
            </ul>

            {/* Logout */}
            <button className="sidebar-logout-btn" onClick={handleLogout}>
                <span className="logout-text">Logout</span>
            </button>
        </div>
    );
}