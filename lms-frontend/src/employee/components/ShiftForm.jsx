import React from "react";
import "../../shared/styles/sidebar.css";
import "../styles/employee.css";
function ShiftForm({
    formData,
    handleChange,
    handleSubmit
}) {

    return (

        <form
            className="shift-form"
            onSubmit={handleSubmit}
        >

            <div className="form-group">

                <label>
                    Shift Name
                </label>

                <input
                    type="text"
                    name="shiftName"
                    value={formData.shiftName}
                    onChange={handleChange}
                    placeholder="Enter Shift Name"
                    required
                />

            </div>

            <div className="form-group">

                <label>
                    Start Time
                </label>

                <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="form-group">

                <label>
                    End Time
                </label>

                <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="form-group">

                <label>
                    Status
                </label>

                <select
                    name="isActive"
                    value={formData.isActive}
                    onChange={(e) =>
                        handleChange({
                            target: {
                                name: "isActive",
                                value:
                                    e.target.value === "true"
                            }
                        })
                    }
                >

                    <option value="true">
                        Active
                    </option>

                    <option value="false">
                        Inactive
                    </option>

                </select>

            </div>

            <button
                type="submit"
                className="submit-btn"
            >

                {
                    formData.shiftId
                        ? "Update Shift"
                        : "Add Shift"
                }

            </button>

        </form>
    );
}

export default ShiftForm;