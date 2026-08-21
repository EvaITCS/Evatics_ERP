import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import FormStepper from "../components/FormStepper";
import FormSections from "../components/FormSections";
import AcademicSections from "../components/AcademicSections";
import ReviewSection from "../components/ReviewSection";
import StudentLayout from "../layouts/StudentLayout";
import studentService from "../services/studentService";

import {
    formatPhoneNumber,
    mapVisaNameToValue,
    validateForm,
    buildStudentFormData,
    createEducation,
    createExperience,
    capitalizeFirstLetter
} from "../utils/studentFormUtils";
import "../styles/MyForm.css";

// Static Options
const visaOptions = [
    { visaId: "US_CITIZEN", visaName: "US Citizen" },
    { visaId: "GREEN_CARD", visaName: "Green Card" },
    { visaId: "EAD", visaName: "EAD" }
];

export default function StudentMyForm() {
    // ==========================================
    // 1. STATES & REFS
    // ==========================================
    const [student, setStudent] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); 
    const [application, setApplication] = useState(null);
    const [errors, setErrors] = useState({});
    
    // Multi-step Flow States
    const [currentStep, setCurrentStep] = useState(0);
    const steps = ["Personal", "Address", "Education", "Experience", "Documents", "Review"];
    
    const formRef = useRef(null);

    // Dynamic Passing Years Array (from 1980 to current year)
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from(
        { length: currentYear - 1980 + 1 },
        (_, index) => String(currentYear - index)
    );

    // Form Fields State 
    const [formData, setFormData] = useState({
        candidateId: "",
        personId: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        alternateEmail: "",
        phoneCountryCode: "+1",
        phone: "",
        alternateCountryCode: "+1",
        alternatePhone: "",

        // ADDRESS
        houseNumber: "",
        addressLine: "",
        country: "United States",
        state: "",
        city: "",
        zipcode: "",

        visaType: "",
        eadType: "",
        otherEadType: "",
        visaExpiryDate: ""
    });

    // Dynamic Lists (Initialized via Utils)
    const [educations, setEducations] = useState([createEducation()]);
    const [experiences, setExperiences] = useState([createExperience()]);

    // Document Files
    const [resume, setResume] = useState(null);
    const [idProof, setIdProof] = useState(null);
    const [transcript, setTranscript] = useState(null);

    // Helper function to format personId as application number (e.g. 1 -> APP00001)
   const formatApplicationNumber = (personId) => {
    if (!personId) return "";

    return "APP" + personId;
};

    // ==========================================
    // 2. EFFECTS & INITIAL LOAD
    // ==========================================
    useEffect(() => {
        fetchApplication();
    }, []);

    useEffect(() => {
        const email = localStorage.getItem("email");

        studentService
            .getDashboard(email)
            .then((res) => {
                setStudent(res.data);
            })
            .catch((err) => console.error(err));
    }, []);

    // ==========================================
    // 3. API METHODS
    // ==========================================
   const fetchApplication = async () => {
    try {
        const response = await api.get("/student/application");

        const masterData = response.data;

        if (masterData) {
            const stageName =
                masterData.applicationStage?.applicationStageName ||
                masterData.applicationStage ||
                "";

            if (stageName === "RECHECK_REQUIRED") {
                setCurrentStep(5);
            } else {
                const savedStep = Number(masterData.currentStep ?? 0);
                setCurrentStep(
                    Math.min(savedStep, steps.length - 1)
                );
            }

            setApplication(masterData);

            const submittedStages = new Set([
                "SUBMITTED",
                "UNDER_REVIEW",
                "ENROLLED",
                "ACTIVE",
                "COURSE_COMPLETED",
                "PLACED",
                "DROPPED"
            ]);

            setIsSubmitted(
                submittedStages.has(stageName)
            );

            const rawVisa =
                masterData.visaType ||
                masterData.visa ||
                "";

            const mappedVisa =
                mapVisaNameToValue(
                    rawVisa,
                    visaOptions
                ) || rawVisa;

            const derivedPersonId =
                masterData.personId ||
                masterData.person?.personId ||
                "";

            const state = masterData.state || "";
            const city = masterData.city || "";

            setFormData({
                candidateId:
                    masterData.candidateId ||
                    derivedPersonId,

                personId: derivedPersonId,

                firstName:
                    masterData.firstName || "",

                middleName:
                    masterData.middleName || "",

                lastName:
                    masterData.lastName || "",

                email:
                    masterData.email || "",

                alternateEmail:
                    masterData.alternateEmail || "",

                phoneCountryCode:
                    masterData.phoneCountryCode || "+1",

                phone:
                    formatPhoneNumber(
                        masterData.phone || ""
                    ),

                alternateCountryCode:
                    masterData.alternateCountryCode || "+1",

                alternatePhone:
                    formatPhoneNumber(
                        masterData.alternatePhone || ""
                    ),

                // ADDRESS
                houseNumber:
                    masterData.houseNumber || "",

                addressLine:
                    masterData.addressLine || "",

                country:
                    masterData.country ||
                    "United States",

                state,

                city,

                zipcode:
                    masterData.zipcode || "",

                visaType: mappedVisa,

                eadType:
                    masterData.eadType || "",

                otherEadType:
                    masterData.otherEadType || "",

                visaExpiryDate:
                    masterData.visaExpiryDate
                        ? masterData.visaExpiryDate.split("T")[0]
                        : ""
            });

            setResume(
                masterData.resume ||
                masterData.resumePath ||
                null
            );

            setIdProof(
                masterData.idProof ||
                masterData.idProofPath ||
                null
            );

            setTranscript(
                masterData.transcript ||
                masterData.transcriptPath ||
                null
            );

            // EDUCATION
            if (
                masterData.educations &&
                masterData.educations.length > 0
            ) {
                setEducations(
                    masterData.educations.map((edu) => ({
                        qualification:
                            edu.qualification || "",

                        instituteName:
                            edu.instituteName || "",

                        fieldOfStudy:
                            edu.fieldOfStudy || "",

                        passingYear:
                            edu.passingYear
                                ? String(edu.passingYear)
                                : "",

                        isNew: false
                    }))
                );
            } else {
                setEducations([
                    createEducation()
                ]);
            }

            // EXPERIENCE
            if (
                masterData.experiences &&
                masterData.experiences.length > 0
            ) {
                setExperiences(
                    masterData.experiences.map((exp) => ({
                        companyName:
                            exp.companyName || "",

                        designation:
                            exp.designation || "",

                        startDate:
                            exp.startDate
                                ? exp.startDate.split("T")[0]
                                : "",

                        endDate:
                            exp.endDate
                                ? exp.endDate.split("T")[0]
                                : "",

                        currentlyWorking:
                            exp.currentlyWorking === true ||
                            exp.currentlyWorking === "true" ||
                            exp.currentlyWorking === 1,

                        isNew: false
                    }))
                );
            } else {
                setExperiences([
                    createExperience()
                ]);
            }
        }
    } catch (error) {
        console.error(
            "Fetch Application Error:",
            error
        );
    }
};
    // ============================================
    // 4. NAVIGATION LOGIC
    // ============================================
    const nextStep = async () => {
        if (currentStep >= steps.length - 1) return;

        const valid = validate(currentStep);

        if (!valid) {
            setTimeout(() => {
                const firstError = formRef.current?.querySelector(".invalid-field");
                firstError?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }, 100);
            return;
        }

        try {
            const next = currentStep + 1;

            if (!isDirty) {
                setCurrentStep(next);
                return;
            }

            const data = buildStudentFormData({
                formData,
                educations,
                experiences,
                resume,
                idProof,
                transcript,
                currentStep: next
            });

            await api.put("/student/application/update", data);
            setCurrentStep(next);
            setIsDirty(false);
        } catch (err) {
            console.error(err);
            alert("Unable to save draft.");
        }
    };

    const previousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // ============================================
    // 5. FIELD CHANGE HANDLERS
    // ============================================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setIsDirty(true);

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }

        if (name === "alternatePhone") {
            setFormData(prev => ({ ...prev, alternatePhone: formatPhoneNumber(value) }));
            return;
        }

        if (name === "visaType") {
            const isEAD = value === "EAD";
            const leavesNoExpiry = value === "US_CITIZEN";

            setFormData(prev => ({
                ...prev,
                visaType: value,
                eadType: isEAD ? prev.eadType : "",
                otherEadType: isEAD ? prev.otherEadType : "",
                visaExpiryDate: leavesNoExpiry ? "" : prev.visaExpiryDate
            }));
            return;
        }

        let updatedValue = value;

        if (
            name === "firstName" ||
            name === "middleName" ||
            name === "lastName"
        ) {
            updatedValue = capitalizeFirstLetter(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : updatedValue
        }));
    };

    // ============================================
    // 6. DYNAMIC LISTS HANDLERS
    // ============================================
    const addEducation = () => {
        setIsDirty(true);
        setEducations(prev => [...prev, createEducation()]);
    };

    const removeEducation = (index) => {
        if (educations.length === 1) return;
        setIsDirty(true);
        setEducations(prev => prev.filter((_, i) => i !== index));
    };

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        setIsDirty(true);
        setEducations(prev => {
            const updated = [...prev];
            let updatedValue = value;

            if (
                name === "instituteName" ||
                name === "fieldOfStudy"
            ) {
                updatedValue = capitalizeFirstLetter(value);
            }

            updated[index][name] = updatedValue;
            return updated;
        });

        const errKey = `edu_${index}_${name}`;
        if (errors[errKey]) {
            setErrors(prev => ({ ...prev, [errKey]: null }));
        }
    };

    const addExperience = () => {
        setIsDirty(true);
        setExperiences(prev => [...prev, createExperience()]);
    };

    const removeExperience = (index) => {
        if (experiences.length === 1) return;
        setIsDirty(true);
        setExperiences(prev => prev.filter((_, i) => i !== index));
    };

   const handleExperienceChange = (index, e) => {

    const { name, value, type, checked } = e.target;

    setIsDirty(true);

    setExperiences(prev => {
        const updated = [...prev];

        let updatedValue =
            type === "checkbox"
                ? checked
                : value;

        if (
            name === "companyName" ||
            name === "designation"
        ) {
            updatedValue = capitalizeFirstLetter(value);
        }

        updated[index] = {
            ...updated[index],
            [name]: updatedValue
        };

        // If currently working, clear end date
        if (
            name === "currentlyWorking" &&
            checked === true
        ) {
            updated[index].endDate = "";
        }

        return updated;
    });

    const errKey = `exp_${index}_${name}`;

    if (errors[errKey]) {
        setErrors(prev => ({
            ...prev,
            [errKey]: null
        }));
    }
};
    // ============================================
    // 7. FORM VALIDATION & SUBMISSION
    // ============================================
    const validate = (step = currentStep) => {
        const stepErrors = validateForm({
            currentStep: step,
            formData,
            educations,
            experiences,
            resume,
            idProof,
            transcript
        });

        if (Object.keys(stepErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...stepErrors }));
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        let formIsValid = true;
        setErrors({}); 
        
        for (let i = 0; i < steps.length - 1; i++) {
            if (!validate(i)) {
                formIsValid = false;
                setCurrentStep(i); 
                break;
            }
        }

        if (!formIsValid) return;

        try {
            const data = buildStudentFormData({
                formData,
                educations,
                experiences,
                resume,
                idProof,
                transcript,
                currentStep: steps.length - 1
            });
            await api.put("/student/application/update", data);

            await api.put("/student/final-submit");

            alert("Application Submitted Successfully");
            setIsDirty(false);
            await fetchApplication();
        } catch (err) {
            console.error("Submission Error: ", err);
            alert("Unable to submit application. Please try again.");
        }
    };

    // ============================================
    // 8. FORM DERIVED STATES
    // ============================================
    const isVisaExpiryDisabled = formData.visaType === "US_CITIZEN";

    const activePersonId = application?.personId || application?.person?.personId || formData.personId;
    const formattedApplicationNo = formatApplicationNumber(activePersonId);

    const currentApplicationStage = application?.applicationStage?.applicationStageName || application?.applicationStage || "";

    if (!student) {
        return <h2>Loading...</h2>;
    }

    // ==========================================
    // 9. RETURN BLOCK
    // ==========================================
    return (
        <StudentLayout student={student}>
            <div className="student-form-container">
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <FormStepper
                        steps={steps}
                        currentStep={currentStep}
                    />

                    <FormSections
                        currentStep={currentStep}
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                        applicationNumber={formattedApplicationNo}
                        yearsArray={yearsArray} 
                        visaOptions={visaOptions}
                        isVisaExpiryDisabled={isVisaExpiryDisabled}
                        nextStep={nextStep}
                        previousStep={previousStep}
                        isSubmitted={isSubmitted}
                    />

                    <AcademicSections
                        currentStep={currentStep}
                        educations={educations}
                        experiences={experiences}
                        yearsArray={yearsArray}
                        errors={errors}
                        handleEducationChange={handleEducationChange}
                        handleExperienceChange={handleExperienceChange}
                        addEducation={addEducation}
                        removeEducation={removeEducation}
                        addExperience={addExperience}
                        removeExperience={removeExperience}
                        resume={resume}
                        setResume={setResume}
                        idProof={idProof}
                        setIdProof={setIdProof}
                        transcript={transcript}
                        setTranscript={setTranscript}
                        application={application}
                        setIsDirty={setIsDirty}
                        setErrors={setErrors}
                        previousStep={previousStep}
                        nextStep={nextStep}
                        isSubmitted={isSubmitted}
                    />

                    <ReviewSection
                        currentStep={currentStep}
                        formData={formData}
                        educations={educations}
                        experiences={experiences}
                        resume={resume}
                        idProof={idProof}
                        transcript={transcript}
                        previousStep={previousStep}
                        handleSubmit={handleSubmit}
                        setCurrentStep={setCurrentStep}
                        visaOptions={visaOptions}
                        applicationNumber={formattedApplicationNo}
                        isSubmitted={isSubmitted}
                        status={currentApplicationStage}
                        recheckReason={application?.recheckReason}
                    />
                </form>
            </div>
        </StudentLayout>
    );
}