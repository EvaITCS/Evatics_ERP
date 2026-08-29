import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    createBatch,
    getActivePrograms,
    getAvailableTrainers,
    generateBatchCode
} from "../services/batchService";

import "../styles/createBatch.css";
import { useToast } from "../../shared/components/ToastContext";
export default function CreateBatchPage() {
    const { showToast } = useToast();
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
        
        const selectedProg = programs.find(p => String(p.programId) === String(progId));
        
        if (selectedProg) {
            const durationValue = selectedProg.durationValue || selectedProg.durationMonths || 0;
            const durationType = selectedProg.durationType || "WEEK";

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
           showToast("Maximum students cannot exceed 12", "error");
            return;
        }

        // Min Students Validation
        if (name === "minStudents" && Number(value) < 4) {
          showToast("Minimum students must be at least 4", "error");
            return;
        }

       

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
            endDate: updatedEndDate
        }));
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

      if (Number(form.minStudents) < 4) {
    showToast("Minimum students should be at least 4", "error");
    return;
}

if (Number(form.maxStudents) > 12) {
    showToast("Maximum students cannot exceed 12", "error");
    return;
}

if (Number(form.minStudents) > Number(form.maxStudents)) {
    showToast(
        "Minimum students cannot exceed maximum students",
        "error"
    );
    return;
}

        setIsSubmitting(true);

        try {
            await createBatch(form);
           showToast(
    `Batch ${form.batchCode} created successfully`,
    "success"
);

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
         showToast("Failed to create batch", "error");
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
                <div className="form-card-wrapper">
                    <h2>Loading Form...</h2>
                </div>
            </div>
        );
    }

    // =========================
    // UI RENDER
    // =========================
    return (
        <div className="create-batch-container">

      

            {/* FORM CARD WRAPPER */}
            <div className="form-card-wrapper">

                {/* HEADER INSIDE CARD TO MATCH PROGRAM FORM EXACT REPLICA */}
                <h1 className="form-title">Create New Batch</h1>

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
                                disabled
                            />
                        </div>

                        {/* PROGRAM DROPDOWN */}
                        <div className="form-group">
                            <label>Select Program</label>
                            <select
                                name="programId"
                                value={form.programId}
                                onChange={handleChange}
                                disabled={!!preselectedProgramId}
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

                        {/* END DATE */}
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate || ""}
                                readOnly={true}
                                disabled
                                required
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