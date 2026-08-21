// EmployeeTable.jsx

import React from "react";
import "../styles/employeeTable.css";
import "../../shared/styles/sidebar.css";
import "../styles/employee.css";
function EmployeeTable({
    employees,
    onView,
    onEdit
}) {

    return (

        <div className="employee-table-wrapper">

            <table className="employee-table">

                <thead>

                    <tr>
                        <th>Employee Code</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {
                        employees.map((employee) => (

                            <tr key={employee.employeeId}>

                                <td>
                                    {employee.employeeCode}
                                </td>

                                <td>
                                    {employee.fullName}
                                </td>

                                <td>
                                    {employee.departmentName}
                                </td>

                                <td>
                                    {employee.designationName}
                                </td>

                                <td>
                                    {employee.workEmail}
                                </td>

                                <td>
                                    {employee.employeeStatus}
                                </td>

                                <td>

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

                                </td>

                            </tr>
                        ))
                    }

                </tbody>

            </table>

        </div>
    );
}

export default EmployeeTable;