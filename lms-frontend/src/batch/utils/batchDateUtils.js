// src/batch/utils/batchDateUtils.js

export const formatDate = (
    date
) => {

    return new Date(date)
        .toLocaleDateString();
};