import React, {
    useEffect,
    useState
} from "react";
import { useToast } from "../../shared/components/ToastContext";
import employeeLeaveService
    from "../services/employeeLeaveService";

import PageTitle
    from "../../shared/components/PageTitle";

import "../styles/employee.css";


function EmployeeLeavePage() {

    // =====================================================
    // STATE
    // =====================================================
    const { showToast } = useToast();
    const [
        leaveRequests,
        setLeaveRequests
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        actionLoading,
        setActionLoading
    ] = useState(false);


    // =====================================================
    // LOAD LEAVE REQUESTS
    // =====================================================

    useEffect(() => {

        fetchLeaveRequests();

    }, []);


    const fetchLeaveRequests =
        async () => {

            try {

                setLoading(true);

                const response =
                    await employeeLeaveService
                        .getAllLeaveRequests();

                setLeaveRequests(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load leave requests:",
                    error
                );

                console.error(
                    "SERVER RESPONSE:",
                    error?.response?.data
                );

                setLeaveRequests([]);

            } finally {

                setLoading(false);

            }
        };


    // =====================================================
    // APPROVE LEAVE
    // =====================================================

    const approveLeave =
        async (leaveRequestId) => {

            if (!leaveRequestId) {

                return;

            }


            const confirmed =
                window.confirm(
                    "Are you sure you want to approve this leave?"
                );


            if (!confirmed) {

                return;

            }


            try {

                setActionLoading(true);


                await employeeLeaveService
                    .approveLeave(
                        leaveRequestId
                    );


                showToast(
                    "Leave Approved Successfully",
                    "success"
                );


                // Refresh list
                await fetchLeaveRequests();


            } catch (error) {

                console.error(
                    "Failed to approve leave:",
                    error
                );

                console.error(
                    "SERVER RESPONSE:",
                    error?.response?.data
                );


                showToast(
                    error?.response?.data?.message ||
                    error?.response?.data ||
                    "Failed To Approve Leave",
                    "error"
                );

            } finally {

                setActionLoading(false);

            }
        };


    // =====================================================
    // REJECT LEAVE
    // =====================================================

    const rejectLeave =
        async (leaveRequestId) => {

            if (!leaveRequestId) {

                return;

            }


            const confirmed =
                window.confirm(
                    "Are you sure you want to reject this leave?"
                );


            if (!confirmed) {

                return;

            }


            try {

                setActionLoading(true);


                await employeeLeaveService
                    .rejectLeave(
                        leaveRequestId
                    );


                showToast(
                    "Leave Rejected Successfully",
                    "success"
                );


                // Refresh list
                await fetchLeaveRequests();


            } catch (error) {

                console.error(
                    "Failed to reject leave:",
                    error
                );

                console.error(
                    "SERVER RESPONSE:",
                    error?.response?.data
                );


                showToast(
                    error?.response?.data?.message ||
                    error?.response?.data ||
                    "Failed To Reject Leave",
                    "error"
                );

            } finally {

                setActionLoading(false);

            }
        };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass =
        (status) => {

            if (!status) {

                return "";

            }


            switch (
                status.toUpperCase()
                ) {

                case "APPROVED":

                    return "leave-status-approved";


                case "REJECTED":

                    return "leave-status-rejected";


                case "PENDING":

                    return "leave-status-pending";


                default:

                    return "";

            }
        };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="employee-leave-page">

                <div className="page-header">

                    <PageTitle
                        title="Employee Leaves"
                    />

                </div>


                <div className="leave-table-container">

                    <p
                        style={{
                            padding: "30px",
                            textAlign: "center"
                        }}
                    >

                        Loading leave requests...

                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="employee-leave-page">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="page-header">

                <PageTitle
                    title="Employee Leaves"
                />

            </div>


            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <div className="leave-table-container">

                <table className="leave-table">


                    {/* ================================================= */}
                    {/* TABLE HEADER */}
                    {/* ================================================= */}

                    <thead>

                    <tr>

                        <th>
                            Employee
                        </th>


                        <th>
                            Leave Type
                        </th>


                        <th>
                            Start Date
                        </th>


                        <th>
                            End Date
                        </th>


                        <th>
                            Total Days
                        </th>


                        <th>
                            Reason
                        </th>


                        <th>
                            Status
                        </th>


                        <th>
                            Approved By
                        </th>


                        <th>
                            Actions
                        </th>

                    </tr>

                    </thead>


                    {/* ================================================= */}
                    {/* TABLE BODY */}
                    {/* ================================================= */}

                    <tbody>


                    {/* ============================================= */}
                    {/* NO DATA */}
                    {/* ============================================= */}

                    {leaveRequests.length === 0 ? (

                        <tr>

                            <td
                                colSpan="9"
                                style={{
                                    textAlign: "center",
                                    padding: "30px"
                                }}
                            >

                                No Leave Requests Found

                            </td>

                        </tr>

                    ) : (

                        leaveRequests.map(
                            (leave) => (

                                <tr
                                    key={
                                        leave.leaveRequestId
                                    }
                                >


                                    {/* ================================= */}
                                    {/* EMPLOYEE */}
                                    {/* ================================= */}

                                    <td>

                                        {
                                            leave.employeeName
                                            || "-"
                                        }

                                    </td>


                                    {/* ================================= */}
                                    {/* LEAVE TYPE */}
                                    {/* ================================= */}

                                    <td>

                                        {
                                            leave.leaveType
                                            || "-"
                                        }

                                    </td>


                                    {/* ================================= */}
                                    {/* START DATE */}
                                    {/* ================================= */}

                                    <td>

                                        {
                                            leave.startDate
                                            || "-"
                                        }

                                    </td>


                                    {/* ================================= */}
                                    {/* END DATE */}
                                    {/* ================================= */}

                                    <td>

                                        {
                                            leave.endDate
                                            || "-"
                                        }

                                    </td>


                                    {/* ================================= */}
                                    {/* TOTAL DAYS */}
                                    {/* ================================= */}

                                    <td>

                                        {
                                            leave.totalDays
                                            ?? "-"
                                        }

                                    </td>


                                    {/* ================================= */}
                                    {/* REASON */}
                                    {/* ================================= */}

                                    <td>

                                        {
                                            leave.reason
                                            || "-"
                                        }

                                    </td>


                                    {/* ================================= */}
                                    {/* STATUS */}
                                    {/* ================================= */}

                                    <td>

                                            <span
                                                className={
                                                    getStatusClass(
                                                        leave.leaveStatus
                                                    )
                                                }
                                            >

                                                {
                                                    leave.leaveStatus
                                                    || "-"
                                                }

                                            </span>

                                    </td>


                                    {/* ================================= */}
                                    {/* APPROVED BY */}
                                    {/* ================================= */}

                                    <td>

                                        {
                                            leave.approvedBy
                                            || "-"
                                        }

                                    </td>


                                    {/* ================================= */}
                                    {/* ACTIONS */}
                                    {/* ================================= */}

                                    <td>

                                        {
                                            leave.leaveStatus ===
                                            "PENDING"
                                                ? (

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "8px",
                                                            alignItems: "center"
                                                        }}
                                                    >

                                                        {/* ================= */}
                                                        {/* APPROVE */}
                                                        {/* ================= */}

                                                        <button
                                                            type="button"

                                                            className="approve-btn"

                                                            disabled={
                                                                actionLoading
                                                            }

                                                            onClick={() =>
                                                                approveLeave(
                                                                    leave.leaveRequestId
                                                                )
                                                            }
                                                        >

                                                            Approve

                                                        </button>


                                                        {/* ================= */}
                                                        {/* REJECT */}
                                                        {/* ================= */}

                                                        <button
                                                            type="button"

                                                            className="reject-btn"

                                                            disabled={
                                                                actionLoading
                                                            }

                                                            onClick={() =>
                                                                rejectLeave(
                                                                    leave.leaveRequestId
                                                                )
                                                            }
                                                        >

                                                            Reject

                                                        </button>

                                                    </div>

                                                )
                                                : (

                                                    <span>
                                                            -
                                                        </span>

                                                )
                                        }

                                    </td>

                                </tr>

                            )
                        )

                    )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


export default EmployeeLeavePage;