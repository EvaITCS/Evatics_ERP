// DepartmentForm.jsx

import React from "react";
import "../../shared/styles/sidebar.css";
import "../styles/employee.css";
function DepartmentForm({
    formData,
    handleChange,
    handleSubmit
}) {

    return (

        <form
            className="department-form"
            onSubmit={handleSubmit}
        >

            <div className="form-group">

                <label>Department Name</label>

                <input
                    type="text"
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="form-group">

                <label>Description</label>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

            </div>

            <button
                type="submit"
                className="submit-btn"
            >
                Save Department
            </button>

        </form>
    );
}

export default DepartmentForm;