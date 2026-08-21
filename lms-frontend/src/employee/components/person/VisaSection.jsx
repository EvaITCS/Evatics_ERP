import React from "react";

// =====================================================
// VISA TYPES
// =====================================================

const VISA_TYPES = [
    "US Citizen",
    "Green Card",
    "EAD",
];

// =====================================================
// EAD TYPES
// =====================================================

const EAD_TYPES = [
    "C03B - F1 OPT",
    "C03C - F1 STEM OPT",
    "C09 - Adjustment of Status",
    "A12 - TPS",
    "C08 - Asylum Pending",
    "A05 - Asylee",
    "A10 - Withholding of Removal",
    "C33 - DACA",
    "C18 - L2 Spouse",
    "A17 - H4 EAD",
    "Other",
];

// =====================================================
// COMPONENT
// =====================================================

function VisaSection({
                         formData,
                         handleVisaChange,
                         addVisa,
                         removeVisa,
                     }) {
    const visas = formData?.visas || [];

    return (

        <>

            <h3 className="form-section-title">

                Visa Information

            </h3>



            <div className="form-grid">

            {/* ===================================================== */}
            {/* VISA LIST */}
            {/* ===================================================== */}

            {visas.map((visa, index) => {

                // -------------------------------------------------
                // CHECK VISA TYPE
                // -------------------------------------------------

                const isEAD =
                    visa?.visaType === "EAD";

                const isCitizenOrGreenCard =
                    visa?.visaType === "US Citizen" ||
                    visa?.visaType === "Green Card";

                const isOtherEAD =
                    isEAD &&
                    visa?.eadType === "Other";

                return (
                    <React.Fragment
                        key={
                            visa?.visaId ??
                            `visa-${index}`
                        }
                    >




                        {/* ================================================= */}
                        {/* VISA TYPE */}
                        {/* ================================================= */}

                        <div className="form-group">

                            <label>
                                Visa Type{" "}

                                <span
                                    style={{
                                        color: "red",
                                        fontWeight: "bold",
                                        marginLeft: "2px"
                                    }}
                                >
            *
        </span>
                            </label>

                            <select
                                value={
                                    visa?.visaType || ""
                                }
                                onChange={(e) =>
                                    handleVisaChange(
                                        index,
                                        "visaType",
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Visa Type
                                </option>

                                {VISA_TYPES.map(
                                    (type) => (

                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ================================================= */}
                        {/* EAD TYPE */}
                        {/* ================================================= */}

                        {isEAD && (

                            <div className="form-group">

                                <label>
                                    EAD Type
                                </label>

                                <select
                                    value={
                                        visa?.eadType || ""
                                    }
                                    onChange={(e) =>
                                        handleVisaChange(
                                            index,
                                            "eadType",
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select EAD Type
                                    </option>

                                    {EAD_TYPES.map(
                                        (type) => (
                                            <option
                                                key={type}
                                                value={type}
                                            >
                                                {type}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                        )}


                        {/* ================================================= */}
                        {/* OTHER EAD TYPE */}
                        {/* ================================================= */}

                        {isOtherEAD && (

                            <div className="form-group">

                                <label>
                                    Other EAD Type
                                </label>

                                <input
                                    type="text"
                                    value={
                                        visa?.otherEadType || ""
                                    }
                                    onChange={(e) =>
                                        handleVisaChange(
                                            index,
                                            "otherEadType",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter EAD Type"
                                />

                            </div>

                        )}


                        {/* ================================================= */}
                        {/* VISA EXPIRY DATE */}
                        {/* ================================================= */}

                        <div className="form-group">

                            <label>
                                Visa Expiry Date
                            </label>

                            <input
                                type="date"
                                value={
                                    visa?.visaExpiryDate || ""
                                }
                                onChange={(e) =>
                                    handleVisaChange(
                                        index,
                                        "visaExpiryDate",
                                        e.target.value
                                    )
                                }
                                disabled={
                                    isCitizenOrGreenCard
                                }
                            />

                            {isCitizenOrGreenCard && (

                                <small>
                                    Expiry date is not
                                    required for US Citizen
                                    or Green Card.
                                </small>

                            )}

                        </div>


                        {/* ================================================= */}
                        {/* REMOVE VISA */}
                        {/* ================================================= */}

                        {visas.length > 1 && (

                            <div
                                className="form-group"
                                style={{
                                    display: "flex",
                                    alignItems: "end",
                                }}
                            >

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() =>
                                        removeVisa(index)
                                    }
                                >
                                    Remove Visa
                                </button>

                            </div>

                        )}


                        {/* ================================================= */}
                        {/* SEPARATOR */}
                        {/* ================================================= */}

                        <hr
                            style={{
                                gridColumn: "span 3",
                                margin: "20px 0",
                            }}
                        />

                    </React.Fragment>
                );
            })}


            {/* ===================================================== */}
            {/* ADD VISA */}
            {/* ===================================================== */}

            <div
                style={{
                    gridColumn: "span 3",
                }}
            >

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addVisa}
                >
                    + Add Visa
                </button>

            </div>

        </div>
</>
);
}

export default VisaSection;