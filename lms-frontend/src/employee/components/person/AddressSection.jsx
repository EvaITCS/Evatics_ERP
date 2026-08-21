import React, { useState } from "react";
import api from "../../../api/axios";

function AddressSection({
                            formData,
                            handleAddressChange,
                            handleSameAsPermanent,
                            starStyle,
                            isUpdate = false,
                        }) {
    // =====================================================
    // ADDRESSES
    // =====================================================

    const permanentAddress =
        formData?.addresses?.[0] || {};

    const currentAddress =
        formData?.addresses?.[1] || {};

    // =====================================================
    // SEARCH STATE
    // =====================================================

    const [searchingIndex, setSearchingIndex] =
        useState(null);

    const [searchText, setSearchText] =
        useState({
            0: "",
            1: "",
        });

    const [searchResults, setSearchResults] =
        useState({
            0: [],
            1: [],
        });

    // =====================================================
    // SAFE VALUE
    // =====================================================

    const getValue = (address, field) => {
        return address?.[field] ?? "";
    };

    // =====================================================
    // SEARCH LOCATION
    // =====================================================

    const handleLocationSearch = async (index) => {
        const text =
            searchText[index]?.trim() || "";

        if (!text) {
            alert(
                "Please enter an address to search."
            );
            return;
        }

        if (text.length < 3) {
            alert(
                "Please enter at least 3 characters."
            );
            return;
        }

        try {
            setSearchingIndex(index);

            const response = await api.get(
                "/api/locations/search",
                {
                    params: {
                        text,
                    },
                }
            );

            console.log(
                "Geoapify location search response:",
                response.data
            );

            const results =
                Array.isArray(response.data)
                    ? response.data
                    : [];

            if (results.length === 0) {
                setSearchResults((prev) => ({
                    ...prev,
                    [index]: [],
                }));

                alert(
                    "No address found."
                );

                return;
            }

            setSearchResults((prev) => ({
                ...prev,
                [index]: results,
            }));
        } catch (error) {
            console.error(
                "Location search failed:",
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
            setSearchingIndex(null);
        }
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

        setSearchResults((prev) => ({
            ...prev,
            [index]: [],
        }));
    };

    // =====================================================
    // SELECT LOCATION
    // =====================================================

    const handleLocationSelect = (
        index,
        location
    ) => {
        console.log(
            "Selected Geoapify location:",
            location
        );

        // =================================================
        // ADDRESS LINE 1
        // =================================================

        handleAddressChange(
            index,
            "addressLine1",
            location?.addressLine1 || ""
        );

        // =================================================
        // COUNTRY
        // =================================================

        handleAddressChange(
            index,
            "country",
            location?.country || ""
        );

        // =================================================
        // STATE
        // =================================================

        handleAddressChange(
            index,
            "state",
            location?.state || ""
        );

        // =================================================
        // CITY
        // =================================================

        handleAddressChange(
            index,
            "city",
            location?.city || ""
        );

        // =================================================
        // ZIPCODE
        //
        // IMPORTANT:
        // Form uses `zipcode`
        // =================================================

        handleAddressChange(
            index,
            "zipcode",
            location?.zipcode ??
            location?.zipCode ??
            ""
        );

        // =================================================
        // FORMATTED ADDRESS
        // =================================================

        handleAddressChange(
            index,
            "formattedAddress",
            location?.formatted || ""
        );

        // =================================================
        // LATITUDE
        // =================================================

        if (
            location?.latitude !== undefined &&
            location?.latitude !== null
        ) {
            handleAddressChange(
                index,
                "latitude",
                location.latitude
            );
        }

        // =================================================
        // LONGITUDE
        // =================================================

        if (
            location?.longitude !== undefined &&
            location?.longitude !== null
        ) {
            handleAddressChange(
                index,
                "longitude",
                location.longitude
            );
        }

        // =================================================
        // SEARCH BOX
        // =================================================

        setSearchText((prev) => ({
            ...prev,
            [index]:
                location?.formatted ||
                location?.addressLine1 ||
                "",
        }));

        // =================================================
        // CLOSE RESULTS
        // =================================================

        setSearchResults((prev) => ({
            ...prev,
            [index]: [],
        }));
    };

    // =====================================================
    // RENDER SEARCH RESULTS
    // =====================================================

    const renderSearchResults = (index) => {
        const results =
            searchResults[index] || [];

        if (results.length === 0) {
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
                    (location, resultIndex) => (
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
                            {/* MAIN ADDRESS */}

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

                            {/* LOCATION DETAILS */}

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

                            {/* FORMATTED ADDRESS */}

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
        index,
        disabled
    ) => {
        return (
            <div
                className="form-group"
                style={{
                    gridColumn: "span 3",
                    position: "relative",
                }}
            >
                <label>
                    Search Address
                </label>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                    }}
                >
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
                            disabled ||
                            searchingIndex ===
                            index
                        }
                        placeholder="Enter address, city, state or zip code"
                        autoComplete="off"
                    />

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            handleLocationSearch(
                                index
                            )
                        }
                        disabled={
                            disabled ||
                            searchingIndex ===
                            index
                        }
                    >
                        {searchingIndex ===
                        index
                            ? "Searching..."
                            : "Search Address"}
                    </button>
                </div>

                {renderSearchResults(index)}
            </div>
        );
    };

    // =====================================================
    // RENDER ADDRESS FIELDS
    // =====================================================

    const renderAddressFields = (
        address,
        index,
        disabled = false
    ) => {
        return (
            <>
                {/* ========================================= */}
                {/* SEARCH */}
                {/* ========================================= */}

                {renderAddressSearch(
                    index,
                    disabled
                )}

                {/* ========================================= */}
                {/* ADDRESS LINE 1 */}
                {/* ========================================= */}

                <div className="form-group">
                    <label>
                        Address Line 1{" "}
                        <span
                            style={starStyle}
                        >
                            *
                        </span>
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            address,
                            "addressLine1"
                        )}
                        onChange={(e) =>
                            handleAddressChange(
                                index,
                                "addressLine1",
                                e.target.value
                            )
                        }
                        disabled={disabled}
                        placeholder="Address Line 1"
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
                        value={getValue(
                            address,
                            "addressLine2"
                        )}
                        onChange={(e) =>
                            handleAddressChange(
                                index,
                                "addressLine2",
                                e.target.value
                            )
                        }
                        disabled={disabled}
                        placeholder="Address Line 2"
                    />
                </div>

                {/* ========================================= */}
                {/* COUNTRY */}
                {/* ========================================= */}

                <div className="form-group">
                    <label>
                        Country{" "}
                        <span
                            style={starStyle}
                        >
                            *
                        </span>
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            address,
                            "country"
                        )}
                        onChange={(e) =>
                            handleAddressChange(
                                index,
                                "country",
                                e.target.value
                            )
                        }
                        disabled={disabled}
                        placeholder="Country"
                    />
                </div>

                {/* ========================================= */}
                {/* STATE */}
                {/* ========================================= */}

                <div className="form-group">
                    <label>
                        State{" "}
                        <span
                            style={starStyle}
                        >
                            *
                        </span>
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            address,
                            "state"
                        )}
                        onChange={(e) =>
                            handleAddressChange(
                                index,
                                "state",
                                e.target.value
                            )
                        }
                        disabled={disabled}
                        placeholder="State"
                    />
                </div>

                {/* ========================================= */}
                {/* CITY */}
                {/* ========================================= */}

                <div className="form-group">
                    <label>
                        City{" "}
                        <span
                            style={starStyle}
                        >
                            *
                        </span>
                    </label>

                    <input
                        type="text"
                        value={getValue(
                            address,
                            "city"
                        )}
                        onChange={(e) =>
                            handleAddressChange(
                                index,
                                "city",
                                e.target.value
                            )
                        }
                        disabled={disabled}
                        placeholder="City"
                    />
                </div>

                {/* ========================================= */}
                {/* ZIP CODE */}
                {/* ========================================= */}

                <div className="form-group">
                    <label>
                        Zip Code{" "}
                        <span
                            style={starStyle}
                        >
                            *
                        </span>
                    </label>

                    <input
                        type="text"
                        maxLength={20}
                        value={getValue(
                            address,
                            "zipcode"
                        )}
                        onChange={(e) =>
                            handleAddressChange(
                                index,
                                "zipcode",
                                e.target.value
                            )
                        }
                        disabled={disabled}
                        placeholder="Zip Code"
                    />
                </div>

                {/* ========================================= */}
                {/* VERIFIED ADDRESS */}
                {/* ========================================= */}

                {address?.formattedAddress && (
                    <div
                        className="form-group"
                        style={{
                            gridColumn:
                                "span 3",
                        }}
                    >
                        <label>
                            Verified Address
                        </label>

                        <input
                            type="text"
                            value={
                                address.formattedAddress
                            }
                            readOnly
                        />
                    </div>
                )}
            </>
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <h3 className="form-section-title">
                Address Information
            </h3>

            <div className="form-grid">

            {/* ================================================= */}
            {/* PERMANENT ADDRESS */}
            {/* ================================================= */}

            <h4
                style={{
                    gridColumn: "span 3",
                }}
            >
                Permanent Address
            </h4>

            {renderAddressFields(
                permanentAddress,
                0,
                false
            )}

            <hr
                style={{
                    gridColumn: "span 3",
                    margin: "20px 0",
                }}
            />

            {/* ================================================= */}
            {/* CURRENT ADDRESS HEADER */}
            {/* ================================================= */}

            <div
                style={{
                    gridColumn: "span 3",
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                }}
            >
                <h4>
                    Current Address
                </h4>

                <label
                    style={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: "8px",
                        cursor: "pointer",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={
                            formData?.sameAsPermanent ===
                            true
                        }
                        onChange={
                            handleSameAsPermanent
                        }
                    />

                    Same As Permanent Address
                </label>
            </div>

            {/* ================================================= */}
            {/* CURRENT ADDRESS */}
            {/* ================================================= */}

            {renderAddressFields(
                currentAddress,
                1,
                formData?.sameAsPermanent ===
                true
            )}
            </div>
        </>
    );
}

export default AddressSection;