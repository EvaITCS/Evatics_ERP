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

    const [note,
        setNote] =
        useState("");


    const [actionType,
        setActionType] =
        useState("CALL");


    const [actionResult,
        setActionResult] =
        useState("CONNECTED");


    // =====================================
    // CALL CALLBACK DATE / TIME
    // =====================================

    const [callbackDate,
        setCallbackDate] =
        useState("");


    const [callbackTime,
        setCallbackTime] =
        useState("");


    // =====================================
    // SMS REPLY FOLLOW-UP DATE / TIME
    // =====================================

    const [smsFollowupDate,
        setSmsFollowupDate] =
        useState("");


    const [smsFollowupTime,
        setSmsFollowupTime] =
        useState("");


    // =====================================
    // TODAY
    // =====================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    // =====================================
    // SAVE
    // =====================================

    const handleSave = () => {

        // ---------------------------------
        // NOTE VALIDATION
        // ---------------------------------

        if (!note.trim()) {

            alert(
                "Please enter a follow-up note."
            );

            return;
        }


        // =================================
        // CALL CALLBACK VALIDATION
        // =================================

        if (
            actionType === "CALL" &&
            actionResult === "CALLBACK_REQUESTED"
        ) {

            if (!callbackDate) {

                alert(
                    "Please select callback date."
                );

                return;
            }


            if (!callbackTime) {

                alert(
                    "Please select callback time."
                );

                return;
            }
        }


        // =================================
        // SMS REPLIED VALIDATION
        // =================================

        if (
            actionType === "SMS" &&
            actionResult === "SMS_REPLIED"
        ) {

            if (!smsFollowupDate) {

                alert(
                    "Please select follow-up date."
                );

                return;
            }


            if (!smsFollowupTime) {

                alert(
                    "Please select follow-up time."
                );

                return;
            }
        }


        // =================================
        // SCHEDULED DATE/TIME
        // =================================

        let scheduledAt = null;


        // ---------------------------------
        // CALL CALLBACK
        // ---------------------------------

        if (
            actionType === "CALL" &&
            actionResult === "CALLBACK_REQUESTED" &&
            callbackDate &&
            callbackTime
        ) {

            scheduledAt =
                `${callbackDate}T${callbackTime}`;
        }


        // ---------------------------------
        // SMS REPLIED
        // ---------------------------------

        if (
            actionType === "SMS" &&
            actionResult === "SMS_REPLIED" &&
            smsFollowupDate &&
            smsFollowupTime
        ) {

            scheduledAt =
                `${smsFollowupDate}T${smsFollowupTime}`;
        }
// =================================
// FOLLOW-UP DATA
// =================================

        const followupData = {

            note:
                note.trim(),

            actionType,

            actionResult,

            // CALL → CALLBACK_REQUESTED
            callbackScheduledAt:
                actionType === "CALL" &&
                actionResult === "CALLBACK_REQUESTED"
                    ? scheduledAt
                    : null,

            // SMS → SMS_REPLIED
            nextFollowupAt:
                actionType === "SMS" &&
                actionResult === "SMS_REPLIED"
                    ? scheduledAt
                    : null
        };


// =================================
// DEBUG
// =================================

        console.log(
            "FOLLOWUP MODAL DATA =",
            followupData
        );


// =================================
// SUBMIT TO PARENT
// =================================

        onSubmit(
            followupData
        );
    }

    // =====================================
    // ACTION TYPE CHANGE
    // =====================================

    const handleActionTypeChange = (e) => {

        const type =
            e.target.value;


        setActionType(type);


        // ---------------------------------
        // DEFAULT RESULT
        // ---------------------------------

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


        // ---------------------------------
        // RESET CALL SCHEDULE
        // ---------------------------------

        setCallbackDate("");
        setCallbackTime("");


        // ---------------------------------
        // RESET SMS SCHEDULE
        // ---------------------------------

        setSmsFollowupDate("");
        setSmsFollowupTime("");
    };


    // =====================================
    // ACTION RESULT CHANGE
    // =====================================

    const handleActionResultChange = (e) => {

        const result =
            e.target.value;


        setActionResult(result);


        // ---------------------------------
        // CALLBACK RESULT
        // ---------------------------------

        if (
            result !== "CALLBACK_REQUESTED"
        ) {

            setCallbackDate("");
            setCallbackTime("");
        }


        // ---------------------------------
        // SMS REPLIED
        // ---------------------------------

        if (
            result !== "SMS_REPLIED"
        ) {

            setSmsFollowupDate("");
            setSmsFollowupTime("");
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
                        setNote(
                            e.target.value
                        )
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

                    onChange={
                        handleActionResultChange
                    }

                >

                    {/* =================================
                        CALL
                    ================================= */}

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


                    {/* =================================
                        EMAIL
                    ================================= */}

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


                    {/* =================================
                        SMS
                    ================================= */}

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


                {/* =================================================
                    CALL CALLBACK DATE & TIME
                    ================================================= */}

                {
                    actionType === "CALL" &&
                    actionResult === "CALLBACK_REQUESTED" &&
                    (

                        <div className="callback-schedule">

                            <label>
                                Callback Date
                            </label>

                            <input

                                type="date"

                                value={
                                    callbackDate
                                }

                                min={
                                    today
                                }

                                onChange={(e) =>
                                    setCallbackDate(
                                        e.target.value
                                    )
                                }

                            />


                            <label>
                                Callback Time
                            </label>

                            <input

                                type="time"

                                value={
                                    callbackTime
                                }

                                onChange={(e) =>
                                    setCallbackTime(
                                        e.target.value
                                    )
                                }

                            />

                        </div>

                    )
                }


                {/* =================================================
                    SMS REPLIED FOLLOW-UP DATE & TIME
                    ================================================= */}

                {
                    actionType === "SMS" &&
                    actionResult === "SMS_REPLIED" &&
                    (

                        <div className="callback-schedule">

                            <label>
                                Follow-up Date
                            </label>

                            <input

                                type="date"

                                value={
                                    smsFollowupDate
                                }

                                min={
                                    today
                                }

                                onChange={(e) =>
                                    setSmsFollowupDate(
                                        e.target.value
                                    )
                                }

                            />


                            <label>
                                Follow-up Time
                            </label>

                            <input

                                type="time"

                                value={
                                    smsFollowupTime
                                }

                                onChange={(e) =>
                                    setSmsFollowupTime(
                                        e.target.value
                                    )
                                }

                            />

                        </div>

                    )
                }


                {/* =====================================
                    BUTTONS
                ===================================== */}

                <div className="modal-actions">


                    <button

                        type="button"

                        className="secondary-btn"

                        onClick={
                            onClose
                        }

                    >
                        Cancel

                    </button>


                    <button

                        type="button"

                        className="primary-btn"

                        onClick={
                            handleSave
                        }

                    >
                        Save Followup

                    </button>


                </div>

            </div>

        </div>

    );
}


export default FollowupModal;