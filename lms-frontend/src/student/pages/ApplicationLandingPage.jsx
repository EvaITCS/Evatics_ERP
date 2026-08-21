import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ChangePasswordCard from "../../auth/components/ChangePasswordCard";
import LoginPage from "../../auth/pages/LoginPage";

import evaLogo from "../../assets/eva logo.png";
import api from "../../api/axios";

import "../styles/student.css";

const ApplicationLandingPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [validToken, setValidToken] = useState(false);

    // Flow steps: landing -> change-password -> login
    const [step, setStep] = useState("landing");

    useEffect(() => {
        const validateInvitation = async () => {
            try {
                // Remove old invitation data
                localStorage.removeItem("invitationStudentId");

                // Validate token
                await api.get(`/application/validate/${token}`);

                // Get student linked to this invitation
                const studentRes = await api.get(`/application/student/${token}`);

                localStorage.setItem(
                    "invitationStudentId",
                    String(studentRes.data)
                );

                setValidToken(true);
            } catch (error) {
                console.error(error);
                localStorage.removeItem("invitationStudentId");
                setValidToken(false);
            } finally {
                setLoading(false);
            }
        };

        validateInvitation();
    }, [token]);

    // Render independent full-screen login view to prevent UI overlapping and layout conflicts
    if (step === "login") {
        return (
            <LoginPage
                invitationFlow={true}
                invitationToken={token}
                onMustChangePassword={() => setStep("change-password")}
            />
        );
    }

    if (loading) {
        return (
            <div className="program-dashboard">
                <div className="program-logo">
                    <img src={evaLogo} alt="EVAITCS Logo" />
                </div>
                <h2>Checking invitation...</h2>
            </div>
        );
    }

    if (!validToken) {
        return (
            <div className="program-dashboard">
                <div className="program-logo">
                    <img src={evaLogo} alt="EVAITCS Logo" />
                </div>
                <h2>This invitation link is invalid or has expired.</h2>
            </div>
        );
    }

    return (
        <div className="program-dashboard">
            
            
            {step === "landing" && (
                <div className="program-logo">
                    <img src={evaLogo} alt="EVAITCS Logo" />
                </div>
            )}

            {/* 2. Landing Page UI */}
            {step === "landing" && (
                <>
                    <div className="program-tag">TRAINER-LED PROGRAM</div>

                    <h1 className="program-title">
                        Enterprise AI Full Stack Java Developer Program
                    </h1>

                    <p className="program-desc">
                        Twelve weeks. One production-grade banking platform{" "}
                        <strong> SecureBank </strong>
                        built by you, module by module, from ER Design to Cloud
                        Deployment.
                    </p>

                    <div style={{ marginTop: 20, textAlign: "center" }}>
                        <button
    className="start-application-btn"
    onClick={() => {
        localStorage.setItem("invitationFlow", "true");
        setStep("login");
    }}
>
    <span className="cta-indicator"></span>
    Login & Continue
    <span className="btn-arrow">→</span>
</button>
                    </div>

                    <div className="program-stats" style={{ marginTop: 20 }}>
                        <div className="program-box">
                            <h2>12</h2>
                            <span>WEEKS</span>
                        </div>
                        <div className="program-box">
                            <h2>5</h2>
                            <span>DAYS / WEEK</span>
                        </div>
                        <div className="program-box">
                            <h2>7</h2>
                            <span>HOURS / DAY</span>
                        </div>
                        <div className="program-box">
                            <h2>315</h2>
                            <span>CONTACT HOURS</span>
                        </div>
                        <div className="program-box">
                            <h2>8+1</h2>
                            <span>CAPSTONE MODULES</span>
                        </div>
                    </div>

                    <div className="tech-stack">
                        <span>Java</span>
                        <span>Spring Boot</span>
                        <span>React</span>
                        <span>TypeScript</span>
                        <span>PostgreSQL</span>
                        <span>Kafka</span>
                        <span>Docker</span>
                        <span>Kubernetes</span>
                        <span>AWS</span>
                        <span>Terraform</span>
                        <span>CI/CD</span>
                        <span>Spring AI - RAG</span>
                    </div>
                </>
            )}

          
            {step === "change-password" && (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minHeight: "90vh",
            textAlign: "left",
        }}
    >
        <div
            style={{
                width: "100%",
                maxWidth: "460px",
                textAlign: "left",
            }}
        >
            <style>{`
                .program-dashboard .unique-password-card,
                .program-dashboard .unique-password-card * {
                    text-align: left !important;
                }

                .program-dashboard .unique-password-card h2 {
                    text-align: center !important;
                }
            `}</style>

            <ChangePasswordCard
                token={token}
                onSuccess={() => {
                    navigate("/student/dashboard");
                }}
            />
        </div>
    </div>
)}
        </div>
    );
};

export default ApplicationLandingPage;