// src/batch/utils/batchValidation.js

export const validateBatch = (
    form
) => {

    if (!form.batchCode) {

        return "Batch code required";
    }

    if (!form.programId) {

        return "Program required";
    }

    return null;
};