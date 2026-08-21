import React, { useState } from "react";
import api from "../../../api/axios";
import { DOCUMENT_TYPES } from "../../utils/employeeConstants";

function DocumentSection({
                             formData,
                             handleDocumentChange,
                             handleDocumentFileChange,
                             addDocument,
                             removeDocument,
                             starStyle,
                         }) {
    const documents = formData?.documents || [];

    const [viewingIndex, setViewingIndex] = useState(null);

    // =====================================================
    // VIEW DOCUMENT
    // =====================================================
    const handleViewDocument = async (
        personDocumentId,
        index
    ) => {

        if (!personDocumentId) {
            alert("Document file is not available.");
            return;
        }

        try {

            setViewingIndex(index);

            const response = await api.get(
                `/api/person-documents/${personDocumentId}/file`,
                {
                    responseType: "blob",
                }
            );

            const contentType =
                response.headers?.["content-type"] ||
                "application/octet-stream";

            const blob = new Blob(
                [response.data],
                {
                    type: contentType,
                }
            );

            const blobUrl =
                window.URL.createObjectURL(blob);

            const newWindow =
                window.open(
                    blobUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            if (!newWindow) {
                alert(
                    "Please allow pop-ups to view the document."
                );
            }

            setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
            }, 60000);

        } catch (error) {

            console.error(
                "Failed to open document:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                alert(
                    "You are not authorized to view this document."
                );
                return;
            }

            if (
                error.response?.status === 404
            ) {
                alert(
                    "Document file was not found."
                );
                return;
            }

            alert(
                "Failed to open document."
            );

        } finally {

            setViewingIndex(null);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================
    return (

        <>

            <h3 className="form-section-title">

              Document Information

            </h3>



            <div className="form-grid">

            {documents.map(
                (document, index) => (

                    <React.Fragment
                        key={
                            document.documentId ||
                            document.personDocumentId ||
                            index
                        }
                    >

                        {/* ================================================= */}



                        {/* ================================================= */}
                        {/* DOCUMENT TYPE */}
                        {/* ================================================= */}

                        <div className="form-group">

                            <label>
                                Document Type{" "}
                                <span
                                    style={starStyle}
                                >
                                    *
                                </span>
                            </label>

                            <select
                                value={
                                    document.documentType ||
                                    ""
                                }
                                onChange={(e) =>
                                    handleDocumentChange(
                                        index,
                                        "documentType",
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Document Type
                                </option>

                                {DOCUMENT_TYPES.map(
                                    (type) => (

                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ================================================= */}
                        {/* DOCUMENT NUMBER */}
                        {/* ================================================= */}

                        <div className="form-group">

                            <label>
                                Document Number
                            </label>

                            <input
                                type="text"
                                value={
                                    document.documentNumber ||
                                    ""
                                }
                                onChange={(e) =>
                                    handleDocumentChange(
                                        index,
                                        "documentNumber",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter Document Number"
                            />

                        </div>


                        {/* ================================================= */}
                        {/* FILE UPLOAD */}
                        {/* ================================================= */}

                        <div className="form-group">

                            <label>
                                Upload File{" "}

                                <span style={starStyle}>
            *
        </span>
                            </label>

                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) =>
                                    handleDocumentFileChange(
                                        index,
                                        e
                                    )
                                }
                                required={!document.fileName}                            />

                            {/* --------------------------------------------- */}
                            {/* EXISTING / UPLOADED FILE NAME */}
                            {/* --------------------------------------------- */}

                            {document.fileName && (

                                <small
                                    style={{
                                        display: "block",
                                        marginTop: "6px",
                                    }}
                                >

                                    Uploaded:{" "}

                                    <strong>
                                        {document.fileName}
                                    </strong>

                                </small>

                            )}

                        </div>

                        {/* ================================================= */}
                        {/* VIEW EXISTING / UPLOADED FILE */}
                        {/* ================================================= */}

                        {document.personDocumentId && (

                            <div
                                className="form-group"
                                style={{
                                    gridColumn:
                                        "span 3",
                                }}
                            >

                                <label>
                                    File
                                </label>

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: "10px",
                                    }}
                                >

                                    <button
                                        type="button"
                                        className="view-btn"
                                        disabled={
                                            viewingIndex ===
                                            index
                                        }
                                        onClick={() =>
                                            handleViewDocument(
                                                document.fileUrl,
                                                index
                                            )
                                        }
                                    >

                                        {viewingIndex ===
                                        index
                                            ? "Opening..."
                                            : "View Uploaded Document"}

                                    </button>

                                </div>

                            </div>

                        )}


                        {/* ================================================= */}
                        {/* REMOVE DOCUMENT */}
                        {/* ================================================= */}

                        {documents.length > 1 && (

                            <div
                                className="form-group"
                                style={{
                                    gridColumn:
                                        "span 3",
                                }}
                            >

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() =>
                                        removeDocument(
                                            index
                                        )
                                    }
                                >
                                    Remove Document
                                </button>

                            </div>

                        )}


                        {/* ================================================= */}
                        {/* SEPARATOR */}
                        {/* ================================================= */}

                        <hr
                            style={{
                                gridColumn:
                                    "span 3",
                                margin:
                                    "20px 0",
                            }}
                        />

                    </React.Fragment>

                )
            )}


            {/* ================================================= */}
            {/* ADD DOCUMENT */}
            {/* ================================================= */}

            <div
                style={{
                    gridColumn:
                        "span 3",
                }}
            >

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addDocument}
                >
                    + Add Document
                </button>

            </div>

        </div>
</>
);
}

export default DocumentSection;