import React, {
    useEffect,
    useState
} from "react";
import { useToast } from "../../shared/components/ToastContext";
import employeeLeaveService
    from "../services/employeeLeaveService";

import leaveTypeService
    from "../services/leaveTypeService";

import PageTitle
    from "../../shared/components/PageTitle";

import "../styles/employee.css";


function ApplyLeavePage() {

    // =====================================================
    // PERSON ID
    // =====================================================

    const personId =
        localStorage.getItem("personId");

    const { showToast } = useToast();
    // =====================================================
    // STATE
    // =====================================================

    const [
        leaveTypes,
        setLeaveTypes
    ] = useState([]);


    const [
        loadingLeaveTypes,
        setLoadingLeaveTypes
    ] = useState(true);


    const [
        submitting,
        setSubmitting
    ] = useState(false);


    const [
        formData,
        setFormData
    ] = useState({

        personId:
            personId || "",

        leaveTypeId: "",

        startDate: "",

        endDate: "",

        reason: ""
    });


    // =====================================================
    // LOAD LEAVE TYPES
    // =====================================================

    useEffect(() => {

        fetchLeaveTypes();

    }, []);


    const fetchLeaveTypes =
        async () => {

            try {

                setLoadingLeaveTypes(true);


                const response =
                    await leaveTypeService
                        .getAllLeaveTypes();


                setLeaveTypes(
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load leave types:",
                    error
                );

                console.error(
                    "SERVER RESPONSE:",
                    error?.response?.data
                );

                setLeaveTypes([]);

            } finally {

                setLoadingLeaveTypes(false);

            }
        };


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange =
        (e) => {

            const {
                name,
                value
            } = e.target;


            setFormData(
                previous => ({

                    ...previous,

                    [name]: value

                })
            );
        };


    // =====================================================
    // VALIDATE DATES
    // =====================================================

    const validateDates =
        () => {

            if (
                !formData.startDate ||
                !formData.endDate
            ) {

                return true;
            }


            const start =
                new Date(
                    formData.startDate
                );


            const end =
                new Date(
                    formData.endDate
                );


            if (end < start) {

                showToast(
                    "End date cannot be before start date.",
                    "error"
                );

                return false;
            }


            return true;
        };


    // =====================================================
    // SUBMIT LEAVE
    // =====================================================

    const handleSubmit =
        async (e) => {

            e.preventDefault();


            // =================================================
            // PERSON ID CHECK
            // =================================================

            if (!personId) {

                showToast(
                    "Person ID not found. Please login again.",
                    "error"
                );

                return;
            }


            // =================================================
            // DATE VALIDATION
            // =================================================

            if (!validateDates()) {

                return;
            }


            // =================================================
            // REQUEST PAYLOAD
            // =================================================

            const payload = {

                personId:
                    Number(personId),

                leaveTypeId:
                    Number(
                        formData.leaveTypeId
                    ),

                startDate:
                formData.startDate,

                endDate:
                formData.endDate,

                reason:
                    formData.reason.trim()
            };


            // =================================================
            // SUBMIT
            // =================================================

            try {

                setSubmitting(true);


                await employeeLeaveService
                    .applyLeave(
                        payload
                    );


                showToast(
                    "Leave Applied Successfully",
                    "success"
                );

                // =================================================
                // RESET FORM
                // =================================================

                setFormData({

                    personId:
                    personId,

                    leaveTypeId: "",

                    startDate: "",

                    endDate: "",

                    reason: ""

                });


            } catch (error) {

                console.error(
                    "Failed to apply leave:",
                    error
                );


                console.error(
                    "SERVER RESPONSE:",
                    error?.response?.data
                );


                const message =
                    error?.response?.data?.message
                    ||
                    error?.response?.data
                    ||
                    "Failed To Apply Leave";


                showToast(
                    message,
                    "error"
                );

            } finally {

                setSubmitting(false);

            }
        };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="apply-leave-page">


            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}

            <div className="page-header">

                <PageTitle
                    title="Apply Leave"
                />

            </div>


            {/* ================================================= */}
            {/* FORM */}
            {/* ================================================= */}

            <form
                className="employee-form"
                onSubmit={handleSubmit}
            >


                {/* ================================================= */}
                {/* LEAVE TYPE */}
                {/* ================================================= */}

                <div className="form-group">

                    <label htmlFor="leaveTypeId">

                        Leave Type

                    </label>


                    <select
                        id="leaveTypeId"
                        name="leaveTypeId"
                        value={
                            formData.leaveTypeId
                        }
                        onChange={
                            handleChange
                        }
                        required
                        disabled={
                            loadingLeaveTypes ||
                            submitting
                        }
                    >

                        <option value="">

                            {
                                loadingLeaveTypes
                                    ? "Loading Leave Types..."
                                    : "Select Leave Type"
                            }

                        </option>


                        {leaveTypes.map(
                            (leaveType) => (

                                <option
                                    key={
                                        leaveType.leaveTypeId
                                    }
                                    value={
                                        leaveType.leaveTypeId
                                    }
                                >

                                    {
                                        leaveType.leaveTypeName
                                    }

                                    {
                                        leaveType.isPaid
                                            ? " (Paid)"
                                            : " (Unpaid)"
                                    }

                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* ================================================= */}
                {/* START DATE */}
                {/* ================================================= */}

                <div className="form-group">

                    <label htmlFor="startDate">

                        Start Date

                    </label>


                    <input
                        id="startDate"
                        type="date"
                        name="startDate"
                        value={
                            formData.startDate
                        }
                        onChange={
                            handleChange
                        }
                        min={
                            new Date()
                                .toISOString()
                                .split("T")[0]
                        }
                        required
                        disabled={
                            submitting
                        }
                    />

                </div>


                {/* ================================================= */}
                {/* END DATE */}
                {/* ================================================= */}

                <div className="form-group">

                    <label htmlFor="endDate">

                        End Date

                    </label>


                    <input
                        id="endDate"
                        type="date"
                        name="endDate"
                        value={
                            formData.endDate
                        }
                        onChange={
                            handleChange
                        }
                        min={
                            formData.startDate
                            ||
                            new Date()
                                .toISOString()
                                .split("T")[0]
                        }
                        required
                        disabled={
                            submitting
                        }
                    />

                </div>


                {/* ================================================= */}
                {/* REASON */}
                {/* ================================================= */}

                <div className="form-group">

                    <label htmlFor="reason">

                        Reason

                    </label>


                    <textarea
                        id="reason"
                        name="reason"
                        value={
                            formData.reason
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Enter reason for leave"
                        maxLength={1000}
                        rows={5}
                        required
                        disabled={
                            submitting
                        }
                    />

                </div>


                {/* ================================================= */}
                {/* SUBMIT */}
                {/* ================================================= */}

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={
                        submitting ||
                        loadingLeaveTypes ||
                        !personId
                    }
                >

                    {
                        submitting
                            ? "Applying..."
                            : "Apply Leave"
                    }

                </button>

            </form>

        </div>
    );
}


export default ApplyLeavePage;