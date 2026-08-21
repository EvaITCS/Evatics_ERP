import React from "react";
import "../styles/formStepper.css";
import "../styles/MyForm.css";

/**
 * Clean, lightweight SVG icons representing each step.
 * Using currentColor to inherit dynamic state styling.
 */
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const GraduationCapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
);

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

// Map indices directly to professional vector components
const STEP_ICONS = {
    0: <UserIcon />,
    1: <PhoneIcon />,
    2: <GraduationCapIcon />,
    3: <BriefcaseIcon />,
    4: <FileIcon />,
    5: <CheckCircleIcon />,
};

const CheckGlyph = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function FormStepper({
    steps,
    currentStep,
    completedStep = currentStep - 1,
    allowClick = false,
    onStepClick,
}) {
    const n = steps.length;
    // Half a grid-column's width, in % — the distance from the edge of
    // the row to the center of the first/last circle. The track sits
    // exactly between those two points so it runs through every
    // circle's true center regardless of step count or label width.
    const inset = 100 / (2 * n);
    const furthestDone = Math.max(currentStep, completedStep);
    const progressPct = n > 1 ? Math.max(0, Math.min(1, furthestDone / (n - 1))) * 100 : 0;

    return (
        <div className="form-stepper-container" style={{marginTop:"15px"}}>
           
            <div
                className="stepper-progress-bar"
                role="list"
                style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
            >
                <div className="stepper-track-wrap" style={{ left: `${inset}%`, right: `${inset}%` }}>
                    <div className="stepper-track" />
                    <div className="stepper-track-progress" style={{ width: `${progressPct}%` }} />
                </div>

                {steps.map((step, index) => {
                    const isCompleted = index <= completedStep;
                    const isActive = index === currentStep;

                    let statusClass = "pending";
                    if (isActive) statusClass = "active";
                    else if (isCompleted) statusClass = "completed";

                    const handleNodeClick = () => {
                        if (allowClick && onStepClick) {
                            onStepClick(index);
                        }
                    };

                    return (
                        <button
                            key={index}
                            type="button"
                            className={`stepper-node-wrapper ${statusClass} ${allowClick ? "clickable" : ""}`}
                            onClick={handleNodeClick}
                            disabled={!allowClick}
                            aria-current={isActive ? "step" : undefined}
                            role="listitem"
                        >
                            <div className="stepper-circle">
                                {isCompleted ? (
                                    <span className="check-icon">
                                        <CheckGlyph />
                                    </span>
                                ) : (
                                    <span className="step-icon">{STEP_ICONS[index]}</span>
                                )}
                            </div>
                            <span className="stepper-label">{step}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}