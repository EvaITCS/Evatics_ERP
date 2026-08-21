import { useNavigate } from "react-router-dom";

export default function BookPage() {
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
            {/* Header */}
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
                    ← Back
                </button>

                <h2
                    style={{
                        margin: 0,
                        color: "#002D62",
                        fontWeight: "700",
                    }}
                >
                    Full Stack Java Development Book
                </h2>
            </div>

            {/* Book */}
            <iframe
                src="/book/Full_Stack_Java_Training_Book.html"
                title="Training Book"
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