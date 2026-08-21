import { useNavigate } from "react-router-dom";
import "../style/candidate.css";
// Font Awesome Icons Import
import { FaCalendarAlt, FaUsers, FaLayerGroup, FaCode } from "react-icons/fa";

function CandidateDashboardPage() {
    const navigate = useNavigate();
    const fullName = localStorage.getItem("fullName") || "Candidate Name";

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="candidate-container">
            {/* Top Header Banner */}
            <header className="candidate-header">
                <div className="header-brand">
                    <h1>Enterprise AI Full Stack Java Developer Program</h1>
                    <p className="candidate-tagline">
                        Build Enterprise-Ready Skills. Launch Your Tech Career.
                    </p>
                </div>
                <div className="candidate-user">
                    <span className="user-welcome">
                        Welcome, <strong>{fullName}</strong>
                    </span>
                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="dashboard-content">
                <section className="welcome-hero-card">
                    <div className="hero-badge">Active Cohort</div>
                    <h2>Welcome to Your Corporate Training Portal</h2>
                    <p className="welcome-text">
                        Welcome to the <strong>Enterprise AI Full Stack Java Developer Program</strong>, 
                        a comprehensive training pipeline engineered to transform high-potential candidates into industry-ready software engineers. 
                        This curriculum is highly intensive and focuses deep into building industrial-grade applications using the <strong>Java Enterprise Edition (JEE) ecosystem, Spring Boot microservices framework, and Hibernate ORM</strong>. 
                        You will actively gain core hands-on competency in designing multi-tier distributed architectures, implementing secure RESTful APIs, optimizing production MySQL database layers, and deploying cloud-native web services. 
                        Additionally, you will integrate <strong>AI-assisted coding paradigms</strong> to write optimized, high-throughput, and clean Object-Oriented implementations that align with global software standards.
                    </p>
                </section>
<section className="benefits-section">

    <h2 className="section-title">
        Why Choose This Program?
    </h2>

    <div className="benefits-grid">

        <div className="benefit-card">
            <span>🚀</span>
            <h3>Industry Projects</h3>
            <p>Build applications similar to real enterprise systems.</p>
        </div>

        <div className="benefit-card">
            <span>👨‍🏫</span>
            <h3>Expert Mentors</h3>
            <p>Learn directly from experienced professionals.</p>
        </div>

        <div className="benefit-card">
            <span>💼</span>
            <h3>Placement Support</h3>
            <p>Resume guidance and interview preparation.</p>
        </div>

        <div className="benefit-card">
            <span>📜</span>
            <h3>Certification</h3>
            <p>Receive a completion certificate after training.</p>
        </div>

    </div>

</section>
              <section className="program-highlights">

    <div className="highlight-card">
        <FaCalendarAlt className="highlight-icon" />
        <div>
            <h3>12 Weeks</h3>
            <p>Intensive Training</p>
        </div>
    </div>

    <div className="highlight-card">
        <FaUsers className="highlight-icon" />
        <div>
            <h3>Live Mentoring</h3>
            <p>Expert Guidance</p>
        </div>
    </div>

    <div className="highlight-card">
        <FaLayerGroup className="highlight-icon" />
        <div>
            <h3>Beginner Friendly</h3>
            <p>Step-by-Step Learning</p>
        </div>
    </div>

    <div className="highlight-card">
        <FaCode className="highlight-icon" />
        <div>
            <h3>Real Projects</h3>
            <p>Industry Experience</p>
        </div>
    </div>

</section>
            </main>
        </div>
    );
}

export default CandidateDashboardPage;