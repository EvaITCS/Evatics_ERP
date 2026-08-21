// src/batch/pages/BatchListPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import BatchTable from "../components/BatchTable"; // Handled inline below for architecture safety
import EmptyBatchState from "../components/EmptyBatchState";
import { getAllBatches } from "../services/batchService";
import "../styles/batchTable.css";
import { FiSearch } from "react-icons/fi";
export default function BatchListPage() {
    // =========================
    // NAVIGATION
    // =========================
    const navigate = useNavigate();

    // =========================
    // STATES
    // =========================
    const [batches, setBatches] = useState([]);
    const [filteredBatches, setFilteredBatches] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("ALL");

    // =========================
    // LOAD BATCHES
    // =========================
    const loadBatches = async () => {
        try {
            setLoading(true);
            const response = await getAllBatches();
            console.log("BATCH API RESPONSE:", response);

            const batchData = Array.isArray(response)
                ? response
                : Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.content)
                        ? response.content
                        : [];

            setBatches(batchData);
            setFilteredBatches(batchData);
        } catch (error) {
            console.error("Error loading batches:", error);
            setBatches([]);
            setFilteredBatches([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        loadBatches();
    }, []);

    // =========================
    // FILTER LOGIC
    // =========================
    useEffect(() => {
        let filtered = [...batches];

        // SEARCH
        if (search) {
            filtered = filtered.filter((batch) =>
                batch.batchCode?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // STATUS FILTER
        if (selectedFilter !== "ALL") {
            filtered = filtered.filter((batch) => {
                const status = batch.status?.toUpperCase();
                return status === selectedFilter;
            });
        }

        setFilteredBatches(filtered);
    }, [search, selectedFilter, batches]);

    const handleViewDetails = (batchId) => {
        navigate(`/admin/batches/details/${batchId}`);
    };

    const handleManageClasses = (batchId) => {
        navigate(`/admin/batches/batch-classes/${batchId}`);
    };

    // =========================
    // UI
    // =========================
    return (

        <div className="batch-page-content">

            {/* HEADER ZONE */}
            <div
            >
                <h1>Batch Management</h1>
            </div>

            {/* TOOLS BAR (SEARCH & FILTERS) */}
            <div className="batch-list-tools">

                {/* SEARCH INTERFACE */}
                <div className="local-search-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search batch code..."
                    />
                </div>

                {/* SEGMENTED TAB FILTERS */}
                <div className="batch-filter-buttons">
                    <button
                        className={selectedFilter === "ALL" ? "active-filter" : ""}
                        onClick={() => setSelectedFilter("ALL")}
                    >
                        All Batches
                    </button>

                    <button
                        className={selectedFilter === "ONGOING" ? "active-filter" : ""}
                        onClick={() => setSelectedFilter("ONGOING")}
                    >
                        Ongoing
                    </button>

                    <button
                        className={selectedFilter === "UPCOMING" ? "active-filter" : ""}
                        onClick={() => setSelectedFilter("UPCOMING")}
                    >
                        Upcoming
                    </button>

                    <button
                        className={selectedFilter === "COMPLETED" ? "active-filter" : ""}
                        onClick={() => setSelectedFilter("COMPLETED")}
                    >
                        Completed
                    </button>
                </div>

            </div>

            {/* MAIN GRID BODY LAYER */}
            {loading ? (
                <div className="table-loading-skeleton">
                    <h3>Loading batches...</h3>
                </div>
            ) : filteredBatches.length === 0 ? (
                <EmptyBatchState />
            ) : (
                <div className="batch-table-container"
                     style={{
                         borderTop: "4px solid #2563eb",
                         borderRadius: "12px",
                         overflow: "hidden",
                         boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)"
                     }}
                >
                    <table className="batch-table">
                        <thead>
                        <tr>
                            <th>Batch Code</th>
                            <th>Batch Name</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th >Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredBatches.map((batch) => (
                            <tr key={batch.batchId}>
                                <td>{batch.batchCode}</td>
                                <td>{batch.batchName || "-"}</td>

                                <td>{batch.currentStrength || 0}</td>
                                <td>
                                            <span
                                                className={`status-badge ${
                                                    batch.status
                                                        ? batch.status.toLowerCase()
                                                        : "available"
                                                }`}
                                            >
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