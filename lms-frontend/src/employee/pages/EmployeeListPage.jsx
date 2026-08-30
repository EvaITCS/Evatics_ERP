import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
// =====================================================
// SERVICES
// =====================================================
import { useToast } from "../../shared/components/ToastContext";
import employeeService from "../services/employeeService";

// =====================================================
// SHARED
// =====================================================

import PageTitle from "../../shared/components/PageTitle";
import SearchBar from "../../lead/components/SearchBar";

// =====================================================
// STYLES
// =====================================================

import "../styles/employee.css";

// =====================================================
// COMPONENT
// =====================================================

function EmployeeListPage() {
    const navigate = useNavigate();
    // =================================================
    // STATE
    // =================================================

    const [employees, setEmployees] = useState([]);
    const { showToast } = useToast();
    const [filteredEmployees, setFilteredEmployees] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    // =================================================
    // FETCH EMPLOYEES ON MOUNT
    // =================================================

    useEffect(() => {

        void fetchEmployees();

    }, []);


    // =================================================
    // SEARCH FILTER
    // =================================================

    // =================================================
// SEARCH FILTER (ESLint Warning Fixed)
// =================================================
    useEffect(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            setFilteredEmployees(employees);
            return;
        }

        const filtered = employees.filter((employee) => {
            const fullName = employee.fullName?.toLowerCase() || "";
            const employeeCode = employee.employeeCode?.toLowerCase() || "";
            const primaryEmail = employee.primaryEmail?.toLowerCase() || "";
            const alternateEmail = employee.alternateEmail?.toLowerCase() || "";
            const primaryPhone = String(employee.primaryPhone || "").toLowerCase();
            const alternatePhone = String(employee.alternatePhone || "").toLowerCase();

            return (
                fullName.includes(query) ||
                employeeCode.includes(query) ||
                primaryEmail.includes(query) ||
                alternateEmail.includes(query) ||
                primaryPhone.includes(query) ||
                alternatePhone.includes(query)
            );
        });

        setFilteredEmployees(filtered);
    }, [search, employees]); // Pure state dependencies, completely safe for ESLint

    // =================================================
    // FETCH EMPLOYEES
    // =================================================

    const fetchEmployees = async () => {

        try {

            setLoading(true);


            const response =
                await employeeService.getAllEmployees();


            console.log(
                "Employees Response:",
                response.data
            );


            const employeeData =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            setEmployees(
                employeeData
            );


            setFilteredEmployees(
                employeeData
            );


        } catch (error) {

            console.error(
                "Failed to fetch employees:",
                error
            );


            showToast(
                "Failed to load employees.",
                "error"
            );


            setEmployees([]);

            setFilteredEmployees([]);


        } finally {

            setLoading(false);

        }

    };


    // =================================================
    // DELETE EMPLOYEE
    // =================================================

    const handleDelete = async (
        personId
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this employee?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            await employeeService.deleteEmployee(
                personId
            );


            showToast(
                "Employee deleted successfully.",
                "success"
            );


            await fetchEmployees();


        } catch (error) {

            console.error(
                "Failed to delete employee:",
                error
            );


            showToast(
                "Failed to delete employee.",
                "error"
            );

        }

    };


    // =================================================
    // SEARCH & FILTER
    // =================================================

    const handleFilter = () => {

        const query =
            search
                .trim()
                .toLowerCase();


        // =============================================
        // NO SEARCH
        // =============================================

        if (!query) {

            setFilteredEmployees(
                employees
            );

            return;

        }


        // =============================================
        // FILTER
        // =============================================

        const filtered =
            employees.filter(
                (employee) => {

                    const fullName =
                        employee.fullName
                            ?.toLowerCase() || "";


                    const employeeCode =
                        employee.employeeCode
                            ?.toLowerCase() || "";


                    // =================================
                    // IMPORTANT
                    //
                    // EmployeeResponse uses:
                    // primaryEmail
                    // primaryPhone
                    // =================================

                    const primaryEmail =
                        employee.primaryEmail
                            ?.toLowerCase() || "";


                    const alternateEmail =
                        employee.alternateEmail
                            ?.toLowerCase() || "";


                    const primaryPhone =
                        String(
                            employee.primaryPhone || ""
                        ).toLowerCase();


                    const alternatePhone =
                        String(
                            employee.alternatePhone || ""
                        ).toLowerCase();


                    return (

                        fullName.includes(
                            query
                        ) ||

                        employeeCode.includes(
                            query
                        ) ||

                        primaryEmail.includes(
                            query
                        ) ||

                        alternateEmail.includes(
                            query
                        ) ||

                        primaryPhone.includes(
                            query
                        ) ||

                        alternatePhone.includes(
                            query
                        )

                    );

                }
            );


        setFilteredEmployees(
            filtered
        );

    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <div className="employee-list-page">

                <PageTitle
                    title="Employees List"
                />

                <div>
                    Loading Employees...
                </div>

            </div>

        );

    }


    // =================================================
    // RENDER
    // =================================================

    return (

        <div className="employee-list-page">

            {/* ========================================= */}
            {/* PAGE HEADER */}
            {/* ========================================= */}

            {/* ========================================= */}
            {/* PAGE HEADER */}
            {/* ========================================= */}

            <div className="page-header-container">

                <div className="header-left">
                    <PageTitle title="Employees List" />

                    <Link
                        to="/admin/employees/add"
                        className="add-btn-blue"
                    >
                        + Add Employee
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="back-btn-secondary"
                >
                    ← Back
                </button>

            </div>


            {/* ========================================= */}
            {/* SEARCH */}
            {/* ========================================= */}

            <div
                className="lead-filters"
                style={{
                    marginBottom: "20px",
                }}
            >

                <SearchBar
                    value={search}
                    onSearch={setSearch}
                    placeholder="Search employees by name, code, email or phone..."
                />

            </div>


            {/* ========================================= */}
            {/* TABLE */}
            {/* ========================================= */}

            <div className="employee-table-wrapper">

                <table className="employee-table">

                    <thead>

                    <tr>

                        <th>
                            ID
                        </th>

                        <th>
                            Employee Code
                        </th>

                        <th>
                            Name
                        </th>

                        <th>
                            Personal Email
                        </th>

                        <th>
                            Phone
                        </th>

                        <th>
                            Department
                        </th>

                        <th>
                            Designation
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {filteredEmployees.length > 0 ? (

                        filteredEmployees.map(
                            (employee) => {

                                // =================================
                                // BACKEND USES personId
                                // =================================

                                const personId =
                                    employee.personId;


                                return (

                                    <tr
                                        key={personId}
                                    >

                                        {/* ============================= */}
                                        {/* ID */}
                                        {/* ============================= */}

                                        <td>
                                            {personId || "-"}
                                        </td>


                                        {/* ============================= */}
                                        {/* EMPLOYEE CODE */}
                                        {/* ============================= */}

                                        <td>
                                            {
                                                employee.employeeCode ||
                                                "-"
                                            }
                                        </td>


                                        {/* ============================= */}
                                        {/* NAME */}
                                        {/* ============================= */}

                                        <td>
                                            {
                                                employee.fullName ||
                                                "-"
                                            }
                                        </td>


                                        {/* ============================= */}
                                        {/* PRIMARY EMAIL */}
                                        {/* ============================= */}

                                        <td>

                                            {
                                                employee.primaryEmail ||
                                                "-"
                                            }

                                        </td>


                                        {/* ============================= */}
                                        {/* PRIMARY PHONE */}
                                        {/* ============================= */}

                                        <td>

                                            {
                                                employee.primaryPhone ||
                                                "-"
                                            }

                                        </td>


                                        {/* ============================= */}
                                        {/* DEPARTMENT */}
                                        {/* ============================= */}

                                        <td>

                                            {
                                                employee.departmentName ||
                                                "-"
                                            }

                                        </td>


                                        {/* ============================= */}
                                        {/* DESIGNATION */}
                                        {/* ============================= */}

                                        <td>

                                            {
                                                employee.designationName ||
                                                "-"
                                            }

                                        </td>


                                        {/* ============================= */}
                                        {/* STATUS */}
                                        {/* ============================= */}

                                        <td>

                                            {
                                                employee.employeeStatus ||
                                                "-"
                                            }

                                        </td>


                                        {/* ============================= */}
                                        {/* ACTIONS */}
                                        {/* ============================= */}

                                        <td>

                                            <Link
                                                to={`/admin/employees/${personId}`}
                                            >
                                                View
                                            </Link>


                                            {" | "}


                                            <Link
                                                to={`/admin/employees/update/${personId}`}
                                            >
                                                Edit
                                            </Link>


                                            {" | "}


                                            <Link
                                                to={`/admin/employees/${personId}/documents`}
                                            >
                                                Documents
                                            </Link>


                                            {" | "}


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        personId
                                                    )
                                                }
                                                style={{
                                                    background:
                                                        "none",

                                                    border:
                                                        "none",

                                                    color:
                                                        "var(--danger-start)",

                                                    cursor:
                                                        "pointer",

                                                    padding:
                                                        0,

                                                    font:
                                                        "inherit",
                                                }}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                );

                            }

                        )

                    ) : (

                        <tr>

                            <td
                                colSpan="9"
                                style={{
                                    textAlign:
                                        "center",
                                }}
                            >
                                No Employees Found
                            </td>

                        </tr>

                    )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default EmployeeListPage;