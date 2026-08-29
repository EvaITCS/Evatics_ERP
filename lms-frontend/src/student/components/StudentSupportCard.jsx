import { useState } from "react";
import studentService from "../services/studentService";
import { useToast } from "../../shared/components/ToastContext";
import "../styles/student.css";

export default function StudentSupportCard() {

    const { showToast } = useToast();

    const [form, setForm] = useState({
        subject: "",
        message: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const submitTicket = async () => {

        if (!form.subject.trim() || !form.message.trim()) {
            showToast(
                "Please fill out all fields before submitting.",
                "error",
                "Required Fields"
            );
            return;
        }

        setIsLoading(true);

        try {

            // Backend logged-in student ko automatically identify karega
            const payload = {
                subject: form.subject,
                message: form.message
            };

            const res = await studentService.sendSupportTicket(payload);

            showToast(
                res.data || "Support ticket created successfully!",
                "success",
                "Request Submitted"
            );

            setForm({
                subject: "",
                message: ""
            });

        } catch (err) {
            console.error(err);

            showToast(
                "Failed to create support ticket. Please try again.",
                "error",
                "Request Failed"
            );

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="student-card support-card-container"
            style={{ marginTop: "15px" }}
        >

            <div className="support-card-header">
                <h2>Create Support Request</h2>
                <p>
                    Have a question or facing an issue?
                    Send a Request and our team will assist you shortly.
                </p>
            </div>

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