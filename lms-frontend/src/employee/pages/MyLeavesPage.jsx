import React, {
    useEffect,
    useState
} from "react";

import employeeLeaveService
    from "../services/employeeLeaveService";
import { useToast } from "../../shared/components/ToastContext";
import PageTitle
    from "../../shared/components/PageTitle";

import "../styles/employee.css";


function MyLeavesPage() {

    // =====================================================
    // STATE
    // =====================================================
    const { showToast } = useToast();
    const [
        leaves,
        setLeaves
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        errorMessage,
        setErrorMessage
    ] = useState("");


    // =====================================================
    // LOAD MY LEAVES
    // =====================================================

    useEffect(() => {

        fetchMyLeaves();

    }, []);


    const fetchMyLeaves =
        async () => {

            try {

                setLoading(true);

                setErrorMessage("");


                // =================================================
                // PERSON ID
                // =================================================

                const personId =
                    localStorage.getItem(
                        "personId"
                    );


                if (!personId) {

                    throw new Error(
                        "Person ID not found. Please login again."
                    );
                }


                // =================================================
                // API CALL
                // =================================================

                const response =
                    await employeeLeaveService
                        .getLeavesByEmployee(
                            personId
                        );


                // =================================================
                // RESPONSE
                // =================================================

                setLeaves(
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to load my leaves:",
                    error
                );


                console.error(
                    "SERVER RESPONSE:",
                    error?.response?.data
                );


                setLeaves([]);


                setErrorMessage(
                    error?.response?.data?.message
                    ||
                    error?.response?.data
                    ||
                    error?.message
                    ||
                    "Failed to load leave requests."
                );

            } finally {

                setLoading(false);

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

            <div className="my-leaves-page">

                <div className="page-header">

                    <PageTitle
                        title="My Leave Requests"
                    />

                </div>


                <div
                    className="my-leaves-table-container"
                >

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

        <div className="my-leaves-page">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="page-header">

                <PageTitle
                    title="My Leave Requests"
                />

            </div>


            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {errorMessage && (

                <div
                    style={{
                        padding: "12px 16px",
                        marginBottom: "15px",
                        borderRadius: "6px"
                    }}
                >

                    {errorMessage}

                </div>

            )}


            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <div
                className="my-leaves-table-container"
            >

                <table
                    className="my-leaves-table"
                >


                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <thead>

                    <tr>

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
                            Status
                        </th>

                    </tr>

                    </thead>


                    {/* ================================================= */}
                    {/* BODY */}
                    {/* ================================================= */}

                    <tbody>

                    {leaves.length === 0 ? (

                        <tr>

                            <td
                                colSpan="5"
                                style={{
                                    textAlign: "center",
                                    padding: "30px"
                                }}
                            >

                                No Leave Requests Found

                            </td>

                        </tr>

                    ) : (

                        leaves.map(
                            (leave) => (

                                <tr
                                    key={
                                        leave.leaveRequestId
                                    }
                                >


                                    {/* ============================== */}
                                    {/* LEAVE TYPE */}
                                    {/* ============================== */}

                                    <td>

                                        {
                                            leave.leaveType
                                            || "-"
                                        }

                                    </td>


                                    {/* ============================== */}
                                    {/* START DATE */}
                                    {/* ============================== */}

                                    <td>

                                        {
                                            leave.startDate
                                            || "-"
                                        }

                                    </td>


                                    {/* ============================== */}
                                    {/* END DATE */}
                                    {/* ============================== */}

                                    <td>

                                        {
                                            leave.endDate
                                            || "-"
                                        }

                                    </td>


                                    {/* ============================== */}
                                    {/* TOTAL DAYS */}
                                    {/* ============================== */}

                                    <td>

                                        {
                                            leave.totalDays
                                            ?? "-"
                                        }

                                    </td>


                                    {/* ============================== */}
                                    {/* STATUS */}
                                    {/* ============================== */}

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


export default MyLeavesPage;