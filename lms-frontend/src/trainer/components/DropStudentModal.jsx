import React, {
    useState
} from "react";

import dropRequestService
    from "../services/dropRequestService";

import "../styles/dropRequest.css";


function DropStudentModal({

                              student,

                              batchName,

                              onClose,

                              onSuccess

                          }) {

    const [trainerReason, setTrainerReason] =
        useState("");

    const [trainerRemarks, setTrainerRemarks] =
        useState("");

    const [saving, setSaving] =
        useState(false);


    const handleSubmit = async () => {

        if (!trainerReason.trim()) {

            alert("Drop reason is required.");

            return;
        }

        try {

            setSaving(true);

            await dropRequestService.createDropRequest(

                student.studentBatchId,

                {
                    dropReason: trainerReason,
                    trainerRemarks: trainerRemarks
                }

            );

            alert(
                "Drop request submitted successfully."
            );

            onSuccess();

            onClose();

        } catch (error) {

            console.error(
                "Drop Request Error:",
                error
            );

            alert(
                "Failed to submit drop request."
            );

        } finally {

            setSaving(false);
        }
    };


    if (!student) {

        return null;

    }


    return (

        <div className="modal-overlay">

            <div className="drop-modal">

                <h2>
                    Student Drop Request
                </h2>

                <hr />


                <div className="drop-form">

                    <label>
                        Student
                    </label>

                    <input
                        value={
                            student.studentName || "-"
                        }
                        readOnly
                    />


                    <label>
                        Batch
                    </label>

                    <input
                        value={
                            batchName || "-"
                        }
                        readOnly
                    />


                    <label>
                        Reason *
                    </label>

                    <textarea
                        rows="4"
                        value={trainerReason}
                        onChange={(e) =>
                            setTrainerReason(
                                e.target.value
                            )
                        }
                    />


                    <label>
                        Remarks
                    </label>

                    <textarea
                        rows="4"
                        value={trainerRemarks}
                        onChange={(e) =>
                            setTrainerRemarks(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="drop-actions">

                    <button
                        className="save-btn"
                        disabled={saving}
                        onClick={handleSubmit}
                    >

                        {saving
                            ? "Submitting..."
                            : "Submit Request"
                        }

                    </button>


                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>

    );

}


export default DropStudentModal;