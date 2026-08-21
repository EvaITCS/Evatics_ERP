import React from "react";
import "../styles/student.css";
import NotificationBell from "../../lead/components/NotificationBell";

export default function StudentNavbar({
    name,
    applicationNo,
    type,
    programName
}) {

    const formatName = (fullName) => {
        if (!fullName) return "Student";

        return fullName
            .trim()
            .toLowerCase()
            .split(" ")
            .filter(word => word)
            .map(
                word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
    };

    // Current Date
    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    return (
        <header className="student-navbar">

            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                {/* Left Side */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "0px"
                    }}
                >

                    <h2
    style={{
        margin: 0,
        fontSize: "18px",
        fontWeight: "500",
        color: "#1b3447", // Welcome text color
        lineHeight: "1.1"
    }}
>
    Welcome,{" "}
    <span style={{ color: "#0c73f1", fontWeight: "400" }}>
        {type === "BASIC"
            ? formatName(name)
            : formatName(name).split(" ")[0]}
    </span>
</h2>

                    {/* Show only for enrolled students */}
                    {type !== "BASIC" && (
                        <p
                            style={{
                                margin: 0,
                                marginTop: "8px",
                                fontSize: "16px",
                                fontWeight: "400",
                                color: "#51627c",
                                lineHeight: "1.3",
                                letterSpacing: "0.2px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                textShadow: "0 1px 1px rgba(0,0,0,0.05)"
                            }}
                        >
                            🎓 Welcome to our{" "}
                            <span
                                style={{
                                    color: "#1f4e8c",
                                    fontWeight: "600"
                                }}
                            >
                                {programName || "Program"}
                            </span>{" "}
                            Program
                        </p>
                    )}

                </div>

         {/* Right Side */}
<div
    style={{
        display: "flex",
        alignItems: "center",
        gap: "20px"
    }}
>
    <NotificationBell />

    <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "2px"
        }}
    >
        <div
            style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1b3447"
            }}
        >
            {type === "BASIC"
                ? "Application No.: "
                : "Enrollment No.: "}
            {applicationNo}
        </div>

        <span
            style={{
                fontSize: "15px",
                color: "#6b7280",
                fontWeight: "500"
            }}
        >
            {currentDate}
        </span>
    </div>
</div>

</div>

        </header>
    );
}