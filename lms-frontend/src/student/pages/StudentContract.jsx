import { useEffect, useState } from "react";
import StudentLayout from "../layouts/StudentLayout";
import studentService from "../services/studentService";
import contractService from "../services/contractService";
import api from "../../api/axios";

const BASIC_CONTRACT_FILE = "student-contract.pdf";

export default function StudentContract() {
    const [student, setStudent] = useState({});
    const [contract, setContract] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [signatureType, setSignatureType] = useState("TYPED");
    const [signature, setSignature] = useState("");
    const [signatureFile, setSignatureFile] = useState(null);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadContract();

        return () => {
            if (pdfUrl) {
                window.URL.revokeObjectURL(pdfUrl);
            }
        };
    }, []);

    // =========================================================
    // LOAD CONTRACT
    // =========================================================
    const loadContract = async () => {
    try {
        setLoading(true);
        setError("");

        const email = localStorage.getItem("email");

        // Load student/dashboard information
        const studentResponse = await studentService.getDashboard(email);

        if (studentResponse?.data) {
            setStudent(studentResponse.data);
        }

        const dashboardType =
            studentResponse?.data?.dashboardType ||
            localStorage.getItem("dashboardType") ||
            "BASIC";

        console.log("Contract Dashboard Type:", dashboardType);

        // =====================================================
        // BASIC
        // Only BASIC gets the fixed general student contract
        // =====================================================
        if (dashboardType === "BASIC") {
            await loadBasicContract();
            return;
        }

        // =====================================================
        // WAITING_BATCH / TRAINING / PLACEMENT
        // All these get the admin-assigned contract
        // =====================================================
        if (
            dashboardType === "WAITING_BATCH" ||
            dashboardType === "TRAINING" ||
            dashboardType === "PLACEMENT"
        ) {
            const response = await contractService.getMyContract();

            if (response?.data) {
                setContract(response.data);
                await loadPdf(response.data.contractId);
            } else {
                setContract(null);
            }

            return;
        }

        // Fallback
        setContract(null);

    } catch (err) {
        console.error("Contract fetch error:", err);

        setError(
            err?.response?.data?.message ||
            "Unable to load contract."
        );
    } finally {
        setLoading(false);
    }
};
    // =========================================================
    // BASIC CONTRACT
    // =========================================================
    const loadBasicContract = async () => {
        try {
            await loadPdf(BASIC_CONTRACT_FILE);

            setContract({
                contractId: null,
                candidateContractId: null,
                batchId: null,
                batchName: null,
                fileName: "Student Contract",
                filePath: BASIC_CONTRACT_FILE,
                uploadedByPersonId: null,
                uploadedAt: null,
                status: "ACTIVE",
                signatureStatus: "NOT_REQUIRED",
                signatureType: null,
                signatureData: null,
                signedAt: null,
                basicContract: true
            });
        } catch (err) {
            console.error("Basic contract loading error:", err);
            throw err;
        }
    };

    // =========================================================
    // LOAD PDF
    // =========================================================
    const loadPdf = async (contractId) => {
    if (!contractId) return;

    try {
        const response = await api.get(
            `/api/student/contracts/${contractId}/file`,
            {
                responseType: "blob"
            }
        );

        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
        }

        const url = window.URL.createObjectURL(
            new Blob([response.data], {
                type: response.headers["content-type"] || "application/pdf"
            })
        );

        setPdfUrl(url);
    } catch (err) {
        console.error("PDF loading error:", err);
        setError("Unable to open contract PDF.");
    }
};

    // =========================================================
    // SIGNATURE FILE
    // =========================================================
    const handleSignatureFile = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setSignatureFile(null);
            return;
        }

        if (!["image/png", "image/jpeg"].includes(file.type)) {
            setError("Please upload a PNG or JPG signature image.");
            event.target.value = "";
            setSignatureFile(null);
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("Signature image must not exceed 2 MB.");
            event.target.value = "";
            setSignatureFile(null);
            return;
        }

        setError("");
        setSignatureFile(file);
    };

    // =========================================================
    // SIGN CONTRACT
    // =========================================================
    const handleSign = async () => {
        setError("");

        if (contract?.basicContract) {
            setError("This contract does not require a signature.");
            return;
        }

        if (!contract?.candidateContractId) {
            setError("Contract signing record was not found.");
            return;
        }

        if (!agreed) {
            setError("Please confirm that you agree to the contract terms.");
            return;
        }

        if (signatureType === "TYPED" && !signature.trim()) {
            setError("Please enter your signature.");
            return;
        }

        if (signatureType === "UPLOADED" && !signatureFile) {
            setError("Please upload your signature.");
            return;
        }

        try {
            setSigning(true);

             const formData = new FormData();

        formData.append("signatureType", signatureType);

        if (signatureType === "TYPED") {
            formData.append("signatureData", signature.trim());
        }

        if (signatureType === "UPLOADED" && signatureFile) {
            formData.append("signatureFile", signatureFile);
        }

        const response = await contractService.signContract(
            contract.candidateContractId,
            formData
        );

            if (response?.data) {
                setContract(response.data);
            }

            setAgreed(false);
            setSignature("");
            setSignatureFile(null);
        } catch (err) {
            console.error("Contract signing error:", err);
            setError(
                err?.response?.data?.message || "Unable to sign contract."
            );
        } finally {
            setSigning(false);
        }
    };

    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        return (
            <StudentLayout student={student}>
                <div style={{ padding: "40px", textAlign: "center" }}>
                    Loading contract...
                </div>
            </StudentLayout>
        );
    }

    // =========================================================
    // NO CONTRACT
    // =========================================================
    if (!contract) {
        return (
            <StudentLayout student={student}>
                <div style={{ padding: "30px" }}>
                    <div
                        style={{
                            background: "#fff",
                            padding: "30px",
                            borderRadius: "10px",
                            border: "1px solid #e1e8f0",
                            textAlign: "center"
                        }}
                    >
                        <h2 style={{ margin: 0 }}>No Contract Available</h2>
                        <p style={{ color: "#666" }}>
                            No contract has been assigned to you yet.
                        </p>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    // =========================================================
    // CONTRACT STATE
    // =========================================================
    const isBasicContract = contract.basicContract === true;
    const isSigned = contract.signatureStatus === "SIGNED";
    const canSign = !isBasicContract && !isSigned;

    return (
        <StudentLayout student={student}>
            <div
                style={{
                    width: "100%",
                    minHeight: "calc(100vh - 80px)",
                    padding: "30px",
                    background: "#f4f8fc",
                    boxSizing: "border-box"
                }}
            >
                {/* HEADER */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "10px",
                        padding: "20px 25px",
                        marginBottom: "20px",
                        border: "1px solid #e1e8f0",
                        boxShadow: "0 2px 6px rgba(0,0,0,.04)"
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontFamily: "Cambria",
                            fontSize: "24px",
                            fontWeight: 600
                        }}
                    >
                        Student Contract
                    </h1>
                    <p
                        style={{
                            margin: "5px 0 0",
                            color: "#666",
                            fontSize: "14px"
                        }}
                    >
                        {isBasicContract
                            ? "Please review the contract carefully."
                            : isSigned
                            ? "Your contract has been signed successfully."
                            : "Please review your contract carefully and sign it below."}
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div
                        style={{
                            background: "#fef2f2",
                            color: "#b91c1c",
                            padding: "12px 15px",
                            borderRadius: "7px",
                            marginBottom: "15px"
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* PDF SECTION */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "10px",
                        border: "1px solid #dce5ee",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,.06)"
                    }}
                >
                    {/* Contract Header */}
                    <div
                        style={{
                            padding: "15px 20px",
                            borderBottom: "1px solid #e5e7eb",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            <strong>{contract.fileName}</strong>
                            {!isBasicContract && (
                                <div
                                    style={{
                                        marginTop: "5px",
                                        fontSize: "13px",
                                        color: isSigned ? "#047857" : "#b45309"
                                    }}
                                >
                                    {isSigned ? "✓ Signed" : "Pending Signature"}
                                </div>
                            )}
                        </div>

                        {isSigned && contract.signedAt && (
                            <span
                                style={{
                                    fontSize: "13px",
                                    color: "#666"
                                }}
                            >
                                Signed:{" "}
                                {new Date(contract.signedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {/* PDF Viewer */}
                    <div
                        style={{
                            height: "600px",
                            minHeight: "500px"
                        }}
                    >
                        {pdfUrl && (
                            <iframe
                                src={pdfUrl}
                                title="Student Contract"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none"
                                }}
                            />
                        )}
                    </div>
                </div>

                              {/* SIGN CONTRACT SECTION
                {canSign && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            padding: "24px",
                            marginTop: "20px",
                            border: "1px solid #dce5ee",
                            boxShadow: "0 2px 8px rgba(0,0,0,.04)"
                        }}
                    >
                        <h3 style={{ margin: "0 0 6px" }}>Sign Contract</h3>
                        <p
                            style={{
                                margin: "0 0 20px",
                                color: "#666",
                                fontSize: "14px"
                            }}
                        >
                            Choose how you would like to provide your signature.
                        </p>

                        Signature Type Switcher
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginBottom: "20px",
                                flexWrap: "wrap"
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setSignatureType("TYPED");
                                    setSignatureFile(null);
                                }}
                                style={{
                                    padding: "9px 15px",
                                    borderRadius: "6px",
                                    border: "1px solid #d1d5db",
                                    cursor: "pointer",
                                    background:
                                        signatureType === "TYPED"
                                            ? "#1d4ed8"
                                            : "#fff",
                                    color:
                                        signatureType === "TYPED"
                                            ? "#fff"
                                            : "#374151",
                                    fontWeight: 600
                                }}
                            >
                                Type Signature
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setSignatureType("UPLOADED");
                                    setSignature("");
                                }}
                                style={{
                                    padding: "9px 15px",
                                    borderRadius: "6px",
                                    border: "1px solid #d1d5db",
                                    cursor: "pointer",
                                    background:
                                        signatureType === "UPLOADED"
                                            ? "#1d4ed8"
                                            : "#fff",
                                    color:
                                        signatureType === "UPLOADED"
                                            ? "#fff"
                                            : "#374151",
                                    fontWeight: 600
                                }}
                            >
                                Upload Signature
                            </button>
                        </div>

                        Typed Signature Input
                        {signatureType === "TYPED" && (
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontWeight: 600,
                                        marginBottom: "7px"
                                    }}
                                >
                                    Your Signature
                                </label>
                                <input
                                    type="text"
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    placeholder="Enter your full name"
                                    style={{
                                        width: "100%",
                                        height: "42px",
                                        padding: "0 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #d1d5db",
                                        boxSizing: "border-box",
                                        fontSize: "14px"
                                    }}
                                />
                            </div>
                        )}

                        Upload Signature Input
                        {signatureType === "UPLOADED" && (
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontWeight: 600,
                                        marginBottom: "7px"
                                    }}
                                >
                                    Upload Signature Image (PNG/JPG, max 2MB)
                                </label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={handleSignatureFile}
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "6px",
                                        border: "1px solid #d1d5db",
                                        boxSizing: "border-box"
                                    }}
                                />
                                {signatureFile && (
                                    <p
                                        style={{
                                            margin: "6px 0 0",
                                            fontSize: "13px",
                                            color: "#047857"
                                        }}
                                    >
                                        Selected: {signatureFile.name}
                                    </p>
                                )}
                            </div>
                        )}

                        Agreement Checkbox
                        <div
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px"
                            }}
                        >
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    cursor: "pointer"
                                }}
                            />
                            <label
                                htmlFor="agreeTerms"
                                style={{
                                    fontSize: "14px",
                                    color: "#374151",
                                    cursor: "pointer"
                                }}
                            >
                                I have read and agree to all the terms and conditions outlined in this contract.
                            </label>
                        </div>

                        Submit Button
                        <div style={{ marginTop: "20px" }}>
                            <button
                                type="button"
                                onClick={handleSign}
                                disabled={signing}
                                style={{
                                    padding: "10px 24px",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: signing ? "#9ca3af" : "#1d4ed8",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "15px",
                                    cursor: signing ? "not-allowed" : "pointer"
                                }}
                            >
                                {signing ? "Signing Contract..." : "Submit Signature"}
                            </button>
                        </div>
                    </div>
                )}
                */}
            </div>
        </StudentLayout>
    );
}