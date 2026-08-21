// EmployeeFilters.jsx

import React from "react";
import "../../shared/styles/sidebar.css";
import "../styles/employee.css";
function EmployeeFilters({
    search,
    setSearch,
    departmentFilter,
    setDepartmentFilter,
    departments
}) {

    return (

        <div className="employee-filters">

            <input
                type="text"
                placeholder="Search Employee..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            <select
                value={departmentFilter}
                onChange={(e) =>
                    setDepartmentFilter(e.target.value)
                }
            >

                <option value="">
                    All Departments
                </option>

                {
                    departments.map((department) => (
                        <option
                            key={department.departmentId}
                            value={department.departmentId}
                        >
                            {department.departmentName}
                        </option>
                    ))
                }

            </select>

        </div>
    );
}

export default EmployeeFilters;