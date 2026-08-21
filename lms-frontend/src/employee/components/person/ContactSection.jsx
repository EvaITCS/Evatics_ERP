import React from "react";

function ContactSection({
                            formData,
                            handleArrayChange,
                            starStyle,
                            isUpdate = false,
                        }) {

    // =====================================================
    // CONTACTS
    // =====================================================

    const contacts =
        formData?.contacts || [];

    const primaryEmail =
        contacts[0]?.contactValue || "";

    const primaryPhone =
        contacts[1]?.contactValue || "";

    const alternateEmail =
        contacts[2]?.contactValue || "";

    const alternatePhone =
        contacts[3]?.contactValue || "";

    // =====================================================
    // PHONE CHANGE
    // =====================================================

    const handlePhoneChange = (
        index,
        value
    ) => {

        // Only digits
        const digits =
            value.replace(/\D/g, "");

        // Maximum 10 digits
        const limited =
            digits.slice(0, 10);

        handleArrayChange(
            "contacts",
            index,
            "contactValue",
            limited
        );
    };

    // =====================================================
    // EMAIL CHANGE
    // =====================================================

    const handleEmailChange = (
        index,
        value
    ) => {

        handleArrayChange(
            "contacts",
            index,
            "contactValue",
            value.trimStart()
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <>

            <h3 className="form-section-title">

                Contact Information

            </h3>



            <div className="form-grid">

            {/* ================================================= */}
            {/* PRIMARY EMAIL */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Primary Email{" "}
                    <span style={starStyle}>
                        *
                    </span>
                </label>

                <input
                    type="email"
                    value={primaryEmail}
                    onChange={(e) =>
                        handleEmailChange(
                            0,
                            e.target.value
                        )
                    }
                    placeholder="example@company.com"
                    required
                    autoComplete="email"
                    disabled={isUpdate}
                />

                {isUpdate && (
                    <small>
                        Primary email cannot be changed.
                    </small>
                )}

            </div>

            {/* ================================================= */}
            {/* PRIMARY PHONE */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Primary Phone{" "}
                    <span style={starStyle}>
                        *
                    </span>
                </label>

                <input
                    type="tel"
                    value={primaryPhone}
                    onChange={(e) =>
                        handlePhoneChange(
                            1,
                            e.target.value
                        )
                    }
                    placeholder="10-digit Mobile Number"
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    required
                    autoComplete="tel"
                    disabled={isUpdate}
                />

                {isUpdate && (
                    <small>
                        Primary phone cannot be changed.
                    </small>
                )}

                {!isUpdate &&
                    primaryPhone.length > 0 &&
                    primaryPhone.length !== 10 && (
                        <small
                            style={{
                                color: "red",
                            }}
                        >
                            Phone number must be exactly
                            10 digits.
                        </small>
                    )}

            </div>

            {/* ================================================= */}
            {/* ALTERNATE EMAIL */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Alternate Email
                </label>

                <input
                    type="email"
                    value={alternateEmail}
                    onChange={(e) =>
                        handleEmailChange(
                            2,
                            e.target.value
                        )
                    }
                    placeholder="Alternate Email"
                    autoComplete="email"
                />

            </div>

            {/* ================================================= */}
            {/* ALTERNATE PHONE */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Alternate Phone
                </label>

                <input
                    type="tel"
                    value={alternatePhone}
                    onChange={(e) =>
                        handlePhoneChange(
                            3,
                            e.target.value
                        )
                    }
                    placeholder="10-digit Mobile Number"
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    autoComplete="tel"
                />

                {alternatePhone.length > 0 &&
                    alternatePhone.length !== 10 && (
                        <small
                            style={{
                                color: "red",
                            }}
                        >
                            Alternate phone number
                            must be exactly 10 digits.
                        </small>
                    )}

            </div>

        </div>
</>
);
}

export default ContactSection;