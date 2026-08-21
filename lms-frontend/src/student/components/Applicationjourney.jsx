import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";
import { WEEKLY_PLAN } from "../utils/weeklyPlan";

/* ============================================================
   COLOR TOKENS (Premium Gradient Palette)
============================================================ */

const C = {
    navy: "#2563EB",
    navyDark: "#1D4ED8",
    navyText: "#1E293B",
    slate: "#475569",
    slateLight: "#94A3B8",
    line: "#E2E8F0",

    amber: "#B45309",
    amberBg: "#FFF7ED",
    amberLine: "#F59E0B",

    teal: "#0D7D6F",
    tealBg: "#ECFDF6",

    red: "#B91C1C",
    redBg: "#FEF2F2",
};


/* ============================================================
   1. STAGE → STEP MAPPING (4 Steps)
============================================================ */

const JOURNEY_STEPS = [
    {
        key: "REGISTERED",
        label: "Registered",
    },
    {
        key: "APPLICATION_FORM",
        label: "Start Application",
    },
    {
        key: "UNDER_REVIEW",
        label: "Application Under Review",
    },
    {
        key: "DECISION",
        label: "Reviewed",
    },
];


function getStepIndex(rawStage) {
    const s = (rawStage || "").toUpperCase();

    if (
        [
            "APPROVED",
            "ENROLLED",
            "ACTIVE",
            "COURSE_COMPLETED",
            "PLACED",
            "REJECTED",
            "DROPPED",
        ].includes(s)
    ) {
        return 3;
    }

    /*
     * Application submitted / under review
     */
    if (
        [
            "SUBMITTED",
            "UNDER_REVIEW",
        ].includes(s)
    ) {
        return 2;
    }

    /*
     * Application not submitted yet
     */
    return 1;
}


function isNegativeDecision(rawStage) {
    return ["REJECTED", "DROPPED"].includes(
        (rawStage || "").toUpperCase()
    );
}


/* ============================================================
   2. STEPPER
============================================================ */

function Stepper({ activeIndex, isRecheck }) {
    const n = JOURNEY_STEPS.length;

    const inset = 100 / (2 * n);

    const progressPct =
        (activeIndex / (n - 1)) * 100;

    return (
        <div
            className="ej-stepper"
            style={{
                gridTemplateColumns: `repeat(${n}, 1fr)`,
            }}
        >

            {/* Progress Track */}

            <div
                className="ej-track-wrap"
                style={{
                    left: `${inset}%`,
                    right: `${inset}%`,
                }}
            >
                <div className="ej-track" />

                <div
                    className="ej-track-progress"
                    style={{
                        width: `${progressPct}%`,
                    }}
                />
            </div>


            {/* Steps */}

            {JOURNEY_STEPS.map((step, i) => {
                const done = i < activeIndex;
                const active = i === activeIndex;
                const flagged = active && isRecheck;

                let circleClass = "ej-circle";

                if (done) {
                    circleClass += " ej-circle-done";
                } else if (flagged) {
                    circleClass += " ej-circle-flagged";
                } else if (active) {
                    circleClass += " ej-circle-active";
                } else {
                    circleClass += " ej-circle-pending";
                }

                return (
                    <div
                        className="ej-step"
                        key={step.key}
                    >

                        <div className={circleClass}>

                            <span className="ej-circle-glyph">
                                {done
                                    ? "✓"
                                    : flagged
                                    ? "!"
                                    : i + 1}
                            </span>

                            {active && (
                                <span className="ej-pulse" />
                            )}

                        </div>


                        <div className="ej-step-label">
                            {step.label}
                        </div>


                        <div className="ej-step-sub">

                            {done && "Completed"}

                            {flagged && "Needs correction"}

                            {active &&
                                !flagged &&
                                "Currently active"}

                            {!done &&
                                !active &&
                                "Pending"}

                        </div>

                    </div>
                );
            })}

        </div>
    );
}


/* ============================================================
   3. ACTION REQUIRED
============================================================ */

function ActionRequiredCard({
    isRecheck,
    recheckReason,
    formStep,
    formStepLabel,
}) {
    const navigate = useNavigate();

    const hasStarted =
        typeof formStep === "number" &&
        formStep > 0;

    return (
        <div
            className={`ej-panel ${
                isRecheck
                    ? "ej-panel-red"
                    : "ej-panel-amber"
            }`}
        >

            <div className="ej-panel-icon">
                {isRecheck ? "⚠" : "✎"}
            </div>


            <div className="ej-panel-body">

                <div className="ej-panel-title">
                    {isRecheck
                        ? "Correction Required"
                        : "Action Required"}
                </div>


                <p className="ej-panel-text">

                    {isRecheck
                        ? recheckReason
                            ? `Our team requested a correction: "${recheckReason}". Please update the details and resubmit.`
                            : "Our team requested a correction on your application. Please review and resubmit."

                        : hasStarted
                        ? `You're partway through your application — currently on "${formStepLabel}". Finish the remaining steps to move to review.`

                        : "Your account is set up. Complete your application form so our team can review it."
                    }

                </p>


                <button
                    className="ej-btn"
                    onClick={() =>
                        navigate("/student/my-form")
                    }
                >
                    {isRecheck
                        ? "Review & Resubmit"
                        : hasStarted
                        ? "Continue Application"
                        : "Start Application"}
                    <span className="ej-btn-arrow">→</span>
                </button>

            </div>

        </div>
    );
}


/* ============================================================
   4. UNDER REVIEW
============================================================ */

function UnderReviewCard() {
    return (
        <div className="ej-review-card">

            <div className="ej-review-icon">
                ⏳
            </div>

            <div className="ej-review-content">

                <div className="ej-review-title">
                    Application Under Review
                </div>

                <p className="ej-review-text">
                    Your application is under review. We’ll notify you when there is an update.
                </p>

            </div>

        </div>
    );
}


/* ============================================================
   5. FINAL DECISION STATE
============================================================ */

function DecisionCard({ rawStage }) {
    const negative =
        isNegativeDecision(rawStage);

    return (
        <div
            className={`ej-panel ${
                negative
                    ? "ej-panel-red"
                    : "ej-panel-teal"
            }`}
        >

            <div className="ej-panel-icon">
                {negative ? "✕" : "✓"}
            </div>


            <div className="ej-panel-body">

                <div className="ej-panel-title">
                    {negative
                        ? "Application Not Approved"
                        : "Application Reviewed"}
                </div>


                <p className="ej-panel-text">

                    {negative
                        ? "Your application wasn't approved this time. Reach out to admissions if you'd like feedback or to reapply."

                        : "Your application has been reviewed and approved. Next steps will appear here shortly."
                    }

                </p>

            </div>

        </div>
    );
}


/* ============================================================
   6. MAIN EXPORT
============================================================ */

export default function ApplicationJourney({
    data,
}) {

    const rawStage = data?.currentStage;


    const activeIndex = useMemo(
        () => getStepIndex(rawStage),
        [rawStage]
    );


    const isRecheck =
        (rawStage || "").toUpperCase() ===
        "RECHECK_REQUIRED";


    return (
        <div className="ej-wrap">

            <style>{EJ_STYLES}</style>


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="ej-header">

                <h3>
                    Your Application Journey
                </h3>

            </div>


            {/* ==================================================
                STEPPER
            ================================================== */}

            <Stepper
                activeIndex={activeIndex}
                isRecheck={isRecheck}
            />


            {/* ==================================================
                APPLICATION NOT YET SUBMITTED
            ================================================== */}

            {activeIndex === 1 && (
                <ActionRequiredCard
                    isRecheck={isRecheck}
                    recheckReason={
                        data?.recheckReason
                    }
                    formStep={
                        data?.formStep
                    }
                    formStepLabel={
                        data?.formStepLabel
                    }
                />
            )}


            {/* ==================================================
                APPLICATION UNDER REVIEW
            ================================================== */}

            {activeIndex === 2 && (
                <UnderReviewCard />
            )}


            {/* ==================================================
                FINAL DECISION
            ================================================== */}

            {activeIndex === 3 && (
                <DecisionCard
                    rawStage={rawStage}
                />
            )}

        </div>
    );
}


/* ============================================================
   7. SCOPED STYLES
============================================================ */

const EJ_STYLES = `

/* ============================================================
   MAIN WRAPPER
============================================================ */

.ej-wrap {
    width: 100%;

    margin: 0;

    box-sizing: border-box;

    font-family: Cambria;
}


/*
 * Force Cambria throughout this component
 */

.ej-wrap,
.ej-wrap * {
    font-family: Cambria;
}


/* ============================================================
   HEADER
============================================================ */

.ej-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
 
    margin: 0 0 18px 0;
}


.ej-header h3 {
    margin: 0;

    font-size: 22px;
    font-weight: 700;

    color: ${C.navyText};

    letter-spacing: -0.2px;
}


/* ============================================================
   STEPPER
============================================================ */

.ej-stepper {

    position: relative;

    display: grid;
    align-items: start;

    width: 100%;

    margin-bottom: 12px;

    min-height: 115px;
}


/* ============================================================
   TRACK
============================================================ */

.ej-track-wrap {
    position: absolute;

    top: 24px;

    height: 4px;

    z-index: 0;
}


.ej-track {
    position: absolute;

    inset: 0;

    background: ${C.line};

    border-radius: 4px;
}


.ej-track-progress {
    position: absolute;

    inset: 0 auto 0 0;

    background: linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%);

    border-radius: 4px;

    transition: width 0.35s ease;
}


/* ============================================================
   STEP
============================================================ */

.ej-step {
    position: relative;

    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;

    padding: 0;
}


/* ============================================================
   CIRCLE (Enlarged to 50px)
============================================================ */

.ej-circle {
    position: relative;

    width: 50px;
    height: 50px;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: all 0.3s ease;
}


.ej-circle-glyph {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    font-weight: 700;
    font-size: 17px;

    line-height: 1;
}


/* Completed */

.ej-circle-done {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    color: #fff;
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4);
}


/* Active */

.ej-circle-active {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    color: #fff;
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
}


/* Recheck */

.ej-circle-flagged {
    background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
    color: #fff;
    box-shadow: 0 6px 18px rgba(185, 28, 28, 0.4);
}


/* Pending */

.ej-circle-pending {
    background: #fff;

    color: ${C.slateLight};

    border: 2px solid ${C.line};
}


/* ============================================================
   ACTIVE PULSE
============================================================ */

.ej-pulse {
    position: absolute;

    inset: -3px;

    border-radius: 50%;

    border: 2px solid #3B82F6;

    animation: ej-pulse 1.8s ease-out infinite;

    pointer-events: none;
}


.ej-circle-flagged .ej-pulse {
    border-color: ${C.red};
}


@keyframes ej-pulse {

    0% {
        transform: scale(0.95);
        opacity: 0.8;
    }

    100% {
        transform: scale(1.4);
        opacity: 0;
    }

}


/* ============================================================
   STEP LABEL
============================================================ */

.ej-step-label {
    margin-top: 10px;

    font-size: 13.5px;
    font-weight: 700;

    color: ${C.navyText};

    line-height: 1.25;

    max-width: 155px;
}


/* ============================================================
   STEP SUB LABEL
============================================================ */

.ej-step-sub {
    margin-top: 3px;

    font-size: 10px;
    font-weight: 600;

    letter-spacing: 0.25px;

    text-transform: uppercase;

    color: ${C.slateLight};

    line-height: 1.2;
}


/* ============================================================
   ACTION / STATUS PANEL
============================================================ */

.ej-panel {
    display: flex;

    gap: 14px;

    align-items: flex-start;

    border-radius: 10px;

    padding: 15px 17px;

    margin-bottom: 18px;
}


.ej-panel-amber {
    background: ${C.amberBg};

    border: 1px solid #FDE3C0;
}


.ej-panel-red {
    background: ${C.redBg};

    border: 1px solid #FBD5D5;
}


.ej-panel-teal {
    background: ${C.tealBg};

    border: 1px solid #C8EEE3;
}


/* ============================================================
   PANEL ICON
============================================================ */

.ej-panel-icon {
    font-size: 19px;

    line-height: 1;

    margin-top: 2px;

    flex-shrink: 0;
}


.ej-panel-amber .ej-panel-icon {
    color: ${C.amberLine};
}


.ej-panel-red .ej-panel-icon {
    color: ${C.red};
}


.ej-panel-teal .ej-panel-icon {
    color: ${C.teal};
}


/* ============================================================
   PANEL BODY
============================================================ */

.ej-panel-body {
    min-width: 0;
}


.ej-panel-title {
    font-weight: 700;

    font-size: 15px;

    color: ${C.navyText};

    margin-bottom: 3px;
}


.ej-panel-text {
    margin: 0 0 10px 0;

    font-size: 13px;

    line-height: 1.45;

    color: ${C.slate};

    max-width: 600px;
}


/* ============================================================
   UNDER REVIEW CARD
============================================================ */

.ej-review-card {
    display: flex;

    align-items: center;

    gap: 12px;

    width: 100%;

    box-sizing: border-box;

    padding: 13px 16px;

    margin-bottom: 18px;

    border-radius: 10px;

    background: #F8FAFC;

    border: 1px solid ${C.line};
}


.ej-review-icon {
    width: 32px;
    height: 32px;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    border-radius: 50%;

    background: #FFF7ED;

    font-size: 16px;
}


.ej-review-content {
    min-width: 0;
}


.ej-review-title {
    margin: 0 0 2px 0;

    font-size: 14px;

    font-weight: 700;

    color: ${C.navyText};
}


.ej-review-text {
    margin: 0;

    font-size: 12.5px;

    line-height: 1.4;

    color: ${C.slate};
}


/* ============================================================
   BUTTON (Smooth Gradient & Blinking Pulse)
============================================================ */

.ej-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);

    color: #ffffff;

    border: none;

    padding: 11px 22px;

    border-radius: 8px;

    font-size: 15.5px;

    font-weight: 700;

    cursor: pointer;

    text-decoration: none;

    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);

    transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;

    will-change: transform, box-shadow;

    /* Guidance floating & glowing pulse animation */
    animation: ejBtnGuidePulse 2.2s infinite ease-in-out;
}

.ej-btn-arrow {
    font-size: 15px;
    transition: transform 0.2s ease;
}

.ej-btn:hover {
    background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);

    transform: translateY(-3px);

    box-shadow: 0 10px 26px rgba(37, 99, 235, 0.55);

    animation-play-state: paused;
}

.ej-btn:hover .ej-btn-arrow {
    transform: translateX(4px);
}

.ej-btn:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

@keyframes ejBtnGuidePulse {
    0%, 100% {
        transform: translateY(0);
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
    }
    50% {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(37, 99, 235, 0.65), 0 0 18px rgba(59, 130, 246, 0.5);
    }
}


/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 768px) {

    .ej-wrap {
        max-width: 100%;

        padding: 18px 8px 14px 8px;
    }


    .ej-stepper {
        min-height: 115px;
    }


    .ej-step {
        padding: 0 2px;
    }


    .ej-circle {
        width: 42px;
        height: 42px;
    }


    .ej-step-label {
        font-size: 11.5px;

        max-width: 110px;
    }


    .ej-step-sub {
        font-size: 8.5px;
    }

}


@media (max-width: 640px) {

    .ej-stepper {
        grid-template-columns: repeat(3, 1fr) !important;

        row-gap: 24px;

        min-height: auto;
    }


    .ej-track-wrap {
        display: none;
    }


    .ej-step-label {
        font-size: 11.5px;
    }


    .ej-step-sub {
        font-size: 8px;
    }


    .ej-panel {
        padding: 13px 14px;
    }


    .ej-review-card {
        padding: 12px 14px;
    }

}

`;