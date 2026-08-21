import api from "../../api/axios";

const BASE_URL = "/api/person-documents";

const uploadDocument = (personId, documentData) => {

    return api.post(
        `${BASE_URL}/person/${personId}`,
        documentData
    );
};

const getDocuments = (personId) => {

    return api.get(
        `${BASE_URL}/person/${personId}`
    );
};

const updateDocument = (documentId, documentData) => {

    return api.put(
        `${BASE_URL}/${documentId}`,
        documentData
    );
};

const deleteDocument = (documentId) => {

    return api.delete(
        `${BASE_URL}/${documentId}`
    );
};

export default {
    uploadDocument,
    getDocuments,
    updateDocument,
    deleteDocument
};