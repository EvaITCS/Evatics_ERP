import { useState } from "react";

import "../styles/lead.css";
import "../../shared/styles/sidebar.css";

function FollowupModal({
                           onSubmit,
                           onClose
                       }) {

    // =====================================
    // STATE
    // =====================================

    const [note, setNote] =
        useState("");

    const [actionType,
        setActionType] =
        useState("CALL");

    const [actionResult,
        setActionResult] =
        useState("CONNECTED");


    // =====================================
    // SAVE
    // =====================================

    const handleSave = () => {

        // Note validation
        if (!note.trim()) {

            alert(
                "Please enter a follow-up note."
            );

            return;
        }

        const followupData = {

            note: note.trim(),

            actionType,

            actionResult
        };

        console.log(
            "FOLLOWUP MODAL DATA =",
            followupData
        );

        onSubmit(
            followupData
        );
    };


    // =====================================
    // ACTION TYPE CHANGE
    // =====================================

    const handleActionTypeChange = (e) => {

        const type =
            e.target.value;

        setActionType(type);


        if (type === "CALL") {

            setActionResult(
                "CONNECTED"
            );

        } else if (type === "EMAIL") {

            setActionResult(
                "EMAIL_SENT"
            );

        } else if (type === "SMS") {

            setActionResult(
                "SMS_SENT"
            );
        }
    };


    // =====================================
    // UI
    // =====================================

    return (

        <div className="modal-overlay">

            <div className="modal-box">

                <h2>
                    Add Followup
                </h2>


                {/* =====================================
                    NOTE
                ===================================== */}

                <textarea

                    value={note}

                    placeholder="Please enter a follow-up note..."

                    required

                    onChange={(e) =>
                        setNote(e.target.value)
                    }

                />


                {/* =====================================
                    ACTION TYPE
                ===================================== */}

                <select

                    value={actionType}

                    onChange={
                        handleActionTypeChange
                    }

                >

                    <option value="CALL">
                        CALL
                    </option>

                    <option value="EMAIL">
                        EMAIL
                    </option>

                    <option value="SMS">
                        SMS
                    </option>

                </select>


                {/* =====================================
                    ACTION RESULT
                ===================================== */}

                <select

                    value={actionResult}

                    onChange={(e) =>
                        setActionResult(
                            e.target.value
                        )
                    }

                >

                    {/* CALL */}

                    {
                        actionType === "CALL" && (

                            <>

                                <option value="CONNECTED">
                                    Connected
                                </option>

                                <option value="NO_RESPONSE">
                                    No Response
                                </option>

                                <option value="CALLBACK_REQUESTED">
                                    Callback Requested
                                </option>

                                <option value="INTERESTED">
                                    Interested
                                </option>

                                <option value="NOT_INTERESTED">
                                    Not Interested
                                </option>

                            </>

                        )
                    }


                    {/* EMAIL */}

                    {
                        actionType === "EMAIL" && (

                            <>

                                <option value="EMAIL_SENT">
                                    Email Sent
                                </option>

                                <option value="NO_RESPONSE">
                                    No Response
                                </option>

                                <option value="INTERESTED">
                                    Interested
                                </option>

                                <option value="NOT_INTERESTED">
                                    Not Interested
                                </option>

                            </>

                        )
                    }


                    {/* SMS */}

                    {
                        actionType === "SMS" && (

                            <>

                                <option value="SMS_SENT">
                                    SMS Sent
                                </option>

                                <option value="SMS_REPLIED">
                                    SMS Replied
                                </option>

                                <option value="NO_RESPONSE">
                                    No Response
                                </option>

                                <option value="INTERESTED">
                                    Interested
                                </option>

                                <option value="NOT_INTERESTED">
                                    Not Interested
                                </option>

                            </>

                        )
                    }

                </select>


                {/* =====================================
                    BUTTONS
                ===================================== */}

                <div className="modal-actions">

                    <button

                        type="button"

                        className="secondary-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>


                    <button

                        type="button"

                        className="primary-btn"

                        onClick={handleSave}

                    >

                        Save Followup

                    </button>

                </div>

            </div>

        </div>

    );
}

export default FollowupModal;