import React from "react";
import "../styles/MyForm.css";
import {
    GraduationCap,
    Briefcase,
    FileText,
    ArrowRight,
    ArrowLeft,
    Plus,
    Trash2,
    CheckCircle
} from "lucide-react";
import { isValidDocumentFile } from "../utils/studentFormUtils";

export default function AcademicSections({
    currentStep,
    educations,
    experiences,
    setEducations,
    setExperiences,
    educationOptions,
    yearsArray,
    errors,
    handleEducationChange,
    handleExperienceChange,
    addEducation,
    removeEducation,
    addExperience,
    removeExperience,
    resume,
    setResume,
    idProof,
    setIdProof,
    transcript,
    setTranscript,
    application,
    setIsDirty,
    setErrors,
    previousStep,
    nextStep
}) {
    // ==========================================
    // STEP 2: EDUCATION DETAILS
    // ==========================================
    if (currentStep === 2) {
        return (
            <div className="form-step-container">
                {/* Header with Lucide Icon */}
                <div className="form-section-header">
                   
                    <div>
                        <h2 className="form-section-title">Education Details</h2>
                    </div>
                </div>

                {educations.map((edu, index) => (
                    <div key={index} className="dynamic-block" style={{ marginBottom: "20px" }}>
                        <div className="form-grid">
                            {/* Degree Selection */}
                            <div className="field-box">
                                <label>
                                    Qualification <span className="required">*</span>
                                </label>
                                <select
                                    name="qualification"
                                    value={edu.qualification || ""}
                                    onChange={(e) => handleEducationChange(index, e)}
                                    className={errors[`edu_${index}_qualification`] ? "invalid-field" : ""}
                                >
                                    <option value="">Select Qualification</option>
                                    <option value="High School">High School</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Associate">Associate</option>
                                    <option value="Bachelor">Bachelor</option>
                                    <option value="Master">Master</option>
                                    <option value="PhD">PhD</option>
                                </select>
                                {errors[`edu_${index}_qualification`] && (
                                    <span className="error-text">
                                        {errors[`edu_${index}_qualification`]}
                                    </span>
                                )}
                            </div>

                            {/* Institute Name */}
                            <div className="field-box">
                                <label>
                                    Institute Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="instituteName"
                                    value={edu.instituteName || ""}
                                    placeholder="University / Institute Name"
                                    onChange={(e) => handleEducationChange(index, e)}
                                    className={errors[`edu_${index}_instituteName`] ? "invalid-field" : ""}
                                />
                                {errors[`edu_${index}_instituteName`] && (
                                    <span className="error-text">
                                        {errors[`edu_${index}_instituteName`]}
                                    </span>
                                )}
                            </div>

                            {/* Field Of Study */}
                            <div className="field-box">
                                <label>
                                    Field Of Study <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fieldOfStudy"
                                    placeholder="e.g. Computer Science"
                                    value={edu.fieldOfStudy || ""}
                                    onChange={(e) => handleEducationChange(index, e)}
                                    className={errors[`edu_${index}_fieldOfStudy`] ? "invalid-field" : ""}
                                />
                                {errors[`edu_${index}_fieldOfStudy`] && (
                                    <span className="error-text">
                                        {errors[`edu_${index}_fieldOfStudy`]}
                                    </span>
                                )}
                            </div>

                            {/* Passing Year */}
                            <div className="field-box">
                                <label>
                                    Passing Year <span className="required">*</span>
                                </label>
                                <select
                                    name="passingYear"
                                    value={edu.passingYear || ""}
                                    onChange={(e) => handleEducationChange(index, e)}
                                    className={errors[`edu_${index}_passingYear`] ? "invalid-field" : ""}
                                >
                                    <option value="">Select Year</option>
                                    {yearsArray.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                {errors[`edu_${index}_passingYear`] && (
                                    <span className="error-text">
                                        {errors[`edu_${index}_passingYear`]}
                                    </span>
                                )}
                            </div>  
                        </div></div>
))}

                    {/* Combined Action Bar for Add & Remove Buttons */}
<div className="actions-row">
    <button
        type="button"
        className="add-btn"
        onClick={addEducation}
    >
        <Plus size={16} />
        <span>Add Education</span>
    </button>

    {educations[educations.length - 1]?.isNew && educations.length > 1 && (
        <button
            type="button"
            className="remove-btn"
            onClick={() => removeEducation(educations.length - 1)}
        >
            <Trash2 size={14} />
            <span>Remove Education</span>
        </button>
    )}
</div>

                {/* Step Navigation Controls */}
                <div className="step-navigation">
                    <button type="button" className="back-btn1" onClick={previousStep}>
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>
                    <button type="button" className="next-btn1" onClick={nextStep}>
                        <span>Next</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // STEP 3: WORK EXPERIENCE DETAILS
    // ==========================================
    if (currentStep === 3) {
        return (
            <div className="form-step-container">
                {/* Header with Lucide Icon */}
                <div className="form-section-header">
                  
                    <div>
                        <h2 className="form-section-title">Work Experience<span style={{fontSize:"18px"}}> (If Required)</span></h2>
                   
                    </div>
                </div>

                {experiences.map((exp, index) => (
                    <div key={index} className="dynamic-block" style={{ marginBottom: "20px" }}>
                        <div className="form-grid">
                            {/* Company Name */}
                            <div className="field-box">
                                <label>
                                    Company Name 
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="e.g. Acme Corp"
                                    value={exp.companyName || ""}
                                    onChange={(e) => handleExperienceChange(index, e)}
                                    className={errors[`exp_${index}_companyName`] ? "invalid-field" : ""}
                                />
                                {errors[`exp_${index}_companyName`] && (
                                    <span className="error-text">
                                        {errors[`exp_${index}_companyName`]}
                                    </span>
                                )}
                            </div>

                            {/* Job Title */}
                            <div className="field-box">
                                <label>
                                    Job Title 
                                </label>
                                <input
                                    type="text"
                                    name="designation"
                                    placeholder="e.g. Software Engineer"
                                    value={exp.designation || ""}
                                    onChange={(e) => handleExperienceChange(index, e)}
                                    className={errors[`exp_${index}_designation`] ? "invalid-field" : ""}
                                />
                                {errors[`exp_${index}_designation`] && (
                                    <span className="error-text">
                                        {errors[`exp_${index}_designation`]}
                                    </span>
                                )}
                            </div>

                            {/* Start Date */}
                            <div className="field-box">
                                <label>
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={exp.startDate || ""}
                                    onChange={(e) => handleExperienceChange(index, e)}
                                    className={errors[`exp_${index}_startDate`] ? "invalid-field" : ""}
                                />
                                {errors[`exp_${index}_startDate`] && (
                                    <span className="error-text">
                                        {errors[`exp_${index}_startDate`]}
                                    </span>
                                )}
                            </div>

                            {/* End Date */}
                             <div className="field-box">
                            <label>
                                End Date
                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={exp.endDate || ""}
                                disabled={Boolean(exp.currentlyWorking)}
                                onChange={(e) =>
                                    handleExperienceChange(index, e)
                                }
                                className={
                                    errors[`exp_${index}_endDate`]
                                        ? "invalid-field"
                                        : ""
                                }
                            />

                            {errors[`exp_${index}_endDate`] && (
                                <span className="error-text">
                                    {errors[`exp_${index}_endDate`]}
                                </span>
                            )}
                        </div>

                         {/* CURRENTLY WORKING */}
                        <div className="field-box">

                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer"
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name="currentlyWorking"
                                    checked={Boolean(exp.currentlyWorking)}
                                    onChange={(e) =>
                                        handleExperienceChange(index, {
                                            target: {
                                                name: "currentlyWorking",
                                                value: e.target.checked,
                                                type: "checkbox",
                                                checked: e.target.checked
                                            }
                                        })
                                    }
                                    style={{
                                        width: "16px",
                                        height: "16px",
                                        cursor: "pointer",
                                        accentColor: "#1e5bb8"
                                    }}
                                />

                                Currently Working
                            </label>

                        </div>
                       </div>
    </div>
))}

{/* Combined Action Bar for Add & Remove Experience Buttons */}
<div className="actions-row">
    <button
        type="button"
        className="add-btn"
        onClick={addExperience}
    >
        <Plus size={16} />
        <span>Add Experience</span>
    </button>

    {experiences[experiences.length - 1]?.isNew && experiences.length > 1 && (
        <button
            type="button"
            className="remove-btn"
            onClick={() => removeExperience(experiences.length - 1)}
        >
            <Trash2 size={14} />
            <span>Remove Experience</span>
        </button>
    )}
</div>
                {/* Step Navigation Controls */}
                <div className="step-navigation">
                    <button type="button" className="back-btn1" onClick={previousStep}>
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>
                    <button type="button" className="next-btn1" onClick={nextStep}>
                        <span>Next</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // STEP 4: DOCUMENT UPLOADS
    // ==========================================
    if (currentStep === 4) {
        return (
            <div className="form-step-container">
                {/* Header with Lucide Icon */}
                <div className="form-section-header">
                   
                    <div>
                        <h2 className="form-section-title">Upload Documents</h2>
                    </div>
                </div>
<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
    {/* Resume Upload Box */}
    <div className="file-upload-box field-box">
        <label>
            Resume <span className="required">*</span>
        </label>
        <input
            type="file"
           onChange={(e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!isValidDocumentFile(file)) {
        setResume(null);

        setErrors((prev) => ({
            ...prev,
            resume: "Only PDF, DOC, and DOCX files are allowed."
        }));

        e.target.value = "";
        return;
    }

    setResume(file);
    setIsDirty(true);

    setErrors((prev) => ({
        ...prev,
        resume: null
    }));
}}
            className={errors.resume ? "invalid-field" : ""}
        />
        {errors.resume && (
            <span className="error-text">{errors.resume}</span>
        )}
        {resume && !(resume instanceof File) && (
            <div className="file-status" style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "13px", color: "#16a34a" }}>
                <CheckCircle size={14} />
                <span>Existing Resume Uploaded</span>
            </div>
        )}
        {resume instanceof File && (
            <div className="file-status" style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "13px", color: "#2563eb" }}>
                <FileText size={14} />
                <span>{resume.name}</span>
            </div>
        )}
    </div>

    {/* ID Proof Upload Box */}
    <div className="file-upload-box field-box">
        <label>ID Proof</label>
        <input
            type="file"
            onChange={(e) => {
                setIdProof(e.target.files[0]);
                setIsDirty(true);
                if (errors.idProof) {
                    setErrors((prev) => ({
                        ...prev,
                        idProof: null
                    }));
                }
            }}
            className={errors.idProof ? "invalid-field" : ""}
        />
        {errors.idProof && (
            <span className="error-text">{errors.idProof}</span>
        )}
        {idProof && !(idProof instanceof File) && (
            <div className="file-status" style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "13px", color: "#16a34a" }}>
                <CheckCircle size={14} />
                <span>Existing ID Proof Uploaded</span>
            </div>
        )}
        {idProof instanceof File && (
            <div className="file-status" style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "13px", color: "#2563eb" }}>
                <FileText size={14} />
                <span>{idProof.name}</span>
            </div>
        )}
    </div>

    {/* Educational Transcript Box */}
    <div className="file-upload-box field-box">
        <label>Educational Transcript</label>
        <input
            type="file"
            onChange={(e) => {
                setTranscript(e.target.files[0]);
                setIsDirty(true);
            }}
        />
        {transcript && !(transcript instanceof File) && (
            <div className="file-status" style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "13px", color: "#16a34a" }}>
                <CheckCircle size={14} />
                <span>Existing Transcript Uploaded</span>
            </div>
        )}
        {transcript instanceof File && (
            <div className="file-status" style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "13px", color: "#2563eb" }}>
                <FileText size={14} />
                <span>{transcript.name}</span>
            </div>
        )}
    </div>
</div>
                {/* Step Navigation Controls */}
                <div className="step-navigation">
                    <button type="button" className="back-btn1" onClick={previousStep}>
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>
                    <button type="button" className="next-btn1" onClick={nextStep}>
                        <span>Review</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return null;
}