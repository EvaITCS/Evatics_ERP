// EmployeeCard.jsx

import React from "react";
import "../styles/employee.css";
import "../../shared/styles/sidebar.css";
function EmployeeCard({ employee, onView, onEdit }) {

    return (
        <div className="employee-card">

            <div className="employee-card-header">
                <img
                    src={
                        employee.profilePhoto ||
                        "https://via.placeholder.com/80"
                    }
                    alt="employee"
                    className="employee-avatar"
                />

                <div>
                    <h3>{employee.fullName}</h3>
                    <p>{employee.employeeCode}</p>
                </div>
            </div>

            <div className="employee-card-body">

                <p>
                    <strong>Department:</strong>
                    {employee.departmentName}
                </p>

                <p>
                    <strong>Designation:</strong>
                    {employee.designationName}
                </p>

                <p>
                    <strong>Email:</strong>
                    {employee.workEmail}
                </p>

                <p>
                    <strong>Status:</strong>
                    {employee.employeeStatus}
                </p>

            </div>

            <div className="employee-card-footer">

                <button
                    className="view-btn"
                    onClick={() => onView(employee)}
                >
                    View
                </button>

                <button
                    className="edit-btn"
                    onClick={() => onEdit(employee)}
                >
                    Edit
                </button>

            </div>

        </div>
    );
}

export default EmployeeCard;