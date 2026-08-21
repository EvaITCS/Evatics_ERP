// =============================================
// BUILD STUDENT FORM DATA
// =============================================

export const buildStudentFormData = ({
    formData,
    educations,
    experiences,
    resume,
    idProof,
    transcript,
    currentStep
}) => {
    const data = new FormData();

    // =========================================
    // BASIC FORM FIELDS
    // =========================================

    Object.keys(formData).forEach((key) => {
        const value = formData[key];

        // houseNumber is used only to build addressLine.
        // Do not send it separately.
        if (key === "houseNumber") {
            return;
        }

        if (value !== null && value !== undefined) {
            // Phone numbers should contain digits only
            if (key === "phone" || key === "alternatePhone") {
                data.append(
                    key,
                    String(value).replace(/\D/g, "")
                );
            } else {
                data.append(key, value);
            }
        }
    });

    // =========================================
    // COMBINED ADDRESS
    // =========================================
   const houseNumber =
    String(formData.houseNumber || "").trim();

let streetAddress =
    String(formData.addressLine || "").trim();

// Prevent duplicate house/building number
// Example:
// houseNumber = "1111"
// addressLine = "1111 Eastman Brook"
// Result should be:
// "1111 Eastman Brook"
if (
    houseNumber &&
    streetAddress
) {
    const escapedHouseNumber =
        houseNumber.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

    const houseNumberPattern =
        new RegExp(
            `^${escapedHouseNumber}(?:\\s+|$)`,
            "i"
        );

    if (houseNumberPattern.test(streetAddress)) {
        streetAddress =
            streetAddress
                .replace(
                    houseNumberPattern,
                    ""
                )
                .trim();
    }
}

const combinedAddress = [
    houseNumber,
    streetAddress
]
    .filter(Boolean)
    .join(" ");

data.set(
    "addressLine",
    combinedAddress
);

    // Current step
    data.append("currentStep", currentStep);

    // =========================================
    // EDUCATION
    // =========================================

    educations.forEach((edu, index) => {

        if (edu.qualification?.trim()) {
            data.append(
                `educations[${index}].qualification`,
                edu.qualification.trim()
            );
        }

        if (edu.instituteName?.trim()) {
            data.append(
                `educations[${index}].instituteName`,
                edu.instituteName.trim()
            );
        }

        if (edu.fieldOfStudy?.trim()) {
            data.append(
                `educations[${index}].fieldOfStudy`,
                edu.fieldOfStudy.trim()
            );
        }

        if (edu.passingYear) {
            data.append(
                `educations[${index}].passingYear`,
                edu.passingYear
            );
        }
    });

    // =========================================
    // EXPERIENCE
    // =========================================

   experiences.forEach((exp, index) => {

    if (exp.companyName?.trim()) {
        data.append(
            `experiences[${index}].companyName`,
            exp.companyName.trim()
        );
    }

    if (exp.designation?.trim()) {
        data.append(
            `experiences[${index}].designation`,
            exp.designation.trim()
        );
    }

    if (exp.startDate) {
        data.append(
            `experiences[${index}].startDate`,
            exp.startDate
        );
    }

    // IMPORTANT
    data.append(
        `experiences[${index}].currentlyWorking`,
        exp.currentlyWorking ? "true" : "false"
    );

    // Currently working hone par end date nahi bhejna
    if (!exp.currentlyWorking && exp.endDate) {
        data.append(
            `experiences[${index}].endDate`,
            exp.endDate
        );
    }
});

    // =========================================
    // DOCUMENTS
    // =========================================

    if (resume instanceof File) {
        data.append("resume", resume);
    }

    if (idProof instanceof File) {
        data.append("idProof", idProof);
    }

    if (transcript instanceof File) {
        data.append("transcript", transcript);
    }

    return data;
};


// =============================================
// PHONE FORMAT
// 9876543210
// ↓
// 987-654-3210
// =============================================

export const formatPhoneNumber = (value) => {
    if (!value) return "";

    const phone = String(value).replace(/\D/g, "");

    if (phone.length <= 3) {
        return phone;
    }

    if (phone.length <= 6) {
        return `${phone.slice(0, 3)}-${phone.slice(3)}`;
    }

    return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
};



// =============================================
// DOCUMENT FILE VALIDATION
// PDF / DOC / DOCX ONLY
// =============================================

export const isValidDocumentFile = (file) => {
    if (!file) return false;

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    const fileName = file.name.toLowerCase();

    const hasValidExtension = allowedExtensions.some(
        (extension) => fileName.endsWith(extension)
    );

    return (
        allowedTypes.includes(file.type) &&
        hasValidExtension
    );
};

// =============================================
// ONLY DIGITS
// =============================================

export const onlyDigits = (value) => {
    if (!value) return "";

    return String(value).replace(/\D/g, "");
};


// =============================================
// CAPITALIZE FIRST LETTER
// =============================================

export const capitalizeFirstLetter = (value) => {
    if (!value) return "";

    return value
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};


// =============================================
// EMAIL VALIDATION
// =============================================

export const isValidEmail = (email) => {
    if (!email) return false;

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


// =============================================
// PHONE VALIDATION
// =============================================

export const isValidPhone = (phone) => {
    if (!phone) return false;

    const digits = String(phone).replace(/\D/g, "");

    return digits.length === 10;
};


// =============================================
// ZIP CODE VALIDATION
// US ZIP CODE
// Example: 12345
// =============================================

export const isValidZipCode = (zip) => {
    if (!zip) return false;

    return /^\d{5}(-\d{4})?$/.test(String(zip).trim());
};


// =============================================
// VISA ID -> VALUE
// =============================================

export const mapVisaNameToValue = (value, visaOptions) => {
    if (!value || !visaOptions) return "";

    const visa = visaOptions.find(
        (item) =>
            String(item.visaId) === String(value) ||
            item.visaName === value
    );

    return visa ? String(visa.visaId) : "";
};


// =============================================
// YEAR ARRAY
// CURRENT YEAR -> 1970
// =============================================

export const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 1970; year--) {
        years.push(year);
    }

    return years;
};


// =============================================
// EMPTY EDUCATION ROW
// =============================================

export const createEducation = () => ({
    qualification: "",
    instituteName: "",
    fieldOfStudy: "",
    passingYear: "",
    isNew: true
});


// =============================================
// EMPTY EXPERIENCE ROW
// =============================================

export const createExperience = () => ({
    companyName: "",
    designation: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    isNew: true
});


// =============================================
// COMPLETE FORM VALIDATION
// =============================================

export const validateForm = ({
    currentStep,
    formData,
    educations,
    experiences,
    resume,
    idProof,
    transcript
}) => {

    const errors = {};

    // =========================================
    // STEP 0
    // PERSONAL INFORMATION
    // =========================================

    if (currentStep === 0) {

        if (!formData.firstName?.trim()) {
            errors.firstName = "First Name is required";
        }

        if (!formData.lastName?.trim()) {
            errors.lastName = "Last Name is required";
        }

        if (!formData.visaType) {
            errors.visaType = "Visa Type is required";
        }

        // =====================================
        // EAD VALIDATION
        // =====================================

        if (formData.visaType === "EAD") {

            if (!formData.eadType) {
                errors.eadType = "Type of EAD is required";
            }

            if (
                formData.eadType === "Other" &&
                !formData.otherEadType?.trim()
            ) {
                errors.otherEadType =
                    "Please specify EAD Type";
            }

            if (!formData.visaExpiryDate) {
                errors.visaExpiryDate =
                    "Visa Expiry is required";
            }
        }
    }


    // =========================================
    // STEP 1
    // CONTACT & ADDRESS
    // =========================================

    if (currentStep === 1) {

        // Email
        if (!isValidEmail(formData.email)) {
            errors.email = "Valid Email required";
        }

        // Alternate Email
        if (
            formData.alternateEmail &&
            !isValidEmail(formData.alternateEmail)
        ) {
            errors.alternateEmail = "Invalid Email";
        }

        // Primary Phone
        if (!isValidPhone(formData.phone)) {
            errors.phone =
                "Phone must contain 10 digits";
        }

        // Alternate Phone
        if (
            formData.alternatePhone &&
            !isValidPhone(formData.alternatePhone)
        ) {
            errors.alternatePhone =
                "Invalid Phone";
        }

        // Country
        if (!formData.country?.trim()) {
            errors.country = "Country required";
        }

        // =====================================
        // STATE
        // IMPORTANT:
        // state is now String
        // =====================================

        if (!formData.state?.trim()) {
            errors.state = "State required";
        }

        // =====================================
        // CITY
        // IMPORTANT:
        // city is now String
        // =====================================

        if (!formData.city?.trim()) {
            errors.city = "City required";
        }

        // House / Building Number
        if (!formData.houseNumber?.trim()) {
            errors.houseNumber =
                "House / Building No. is required";
        }

        // Street Address
        if (!formData.addressLine?.trim()) {
            errors.addressLine =
                "Street Address is required";
        }

        // ZIP
        if (!isValidZipCode(formData.zipcode)) {
            errors.zipcode =
                "Zip Code must be 5 digits";
        }
    }


    // =========================================
    // STEP 2
    // EDUCATION
    // =========================================

    if (currentStep === 2) {

        educations.forEach((edu, index) => {

            if (!edu.qualification?.trim()) {
                errors[
                    `edu_${index}_qualification`
                ] = "Qualification required";
            }

            if (!edu.instituteName?.trim()) {
                errors[
                    `edu_${index}_instituteName`
                ] = "Institute required";
            }

            if (!edu.fieldOfStudy?.trim()) {
                errors[
                    `edu_${index}_fieldOfStudy`
                ] = "Field required";
            }

            if (!edu.passingYear) {
                errors[
                    `edu_${index}_passingYear`
                ] = "Passing Year required";
            }
        });
    }



    // =========================================
    // STEP 4
    // DOCUMENTS
    // =========================================

    if (currentStep === 4) {

        if (!resume) {
            errors.resume =
                "Resume is required";
        }

       
    }


    return errors;
};