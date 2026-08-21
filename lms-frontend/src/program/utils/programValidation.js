export const validateProgram = (form) => {

    if (!form.programName?.trim()) {
        return {
            valid: false,
            message: "Program Name Required"
        };
    }

    if (!form.programCode?.trim()) {
        return {
            valid: false,
            message: "Program Code Required"
        };
    }

    if (!form.durationValue || form.durationValue <= 0) {
        return {
            valid: false,
            message: "Duration Required"
        };
    }

    if (!form.durationType) {
        return {
            valid: false,
            message: "Duration Type Required"
        };
    }

    return {
        valid: true
    };
};