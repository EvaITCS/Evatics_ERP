import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    createProgram,
    getProgramById,
    updateProgram
} from "../services/programService";
import { validateProgram } from "../utils/programValidation";
import "../styles/program.css";

export default function ProgramForm() {
    const { programId } = useParams();
    const navigate = useNavigate();
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
    }, [programId]);

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
            console.log(error);
            alert("Failed To Load Program");
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateProgram(form);

        if (!validation.valid) {
            alert(validation.message);
            return;
        }

        try {
            if (isEditMode) {
                await updateProgram(programId, form);

                alert("Program Updated Successfully");
                navigate("/admin/programs");
            } else {
                await createProgram(form);

                alert("Program Created Successfully");

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
            console.log(error);
            console.log(error.response?.data);

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                (isEditMode
                    ? "Failed To Update Program"
                    : "Failed To Create Program")
            );
        }
    };

    return (
        <form className="program-form" onSubmit={handleSubmit}>

            <input
                type="text"
                name="programName"
                placeholder="Program Name"
                value={form.programName}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="programCode"
                value={form.programCode}
                disabled
            />

            <input
                type="number"
                name="durationValue"
                placeholder="Duration"
                value={form.durationValue}
                onChange={handleChange}
                min="1"
                required
            />

            <select
                name="durationType"
                value={form.durationType}
                onChange={handleChange}
            >
                <option value="DAY">Days</option>
                <option value="WEEK">Weeks</option>
                <option value="MONTH">Months</option>
            </select>

            <textarea
                name="description"
                placeholder="Program Description"
                value={form.description}
                onChange={handleChange}
            />

            <button type="submit">
                {isEditMode ? "Save Changes" : "Create Program"}
            </button>

        </form>
    );
}