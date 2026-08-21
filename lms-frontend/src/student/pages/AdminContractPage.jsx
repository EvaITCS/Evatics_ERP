import React, {
    useEffect,
    useRef,
    useState
} from "react";
import api from "../../api/axios";
import batchService from "../../batch/services/batchService";
import contractService from "../services/contractService";

export default function AdminContractPage() {

    // =========================================================
    // STATE
    // =========================================================

    const [batches, setBatches] = useState([]);

    const [contracts, setContracts] = useState([]);

    const [selectedBatchId, setSelectedBatchId] =
        useState("");

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isUploading, setIsUploading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const fileInputRef = useRef(null);


    // =========================================================
    // LOAD INITIAL DATA
    // =========================================================

    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        try {

            setIsLoading(true);
            setError("");

            const [
                batchResponse,
                contractResponse
            ] = await Promise.all([

                batchService.getAllBatches(),

                contractService.getAllContracts()

            ]);

            setBatches(
                batchResponse.data || []
            );

            setContracts(
                contractResponse.data || []
            );

        } catch (err) {

            console.error(
                "Failed to load contract data:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load contract data."
            );

        } finally {

            setIsLoading(false);
        }
    };


    // =========================================================
    // FILE SELECT
    // =========================================================

    const handleFileChange = (event) => {

        const file =
            event.target.files?.[0];

        setError("");
        setSuccess("");

        if (!file) {

            setSelectedFile(null);

            return;
        }

        // -----------------------------------------------------
        // PDF only
        // -----------------------------------------------------

        const fileName =
            file.name.toLowerCase();

        if (!fileName.endsWith(".pdf")) {

            setError(
                "Only PDF files are allowed."
            );

            event.target.value = "";

            setSelectedFile(null);

            return;
        }

        // -----------------------------------------------------
        // 5 MB limit
        // -----------------------------------------------------

        const maxSize =
            5 * 1024 * 1024;

        if (file.size > maxSize) {

            setError(
                "Contract PDF must not exceed 5 MB."
            );

            event.target.value = "";

            setSelectedFile(null);

            return;
        }

        setSelectedFile(file);
    };


    // =========================================================
    // UPLOAD CONTRACT
    // =========================================================

    const handleUpload = async () => {

        setError("");
        setSuccess("");

        // -----------------------------------------------------
        // Validate batch
        // -----------------------------------------------------

        if (!selectedBatchId) {

            setError(
                "Please select a batch."
            );

            return;
        }

        // -----------------------------------------------------
        // Validate file
        // -----------------------------------------------------

        if (!selectedFile) {

            setError(
                "Please select a contract PDF."
            );

            return;
        }

        try {

            setIsUploading(true);

            const response =
                await contractService.uploadContract(
                    selectedBatchId,
                    selectedFile
                );

            // -------------------------------------------------
            // Add newly uploaded contract to list
            // -------------------------------------------------

            if (response.data) {

                setContracts(
                    previous => [
                        response.data,
                        ...previous
                    ]
                );
            }

            // -------------------------------------------------
            // Reset form
            // -------------------------------------------------

            setSelectedBatchId("");

            setSelectedFile(null);

            if (fileInputRef.current) {

                fileInputRef.current.value = "";
            }

            setSuccess(
                "Contract uploaded successfully."
            );

        } catch (err) {

            console.error(
                "Contract upload failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to upload contract."
            );

        } finally {

            setIsUploading(false);
        }
    };


    // =========================================================
    // VIEW CONTRACT
    // =========================================================
const handleViewContract = async (contractId) => {
    if (!contractId) {
        setError("Contract is not available.");
        return;
    }

    try {
        setError("");

        const response = await api.get(
            `/api/admin/contracts/${contractId}/file`,
            { responseType: "blob" }
        );

        const fileUrl = window.URL.createObjectURL(
            new Blob([response.data], {
                type: response.headers["content-type"] || "application/pdf"
            })
        );

        window.open(fileUrl, "_blank", "noopener,noreferrer");

        setTimeout(() => {
            window.URL.revokeObjectURL(fileUrl);
        }, 60000);

    } catch (err) {
        console.error("Failed to open contract:", err);

        setError(
            err?.response?.status === 401 ||
            err?.response?.status === 403
                ? "You are not authorized to view this contract."
                : "Unable to open contract PDF."
        );
    }
};

    // =========================================================
    // LOADING
    // =========================================================

    if (isLoading) {

        return (
            <div style={{ padding: "10px" }}>

                <div style={{ padding: "40px 20px", textAlign: "center", color: "#6b7280" }}>

                    Loading contracts...

                </div>

            </div>
        );
    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <div style={{ padding: "0px" }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <div style={{ marginBottom: "10px" }}>

                <div>

                    <h2 style={{ margin: 0, fontSize: "24px" }}>
                        Contracts
                    </h2>

                </div>

            </div>


            {/* =================================================
                UPLOAD SECTION
            ================================================= */}

            <div style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "24px",
                marginBottom: "24px"
            }}>

                <h3 style={{ margin: 0, fontSize: "18px" }}>
                    Upload Contract
                </h3>

                <p style={{ margin: "6px 0 20px", color: "#6b7280" }}>
                    Select a training batch and
                    upload its contract as a PDF.
                </p>


                {/* =================================================
                    BATCH
                ================================================= */}

                <div style={{ marginBottom: "18px" }}>

                    <label htmlFor="contract-batch" style={{ display: "block", marginBottom: "7px", fontWeight: 600 }}>

                        Batch

                    </label>

                    <select
                        id="contract-batch"
                        value={selectedBatchId}
                        onChange={(event) =>
                            setSelectedBatchId(
                                event.target.value
                            )
                        }
                        disabled={isUploading}
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            height: "42px",
                            padding: "0 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            background: "#ffffff"
                        }}
                    >

                        <option value="">
                            Select Batch
                        </option>

                        {batches.map((batch) => (

                            <option
                                key={batch.batchId}
                                value={batch.batchId}
                            >
                                {batch.batchName}
                            </option>

                        ))}

                    </select>

                </div>


                {/* =================================================
                    PDF
                ================================================= */}

                <div style={{ marginBottom: "18px" }}>

                    <label htmlFor="contract-file" style={{ display: "block", marginBottom: "7px", fontWeight: 600 }}>

                        Contract PDF

                    </label>

                    <input
                        ref={fileInputRef}
                        id="contract-file"
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "10px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px"
                        }}
                    />

                    {selectedFile && (

                        <div style={{ marginTop: "8px", fontSize: "14px", color: "#374151" }}>

                            {selectedFile.name}

                        </div>

                    )}

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div style={{
                        marginTop: "12px",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        background: "#fef2f2",
                        color: "#b91c1c"
                    }}>

                        {error}

                    </div>

                )}


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (

                    <div style={{
                        marginTop: "12px",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        background: "#f0fdf4",
                        color: "#15803d"
                    }}>

                        {success}

                    </div>

                )}


                {/* =================================================
                    UPLOAD BUTTON
                ================================================= */}

                <div style={{ marginTop: "20px" }}>

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            style={{
                                border: "none",
                            borderRadius: "6px",
                            cursor: isUploading ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            padding: "11px 20px",
                            background: isUploading
                                ? "#93c5fd"
                                : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            color: "#ffffff",
                            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.25)",
                            opacity: isUploading ? 0.7 : 1,
                            transition: "all 0.2s ease"
                            }}
                        >

                            {isUploading
                                ? "Uploading..."
                                : "Upload Contract"
                            }

                        </button>

                </div>

            </div>


            {/* =================================================
                CONTRACT LIST
            ================================================= */}

            <div style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "24px",
                marginBottom: "24px"
            }}>

                <div style={{ marginBottom: "16px" }}>

                    <div>

                        <h3 style={{ margin: 0, fontSize: "18px" }}>
                            Uploaded Contracts
                        </h3>


                    </div>

                </div>


                {contracts.length === 0 ? (

                    <div style={{ padding: "40px 20px", textAlign: "center", color: "#6b7280" }}>

                        No contracts have been
                        uploaded yet.

                    </div>

                ) : (

                    <div style={{ overflowX: "auto" }}>

                        <table style={{ width: "100%", borderCollapse: "collapse" }}>

                            <thead>

                                <tr>

                                    <th style={{ padding: "13px 12px", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "13px", fontWeight: 600 }}>
                                        Batch
                                    </th>

                                    <th style={{ padding: "13px 12px", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "13px", fontWeight: 600 }}>
                                        Contract
                                    </th>

                                    <th style={{ padding: "13px 12px", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "13px", fontWeight: 600 }}>
                                        Uploaded
                                    </th>

                                    <th style={{ padding: "13px 12px", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "13px", fontWeight: 600 }}>
                                        Status
                                    </th>

                                    <th style={{ padding: "13px 12px", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontSize: "13px", fontWeight: 600 }}>
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {contracts.map(
                                    (contract) => {
                                        const statusLower = String(contract.status).toLowerCase();
                                        const isStatusActive = statusLower === "active";
                                        const isStatusInactive = statusLower === "inactive";

                                        return (

                                            <tr
                                                key={
                                                    contract.contractId
                                                }
                                            >

                                                <td style={{ padding: "13px 12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                                                    {
                                                        contract.batchName
                                                    }
                                                </td>

                                                <td style={{ padding: "13px 12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>

                                                    <span style={{ fontWeight: 500 }}>

                                                        {
                                                            contract.fileName
                                                        }

                                                    </span>

                                                </td>

                                                <td style={{ padding: "13px 12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>

                                                    {
                                                        contract.uploadedAt
                                                            ? new Date(
                                                                contract.uploadedAt
                                                            ).toLocaleDateString()
                                                            : "—"
                                                    }

                                                </td>

                                                <td style={{ padding: "13px 12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>

                                                    <span
                                                        style={{
                                                            display: "inline-block",
                                                            padding: "4px 9px",
                                                            borderRadius: "20px",
                                                            fontSize: "12px",
                                                            fontWeight: 600,
                                                            background: isStatusActive ? "#ecfdf5" : isStatusInactive ? "#f3f4f6" : "#f3f4f6",
                                                            color: isStatusActive ? "#047857" : isStatusInactive ? "#6b7280" : "#6b7280"
                                                        }}
                                                    >

                                                        {
                                                            contract.status
                                                        }

                                                    </span>

                                                </td>

                                                <td style={{ padding: "13px 12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>

                                                    <button
                                                        type="button"
                                                        style={{
                                                            border: "none",
                                                            borderRadius: "6px",
                                                            cursor: "pointer",
                                                            fontWeight: 600,
                                                            padding: "7px 12px"
                                                        }}
                                                        onClick={() =>
                                                            handleViewContract(
                                                                contract.contractId
                                                            )
                                                        }
                                                    >

                                                        View PDF

                                                    </button>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}