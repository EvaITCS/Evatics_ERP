// employeeDocumentService.js

import api from "../../api/axios";

const BASE_URL = "/api/employee-documents";

const uploadDocument = (documentData) => {

    return api.post(
        BASE_URL,
        documentData
    );
};

const getDocumentsByEmployee = (
    employeeId
) => {

    return api.get(
        `${BASE_URL}/employee/${employeeId}`
    );
};

const deleteDocument = (documentId) => {

    return api.delete(
        `${BASE_URL}/${documentId}`
    );
};

const employeeDocumentService = {

    uploadDocument,
    getDocumentsByEmployee,
    deleteDocument
};

export default employeeDocumentService;