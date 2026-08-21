// src/batch/pages/CreateBatchPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // For Feature 2

import {
    createBatch,
    getActivePrograms,
    getAvailableTrainers,
    generateBatchCode
} from "../services/batchService";

import "../styles/createBatch.css";

export default function CreateBatchPage() {

    // =========================
    // DROPDOWN & QUERY PARAMS DATA
    // =========================
    const [programs, setPrograms] = useState([]);
    const [trainers, setTrainers] = useState([]);
    
    // Feature 2: Get programId from URL if navigated from Program List
    const [searchParams] = useSearchParams();
    const preselectedProgramId = searchParams.get("programId");

    // =========================
    // FORM STATE
    // =========================
    const [form, setForm] = useState({
        batchCode: "",
        personId: "",
        programId: preselectedProgramId || "", // Pre-fill if exists
        batchStatusId: "2",
        startDate: "",
        endDate: "",
        minStudents: 4,
        maxStudents: 12
    });

    // =========================
    // UI STATES
    // =========================
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState({
        type: "",
        text: ""
    });

    // =========================
    // HELPER: AUTOMATED END DATE CALCULATION
    // =========================
    const calculateEndDate = (startDate, durationValue, durationType) => {
    if (!startDate || !durationValue || !durationType) return "";

    const date = new Date(startDate);
    const value = Number(durationValue);

    switch (durationType.toUpperCase()) {

        case "DAY":
        case "DAYS":
            date.setDate(date.getDate() + value);
            break;

        case "WEEK":
        case "WEEKS":
            date.setDate(date.getDate() + (value * 7));
            break;

        case "MONTH":
        case "MONTHS":
            date.setMonth(date.getMonth() + value);
            break;

        case "YEAR":
        case "YEARS":
            date.setFullYear(date.getFullYear() + value);
            break;

        default:
            return "";
    }

    return date.toISOString().split("T")[0];
};

    // Helper to update end date based on selected program and start date
    const runDateCalculation = (progId, currentStartDate) => {
        if (!currentStartDate || !progId) return "";
        
        // Find the selected program metadata from our loaded list
        const selectedProg = programs.find(p => String(p.programId) === String(progId));
        
        if (selectedProg) {
            // Foolproof Fallback: checks durationValue first, then falls back to durationMonths, defaults to 0 if missing
            const durationValue = selectedProg.durationValue || selectedProg.durationMonths || 0;
            const durationType = selectedProg.durationType || "WEEK"; // Default fallback type

            if (durationValue > 0) {
                return calculateEndDate(
                    currentStartDate,
                    durationValue,
                    durationType
                );
            }
        }
        return "";
    };

    // =========================
    // LOAD INITIAL DATA
    // =========================
    const loadInitialData = async () => {
        try {
            const trainerResponse = await getAvailableTrainers();
            const programResponse = await getActivePrograms();

            setTrainers(trainerResponse.data || []);
            
            const fetchedPrograms = programResponse.data || [];
            setPrograms(fetchedPrograms);

            if (preselectedProgramId) {
                await autoGenerateBatchCode(preselectedProgramId);
            }

        } catch (error) {
            console.error("Dropdown Load Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // AUTO GENERATE BATCH CODE
    // =========================
    const autoGenerateBatchCode = async (programId) => {
        try {
            if (!programId) return;
            const response = await generateBatchCode(programId);
            setForm((prev) => ({
                ...prev,
                batchCode: response.data
            }));
        } catch (error) {
            console.error("Batch Code Error:", error);
        }
    };

    // =========================
    // HANDLE CHANGE
    // =========================
    const handleChange = async (e) => {
        const { name, value } = e.target;

        // Max Students Validation
        if (name === "maxStudents" && Number(value) > 12) {
            setStatusMessage({
                type: "error",
                text: "❌ Maximum students cannot exceed 12"
            });
            return;
        }

        // Min Students Validation
        if (name === "minStudents" && Number(value) < 4) {
            setStatusMessage({
                type: "error",
                text: "❌ Minimum students must be at least 4"
            });
            return;
        }

        setStatusMessage({ type: "", text: "" });

        // Calculate dynamic dates or batch code generation based on target fields
        let updatedEndDate = form.endDate;

        if (name === "programId") {
            await autoGenerateBatchCode(value);
            updatedEndDate = runDateCalculation(value, form.startDate);
        }

        if (name === "startDate") {
            updatedEndDate = runDateCalculation(form.programId, value);
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
            endDate: updatedEndDate // Dynamic allocation
        }));
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(form.minStudents) < 4) {
            setStatusMessage({ type: "error", text: "❌ Minimum students should be at least 4" });
            return;
        }
        if (Number(form.maxStudents) > 12) {
            setStatusMessage({ type: "error", text: "❌ Maximum students cannot exceed 12" });
            return;
        }
        if (Number(form.minStudents) > Number(form.maxStudents)) {
            setStatusMessage({ type: "error", text: "❌ Minimum students cannot exceed maximum students" });
            return;
        }

        setIsSubmitting(true);

        try {
            await createBatch(form);
            setStatusMessage({
                type: "success",
                text: `✅ Batch ${form.batchCode} created successfully`
            });

            // Reset form back to base setup
            setForm({
                batchCode: "",
                personId: "",
                programId: preselectedProgramId || "",
                batchStatusId: "2",
                startDate: "",
                endDate: "",
                minStudents: 4,
                maxStudents: 12
            });

            if (preselectedProgramId) {
                await autoGenerateBatchCode(preselectedProgramId);
            }

        } catch (error) {
            console.error("Create Batch Error:", error);
            setStatusMessage({ type: "error", text: "❌ Failed to create batch" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // =========================
    // USE EFFECT
    // =========================
    useEffect(() => {
        loadInitialData();
    }, []);

    // Handles subsequent date recalculation if programs finish loading after form state initializes
    useEffect(() => {
        if (form.programId && form.startDate && programs.length > 0) {
            const calculated = runDateCalculation(form.programId, form.startDate);
            setForm(prev => ({ ...prev, endDate: calculated }));
        }
    }, [programs, form.programId, form.startDate]);

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="create-batch-container">
                <h2>Loading Form...</h2>
            </div>
        );
    }

    // =========================
    // UI RENDER
    // =========================
    return (
        <div className="create-batch-container">
            {/* HEADER */}
            <div className="form-header-zone">
                <h1>Create New Batch</h1>
                <p className="form-subtitle">Create and configure training batches</p>
            </div>

            {/* STATUS */}
            {statusMessage.text && (
                <div className={`form-status-alert ${statusMessage.type}`}>
                    {statusMessage.text}
                </div>
            )}

            {/* FORM */}
            <div className="form-card-wrapper">
                <form onSubmit={handleSubmit} className="enterprise-form">
                    <div className="form-fields-grid">

                        {/* BATCH CODE */}
                        <div className="form-group full-width">
                            <label>Auto Generated Batch Code</label>
                            <input
                                type="text"
                                name="batchCode"
                                value={form.batchCode}
                                placeholder="Select Program First"
                                readOnly
                            />
                        </div>

                        {/* PROGRAM DROPDOWN */}
                        <div className="form-group">
                            <label>Select Program</label>
                            <select
                                name="programId"
                                value={form.programId}
                                onChange={handleChange}
                                disabled={!!preselectedProgramId} // Disables if accessed via shortcut
                                required
                            >
                                <option value="">Select Program</option>
                                {Array.isArray(programs) &&
                                    programs.map((program) => (
                                        <option key={program.programId} value={program.programId}>
                                            {program.programName}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* TRAINER */}
                        <div className="form-group">
                            <label>Select Trainer</label>
                            <select
                                name="personId"
                                value={form.personId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Trainer</option>
                                {Array.isArray(trainers) &&
                                    trainers.map((trainer) => (
                                        <option
    key={trainer.trainerPersonId}
    value={trainer.trainerPersonId}
>
    {trainer.trainerName}
</option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* START DATE */}
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* END DATE (READONLY VIA AUTOMATION) */}
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate || ""} 
                                readOnly={true}            
                                required
                                style={{ backgroundColor: "#f4f6f9", cursor: "not-allowed", color: "#333" }} 
                            />
                            {form.startDate && form.programId && (
                                <div className="auto-date-badge">
                                    Calculated automatically based on Program Duration
                                </div>
                            )}
                        </div>

                        {/* MIN STUDENTS */}
                        <div className="form-group">
                            <label>Minimum Students</label>
                            <input
                                type="number"
                                name="minStudents"
                                value={form.minStudents}
                                onChange={handleChange}
                                min="4"
                                max="12"
                                required
                            />
                        </div>

                        {/* MAX STUDENTS */}
                        <div className="form-group">
                            <label>Maximum Students</label>
                            <input
                                type="number"
                                name="maxStudents"
                                value={form.maxStudents}
                                onChange={handleChange}
                                min="4"
                                max="12"
                                required
                            />
                        </div>

                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="form-actions-footer">
                        <button
                            type="submit"
                            className="submit-form-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating Batch..." : "Create Batch"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}