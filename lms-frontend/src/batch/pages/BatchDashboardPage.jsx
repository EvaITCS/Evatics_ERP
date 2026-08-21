import { useEffect, useState } from "react";
import { getBatchDashboard } from "../services/batchService";

export default function BatchDashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    // =========================
    // LOAD DASHBOARD DATA
    // =========================
    const loadDashboard = async () => {
        try {
            const response = await getBatchDashboard();
            console.log("BATCH DASHBOARD:", response.data);
            setDashboard(response.data);
        } catch (error) {
            console.error("Batch Dashboard Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    // =========================
    // COMPACT ADMIN-MATCHED STYLES
    // =========================
    const styles = {
        container: {
            width: "100%",
            padding: "10px",
            boxSizing: "border-box",
            fontFamily: "'cambria",
            backgroundColor: "#f8fafc",
            minHeight: "100vh"
        },
        headerZone: {
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "14px"
        },
        headerTitle: {
            fontSize: "24px",
            fontWeight: "700",
            color: "#0f172a",
            margin: "0 0 4px 0",
            letterSpacing: "-0.01em"
        },
        headerSubtitle: {
            fontSize: "13px",
            color: "#64748b",
            margin: "0",
            fontWeight: "400"
        },
        statsGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            width: "100%"
        },
        // Compact Card Style matching Admin Dashboard exactly
        card: (topBorderColor) => ({
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderTop: `4px solid ${topBorderColor}`,
            borderRadius: "8px",
            padding: "14px 18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.03)",
            height: "85px",
            boxSizing: "border-box",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
        }),
        cardTitle: {
            fontSize: "11px",
            fontWeight: "700",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: "0 0 8px 0"
        },
        cardValue: {
            fontSize: "26px",
            fontWeight: "800",
            color: "#1e293b",
            margin: "0",
            lineHeight: "1"
        },
        loadingContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            color: "#64748b",
            fontSize: "14px",
            fontFamily: "cambria"
        },
        spinner: {
            width: "30px",
            height: "30px",
            border: "3px solid #e2e8f0",
            borderTopColor: "#2563eb",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginBottom: "12px"
        }
    };

    // =========================
    // LOADING SKELETON UI
    // =========================
    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <style>
                    {`@keyframes spin { to { transform: rotate(360deg); } }`}
                </style>
                <div style={styles.spinner}></div>
                <p>Loading Enterprise Dashboard Analytics...</p>
            </div>
        );
    }

    // =========================
    // MAIN UI PRODUCTION FRAME
    // =========================
    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes spin { to { transform: rotate(360deg); } }
                    .admin-card-hover:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 12px -2px rgba(15, 23, 42, 0.08) !important;
                    }
                    @media (max-width: 1024px) {
                        .compact-grid {
                            grid-template-columns: repeat(2, 1fr) !important;
                        }
                    }
                    @media (max-width: 600px) {
                        .compact-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}
            </style>

            {/* DASHBOARD HEADER MODULE */}
            <div style={styles.headerZone}>
                <div>
                    <h1 style={styles.headerTitle}>Batch Dashboard</h1>
                    <p style={styles.headerSubtitle}>
                        Overview of your ongoing training batches and corporate system metrics.
                    </p>
                </div>
            </div>

            {/* COMPACT ADMIN-MATCHED BENTO STATS GRID */}
            <div className="compact-grid" style={styles.statsGrid}>
                
                {/* 1. TOTAL BATCHES */}
                <div className="admin-card-hover" style={styles.card("#2563eb")}>
                    <span style={styles.cardTitle}>Total Batches</span>
                    <h2 style={styles.cardValue}>{dashboard?.totalBatches || 0}</h2>
                </div>

                {/* 2. ONGOING BATCHES */}
                <div className="admin-card-hover" style={styles.card("#06b6d4")}>
                    <span style={styles.cardTitle}>Ongoing Batches</span>
                    <h2 style={styles.cardValue}>{dashboard?.ongoingBatches || 0}</h2>
                </div>

                {/* 3. UPCOMING BATCHES */}
                <div className="admin-card-hover" style={styles.card("#f59e0b")}>
                    <span style={styles.cardTitle}>Upcoming Batches</span>
                    <h2 style={styles.cardValue}>{dashboard?.upcomingBatches || 0}</h2>
                </div>

                {/* 4. COMPLETED BATCHES */}
                <div className="admin-card-hover" style={styles.card("#8b5cf6")}>
                    <span style={styles.cardTitle}>Completed Batches</span>
                    <h2 style={styles.cardValue}>{dashboard?.completedBatches || 0}</h2>
                </div>

            </div>
        </div>
    );
}