import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getBatchDetails,
    updateBatch,
    getActivePrograms,
    getAvailableTrainersForEdit,
    getAllTrainers
} from "../services/batchService";

import "../styles/editBatch.css";

export default function EditBatchPage() {

    // =========================
    // ROUTER
    // =========================

    const { batchId } = useParams();
    const navigate = useNavigate();

    // =========================
    // STATES
    // =========================

    const [loading, setLoading] = useState(true);
    const [programs, setPrograms] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    const [form, setForm] = useState({
        batchName: "",
        trainerId: "",
        programId: "",
        batchStatusId: "",
        startDate: "",
        endDate: "",
        maxStudents: 12
    });

    // =========================
    // DATE CALCULATION FUNCTIONS
    // =========================

    const calculateEndDate = (startDate, durationValue, durationType) => {

        if (!startDate || !durationValue || !durationType) {
            return "";
        }

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

    const runDateCalculation = (programId, startDate) => {
        if (!programId || !startDate) {
            return "";
        }

        const selectedProgram = programs.find(
            p => String(p.programId) === String(programId)
        );

        if (!selectedProgram) {
            return "";
        }

        const durationValue = Number(
            selectedProgram.durationValue ??
            selectedProgram.durationMonths ??
            0
        );

        const durationType = selectedProgram.durationType || "WEEK";

        return calculateEndDate(startDate, durationValue, durationType);
    };

    // =========================
    // INITIAL LOAD
    // =========================

    const loadData = async () => {
        try {
            setLoading(true);

            const [
                batchResponse,
                trainerResponse,
                programResponse
            ] = await Promise.all([
                getBatchDetails(batchId),
                getAvailableTrainersForEdit(batchId),
                getActivePrograms()
            ]);

            const batch = batchResponse.data;

            console.log(programResponse.data);

            console.log("EDIT BATCH DATA:", batch);

            setPrograms(programResponse.data || []);
            setTrainers(trainerResponse.data || []);

            setForm({
                batchName: batch.batchName || "",
                trainerId: batch.personId || "",
                programId: batch.programId || "",
                batchStatusId: batch.batchStatusId || "",
                startDate: batch.startDate || "",
                endDate: batch.endDate || "",
                maxStudents: batch.maxStudents || 12
            });

        } catch (error) {
            console.error("Edit Load Error:", error);
            alert("Failed to load batch details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [batchId]);

    // =========================
    // INITIAL LOAD / DEPENDENCY RECALCULATION
    // =========================

    useEffect(() => {
        if (form.programId && form.startDate && programs.length > 0) {
            const calculatedDate = runDateCalculation(
                form.programId,
                form.startDate
            );
            setForm(prev => ({
                ...prev,
                endDate: calculatedDate
            }));
        }
    }, [programs, form.programId, form.startDate]);

    // =========================
    // HANDLE CHANGE (STEP 3)
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        // =====================
        // MAX STUDENT FIX
        // =====================

        if (name === "maxStudents") {
            let number = Number(value);

            // Empty value
            if (value === "") {
                setForm((prev) => ({
                    ...prev,
                    maxStudents: ""
                }));
                return;
            }

            // Max limit
            if (number > 12) {
                number = 12;
            }

            // Min limit
            if (number < 4) {
                number = 4;
            }

            setForm((prev) => ({
                ...prev,
                maxStudents: number
            }));
            return;
        }

        // =====================
        // NORMAL FIELDS & AUTO DATE CALCULATION
        // =====================

        let updatedEndDate = form.endDate;

        if (name === "programId") {
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

        console.log("FORM DATA:", form);

        try {
            setIsUpdating(true);

            const payload = {
                batchName: form.batchName,
                personId: form.trainerId,
                programId: form.programId,
                batchStatusId: form.batchStatusId,
                startDate: form.startDate,
                endDate: form.endDate,
                maxStudents: form.maxStudents
            };

            console.log("UPDATE PAYLOAD", payload);

            await updateBatch(batchId, payload);

            alert("Batch updated successfully");
            navigate(`/admin/batches/details/${batchId}`);
        } catch (error) {
            console.error("Update Error:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="edit-batch-page">
                <div className="edit-loading">
                    <h2>Loading Batch...</h2>
                </div>
            </div>
        );
    }

    // =========================
    // UI
    // =========================

    return (
        <div className="edit-batch-page">

            {/* HEADER */}
            <div className="edit-header">
                <div>
                    <h1>Edit Batch</h1>
                    <p>Update batch details and trainer assignment</p>
                </div>
                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

            {/* CARD */}
            <div className="edit-card">
                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="edit-grid">

                        {/* BATCH NAME */}
                        <div className="form-group">
                            <label>Batch Name</label>
                            <input
                                type="text"
                                name="batchName"
                                value={form.batchName}
                                readOnly
                                className="readonly-input"
                            />
                        </div>

                        {/* PROGRAM */}
                        <div className="form-group">
                            <label>Program</label>
                            <select
                                name="programId"
                                value={form.programId}
                                onChange={handleChange}
                            >
                                {programs.map((program) => (
                                    <option
                                        key={program.programId}
                                        value={program.programId}
                                    >
                                        {program.programName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* TRAINER */}
                        <div className="form-group">
                            <label>Trainer</label>
                            <select
                                name="trainerId"
                                value={form.trainerId}
                                onChange={handleChange}
                            >
                                {trainers.map((trainer) => (
                                    <option
                                        key={trainer.trainerPersonId}
                                        value={trainer.trainerPersonId}
                                    >
                                        {trainer.trainerName}
                                    </option>
                                ))}
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
                            />
                        </div>

                        {/* END DATE (STEP 5) */}
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate || ""}
                                readOnly
                                style={{
                                    backgroundColor: "#f4f6f9",
                                    cursor: "not-allowed"
                                }}
                            />
                        </div>

                        {/* MAX STUDENTS */}
                        <div className="form-group">
                            <label>Max Students</label>
                            <input
                                type="number"
                                name="maxStudents"
                                value={form.maxStudents}
                                onChange={handleChange}
                                min="4"
                                max="12"
                            />
                            <small>
                                Allowed range: 4 to 12 students
                            </small>
                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="edit-actions">
                        <button
                            type="submit"
                            className="update-btn"
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Updating..." : "Update Batch"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}