import React from "react";
import "../../shared/styles/sidebar.css";
import "../styles/employee.css";
function EmployeeStats({ statistics }) {

    return (

        <div className="employee-stats-grid">

            <div className="employee-stat-card">

                <h4>Employee Code</h4>

                <h2>
                    {statistics.employeeCode || "-"}
                </h2>

            </div>

            <div className="employee-stat-card">

                <h4>Department</h4>

                <h2>
                    {statistics.departmentName || "-"}
                </h2>

            </div>

            <div className="employee-stat-card">

                <h4>Designation</h4>

                <h2>
                    {statistics.designationName || "-"}
                </h2>

            </div>

            <div className="employee-stat-card">

                <h4>Work Mode</h4>

                <h2>
                    {statistics.workMode || "-"}
                </h2>

            </div>

            <div className="employee-stat-card">

                <h4>Location</h4>

                <h2>
                    {statistics.locationName || "-"}
                </h2>

            </div>

            <div className="employee-stat-card">

                <h4>Status</h4>

                <h2>
                    {statistics.employeeStatus || "-"}
                </h2>

            </div>

        </div>
    );
}

export default EmployeeStats;