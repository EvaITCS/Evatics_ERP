import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import studentService from "../services/studentService";
import api from "../../api/axios";

export default function InterviewQuestionsPage() {
    const navigate = useNavigate();
    const [student, setStudent] = useState({});

    useEffect(() => {
        const fetchLayoutData = async () => {
            try {
                const email = localStorage.getItem("email");
                
                // Dono API se data safe side fetch kar rahe hain layout data synchronization ke liye
                const profileRes = await api.get("/student/profile");
                const masterData = profileRes.data;

                const dashboardRes = await studentService.getDashboard(email);
                const dashboardData = dashboardRes.data;

                if (masterData) {
                    setStudent({
                        ...masterData,
                        program: dashboardData?.program || dashboardData?.programName || ""
                    });
                }
            } catch (err) {
                console.log("Error loading layout context data:", err);
            }
        };

        fetchLayoutData();
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "#f5f7fb",
            }}
        >
            {/* Header - EXACT SAME DESIGN AS YOU REQUESTED */}
            <div
                style={{
                    height: "70px",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    borderBottom: "1px solid #ddd",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <button
                    onClick={() => navigate("/student/dashboard")}
                    style={{
                        position: "absolute",
                        left: "20px",
                        padding: "10px 18px",
                        background: "#002D62",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                    }}
                >
                    &larr; Back
                </button>

                <h2
                    style={{
                        margin: 0,
                        color: "#002D62",
                        fontWeight: "700",
                    }}
                >
                    Full Stack Java Interview Questions
                </h2>
            </div>

            {/* Interview Questions - EXACT IFRAME VIEW */}
            <iframe
                src="/book/EvaITCS-Full_Stack_Java_Interview_Guide.html"
                title="Interview Questions"
                style={{
                    flex: 1,
                    width: "100%",
                    border: "none",
                    background: "#fff",
                }}
            />
        </div>
    );
}