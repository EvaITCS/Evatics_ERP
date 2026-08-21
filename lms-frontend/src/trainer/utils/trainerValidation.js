export const validateTrainer = (form) => {

    const errors = {};

    if (!form.employeeId) {

        errors.employeeId =
            "Employee ID is required";
    }

    if (!form.specialization) {

        errors.specialization =
            "Specialization is required";
    }

    if (!form.experienceYears) {

        errors.experienceYears =
            "Experience is required";
    }

    return errors;
};