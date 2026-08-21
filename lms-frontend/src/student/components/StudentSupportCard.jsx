import { useState } from "react";
import studentService from "../services/studentService";
import "../styles/student.css";

export default function StudentSupportCard() {

    const [form, setForm] = useState({
        subject: "",
        message: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const [statusMsg, setStatusMsg] = useState({
        type: "",
        text: ""
    });

    const submitTicket = async () => {

        if (!form.subject.trim() || !form.message.trim()) {
            setStatusMsg({
                type: "error",
                text: "Please fill out all fields before submitting."
            });
            return;
        }

        setIsLoading(true);
        setStatusMsg({
            type: "",
            text: ""
        });

        try {

            // Backend logged-in student ko automatically identify karega
            const payload = {
                subject: form.subject,
                message: form.message
            };

            const res = await studentService.sendSupportTicket(payload);

            setStatusMsg({
                type: "success",
                text: res.data || "Support ticket created successfully!"
            });

            setForm({
                subject: "",
                message: ""
            });

        } catch (err) {
            console.error(err);

            setStatusMsg({
                type: "error",
                text: "Failed to create support ticket. Please try again."
            });

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="student-card support-card-container" style={{marginTop:"15px"}}>

            <div className="support-card-header">
                <h2>Create Support Request</h2>
                <p>
                    Have a question or facing an issue?
                    Send a Request and our team will assist you shortly.
                </p>
            </div>

            {statusMsg.text && (
                <div className={`support-status-alert ${statusMsg.type}`}>
                    {statusMsg.type === "success" ? "✓ " : "⚠ "}
                    {statusMsg.text}
                </div>
            )}

            <div className="support-form-group">

                <label className="support-input-label">
                    Request Subject
                </label>

                <div className="support-input-wrapper">

                    <input
                        type="text"
                        placeholder="e.g., Unable to access course content, Payment issue"
                        value={form.subject}
                        className="support-text-input"
                        onChange={(e) =>
                            setForm({
                                ...form,
                                subject: e.target.value
                            })
                        }
                        disabled={isLoading}
                    />

                </div>

            </div>

            <div className="support-form-group">

                <label className="support-input-label">
                    Issue Description
                </label>

                <div className="support-input-wrapper">

                    <textarea
                        placeholder="Please describe your problem in detail so we can help you faster..."
                        value={form.message}
                        className="support-textarea-input"
                        rows="5"
                        onChange={(e) =>
                            setForm({
                                ...form,
                                message: e.target.value
                            })
                        }
                        disabled={isLoading}
                    />

                </div>

            </div>

            <div className="support-action-zone">

                <button
                    className={`support-submit-btn ${isLoading ? "loading" : ""}`}
                    onClick={submitTicket}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="support-spinner"></span>
                            Submitting...
                        </>
                    ) : (
                        "Send Request"
                    )}
                </button>

            </div>

        </div>
    );
}