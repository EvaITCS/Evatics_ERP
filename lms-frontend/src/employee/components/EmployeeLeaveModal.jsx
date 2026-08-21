import React, {
    useEffect,
    useState
} from "react";

import leaveTypeService
    from "../services/leaveTypeService";

import "../../shared/styles/sidebar.css";
import "../styles/employee.css";


function EmployeeLeaveModal({
                                employee,
                                onClose,
                                onSubmit
                            }) {

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
        leaveData,
        setLeaveData
    ] = useState({

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
    // HANDLE CHANGE
    // =====================================================

    const handleChange =
        (e) => {

            const {
                name,
                value
            } = e.target;


            setLeaveData(
                previous => ({

                    ...previous,

                    [name]: value

                })
            );
        };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit =
        async (e) => {

            e.preventDefault();


            // =================================================
            // EMPLOYEE CHECK
            // =================================================

            if (!employee) {

                alert(
                    "Employee information not found."
                );

                return;
            }


            // =================================================
            // PERSON ID
            // =================================================

            const personId =
                employee.personId;


            if (!personId) {

                alert(
                    "Employee person ID not found."
                );

                return;
            }


            // =================================================
            // DATE VALIDATION
            // =================================================

            if (
                !leaveData.startDate ||
                !leaveData.endDate
            ) {

                alert(
                    "Please select start and end dates."
                );

                return;
            }


            const startDate =
                new Date(
                    leaveData.startDate
                );


            const endDate =
                new Date(
                    leaveData.endDate
                );


            if (endDate < startDate) {

                alert(
                    "End date cannot be before start date."
                );

                return;
            }


            // =================================================
            // LEAVE TYPE VALIDATION
            // =================================================

            if (!leaveData.leaveTypeId) {

                alert(
                    "Please select a leave type."
                );

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
                        leaveData.leaveTypeId
                    ),

                startDate:
                leaveData.startDate,

                endDate:
                leaveData.endDate,

                reason:
                    leaveData.reason.trim()
            };


            // =================================================
            // SUBMIT
            // =================================================

            try {

                setSubmitting(true);


                await onSubmit(
                    payload
                );


            } catch (error) {

                console.error(
                    "Failed to apply leave:",
                    error
                );

            } finally {

                setSubmitting(false);

            }
        };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="modal-overlay">

            <div className="employee-modal">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <h2>
                    Apply Leave
                </h2>


                <form
                    onSubmit={
                        handleSubmit
                    }
                >


                    {/* ============================================= */}
                    {/* EMPLOYEE */}
                    {/* ============================================= */}

                    <div className="form-group">

                        <label>
                            Employee
                        </label>

                        <input
                            type="text"
                            value={
                                employee?.employeeName
                                ||
                                employee?.name
                                ||
                                employee?.personName
                                ||
                                "-"
                            }
                            disabled
                        />

                    </div>


                    {/* ============================================= */}
                    {/* LEAVE TYPE */}
                    {/* ============================================= */}

                    <div className="form-group">

                        <label>
                            Leave Type
                        </label>


                        <select
                            name="leaveTypeId"
                            value={
                                leaveData.leaveTypeId
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


                            {
                                leaveTypes.map(
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
                                )
                            }

                        </select>

                    </div>


                    {/* ============================================= */}
                    {/* START DATE */}
                    {/* ============================================= */}

                    <div className="form-group">

                        <label>
                            Start Date
                        </label>


                        <input
                            type="date"
                            name="startDate"
                            value={
                                leaveData.startDate
                            }
                            onChange={
                                handleChange
                            }
                            required
                            disabled={
                                submitting
                            }
                        />

                    </div>


                    {/* ============================================= */}
                    {/* END DATE */}
                    {/* ============================================= */}

                    <div className="form-group">

                        <label>
                            End Date
                        </label>


                        <input
                            type="date"
                            name="endDate"
                            value={
                                leaveData.endDate
                            }
                            onChange={
                                handleChange
                            }
                            min={
                                leaveData.startDate
                            }
                            required
                            disabled={
                                submitting
                            }
                        />

                    </div>


                    {/* ============================================= */}
                    {/* REASON */}
                    {/* ============================================= */}

                    <div className="form-group">

                        <label>
                            Reason
                        </label>


                        <textarea
                            name="reason"
                            value={
                                leaveData.reason
                            }
                            placeholder="Enter reason for leave"
                            maxLength={1000}
                            rows={4}
                            onChange={
                                handleChange
                            }
                            required
                            disabled={
                                submitting
                            }
                        />

                    </div>


                    {/* ============================================= */}
                    {/* ACTIONS */}
                    {/* ============================================= */}

                    <div
                        style={{
                            display: "flex",
                            gap: "10px"
                        }}
                    >

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                loadingLeaveTypes
                            }
                        >

                            {
                                submitting
                                    ? "Applying..."
                                    : "Apply Leave"
                            }

                        </button>


                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                submitting
                            }
                        >

                            Cancel

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default EmployeeLeaveModal;