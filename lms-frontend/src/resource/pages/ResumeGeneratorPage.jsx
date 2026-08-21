import React from "react";
import { useNavigate } from "react-router-dom";

const ResumeGeneratorPage = () => {
    const navigate = useNavigate();

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
                    flexShrink: 0,
                }}
            >


                <h2
                    style={{
                        margin: 0,
                        color: "#002D62",
                        fontWeight: "700",
                    }}
                >
                    EvaITCS Resume Generator
                </h2>
            </div>

            <iframe
                src="/EvaITCS_Resume_Generator.html"
                title="EvaITCS Resume Generator"
                style={{
                    flex: 1,
                    width: "100%",
                    border: "none",
                    background: "#fff",
                }}
            />
        </div>
    );
};

export default ResumeGeneratorPage;