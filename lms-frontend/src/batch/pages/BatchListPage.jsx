import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyBatchState from "../components/EmptyBatchState";
import { getAllBatches } from "../services/batchService";
import "../styles/batchTable.css";
import { FiSearch } from "react-icons/fi";

export default function BatchListPage() {
    const navigate = useNavigate();

    // =========================
    // STATES
    // =========================
    const [batches, setBatches] = useState([]);
    const [filteredBatches, setFilteredBatches] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("ALL");

    // Dynamic Summary Counters
    const [stats, setStats] = useState({
        total: 0,
        ongoing: 0,
        upcoming: 0,
        completed: 0
    });

    // Dynamic title rendering based on filter
    const getSectionTitle = () => {
        if (selectedFilter === "ONGOING") return "Ongoing Batches";
        if (selectedFilter === "UPCOMING") return "Upcoming / Available Batches";
        if (selectedFilter === "COMPLETED") return "Completed Batches";
        return "All Enrolled Batches";
    };

    // =========================
    // LOAD BATCHES
    // =========================
    const loadBatches = async () => {
        try {
            setLoading(true);
            const response = await getAllBatches();

            const batchData = Array.isArray(response)
                ? response
                : Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.content)
                        ? response.content
                        : [];

            setBatches(batchData);
            setFilteredBatches(batchData);
            calculateStats(batchData);
        } catch (error) {
            console.error("Error loading batches:", error);
            setBatches([]);
            setFilteredBatches([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate dynamic badge counts
    const calculateStats = (data) => {
        const counts = {
            total: data.length,
            ongoing: 0,
            upcoming: 0,
            completed: 0
        };

        data.forEach((batch) => {
            const status = batch.status?.toUpperCase();
            if (status === "ONGOING") counts.ongoing += 1;
            else if (status === "UPCOMING" || status === "AVAILABLE") counts.upcoming += 1;
            else if (status === "COMPLETED") counts.completed += 1;
        });

        setStats(counts);
    };

    useEffect(() => {
        loadBatches();
    }, []);

    // =========================
    // FILTER LOGIC
    // =========================
    useEffect(() => {
        let filtered = [...batches];

        if (search) {
            filtered = filtered.filter((batch) =>
                batch.batchCode?.toLowerCase().includes(search.toLowerCase()) ||
                batch.batchName?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedFilter !== "ALL") {
            filtered = filtered.filter((batch) => {
                const status = batch.status?.toUpperCase();
                if (selectedFilter === "UPCOMING") {
                    return status === "UPCOMING" || status === "AVAILABLE";
                }
                return status === selectedFilter;
            });
        }

        setFilteredBatches(filtered);
    }, [search, selectedFilter, batches]);

    const handleViewDetails = (batchId) => {
        navigate(`/admin/batches/details/${batchId}`);
    };

    return (
        <div className="batch-page-content">

            {/* HEADER ZONE */}
            <div className="batch-page-header">
                <h1>Batch Management</h1>
            </div>

            {/* TOP METRICS / SUMMARY STATS (4 DIBBE) */}
            <div className="batch-stats-grid">
                <div 
                    className={`stat-card total ${selectedFilter === "ALL" ? "active-stat" : ""}`}
                    onClick={() => setSelectedFilter("ALL")}
                >
                    <span className="stat-label">TOTAL BATCHES</span>
                    <div className="stat-value-row">
                        <span className="stat-number">{stats.total}</span>
                        {selectedFilter === "ALL" && <span className="stat-badge">• Active View</span>}
                    </div>
                </div>

                <div 
                    className={`stat-card ongoing ${selectedFilter === "ONGOING" ? "active-stat" : ""}`}
                    onClick={() => setSelectedFilter("ONGOING")}
                >
                    <span className="stat-label">ONGOING BATCHES</span>
                    <div className="stat-value-row">
                        <span className="stat-number">{stats.ongoing}</span>
                        {selectedFilter === "ONGOING" ? (
                            <span className="stat-badge">• Active View</span>
                        ) : (
                            <span className="stat-action-link">Click to filter</span>
                        )}
                    </div>
                </div>

                <div 
                    className={`stat-card upcoming ${selectedFilter === "UPCOMING" ? "active-stat" : ""}`}
                    onClick={() => setSelectedFilter("UPCOMING")}
                >
                    <span className="stat-label">UPCOMING BATCHES</span>
                    <div className="stat-value-row">
                        <span className="stat-number">{stats.upcoming}</span>
                        {selectedFilter === "UPCOMING" ? (
                            <span className="stat-badge">• Active View</span>
                        ) : (
                            <span className="stat-action-link">Click to filter</span>
                        )}
                    </div>
                </div>

                <div 
                    className={`stat-card completed ${selectedFilter === "COMPLETED" ? "active-stat" : ""}`}
                    onClick={() => setSelectedFilter("COMPLETED")}
                >
                    <span className="stat-label">COMPLETED BATCHES</span>
                    <div className="stat-value-row">
                        <span className="stat-number">{stats.completed}</span>
                        {selectedFilter === "COMPLETED" ? (
                            <span className="stat-badge">• Active View</span>
                        ) : (
                            <span className="stat-action-link">Click to filter</span>
                        )}
                    </div>
                </div>
            </div>

            {/* TITLE & SEARCH TOOLS ROW */}
            <div className="batch-section-header">
                <div className="section-title-wrapper">
                    <h2>{getSectionTitle()}</h2>
                </div>
                
                <div className="batch-list-right-tools">
                    <span className="showing-entries-text">
                        Showing <strong>{filteredBatches.length}</strong> entries
                    </span>
                    <div className="local-search-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search batch..."
                        />
                    </div>
                </div>
            </div>

            {/* MAIN DATA TABLE / EMPTY DASHED BOX */}
            {loading ? (
                <div className="table-loading-skeleton">
                    <h3>Loading batches...</h3>
                </div>
            ) : filteredBatches.length === 0 ? (
                <EmptyBatchState />
            ) : (
                <div className="batch-table-container">
                    <table className="batch-table">
                        <thead>
                            <tr>
                                <th>Batch Code</th>
                                <th>Batch Name</th>
                                <th>Students</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBatches.map((batch) => (
                                <tr key={batch.batchId}>
                                    <td className="batch-code-cell">{batch.batchCode}</td>
                                    <td className="batch-name-cell">{batch.batchName || "-"}</td>
                                    <td>{batch.currentStrength || 0}</td>
                                    <td>
                                        <span className={`status-badge ${(batch.status || "AVAILABLE").toLowerCase()}`}>
                                            {batch.status || "AVAILABLE"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-action-group">
                                            <button
                                                className="table-action-view-btn"
                                                onClick={() => handleViewDetails(batch.batchId)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}