import React from "react";
import "../styles/employeefrom.css";

// FontAwesome ya Lucide Icon integrate karne ke liye standard SVG use kar rahe hain
const DocumentIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const CheckIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function EmployeeStepper({ steps, currentStep, setCurrentStep }) {
    const handleStepClick = (stepNumber) => {
        if (stepNumber <= currentStep) {
            setCurrentStep(stepNumber);
        }
    };

    return (
        <div className="employee-stepper-card">
            {/* Top Right Badge (STEP X OF Y) */}
            <div className="employee-stepper-badge">
                STEP {currentStep} OF {steps.length}
            </div>

            <div className="employee-stepper-container">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;

                    return (
                        <React.Fragment key={stepNumber}>
                            {/* Step Item */}
                            <div className="employee-step-wrapper">
                                <button
                                    type="button"
                                    className={`employee-step ${
                                        isCompleted ? "completed" : ""
                                    } ${isActive ? "active" : ""}`}
                                    onClick={() => handleStepClick(stepNumber)}
                                >
                                    <span className="employee-step-icon">
                                        {isCompleted ? (
                                            <CheckIcon />
                                        ) : isActive ? (
                                            <DocumentIcon />
                                        ) : (
                                            <CheckIcon />
                                        )}
                                    </span>
                                </button>
                                <span className={`employee-step-label ${isActive ? "active" : ""}`}>
                                    {step}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {stepNumber < steps.length && (
                                <div
                                    className={`employee-step-line ${
                                        stepNumber < currentStep ? "completed" : ""
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

export default EmployeeStepper;