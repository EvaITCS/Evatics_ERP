import React, { useEffect, useState } from "react";

import employeeService from "../services/employeeService";
import PageTitle from "../../shared/components/PageTitle";

import "../styles/employee.css";
import { useToast } from "../../shared/components/ToastContext";
function MyProfilePage() {

    // =====================================================
    // STATE
    // =====================================================

    const [employee, setEmployee] = useState(null);
    const { showToast } = useToast();
    const [activeTab, setActiveTab] =
        useState("profile");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {

        fetchProfile();

    }, []);

    // =====================================================
    // FETCH MY PROFILE
    // =====================================================

    const fetchProfile = async () => {

        try {

            setLoading(true);
            setError("");

            // =================================================
            // IMPORTANT:
            // Person-centric system
            //
            // Do NOT depend on employeeId from localStorage.
            //
            // Backend already provides:
            //
            // GET /api/employees/me
            //
            // =================================================

            const response =
                await employeeService.getMyProfile();

            setEmployee(
                response?.data || null
            );

        } catch (error) {

            console.error(
                "Failed to load profile:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Failed to load profile.";

            setError(message);

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="employee-profile-page">

                <div className="page-header">

                    <PageTitle
                        title="My Profile"
                    />

                </div>

                <div className="profile-loading">

                    Loading profile...

                </div>

            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="employee-profile-page">

                <div className="page-header">

                    <PageTitle
                        title="My Profile"
                    />

                </div>

                <div className="profile-error">

                    <h3>
                        Unable to Load Profile
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchProfile}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    // =====================================================
    // NO PROFILE
    // =====================================================

    if (!employee) {

        return (
            <div className="employee-profile-page">

                <div className="page-header">

                    <PageTitle
                        title="My Profile"
                    />

                </div>

                <div className="profile-empty">

                    No profile information found.

                </div>

            </div>
        );
    }

    // =====================================================
    // HELPERS
    // =====================================================

    const displayValue = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "NA";
        }

        return value;
    };

    // =====================================================
    // FULL NAME
    // =====================================================

    const fullName =
        employee.fullName ||
        [
            employee.firstName,
            employee.middleName,
            employee.lastName,
        ]
            .filter(Boolean)
            .join(" ");

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="employee-profile-page">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="page-header">

                <PageTitle
                    title="My Profile"
                />

            </div>

            {/* ================================================= */}
            {/* PROFILE HEADER CARD */}
            {/* ================================================= */}

            <div className="profile-header-card">

                <div className="profile-avatar">

                    {(
                        fullName ||
                        "E"
                    )
                        .charAt(0)
                        .toUpperCase()}

                </div>

                <div className="profile-header-info">

                    <h2>
                        {displayValue(fullName)}
                    </h2>

                    <p>
                        {displayValue(
                            employee.designationName
                        )}
                    </p>

                    <span>
                        Employee Code:{" "}
                        {displayValue(
                            employee.employeeCode
                        )}
                    </span>

                </div>

            </div>

            {/* ================================================= */}
            {/* TABS */}
            {/* ================================================= */}

            <div className="profile-tabs">

                <button
                    type="button"
                    className={
                        activeTab === "profile"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("profile")
                    }
                >
                    Profile
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "address"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("address")
                    }
                >
                    Address
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "education"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("education")
                    }
                >
                    Education
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "experience"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("experience")
                    }
                >
                    Experience
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "visa"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("visa")
                    }
                >
                    Visa
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "emergency"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab("emergency")
                    }
                >
                    Emergency
                </button>

            </div>

            {/* ================================================= */}
            {/* PROFILE TAB */}
            {/* ================================================= */}

            {activeTab === "profile" && (

                <div className="profile-section-grid">

                    {/* ================================================= */}
                    {/* PERSONAL DETAILS */}
                    {/* ================================================= */}

                    <div className="profile-card">

                        <h3>
                            Personal Details
                        </h3>

                        <div className="profile-info-grid">

                            <div>
                                <label>
                                    First Name
                                </label>

                                <span>
                                    {displayValue(
                                        employee.firstName
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Middle Name
                                </label>

                                <span>
                                    {displayValue(
                                        employee.middleName
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Last Name
                                </label>

                                <span>
                                    {displayValue(
                                        employee.lastName
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Gender
                                </label>

                                <span>
                                    {displayValue(
                                        employee.genderName
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Birth Year
                                </label>

                                <span>
                                    {displayValue(
                                        employee.birthYear
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Nationality
                                </label>

                                <span>
                                    {displayValue(
                                        employee.nationalityName
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Marital Status
                                </label>

                                <span>
                                    {employee.isMarried
                                        ? "Married"
                                        : "Single"}
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* CONTACT DETAILS */}
                    {/* ================================================= */}

                    <div className="profile-card">

                        <h3>
                            Contact Details
                        </h3>

                        <div className="profile-info-grid">

                            <div>
                                <label>
                                    Personal Email
                                </label>

                                <span>
                                    {displayValue(
                                        employee.email
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Phone
                                </label>

                                <span>
                                    {displayValue(
                                        employee.phone
                                    )}
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* EMPLOYMENT DETAILS */}
                    {/* ================================================= */}

                    <div className="profile-card">

                        <h3>
                            Employment Details
                        </h3>

                        <div className="profile-info-grid">

                            <div>
                                <label>
                                    Employee Code
                                </label>

                                <span>
                                    {displayValue(
                                        employee.employeeCode
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Department
                                </label>

                                <span>
                                    {displayValue(
                                        employee.departmentName
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Designation
                                </label>

                                <span>
                                    {displayValue(
                                        employee.designationName
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Employment Type
                                </label>

                                <span>
                                    {displayValue(
                                        employee.employmentType
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Status
                                </label>

                                <span>
                                    {displayValue(
                                        employee.employeeStatus
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Work Mode
                                </label>

                                <span>
                                    {displayValue(
                                        employee.workMode
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Shift
                                </label>

                                <span>
                                    {displayValue(
                                        employee.shiftName
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Location
                                </label>

                                <span>
                                    {displayValue(
                                        employee.locationName
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Joining Date
                                </label>

                                <span>
                                    {displayValue(
                                        employee.joiningDate
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Probation End Date
                                </label>

                                <span>
                                    {displayValue(
                                        employee.probationEndDate
                                    )}
                                </span>
                            </div>

                            <div>
                                <label>
                                    Reporting Manager
                                </label>

                                <span>
                                    {displayValue(
                                        employee.reportingManagerName
                                    )}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* ================================================= */}
            {/* ADDRESS TAB */}
            {/* ================================================= */}

            {activeTab === "address" && (

                <div className="profile-tab-content">

                    <h3>
                        Address Details
                    </h3>

                    {employee.addresses?.length > 0 ? (

                        <div className="profile-section-grid">

                            {employee.addresses.map(
                                (address, index) => (

                                    <div
                                        key={
                                            address.addressId ||
                                            index
                                        }
                                        className="profile-card"
                                    >

                                        <h3>
                                            {displayValue(
                                                address.addressType
                                            )}
                                        </h3>

                                        <div className="profile-info-grid">

                                            <div>
                                                <label>
                                                    Address Line 1
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        address.addressLine1
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Address Line 2
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        address.addressLine2
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    City
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        address.city
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    State
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        address.state
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Country
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        address.country
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Zip Code
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        address.zipcode ||
                                                        address.zipCode
                                                    )}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="profile-empty">
                            No address information found.
                        </div>

                    )}

                </div>
            )}

            {/* ================================================= */}
            {/* EDUCATION TAB */}
            {/* ================================================= */}

            {activeTab === "education" && (

                <div className="profile-tab-content">

                    <h3>
                        Education Details
                    </h3>

                    {employee.educations?.length > 0 ? (

                        <div className="profile-section-grid">

                            {employee.educations.map(
                                (education, index) => (

                                    <div
                                        key={
                                            education.educationId ||
                                            index
                                        }
                                        className="profile-card"
                                    >

                                        <h3>
                                            Education #{index + 1}
                                        </h3>

                                        <div className="profile-info-grid">

                                            <div>
                                                <label>
                                                    Qualification
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        education.qualification ||
                                                        education.educationName
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Institute
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        education.instituteName
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Field of Study
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        education.fieldOfStudy
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Passing Year
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        education.passingYear
                                                    )}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="profile-empty">
                            No education information found.
                        </div>

                    )}

                </div>
            )}

            {/* ================================================= */}
            {/* EXPERIENCE TAB */}
            {/* ================================================= */}

            {activeTab === "experience" && (

                <div className="profile-tab-content">

                    <h3>
                        Work Experience
                    </h3>

                    {employee.workExperiences?.length > 0 ? (

                        <div className="profile-section-grid">

                            {employee.workExperiences.map(
                                (experience, index) => (

                                    <div
                                        key={
                                            experience.experienceId ||
                                            index
                                        }
                                        className="profile-card"
                                    >

                                        <h3>
                                            Experience #{index + 1}
                                        </h3>

                                        <div className="profile-info-grid">

                                            <div>
                                                <label>
                                                    Company
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        experience.companyName
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Designation
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        experience.designation
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Start Date
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        experience.startDate
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    End Date
                                                </label>

                                                <span>
                                                    {experience.currentlyWorking
                                                        ? "Currently Working"
                                                        : displayValue(
                                                            experience.endDate
                                                        )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Skills
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        experience.skillsUsed
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Job Description
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        experience.jobDescription
                                                    )}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="profile-empty">
                            No work experience information found.
                        </div>

                    )}

                </div>
            )}

            {/* ================================================= */}
            {/* VISA TAB */}
            {/* ================================================= */}

            {activeTab === "visa" && (

                <div className="profile-tab-content">

                    <h3>
                        Visa Details
                    </h3>

                    {employee.visas?.length > 0 ? (

                        <div className="profile-section-grid">

                            {employee.visas.map(
                                (visa, index) => (

                                    <div
                                        key={
                                            visa.visaId ||
                                            index
                                        }
                                        className="profile-card"
                                    >

                                        <h3>
                                            Visa #{index + 1}
                                        </h3>

                                        <div className="profile-info-grid">

                                            <div>
                                                <label>
                                                    Visa Type
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        visa.visaType ||
                                                        visa.visaName
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    EAD Type
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        visa.eadType
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Other EAD Type
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        visa.otherEadType
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Expiry Date
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        visa.visaExpiryDate
                                                    )}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="profile-empty">
                            No visa information found.
                        </div>

                    )}

                </div>
            )}

            {/* ================================================= */}
            {/* EMERGENCY CONTACT TAB */}
            {/* ================================================= */}

            {activeTab === "emergency" && (

                <div className="profile-tab-content">

                    <h3>
                        Emergency Contacts
                    </h3>

                    {employee.emergencyContacts?.length > 0 ? (

                        <div className="profile-section-grid">

                            {employee.emergencyContacts.map(
                                (contact, index) => (

                                    <div
                                        key={
                                            contact.emergencyContactId ||
                                            index
                                        }
                                        className="profile-card"
                                    >

                                        <h3>
                                            Contact #{index + 1}
                                        </h3>

                                        <div className="profile-info-grid">

                                            <div>
                                                <label>
                                                    Name
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        contact.contactName
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Relationship
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        contact.relationship
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Phone
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        contact.phoneNumber
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Address
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        contact.addressLine1
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    City
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        contact.city
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    State
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        contact.state
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Country
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        contact.country
                                                    )}
                                                </span>
                                            </div>

                                            <div>
                                                <label>
                                                    Zip Code
                                                </label>

                                                <span>
                                                    {displayValue(
                                                        contact.zipcode ||
                                                        contact.zipCode
                                                    )}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="profile-empty">
                            No emergency contact information found.
                        </div>

                    )}

                </div>
            )}

        </div>
    );
}

export default MyProfilePage;