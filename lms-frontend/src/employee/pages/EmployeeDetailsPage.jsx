import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import employeeService from "../services/employeeService";
import PageTitle from "../../shared/components/PageTitle";
import "../styles/employee.css";

function EmployeeDetailsPage() {
    const { personId } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);
                setError("");

                if (!personId) {
                    setError("Person ID not found.");
                    return;
                }

                const response = await employeeService.getEmployeeById(personId);
                setEmployee(response.data);
            } catch (err) {
                console.error("Failed to load employee:", err);
                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to load employee details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [personId]);

    if (loading) {
        return (
            <div className="employee-details-page">
                <div className="page-header-container">
                    <PageTitle title="Employee Details" />
                </div>
                <div className="profile-loading">Loading employee details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="employee-details-page">
                <div className="page-header-container">
                    <PageTitle title="Employee Details" />
                    <button
                        type="button"
                        className="back-btn-secondary"
                        onClick={() => navigate("/admin/employees")}
                    >
                        ← Back
                    </button>
                </div>
                <div className="profile-error">
                    <h3>Unable to Load Employee</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="employee-details-page">
                <div className="page-header-container">
                    <PageTitle title="Employee Details" />
                    <button
                        type="button"
                        className="back-btn-secondary"
                        onClick={() => navigate("/admin/employees")}
                    >
                        ← Back
                    </button>
                </div>
                <div className="profile-empty">No employee information found.</div>
            </div>
        );
    }

    const displayValue = (val) => (val ? val : "NA");

    return (
        <div className="employee-details-page">
            {/* PAGE HEADER */}
            <div className="page-header-container">
                <PageTitle title="Employee Details" />
                <button
                    type="button"
                    className="back-btn-secondary"
                    onClick={() => navigate("/admin/employees")}
                >
                    ← Back
                </button>
            </div>

            {/* TOP PROFILE HEADER CARD */}
            <div className="profile-header-card">
                <div className="profile-avatar">
                    {(employee.fullName || employee.firstName || "E").charAt(0).toUpperCase()}
                </div>
                <div className="profile-header-info">
                    <div className="profile-name-row">
                        <h2>{displayValue(employee.fullName)}</h2>
                        <span className="employee-code-badge">
                Code: {displayValue(employee.employeeCode)}
            </span>
                    </div>
                    <p className="profile-designation">{displayValue(employee.designationName)}</p>
                </div>
            </div>

            <div className="details-cards-grid">
                {/* PERSONAL DETAILS */}
                <div className="profile-card">
                    <h3>Personal Details</h3>
                    <div className="profile-info-grid">
                        <div><label>Full Name</label><span>{displayValue(employee.fullName)}</span></div>
                        <div><label>First Name</label><span>{displayValue(employee.firstName)}</span></div>
                        <div><label>Middle Name</label><span>{displayValue(employee.middleName)}</span></div>
                        <div><label>Last Name</label><span>{displayValue(employee.lastName)}</span></div>
                        <div><label>Gender</label><span>{displayValue(employee.gender)}</span></div>
                        <div><label>Birth Year</label><span>{displayValue(employee.birthYear)}</span></div>
                        <div><label>Nationality</label><span>{displayValue(employee.nationality)}</span></div>
                        <div><label>Marital Status</label><span>{employee.isMarried ? "Married" : "Single"}</span></div>
                    </div>
                </div>

                {/* CONTACT DETAILS */}
                <div className="profile-card">
                    <h3>Contact Details</h3>
                    <div className="profile-info-grid">
                        <div><label>Primary Email</label><span>{displayValue(employee.email)}</span></div>
                        <div><label>Primary Phone</label><span>{displayValue(employee.phone)}</span></div>
                        {employee.contacts?.map((contact, idx) => (
                            <div key={idx}>
                                <label>{contact.contactTypeName || "Contact"}</label>
                                <span>{displayValue(contact.contactValue)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ORGANIZATION & EMPLOYEE DETAILS */}
                <div className="profile-card">
                    <h3>Organization & Employment</h3>
                    <div className="profile-info-grid">
                        <div><label>Person ID</label><span>{displayValue(employee.personId)}</span></div>
                        <div><label>Employee Code</label><span>{displayValue(employee.employeeCode)}</span></div>
                        <div><label>Department</label><span>{displayValue(employee.departmentName)}</span></div>
                        <div><label>Designation</label><span>{displayValue(employee.designationName)}</span></div>
                        <div><label>Employee Status</label><span>{displayValue(employee.employeeStatus)}</span></div>
                        <div><label>Employment Type</label><span>{displayValue(employee.employmentType)}</span></div>
                        <div><label>Work Mode</label><span>{displayValue(employee.workMode)}</span></div>
                        <div><label>Shift</label><span>{displayValue(employee.shiftName)}</span></div>
                        <div><label>Location</label><span>{displayValue(employee.locationName)}</span></div>
                        <div><label>Joining Date</label><span>{displayValue(employee.joiningDate)}</span></div>
                        <div><label>Probation End Date</label><span>{displayValue(employee.probationEndDate)}</span></div>
                    </div>
                </div>

                {/* ADDRESS DETAILS */}
                {employee.addresses && employee.addresses.length > 0 && (
                    <div className="profile-card">
                        <h3>Address Details</h3>
                        <div className="profile-info-grid">
                            {employee.addresses.map((addr, idx) => (
                                <React.Fragment key={idx}>
                                    <div><label>Type</label><span>{displayValue(addr.addressTypeName)}</span></div>
                                    <div><label>Address Line 1</label><span>{displayValue(addr.addressLine1)}</span></div>
                                    <div><label>City / State</label><span>{`${displayValue(addr.city)}, ${displayValue(addr.state)}`}</span></div>
                                    <div><label>Country / ZIP</label><span>{`${displayValue(addr.country)} - ${displayValue(addr.zipCode)}`}</span></div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}

                {/* EDUCATION DETAILS */}
                {employee.educations && employee.educations.length > 0 && (
                    <div className="profile-card">
                        <h3>Education Details</h3>
                        <div className="profile-info-grid">
                            {employee.educations.map((edu, idx) => (
                                <React.Fragment key={idx}>
                                    <div><label>Qualification</label><span>{displayValue(edu.qualification)}</span></div>
                                    <div><label>Institute</label><span>{displayValue(edu.instituteName)}</span></div>
                                    <div><label>Field of Study</label><span>{displayValue(edu.fieldOfStudy)}</span></div>
                                    <div><label>Passing Year</label><span>{displayValue(edu.passingYear)}</span></div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeDetailsPage;