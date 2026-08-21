// =====================================================
// EMPLOYEE FORM VALIDATION
// =====================================================

export const validateStep = (step, formData) => {

    // =====================================================
    // STEP 1 — PERSONAL
    // =====================================================

    if (step === 1) {

        // FIRST NAME
        if (
            !formData?.firstName ||
            formData.firstName.trim() === ""
        ) {
            return "Please enter First Name.";
        }


        // LAST NAME — REQUIRED
        if (
            !formData?.lastName ||
            formData.lastName.trim() === ""
        ) {
            return "Please enter Last Name.";
        }

// =====================================================
// GENDER — REQUIRED
// =====================================================

        if (
            !formData?.genderId ||
            String(formData.genderId).trim() === ""
        ) {
            return "Please select Gender.";
        }
        // NATIONALITY — REQUIRED
        if (
            !formData?.nationalityId ||
            String(formData.nationalityId).trim() === ""
        ) {
            return "Please select Nationality.";
        }


        return null;
    }


    // =====================================================
    // STEP 2 — CONTACT
    // =====================================================

    if (step === 2) {

        const contacts =
            formData?.contacts || [];


        // PRIMARY EMAIL
        const primaryEmail =
            String(
                contacts?.[0]?.contactValue || ""
            ).trim();


        if (!primaryEmail) {
            return "Please enter Primary Email.";
        }


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(primaryEmail)) {
            return "Please enter a valid Primary Email.";
        }


        // PRIMARY PHONE
        const primaryPhone =
            String(
                contacts?.[1]?.contactValue || ""
            )
                .replace(/\D/g, "")
                .trim();


        if (!primaryPhone) {
            return "Please enter Primary Phone Number.";
        }


        if (!/^\d{10}$/.test(primaryPhone)) {
            return "Primary Phone Number must be exactly 10 digits.";
        }


        // ALTERNATE EMAIL — OPTIONAL
        const alternateEmail =
            String(
                contacts?.[2]?.contactValue || ""
            ).trim();


        if (
            alternateEmail &&
            !emailRegex.test(alternateEmail)
        ) {
            return "Please enter a valid Alternate Email.";
        }


        // ALTERNATE PHONE — OPTIONAL
        const alternatePhone =
            String(
                contacts?.[3]?.contactValue || ""
            )
                .replace(/\D/g, "")
                .trim();


        if (
            alternatePhone &&
            !/^\d{10}$/.test(alternatePhone)
        ) {
            return "Alternate Phone Number must be exactly 10 digits.";
        }


        return null;
    }


    // =====================================================
    // STEP 3 — ADDRESS
    // =====================================================

    if (step === 3) {

        const addresses =
            formData?.addresses || [];


        const permanent =
            addresses?.[0] || {};


        const current =
            addresses?.[1] || {};


        // ---------------------------------------------
        // PERMANENT ADDRESS
        // ---------------------------------------------

        if (
            !permanent.addressLine1 ||
            permanent.addressLine1.trim() === ""
        ) {
            return "Please enter Permanent Address Line 1.";
        }


        if (
            !permanent.country ||
            permanent.country.trim() === ""
        ) {
            return "Please select Permanent Country.";
        }


        if (
            !permanent.state ||
            permanent.state.trim() === ""
        ) {
            return "Please select Permanent State.";
        }


        if (
            !permanent.city ||
            permanent.city.trim() === ""
        ) {
            return "Please select Permanent City.";
        }


        const permanentZip =
            String(
                permanent.zipcode ||
                permanent.zipCode ||
                ""
            )
                .replace(/\D/g, "")
                .trim();


        if (!permanentZip) {
            return "Please enter Permanent Zip Code.";
        }


        // ---------------------------------------------
        // CURRENT ADDRESS
        // ---------------------------------------------

        if (!formData?.sameAsPermanent) {

            if (
                !current.addressLine1 ||
                current.addressLine1.trim() === ""
            ) {
                return "Please enter Current Address Line 1.";
            }


            if (
                !current.country ||
                current.country.trim() === ""
            ) {
                return "Please select Current Country.";
            }


            if (
                !current.state ||
                current.state.trim() === ""
            ) {
                return "Please select Current State.";
            }


            if (
                !current.city ||
                current.city.trim() === ""
            ) {
                return "Please select Current City.";
            }


            const currentZip =
                String(
                    current.zipcode ||
                    current.zipCode ||
                    ""
                )
                    .replace(/\D/g, "")
                    .trim();


            if (!currentZip) {
                return "Please enter Current Zip Code.";
            }
        }


        return null;
    }


    // =====================================================
    // STEP 4 — EDUCATION
    // =====================================================

    if (step === 4) {

        const educations =
            formData?.educations || [];


        // AT LEAST ONE EDUCATION REQUIRED
        if (educations.length === 0) {
            return "Please add at least one Education.";
        }


        // VALIDATE EDUCATION
        for (
            let i = 0;
            i < educations.length;
            i++
        ) {

            const education =
                educations[i] || {};


            // QUALIFICATION
            if (
                !education.qualification ||
                education.qualification.trim() === ""
            ) {
                return `Please select Qualification for Education #${i + 1}.`;
            }


            // INSTITUTE NAME
            if (
                !education.instituteName ||
                education.instituteName.trim() === ""
            ) {
                return `Please enter Institute Name for Education #${i + 1}.`;
            }


            // YEAR OF PASSING
            if (
                education.passingYear === null ||
                education.passingYear === undefined ||
                String(
                    education.passingYear
                ).trim() === ""
            ) {
                return `Please enter Year of Passing for Education #${i + 1}.`;
            }


            // YEAR FORMAT
            const passingYear =
                Number(
                    education.passingYear
                );


            if (
                !Number.isInteger(passingYear) ||
                passingYear < 1900 ||
                passingYear > new Date().getFullYear()
            ) {
                return `Please enter a valid Year of Passing for Education #${i + 1}.`;
            }
        }


        return null;
    }


    // =====================================================
    // STEP 5 — WORK EXPERIENCE
    // OPTIONAL
    // =====================================================

    if (step === 5) {

        return null;
    }


    // =====================================================
    // STEP 6 — VISA
    // =====================================================

    if (step === 6) {

        const visas =
            formData?.visas || [];


        // AT LEAST ONE VISA ENTRY
        if (visas.length === 0) {
            return "Please add Visa information.";
        }


        // VISA TYPE REQUIRED
        for (
            let i = 0;
            i < visas.length;
            i++
        ) {

            const visa =
                visas[i] || {};


            if (
                !visa.visaType ||
                visa.visaType.trim() === ""
            ) {
                return `Please select Visa Type for Visa #${i + 1}.`;
            }
        }


        return null;
    }


    // =====================================================
    // STEP 7 — DOCUMENTS
    // =====================================================

    if (step === 7) {

        const documents =
            formData?.documents || [];


        // AT LEAST ONE DOCUMENT REQUIRED
        if (documents.length === 0) {
            return "Please upload at least one document.";
        }


        for (
            let i = 0;
            i < documents.length;
            i++
        ) {

            const document =
                documents[i] || {};


            // DOCUMENT TYPE
            if (
                !document.documentType ||
                document.documentType.trim() === ""
            ) {
                return `Please select Document Type for Document #${i + 1}.`;
            }


            // DOCUMENT UPLOAD
            const hasFile =
                Boolean(
                    document.fileName ||
                    document.fileUrl
                );


            if (!hasFile) {
                return `Please upload Document #${i + 1}.`;
            }
        }


        return null;
    }


    // =====================================================
    // STEP 8 — EMERGENCY CONTACT
    // OPTIONAL
    // =====================================================

    if (step === 8) {

        const emergencyContacts =
            formData?.emergencyContacts || [];


        for (
            let i = 0;
            i < emergencyContacts.length;
            i++
        ) {

            const contact =
                emergencyContacts[i] || {};


            const hasData =
                contact.contactName ||
                contact.relationship ||
                contact.phoneNumber ||
                contact.addressLine1 ||
                contact.city ||
                contact.state ||
                contact.country ||
                contact.zipcode ||
                contact.zipCode;


            // COMPLETELY EMPTY ROW IS ALLOWED
            if (!hasData) {
                continue;
            }


            if (
                !contact.contactName ||
                contact.contactName.trim() === ""
            ) {
                return `Please enter Emergency Contact Name for Contact #${i + 1}.`;
            }


            if (
                !contact.relationship ||
                contact.relationship.trim() === ""
            ) {
                return `Please enter Relationship for Contact #${i + 1}.`;
            }


            const phone =
                String(
                    contact.phoneNumber || ""
                )
                    .replace(/\D/g, "")
                    .trim();


            if (
                !phone ||
                !/^\d{10}$/.test(phone)
            ) {
                return `Emergency Contact Phone Number must be exactly 10 digits for Contact #${i + 1}.`;
            }
        }


        return null;
    }


    // =====================================================
    // STEP 9 — EMPLOYMENT
    // =====================================================

    if (step === 9) {

        // JOINING DATE
        if (
            !formData?.joiningDate ||
            String(formData.joiningDate).trim() === ""
        ) {
            return "Please select Joining Date.";
        }


        // DEPARTMENT
        if (
            !formData?.departmentId ||
            String(formData.departmentId).trim() === ""
        ) {
            return "Please select Department.";
        }


        // DESIGNATION
        if (
            !formData?.designationId ||
            String(formData.designationId).trim() === ""
        ) {
            return "Please select Designation.";
        }


        // EMPLOYEE STATUS
        if (
            !formData?.employeeStatusId ||
            String(formData.employeeStatusId).trim() === ""
        ) {
            return "Please select Employee Status.";
        }


        // EMPLOYMENT TYPE
        // IMPORTANT:
        // Your actual form uses `employmentType`,
        // NOT employmentTypeId.
        if (
            !formData?.employmentType ||
            String(formData.employmentType).trim() === ""
        ) {
            return "Please select Employment Type.";
        }


        return null;
    }


    // =====================================================
    // NO ERROR
    // =====================================================

    return null;
};