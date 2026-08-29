import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

const ToastContext = createContext(null);

const toastStyles = `
    .custom-toast {
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);

        min-width: 360px;
        max-width: 420px;

        display: flex;
        align-items: center;
        gap: 12px;

        padding: 18px 20px;

        background: #ffffff;

        border-radius: 10px;

        box-shadow:
            0 15px 40px rgba(15, 23, 42, 0.20),
            0 4px 12px rgba(15, 23, 42, 0.10);

        border: 1px solid #e2e8f0;

        z-index: 10000;

        animation: customToastTopIn 0.25s ease-out;

        box-sizing: border-box;
    }

    /* =========================
       SUCCESS
    ========================= */

    .custom-toast.success {
        border-left: 4px solid #16a34a;
    }

    /* =========================
       ERROR
    ========================= */

    .custom-toast.error {
        border-left: 4px solid #dc2626;
    }

    /* =========================
       ICON
    ========================= */

    .custom-toast-icon {
        width: 34px;
        height: 34px;

        min-width: 34px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        font-size: 18px;
        font-weight: 700;
    }

    /* Success Icon */

    .custom-toast.success .custom-toast-icon {
        color: #15803d;
        background: #dcfce7;
    }

    /* Error Icon */

    .custom-toast.error .custom-toast-icon {
        color: #b91c1c;
        background: #fee2e2;
    }

    /* =========================
       CONTENT
    ========================= */

    .custom-toast-content {
        display: flex;
        flex-direction: column;

        gap: 3px;

        flex: 1;

        min-width: 0;
    }

    .custom-toast-content strong {
        font-size: 0.92rem;
        font-weight: 700;

        color: #1e293b;
    }

    .custom-toast-content span {
        font-size: 0.85rem;
        line-height: 1.4;

        color: #64748b;

        word-break: break-word;
    }

    /* =========================
       CLOSE BUTTON
    ========================= */

    .toast-close-btn {
        border: none;

        background: transparent;

        color: #94a3b8;

        font-size: 22px;
        line-height: 1;

        cursor: pointer;

        padding: 2px 4px;

        transition: color 0.2s ease;

        flex-shrink: 0;
    }

    .toast-close-btn:hover {
        color: #334155;
    }

    /* =========================
       TOP CENTER ANIMATION
    ========================= */

    @keyframes customToastTopIn {
        from {
            opacity: 0;

            transform:
                translate(-50%, -45%);
        }

        to {
            opacity: 1;

            transform:
                translate(-50%, 0);
        }
    }

    /* =========================
       RESPONSIVE
    ========================= */

    @media (max-width: 480px) {
        .custom-toast {
            left: 16px;
            right: 16px;

            transform: none;

            min-width: 0;
            max-width: none;

            width: auto;
        }

        @keyframes customToastTopIn {
            from {
                opacity: 0;
                transform: translateY(-45%);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }
`;

export const ToastProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        show: false,
        type: "success",
        title: "Success",
        message: ""
    });

    const toastTimerRef = useRef(null);

    /*
     * Inject inline CSS once when ToastProvider is mounted.
     */
    useEffect(() => {
        const styleElement = document.createElement("style");

        styleElement.setAttribute(
            "data-toast-styles",
            "custom-global-toast"
        );

        styleElement.textContent = toastStyles;

        document.head.appendChild(styleElement);

        return () => {
            if (document.head.contains(styleElement)) {
                document.head.removeChild(styleElement);
            }
        };
    }, []);

    /*
     * Clear previous timer before starting a new one.
     * This prevents an older toast timer from hiding a newer toast.
     */
    const clearToastTimer = useCallback(() => {
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
            toastTimerRef.current = null;
        }
    }, []);

    /*
     * Global Toast Function
     *
     * showToast(
     *     message,
     *     type,
     *     title
     * )
     */
    const showToast = useCallback(
        (message, type = "success", customTitle = null) => {
            clearToastTimer();

            const title =
                customTitle ||
                (type === "success" ? "Success" : "Error");

            setNotification({
                show: true,
                type,
                title,
                message
            });

            toastTimerRef.current = setTimeout(() => {
                setNotification((prev) => ({
                    ...prev,
                    show: false
                }));

                toastTimerRef.current = null;
            }, 3500);
        },
        [clearToastTimer]
    );

    /*
     * Manually close toast
     */
    const hideToast = useCallback(() => {
        clearToastTimer();

        setNotification((prev) => ({
            ...prev,
            show: false
        }));
    }, [clearToastTimer]);

    /*
     * Cleanup timer when Provider unmounts
     */
    useEffect(() => {
        return () => {
            clearToastTimer();
        };
    }, [clearToastTimer]);

    return (
        <ToastContext.Provider
            value={{
                showToast,
                hideToast
            }}
        >
            {children}

            {notification.show && (
                <div
                    className={`custom-toast ${notification.type}`}
                    role="alert"
                    aria-live="polite"
                >
                    <div className="custom-toast-icon">
                        {notification.type === "success" ? "✓" : "!"}
                    </div>

                    <div className="custom-toast-content">
                        <strong>
                            {notification.title}
                        </strong>

                        <span>
                            {notification.message}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={hideToast}
                        className="toast-close-btn"
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
};