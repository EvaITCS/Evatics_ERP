// LocationForm.jsx

import React from "react";
import "../../shared/styles/sidebar.css";
import "../styles/employee.css";
function LocationForm({
    formData,
    handleChange,
    handleSubmit
}) {

    return (

        <form
            className="location-form"
            onSubmit={handleSubmit}
        >

            <div className="form-group">

                <label>Location Name</label>

                <input
                    type="text"
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="form-group">

                <label>Address</label>

                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />

            </div>

            <button
                type="submit"
                className="submit-btn"
            >
                Save Location
            </button>

        </form>
    );
}

export default LocationForm;