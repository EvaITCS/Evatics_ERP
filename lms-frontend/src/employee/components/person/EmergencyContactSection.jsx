import React, { useState } from "react";
import api from "../../../api/axios";

function EmergencyContactSection({
                                     formData,
                                     handleEmergencyContactChange,
                                     starStyle,
                                 }) {

    // =====================================================
    // EMERGENCY CONTACTS
    // =====================================================

    const contacts =
        formData?.emergencyContacts || [];

    // =====================================================
    // GEOAPIFY SEARCH STATE
    // =====================================================

    const [searchingIndex, setSearchingIndex] =
        useState(null);

    const [searchText, setSearchText] =
        useState({});

    const [searchResults, setSearchResults] =
        useState({});

    // =====================================================
    // SAFE VALUE
    // =====================================================

    const getValue = (
        contact,
        field
    ) => {

        return contact?.[field] ?? "";
    };

    // =====================================================
    // SEARCH TEXT CHANGE
    // =====================================================

    const handleSearchTextChange = (
        index,
        value
    ) => {

        setSearchText((prev) => ({
            ...prev,
            [index]: value,
        }));

        // Clear old results
        setSearchResults((prev) => ({
            ...prev,
            [index]: [],
        }));
    };

    // =====================================================
    // SEARCH LOCATION
    // =====================================================

    const handleLocationSearch = async (
        index
    ) => {

        const text =
            searchText[index]?.trim() || "";

        // -------------------------------------------------
        // EMPTY SEARCH
        // -------------------------------------------------

        if (!text) {

            alert(
                "Please enter an address to search."
            );

            return;
        }

        // -------------------------------------------------
        // MINIMUM CHARACTERS
        // -------------------------------------------------

        if (text.length < 3) {

            alert(
                "Please enter at least 3 characters."
            );

            return;
        }

        try {

            setSearchingIndex(index);

            // =================================================
            // SAME GEOAPIFY API USED BY ADDRESS SECTION
            // =================================================

            const response =
                await api.get(
                    "/api/locations/search",
                    {
                        params: {
                            text,
                        },
                    }
                );

            console.log(
                "Emergency Contact Geoapify search response:",
                response.data
            );

            const results =
                Array.isArray(
                    response.data
                )
                    ? response.data
                    : [];

            // =================================================
            // NO RESULTS
            // =================================================

            if (
                results.length === 0
            ) {

                setSearchResults(
                    (prev) => ({
                        ...prev,
                        [index]: [],
                    })
                );

                alert(
                    "No address found."
                );

                return;
            }

            // =================================================
            // SAVE RESULTS
            // =================================================

            setSearchResults(
                (prev) => ({
                    ...prev,
                    [index]: results,
                })
            );

        } catch (error) {

            console.error(
                "Emergency contact location search failed:",
                error
            );

            console.error(
                "Status:",
                error?.response?.status
            );

            console.error(
                "Response:",
                error?.response?.data
            );

            alert(
                error?.response?.data?.message ||
                "Unable to search address. Please try again."
            );

        } finally {

            setSearchingIndex(
                null
            );
        }
    };

    // =====================================================
    // SELECT LOCATION
    // =====================================================

    const handleLocationSelect = (
        index,
        location
    ) => {

        console.log(
            "Selected Emergency Contact location:",
            location
        );

        // =================================================
        // ADDRESS LINE 1
        // =================================================

        handleEmergencyContactChange(
            index,
            "addressLine1",
            location?.addressLine1 || ""
        );

        // =================================================
        // ADDRESS LINE 2
        // =================================================

        if (
            location?.addressLine2 !==
            undefined
        ) {

            handleEmergencyContactChange(
                index,
                "addressLine2",
                location?.addressLine2 || ""
            );
        }

        // =================================================
        // COUNTRY
        // =================================================

        handleEmergencyContactChange(
            index,
            "country",
            location?.country || ""
        );

        // =================================================
        // STATE
        // =================================================

        handleEmergencyContactChange(
            index,
            "state",
            location?.state || ""
        );

        // =================================================
        // CITY
        // =================================================

        handleEmergencyContactChange(
            index,
            "city",
            location?.city || ""
        );

        // =================================================
        // ZIP CODE
        // =================================================
        //
        // Support both:
        // zipcode
        // zipCode
        //
        // =================================================

        handleEmergencyContactChange(
            index,
            "zipcode",
            location?.zipcode ??
            location?.zipCode ??
            ""
        );

        // =================================================
        // SEARCH BOX
        // =================================================

        setSearchText(
            (prev) => ({
                ...prev,
                [index]:
                    location?.formatted ||
                    location?.addressLine1 ||
                    "",
            })
        );

        // =================================================
        // CLOSE RESULTS
        // =================================================

        setSearchResults(
            (prev) => ({
                ...prev,
                [index]: [],
            })
        );
    };

    // =====================================================
    // RENDER SEARCH RESULTS
    // =====================================================

    const renderSearchResults = (
        index
    ) => {

        const results =
            searchResults[index] || [];

        if (
            results.length === 0
        ) {
            return null;
        }

        return (
            <div
                style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: "#ffffff",
                    border:
                        "1px solid #d9dfe8",
                    borderRadius: "8px",
                    marginTop: "5px",
                    boxShadow:
                        "0 6px 18px rgba(0,0,0,0.12)",
                    maxHeight: "300px",
                    overflowY: "auto",
                }}
            >

                {results.map(
                    (
                        location,
                        resultIndex
                    ) => (

                        <div
                            key={
                                location?.placeId ||
                                location?.id ||
                                resultIndex
                            }
                            onClick={() =>
                                handleLocationSelect(
                                    index,
                                    location
                                )
                            }
                            style={{
                                padding:
                                    "12px 15px",
                                cursor:
                                    "pointer",
                                borderBottom:
                                    "1px solid #eeeeee",
                            }}
                            onMouseEnter={(e) => {

                                e.currentTarget.style.backgroundColor =
                                    "#f5f8ff";

                            }}
                            onMouseLeave={(e) => {

                                e.currentTarget.style.backgroundColor =
                                    "#ffffff";

                            }}
                        >

                            {/* ===================================== */}
                            {/* MAIN ADDRESS */}
                            {/* ===================================== */}

                            <div
                                style={{
                                    fontWeight:
                                        "600",
                                    fontSize:
                                        "14px",
                                    marginBottom:
                                        "5px",
                                }}
                            >
                                {
                                    location?.addressLine1 ||
                                    location?.formatted ||
                                    "Address"
                                }
                            </div>

                            {/* ===================================== */}
                            {/* LOCATION DETAILS */}
                            {/* ===================================== */}

                            <div
                                style={{
                                    fontSize:
                                        "13px",
                                    color:
                                        "#667085",
                                    lineHeight:
                                        "1.5",
                                }}
                            >

                                {[
                                    location?.city,
                                    location?.state,
                                    location?.country,
                                    location?.zipcode ??
                                    location?.zipCode,
                                ]
                                    .filter(Boolean)
                                    .join(", ")}

                            </div>

                            {/* ===================================== */}
                            {/* FORMATTED ADDRESS */}
                            {/* ===================================== */}

                            {location?.formatted && (

                                <div
                                    style={{
                                        fontSize:
                                            "12px",
                                        color:
                                            "#98a2b3",
                                        marginTop:
                                            "4px",
                                    }}
                                >
                                    {
                                        location.formatted
                                    }
                                </div>

                            )}

                        </div>

                    )
                )}

            </div>
        );
    };

    // =====================================================
    // RENDER ADDRESS SEARCH
    // =====================================================

    const renderAddressSearch = (
        index
    ) => {

        return (

            <div
                className="form-group"
                style={{
                    gridColumn:
                        "span 3",
                    position:
                        "relative",
                }}
            >

                <label>
                    Search Address
                </label>

                <div
                    style={{
                        display:
                            "flex",
                        gap:
                            "10px",
                    }}
                >

                    {/* ===================================== */}
                    {/* SEARCH INPUT */}
                    {/* ===================================== */}

                    <input
                        type="text"
                        value={
                            searchText[index] ||
                            ""
                        }
                        onChange={(e) =>
                            handleSearchTextChange(
                                index,
                                e.target.value
                            )
                        }
                        disabled={
                            searchingIndex ===
                            index
                        }
                        placeholder="Enter address, city, state or zip code"
                        autoComplete="off"
                    />

                    {/* ===================================== */}
                    {/* SEARCH BUTTON */}
                    {/* ===================================== */}

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            handleLocationSearch(
                                index
                            )
                        }
                        disabled={
                            searchingIndex ===
                            index
                        }
                    >
                        {
                            searchingIndex ===
                            index
                                ? "Searching..."
                                : "Search Address"
                        }
                    </button>

                </div>

                {/* ========================================= */}
                {/* SEARCH RESULTS */}
                {/* ========================================= */}

                {renderSearchResults(index)}

            </div>
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <>

            <h3 className="form-section-title">

                Emergency Contact Section

            </h3>



            <div className="form-grid">

            {contacts.map(
                (
                    contact,
                    index
                ) => (

                    <React.Fragment
                        key={index}
                    >



                        {/* ========================================= */}
                        {/* CONTACT NAME */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                Contact Name
                            </label>

                            <input
                                type="text"
                                value={
                                    getValue(
                                        contact,
                                        "contactName"
                                    )
                                }
                                onChange={(e) =>
                                    handleEmergencyContactChange(
                                        index,
                                        "contactName",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter Contact Name"
                                autoComplete="name"
                            />

                        </div>

                        {/* ========================================= */}
                        {/* RELATIONSHIP */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                Relationship
                            </label>

                            <input
                                type="text"
                                value={
                                    getValue(
                                        contact,
                                        "relationship"
                                    )
                                }
                                onChange={(e) =>
                                    handleEmergencyContactChange(
                                        index,
                                        "relationship",
                                        e.target.value
                                    )
                                }
                                placeholder="Father, Mother, Spouse, etc."
                            />

                        </div>

                        {/* ========================================= */}
                        {/* PHONE */}
                        {/* ========================================= */}

                        {/* =====================================================
    PHONE NUMBER
===================================================== */}

                        <div className="form-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                value={
                                    getValue(
                                        contact,
                                        "phoneNumber"
                                    )
                                }
                                onChange={(e) => {

                                    const value =
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 10);

                                    handleEmergencyContactChange(
                                        index,
                                        "phoneNumber",
                                        value
                                    );
                                }}
                                placeholder="Enter 10 digit phone number"
                                maxLength={10}
                                inputMode="numeric"
                                autoComplete="tel"
                            />

                        </div>

                        {/* ========================================= */}
                        {/* GEOAPIFY SEARCH */}
                        {/* ========================================= */}

                        {renderAddressSearch(
                            index
                        )}

                        {/* ========================================= */}
                        {/* ADDRESS LINE 1 */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                Address Line 1
                            </label>

                            <input
                                type="text"
                                value={
                                    getValue(
                                        contact,
                                        "addressLine1"
                                    )
                                }
                                onChange={(e) =>
                                    handleEmergencyContactChange(
                                        index,
                                        "addressLine1",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter Address Line 1"
                            />

                        </div>

                        {/* ========================================= */}
                        {/* ADDRESS LINE 2 */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                Address Line 2
                            </label>

                            <input
                                type="text"
                                value={
                                    getValue(
                                        contact,
                                        "addressLine2"
                                    )
                                }
                                onChange={(e) =>
                                    handleEmergencyContactChange(
                                        index,
                                        "addressLine2",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter Address Line 2"
                            />

                        </div>

                        {/* ========================================= */}
                        {/* COUNTRY */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                Country
                            </label>

                            <input
                                type="text"
                                value={
                                    getValue(
                                        contact,
                                        "country"
                                    )
                                }
                                onChange={(e) =>
                                    handleEmergencyContactChange(
                                        index,
                                        "country",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter Country"
                            />

                        </div>

                        {/* ========================================= */}
                        {/* STATE */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                State
                            </label>

                            <input
                                type="text"
                                value={
                                    getValue(
                                        contact,
                                        "state"
                                    )
                                }
                                onChange={(e) =>
                                    handleEmergencyContactChange(
                                        index,
                                        "state",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter State"
                            />

                        </div>

                        {/* ========================================= */}
                        {/* CITY */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                City
                            </label>

                            <input
                                type="text"
                                value={
                                    getValue(
                                        contact,
                                        "city"
                                    )
                                }
                                onChange={(e) =>
                                    handleEmergencyContactChange(
                                        index,
                                        "city",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter City"
                            />

                        </div>

                        {/* ========================================= */}
                        {/* ZIP CODE */}
                        {/* ========================================= */}

                        {/* =====================================================
    ZIP CODE
===================================================== */}

                        <div className="form-group">

                            <label>
                                Zip Code
                            </label>

                            <input
                                type="text"
                                value={
                                    getValue(
                                        contact,
                                        "zipcode"
                                    )
                                }
                                onChange={(e) => {

                                    const value =
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 10);

                                    handleEmergencyContactChange(
                                        index,
                                        "zipcode",
                                        value
                                    );
                                }}
                                placeholder="Enter Zip Code"
                                maxLength={10}
                                inputMode="numeric"
                                autoComplete="postal-code"
                            />

                        </div>

                        {/* ========================================= */}
                        {/* SEPARATOR */}
                        {/* ========================================= */}

                        {index <
                            contacts.length - 1 && (

                                <hr
                                    style={{
                                        gridColumn:
                                            "span 3",
                                        margin:
                                            "20px 0",
                                    }}
                                />

                            )}

                    </React.Fragment>

                )
            )}

        </div>
</>
);
}

export default EmergencyContactSection;