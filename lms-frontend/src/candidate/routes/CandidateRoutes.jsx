import { useNavigate } from "react-router-dom";
import "../style/candidate.css";

function CandidateDashboardPage() {
    const navigate = useNavigate();
    const fullName = localStorage.getItem("fullName") || "Candidate Name";

    const avatarInitials = fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="candidate-container">
            {/* Header Section */}
            <header className="candidate-header">
                <div className="header-brand">
                    <h1>Enterprise AI Full Stack Java Developer Program</h1>
                    <p className="candidate-tagline">
                        Build Enterprise-Ready Skills. Launch Your Tech Career.
                    </p>
                </div>
                <div className="candidate-user">
                    <div className="avatar-circle" title={fullName}>
                        {avatarInitials}
                    </div>
                    <div className="user-details">
                        <span className="user-label">Welcome</span>
                        <span className="user-name">{fullName}</span>
                    </div>
                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="dashboard-content">
                {/* Hero Welcome Banner */}
                <section className="welcome-hero-card">
                    <h2>Welcome to Your Journey</h2>
                    <p>
                        Welcome to the <strong>Enterprise AI Full Stack Java Developer Program</strong>,
                        a comprehensive training program designed to transform
                        beginners into industry-ready Full Stack Java Developers.
                    </p>
                    <p>
                        Throughout this 12-week journey, you will gain practical
                        experience by building real-world applications using modern
                        enterprise technologies.
                    </p>
                </section>

                {/* Program Track Timeline (Replaced Cards) */}
                <section className="program-timeline-section">
                    <h3 className="section-title">Program Overview</h3>
                    <div className="timeline-container">
                        <div className="timeline-track-line"></div>
                        
                        <div className="timeline-step">
                            <div className="step-dot active"></div>
                            <span className="step-title">Duration</span>
                            <span className="step-value">12 Weeks Track</span>
                        </div>

                        <div className="timeline-step">
                            <div className="step-dot active"></div>
                            <span className="step-title">Mode</span>
                            <span className="step-value">Offline + Live</span>
                        </div>

                        <div className="timeline-step">
                            <div className="step-dot active"></div>
                            <span className="step-title">Level</span>
                            <span className="step-value">Beginner to Pro</span>
                        </div>

                        <div className="timeline-step">
                            <div className="step-dot active"></div>
                            <span className="step-title">Method</span>
                            <span className="step-value">Project-Based</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default CandidateDashboardPage;