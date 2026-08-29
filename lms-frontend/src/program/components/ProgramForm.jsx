import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    createProgram,
    getProgramById,
    updateProgram
} from "../services/programService";

import { validateProgram } from "../utils/programValidation";

import { useToast } from "../../shared/components/ToastContext";

export default function ProgramForm() {

    const { programId } = useParams();
    const navigate = useNavigate();

    const { showToast } = useToast();

    const isEditMode = !!programId;

    const generateProgramCode = () => {
        return "PRG-" + Date.now();
    };

    const [form, setForm] = useState({
        programName: "",
        programCode: "",
        durationValue: "",
        durationType: "WEEK",
        description: "",
        isActive: true
    });

    useEffect(() => {

        if (isEditMode) {
            loadProgram(programId);
        } else {
            setForm((prev) => ({
                ...prev,
                programCode: generateProgramCode()
            }));
        }

    }, [programId, isEditMode]);

    const loadProgram = async (id) => {

        try {

            const response = await getProgramById(id);

            setForm({
                programName: response.data.programName || "",
                programCode: response.data.programCode || "",
                durationValue: response.data.durationValue || "",
                durationType: response.data.durationType || "WEEK",
                description: response.data.description || "",
                isActive: response.data.isActive ?? true
            });

        } catch (error) {

            console.error(error);

            showToast("Failed To Load Program", "error");
        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const validation = validateProgram(form);

        if (!validation.valid) {

            showToast(validation.message, "error");

            return;
        }

        try {

            if (isEditMode) {

                await updateProgram(programId, form);

                showToast("Program Updated Successfully", "success");

                navigate("/admin/programs");

            } else {

                await createProgram(form);

                showToast("Program Created Successfully", "success");

                setForm({
                    programName: "",
                    programCode: generateProgramCode(),
                    durationValue: "",
                    durationType: "WEEK",
                    description: "",
                    isActive: true
                });
            }

        } catch (error) {

            console.error(error);
            console.error(error.response?.data);

            showToast(
                error.response?.data?.message ||
                error.response?.data ||
                (
                    isEditMode
                        ? "Failed To Update Program"
                        : "Failed To Create Program"
                ),
                "error"
            );
        }
    };


    // =========================================================
    // INLINE STYLES
    // =========================================================

    const pageWrapperStyle = {
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        boxSizing: "border-box"
    };

    const formStyle = {
        width: "100%",
        maxWidth: "800px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderTop: "5px solid #2563eb",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        boxSizing: "border-box",
        overflow: "hidden",
        margin: "0"
    };

    const headerStyle = {
        width: "100%",
        padding: "22px 30px 18px",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        boxSizing: "border-box"
    };

    const headingStyle = {
        margin: "0",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI , Roboto, Helvetica, Arial, sans-serif",
        fontSize: "24px",
        fontWeight: "700",
        color: "#0f172a",
        lineHeight: "1.3"
    };

    const fieldsContainerStyle = {
        width: "100%",
        padding: "26px 30px 28px",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        columnGap: "26px",
        rowGap: "20px",
        boxSizing: "border-box"
    };

    const fieldStyle = {
        width: "100%",
        minWidth: "0",
        boxSizing: "border-box"
    };

    const labelStyle = {
        display: "block",
        marginBottom: "7px",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        fontSize: "14px",
        fontWeight: "600",
        color: "#0f172a",
        lineHeight: "1.4"
    };

    const inputStyle = {
        width: "100%",
        height: "42px",
        padding: "0 12px",
        boxSizing: "border-box",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        fontSize: "14px",
        fontWeight: "400",
        outline: "none"
    };

    const disabledInputStyle = {
        ...inputStyle,
        backgroundColor: "#f8fafc",
        color: "#64748b",
        cursor: "not-allowed",
        borderColor: "#e2e8f0"
    };

    const selectStyle = {
        ...inputStyle,
        cursor: "pointer",
        appearance: "auto"
    };

    const descriptionFieldStyle = {
        ...fieldStyle,
        gridColumn: "1 / -1"
    };

    const textareaStyle = {
        width: "100%",
        minHeight: "115px",
        height: "115px",
        padding: "12px",
        boxSizing: "border-box",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "1.5",
        outline: "none",
        resize: "vertical"
    };

    const actionsStyle = {
        width: "100%",
        padding: "0 30px 28px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        boxSizing: "border-box"
    };

    const buttonStyle = {
        minWidth: "145px",
        height: "42px",
        padding: "0 20px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
    };


    return (

        <div style={pageWrapperStyle}>

            <form
                onSubmit={handleSubmit}
                style={formStyle}
            >

                {/* =================================================
                    FORM HEADER
                ================================================= */}

                <div style={headerStyle}>

                    <h3 style={headingStyle}>
                        {isEditMode
                            ? "Edit Program"
                            : "Create Program"
                        }
                    </h3>

                </div>


                {/* =================================================
                    FORM BODY
                ================================================= */}

                <div style={fieldsContainerStyle}>

                    {/* =================================================
                        PROGRAM NAME
                    ================================================= */}

                    <div style={fieldStyle}>

                        <label
                            htmlFor="programName"
                            style={labelStyle}
                        >
                            Program Name
                        </label>

                        <input
                            id="programName"
                            type="text"
                            name="programName"
                            placeholder="e.g. Full Stack Java Development"
                            value={form.programName}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                    </div>


                    {/* =================================================
                        PROGRAM CODE
                    ================================================= */}

                    <div style={fieldStyle}>

                        <label
                            htmlFor="programCode"
                            style={labelStyle}
                        >
                            Program Code
                        </label>

                        <input
                            id="programCode"
                            type="text"
                            name="programCode"
                            placeholder="Auto generated program code"
                            value={form.programCode}
                            disabled
                            style={disabledInputStyle}
                        />

                    </div>


                    {/* =================================================
                        DURATION
                    ================================================= */}

                    <div style={fieldStyle}>

                        <label
                            htmlFor="durationValue"
                            style={labelStyle}
                        >
                            Duration
                        </label>

                        <input
                            id="durationValue"
                            type="number"
                            name="durationValue"
                            placeholder="e.g. 12"
                            value={form.durationValue}
                            onChange={handleChange}
                            min="1"
                            required
                            style={inputStyle}
                        />

                    </div>


                    {/* =================================================
                        DURATION TYPE
                    ================================================= */}

                    <div style={fieldStyle}>

                        <label
                            htmlFor="durationType"
                            style={labelStyle}
                        >
                            Duration Type
                        </label>

                        <select
                            id="durationType"
                            name="durationType"
                            value={form.durationType}
                            onChange={handleChange}
                            style={selectStyle}
                        >

                            <option value="DAY">
                                Days
                            </option>

                            <option value="WEEK">
                                Weeks
                            </option>

                            <option value="MONTH">
                                Months
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        PROGRAM DESCRIPTION
                    ================================================= */}

                    <div style={descriptionFieldStyle}>

                        <label
                            htmlFor="description"
                            style={labelStyle}
                        >
                            Program Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            placeholder="e.g. Comprehensive training program covering Core Java, Spring Boot, React, REST APIs and MySQL."
                            value={form.description}
                            onChange={handleChange}
                            style={textareaStyle}
                        />

                    </div>

                </div>


                {/* =================================================
                    FORM ACTION
                ================================================= */}

                <div style={actionsStyle}>

                    <button
                        type="submit"
                        style={buttonStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#1d4ed8";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#2563eb";
                        }}
                    >

                        {isEditMode
                            ? "Save Changes"
                            : "Create Program"
                        }

                    </button>

                </div>

            </form>

        </div>
    );
}