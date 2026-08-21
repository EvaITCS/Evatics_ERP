// EmployeeDetailsModal.jsx

import React from "react";
import "../../shared/styles/sidebar.css";
import "../styles/employee.css";
function EmployeeDetailsModal({
    employee,
    onClose
}) {

    if (!employee) return null;

    return (

        <div className="modal-overlay">

            <div className="employee-modal">

                <h2>Employee Details</h2>

                <p>
                    <strong>Name:</strong>
                    {employee.fullName}
                </p>

                <p>
                    <strong>Employee Code:</strong>
                    {employee.employeeCode}
                </p>

                <p>
                    <strong>Email:</strong>
                    {employee.workEmail}
                </p>

                <p>
                    <strong>Department:</strong>
                    {employee.departmentName}
                </p>

                <p>
                    <strong>Designation:</strong>
                    {employee.designationName}
                </p>

                <p>
                    <strong>Status:</strong>
                    {employee.employeeStatus}
                </p>

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    Close
                </button>

            </div>

        </div>
    );
}

export default EmployeeDetailsModal;