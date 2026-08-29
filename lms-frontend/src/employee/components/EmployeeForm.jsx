import React, { useState } from "react";
import api from "../../api/axios";
import "../styles/employeefrom.css";
import { useToast } from "../../shared/components/ToastContext";
// =====================================================
// PERSON COMPONENTS
// =====================================================

import PersonalInformationSection from "./person/PersonalInformationSection";
import ContactSection from "./person/ContactSection";
import AddressSection from "./person/AddressSection";
import EducationSection from "./person/EducationSection";
import WorkExperienceSection from "./person/WorkExperienceSection";
import VisaSection from "./person/VisaSection";
import DocumentSection from "./person/DocumentSection";
import EmergencyContactSection from "./person/EmergencyContactSection";

// =====================================================
// EMPLOYEE COMPONENT
// =====================================================

import EmploymentDetailsSection from "./EmploymentDetailsSection";

// =====================================================
// REVIEW
// =====================================================

import EmployeeReviewSection from "./EmployeeReviewSection";

// =====================================================
// STEPPER
// =====================================================

import EmployeeStepper from "./EmployeeStepper";

// =====================================================
// VALIDATION
// =====================================================

import { validateStep } from "../utils/employeeValidation";

// =====================================================
// STYLES
// =====================================================

import "../../shared/styles/sidebar.css";
import "../styles/employee.css";

// =====================================================
// COMPONENT
// =====================================================

function EmployeeForm({
                        formData,
                        handleChange,
                        handleSubmit,
                        setFormData,

                        // ADD / UPDATE
                        isUpdate = false,

                        // EMAIL ERROR
                        emailError = "",
                        setEmailError = () => {},

                        // PERSON MASTERS
                        genders = [],
                        nationalities = [],

                        // EMPLOYEE MASTERS
                        departments = [],
                        designations = [],
                        employeeStatuses = [],
                        workModes = [],
                        shifts = [],
                        locations = [],
                      }) {

  // =====================================================
  // CURRENT STEP
  // =====================================================
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // =====================================================
  // REQUIRED FIELD STYLE
  // =====================================================

  const starStyle = {
    color: "red",
    fontWeight: "bold",
    marginLeft: "2px",
  };

  // =====================================================
  // STEPS
  // =====================================================

  const EMPLOYEE_STEPS = [
    "Personal",
    "Contact",
    "Address",
    "Education",
    "Experience",
    "Visa",
    "Documents",
    "Emergency",
    "Employment",
    "Review",
  ];

  const totalSteps = EMPLOYEE_STEPS.length;

  // =====================================================
  // GENERIC ARRAY CHANGE
  // =====================================================

  const handleArrayChange = (
      arrayName,
      index,
      field,
      value
  ) => {

    setFormData((prev) => {

      const updated = [
        ...(prev?.[arrayName] || []),
      ];

      updated[index] = {
        ...(updated[index] || {}),
        [field]: value,
      };

      return {
        ...prev,
        [arrayName]: updated,
      };
    });
  };

  // =====================================================
  // CONTACT CHANGE
  // =====================================================

  const handleContactChange = (
      index,
      field,
      value
  ) => {

    if (
        field === "contactValue" &&
        (index === 1 || index === 3)
    ) {

      value = String(value || "")
          .replace(/\D/g, "")
          .slice(0, 10);
    }

    handleArrayChange(
        "contacts",
        index,
        field,
        value
    );
  };

  // =====================================================
  // EDUCATION CHANGE
  // =====================================================

  const handleEducationChange = (
      index,
      field,
      value
  ) => {

    handleArrayChange(
        "educations",
        index,
        field,
        value
    );
  };

  // =====================================================
  // EXPERIENCE CHANGE
  // =====================================================

  const handleExperienceChange = (
      index,
      field,
      value
  ) => {

    handleArrayChange(
        "workExperiences",
        index,
        field,
        value
    );
  };

  // =====================================================
  // VISA CHANGE
  // =====================================================

  const handleVisaChange = (
      index,
      field,
      value
  ) => {

    setFormData((prev) => {

      const visas = [
        ...(prev?.visas || []),
      ];

      visas[index] = {
        ...(visas[index] || {}),
        [field]: value,
      };

      // VISA TYPE CHANGED
      if (field === "visaType") {

        if (value !== "EAD") {

          visas[index].eadType = "";
          visas[index].otherEadType = "";
        }

        if (
            value === "US Citizen" ||
            value === "Green Card"
        ) {

          visas[index].visaExpiryDate = "";
        }
      }

      // EAD TYPE CHANGED
      if (
          field === "eadType" &&
          value !== "Other"
      ) {

        visas[index].otherEadType = "";
      }

      return {
        ...prev,
        visas,
      };
    });
  };

  // =====================================================
  // DOCUMENT CHANGE
  // =====================================================

  const handleDocumentChange = (
      index,
      field,
      value
  ) => {

    handleArrayChange(
        "documents",
        index,
        field,
        value
    );
  };

  // =====================================================
  // ADDRESS CHANGE
  // =====================================================
  //
  // IMPORTANT:
  //
  // Frontend may use:
  //
  //     zipCode
  //
  // Backend uses:
  //
  //     zipcode
  //
  // We ALWAYS keep both synchronized.
  //
  // Also, if "Same As Permanent Address" is checked,
  // Permanent Address automatically updates Current Address.
  //
  // =====================================================

  const handleAddressChange = (
      index,
      field,
      value
  ) => {

    setFormData((prev) => {

      const addresses = [
        ...(prev?.addresses || []),
      ];

      // =================================================
      // EXISTING ADDRESS
      // =================================================

      const updatedAddress = {
        ...(addresses[index] || {}),
      };

      // =================================================
      // ZIP CODE
      // =================================================

      if (
          field === "zipcode" ||
          field === "zipCode"
      ) {

        const normalizedZip =
            String(value || "")
                .replace(/\D/g, "")
                .slice(0, 10);

        // Keep BOTH names
        updatedAddress.zipcode =
            normalizedZip;

        updatedAddress.zipCode =
            normalizedZip;
      }

          // =================================================
          // NORMAL FIELD
      // =================================================

      else {

        updatedAddress[field] =
            value;
      }

      // =================================================
      // SAVE PERMANENT/CURRENT ADDRESS
      // =================================================

      addresses[index] =
          updatedAddress;

      // =================================================
      // SAME AS PERMANENT
      // =================================================
      //
      // If permanent address changes and checkbox
      // is checked, copy it to current address.
      //
      // =================================================

      if (
          index === 0 &&
          prev?.sameAsPermanent === true
      ) {

        const current =
            addresses[1] || {};

        const permanentZip =
            updatedAddress.zipcode ??
            updatedAddress.zipCode ??
            "";

        addresses[1] = {

          ...updatedAddress,

          // -----------------------------------------
          // Preserve current address database ID
          // -----------------------------------------

          addressId:
              current.addressId ??
              null,

          // -----------------------------------------
          // Preserve current address type
          // -----------------------------------------

          addressTypeId:
              current.addressTypeId ??
              null,

          // -----------------------------------------
          // Current address name
          // -----------------------------------------

          addressTypeName:
              "CURRENT",

          // -----------------------------------------
          // Keep both ZIP fields
          // -----------------------------------------

          zipcode:
          permanentZip,

          zipCode:
          permanentZip,
        };
      }

      return {
        ...prev,
        addresses,
      };
    });
  };

  // =====================================================
  // SAME AS PERMANENT
  // =====================================================

  const handleSameAsPermanent = (e) => {

    const checked =
        Boolean(e.target.checked);

    setFormData((prev) => {

      const addresses = [
        ...(prev?.addresses || []),
      ];

      const permanent =
          addresses[0] || {};

      const current =
          addresses[1] || {};

      // =================================================
      // CHECKED
      // =================================================

      if (checked) {

        const permanentZip =
            permanent.zipcode ??
            permanent.zipCode ??
            "";

        addresses[1] = {

          ...permanent,

          // -----------------------------------------
          // Preserve current address ID
          // -----------------------------------------

          addressId:
              current.addressId ??
              null,

          // -----------------------------------------
          // Preserve current address type ID
          // -----------------------------------------

          addressTypeId:
              current.addressTypeId ??
              null,

          // -----------------------------------------
          // Current address type
          // -----------------------------------------

          addressTypeName:
              "CURRENT",

          // -----------------------------------------
          // ZIP CODE
          // -----------------------------------------

          zipcode:
          permanentZip,

          zipCode:
          permanentZip,
        };
      }

          // =================================================
          // UNCHECKED
      // =================================================

      else {

        addresses[1] = {

          ...current,

          addressLine1: "",
          addressLine2: "",

          city: "",
          state: "",
          country: "",

          zipcode: "",
          zipCode: "",

          formattedAddress: "",

          latitude: null,
          longitude: null,

          addressTypeName:
              "CURRENT",
        };
      }

      return {

        ...prev,

        sameAsPermanent:
        checked,

        addresses,
      };
    });
  };

  // =====================================================
  // EMERGENCY CONTACT CHANGE
  // =====================================================

  const handleEmergencyContactChange = (
      index,
      field,
      value
  ) => {

    // PHONE
    if (field === "phoneNumber") {

      value = String(value || "")
          .replace(/\D/g, "")
          .slice(0, 10);
    }

    // ZIP CODE
    if (
        field === "zipcode" ||
        field === "zipCode"
    ) {

      value = String(value || "")
          .replace(/\D/g, "")
          .slice(0, 10);
    }

    handleArrayChange(
        "emergencyContacts",
        index,
        field,
        value
    );
  };

  // =====================================================
  // ADD EDUCATION
  // =====================================================

  const addEducation = () => {

    setFormData((prev) => ({

      ...prev,

      educations: [

        ...(prev?.educations || []),

        {
          educationId: null,

          qualification: "",
          instituteName: "",
          fieldOfStudy: "",
          passingYear: "",
        },
      ],
    }));
  };

  // =====================================================
  // REMOVE EDUCATION
  // =====================================================

  const removeEducation = (
      index
  ) => {

    setFormData((prev) => {

      const updated = [
        ...(prev?.educations || []),
      ];

      updated.splice(index, 1);

      return {
        ...prev,
        educations: updated,
      };
    });
  };

  // =====================================================
  // ADD VISA
  // =====================================================

  const addVisa = () => {

    setFormData((prev) => ({

      ...prev,

      visas: [

        ...(prev?.visas || []),

        {
          visaId: null,

          visaType: "",
          eadType: "",
          otherEadType: "",
          visaExpiryDate: "",
        },
      ],
    }));
  };

  // =====================================================
  // REMOVE VISA
  // =====================================================

  const removeVisa = (
      index
  ) => {

    setFormData((prev) => {

      const updated = [
        ...(prev?.visas || []),
      ];

      updated.splice(index, 1);

      return {
        ...prev,
        visas: updated,
      };
    });
  };

  // =====================================================
  // ADD DOCUMENT
  // =====================================================

  const addDocument = () => {

    setFormData((prev) => ({

      ...prev,

      documents: [

        ...(prev?.documents || []),

        {
          personDocumentId: null,
          documentType: "",
          documentNumber: "",
          fileName: "",
          file: null,
        },
      ],
    }));
  };

  // =====================================================
  // REMOVE DOCUMENT
  // =====================================================

  const removeDocument = (
      index
  ) => {

    setFormData((prev) => {

      const updated = [
        ...(prev?.documents || []),
      ];

      updated.splice(index, 1);

      return {
        ...prev,
        documents: updated,
      };
    });
  };

  // =====================================================
  // DOCUMENT FILE UPLOAD
  // =====================================================

  const handleDocumentFileChange = (
      index,
      e
  ) => {

    const file =
        e.target.files?.[0];

    if (!file) {
      return;
    }

    // ==========================================
    // MAX FILE SIZE — 5 MB
    // ==========================================

    const maxFileSize =
        5 * 1024 * 1024;

    if (file.size > maxFileSize) {

      showToast(
          "File size must be less than 5 MB.",
          "error"
      );

      e.target.value = "";
      return;
    }

    // ==========================================
    // ALLOWED FILE TYPES
    // ==========================================

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {

      showToast(
          "Only PDF, JPG, JPEG, PNG, DOC and DOCX files are allowed.",
          "error"
      );

      e.target.value = "";
      return;
    }

    // ==========================================
    // STORE FILE IN REACT STATE
    // ==========================================

    setFormData((prev) => {

      const updated = [
        ...(prev?.documents || []),
      ];

      updated[index] = {

        ...(updated[index] || {}),

        fileName:
        file.name,

        file: file,
      };

      return {
        ...prev,
        documents: updated,
      };
    });
  };
  // =====================================================
  // ADD WORK EXPERIENCE
  // =====================================================

  const addWorkExperience = () => {

    setFormData((prev) => ({

      ...prev,

      workExperiences: [

        ...(prev?.workExperiences || []),

        {
          experienceId: null,

          companyName: "",
          designation: "",

          startDate: "",
          endDate: "",

          currentlyWorking:
              false,

          skillsUsed: "",
          jobDescription: "",
        },
      ],
    }));
  };

  // =====================================================
  // REMOVE WORK EXPERIENCE
  // =====================================================

  const removeExperience = (
      index
  ) => {

    setFormData((prev) => {

      const updated = [
        ...(prev?.workExperiences || []),
      ];

      updated.splice(index, 1);

      return {
        ...prev,

        workExperiences:
        updated,
      };
    });
  };

  // =====================================================
  // NEXT STEP
  // =====================================================

  const nextStep = () => {

    const error =
        validateStep(
            currentStep,
            formData
        );

    if (error) {

      showToast(error, "error");

      return;
    }

    if (
        currentStep <
        totalSteps
    ) {

      setCurrentStep(
          (prev) =>
              prev + 1
      );
    }
  };

  // =====================================================
  // PREVIOUS STEP
  // =====================================================

  const previousStep = () => {

    if (
        currentStep > 1
    ) {

      setCurrentStep(
          (prev) =>
              prev - 1
      );
    }
  };

  // =====================================================
  // GO TO STEP
  // =====================================================

  const goToStep = (
      step
  ) => {

    if (
        step >= 1 &&
        step <= totalSteps
    ) {

      setCurrentStep(
          step
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (

      // <form
      //     className="employee-form"
      //     onSubmit={handleSubmit}
      // >

      <form
          className="employee-form"
          onSubmit={(e) => {
            e.preventDefault();

            // NEVER submit before Review step
            if (currentStep !== totalSteps) {
              console.log(
                  "Blocked submit. Current step:",
                  currentStep
              );
              return;
            }

            console.log(
                "Submitting employee from Review step"
            );

            handleSubmit(e);
          }}
      >
        {/* ================================================= */}
        {/* STEPPER */}
        {/* ================================================= */}

        <EmployeeStepper
            steps={
              EMPLOYEE_STEPS
            }
            currentStep={
              currentStep
            }
            setCurrentStep={
              goToStep
            }
        />

        {/* ================================================= */}
        {/* STEP 1 — PERSONAL */}
        {/* ================================================= */}

        {currentStep === 1 && (

            <PersonalInformationSection

                formData={
                  formData
                }

                handleChange={
                  handleChange
                }

                setFormData={
                  setFormData
                }

                genders={
                  genders
                }

                nationalities={
                  nationalities
                }

                starStyle={
                  starStyle
                }

                isUpdate={
                  isUpdate
                }
            />
        )}

        {/* ================================================= */}
        {/* STEP 2 — CONTACT */}
        {/* ================================================= */}

        {currentStep === 2 && (

            <ContactSection

                formData={
                  formData
                }

                handleArrayChange={
                  handleArrayChange
                }

                handleContactChange={
                  handleContactChange
                }

                starStyle={
                  starStyle
                }

                isUpdate={
                  isUpdate
                }

                emailError={
                  emailError
                }

                setEmailError={
                  setEmailError
                }
            />
        )}

        {/* ================================================= */}
        {/* STEP 3 — ADDRESS */}
        {/* ================================================= */}

        {currentStep === 3 && (

            <AddressSection

                formData={
                  formData
                }

                handleAddressChange={
                  handleAddressChange
                }

                handleSameAsPermanent={
                  handleSameAsPermanent
                }

                starStyle={
                  starStyle
                }

                isUpdate={
                  isUpdate
                }
            />
        )}

        {/* ================================================= */}
        {/* STEP 4 — EDUCATION */}
        {/* ================================================= */}

        {currentStep === 4 && (

            <EducationSection

                formData={
                  formData
                }

                handleArrayChange={
                  handleArrayChange
                }

                handleEducationChange={
                  handleEducationChange
                }

                addEducation={
                  addEducation
                }

                removeEducation={
                  removeEducation
                }

                starStyle={
                  starStyle
                }

                isUpdate={
                  isUpdate
                }
            />
        )}

        {/* ================================================= */}
        {/* STEP 5 — EXPERIENCE */}
        {/* ================================================= */}

        {currentStep === 5 && (

            <WorkExperienceSection

                formData={
                  formData
                }

                handleArrayChange={
                  handleArrayChange
                }

                handleExperienceChange={
                  handleExperienceChange
                }

                addExperience={
                  addWorkExperience
                }

                removeExperience={
                  removeExperience
                }

                starStyle={
                  starStyle
                }

                isUpdate={
                  isUpdate
                }
            />
        )}

        {/* ================================================= */}
        {/* STEP 6 — VISA */}
        {/* ================================================= */}

        {currentStep === 6 && (

            <VisaSection

                formData={
                  formData
                }

                handleArrayChange={
                  handleArrayChange
                }

                handleVisaChange={
                  handleVisaChange
                }

                addVisa={
                  addVisa
                }

                removeVisa={
                  removeVisa
                }

                starStyle={
                  starStyle
                }

                isUpdate={
                  isUpdate
                }
            />
        )}

        {/* ================================================= */}
        {/* STEP 7 — DOCUMENTS */}
        {/* ================================================= */}

        {currentStep === 7 && (

            <DocumentSection

                formData={
                  formData
                }

                handleArrayChange={
                  handleArrayChange
                }

                handleDocumentChange={
                  handleDocumentChange
                }

                handleDocumentFileChange={
                  handleDocumentFileChange
                }

                addDocument={
                  addDocument
                }

                removeDocument={
                  removeDocument
                }

                starStyle={
                  starStyle
                }

                isUpdate={
                  isUpdate
                }
            />
        )}

        {/* ================================================= */}
        {/* STEP 8 — EMERGENCY */}
        {/* ================================================= */}

        {currentStep === 8 && (

            <EmergencyContactSection

                formData={
                  formData
                }

                handleArrayChange={
                  handleArrayChange
                }

                handleEmergencyContactChange={
                  handleEmergencyContactChange
                }

                starStyle={
                  starStyle
                }

                isUpdate={
                  isUpdate
                }
            />
        )}

        {/* ================================================= */}
        {/* STEP 9 — EMPLOYMENT */}
        {/* ================================================= */}

        {currentStep === 9 && (

            <EmploymentDetailsSection

                formData={
                  formData
                }

                handleChange={
                  handleChange
                }

                departments={
                  departments
                }

                designations={
                  designations
                }

                employeeStatuses={
                  employeeStatuses
                }

                workModes={
                  workModes
                }

                shifts={
                  shifts
                }

                locations={
                  locations
                }

                starStyle={
                  starStyle
                }

                isUpdate={
                  isUpdate
                }
            />
        )}

        {/* ================================================= */}
        {/* STEP 10 — REVIEW */}
        {/* ================================================= */}

        {currentStep === 10 && (

            <EmployeeReviewSection
                formData={formData}

                genders={genders}
                nationalities={nationalities}

                departments={departments}
                designations={designations}
                employeeStatuses={employeeStatuses}
                workModes={workModes}
                shifts={shifts}
                locations={locations}

                onEditStep={goToStep}

                isUpdate={isUpdate}
            />
        )}

        {/* ================================================= */}
        {/* WIZARD BUTTONS */}
        {/* ================================================= */}

        <div
            className="wizard-buttons"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: "30px",
              gap: "15px",
            }}
        >

          {/* PREVIOUS */}

          <button
              type="button"
              disabled={currentStep === 1}
              onClick={previousStep}
          >
            ← Previous
          </button>

          {/* ================================================= */}
          {/* STEP 1 - 8 : NEXT */}
          {/* STEP 9     : REVIEW */}
          {/* STEP 10    : SAVE / UPDATE */}
          {/* ================================================= */}

          {currentStep <= 8 && (

              <button
                  type="button"
                  onClick={nextStep}
              >
                Next →
              </button>

          )}

          {currentStep === 9 && (

              <button
                  type="button"
                  onClick={nextStep}
              >
                Review Employee →
              </button>

          )}

          {currentStep === 10 && (

              <button
                  type="submit"
              >
                {isUpdate
                    ? "Update Employee"
                    : "Save Employee"}
              </button>

          )}

        </div>

      </form>
  );
}

export default EmployeeForm;