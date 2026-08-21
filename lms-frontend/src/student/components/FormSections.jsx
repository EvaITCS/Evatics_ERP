import React, { useEffect, useState } from "react";
import "../styles/MyForm.css";
import {
  User,
  Phone,
  MapPin,
  Search,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// ==========================================
// STATIC OPTIONS FOR EAD TYPES
// ==========================================
const eadTypes = [
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

export default function FormSections({
  currentStep,
  formData,
  errors,
  handleChange,
  yearsArray,
  visaOptions,
  isVisaExpiryDisabled,
  nextStep,
  previousStep,
}) {
  // ==========================================
  // ADDRESS AUTOCOMPLETE STATES
  // ==========================================
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  // ==========================================
  // ZIPCODE AUTOCOMPLETE STATES
  // ==========================================
  const [zipSuggestions, setZipSuggestions] = useState([]);
  const [zipLoading, setZipLoading] = useState(false);

  // ==========================================
  // STREET ADDRESS SEARCH
  // ONLY UNITED STATES
  // ==========================================
  useEffect(() => {
    const text = formData.addressLine?.trim();

    // Do not search after user selects a suggestion
    if (isAddressSelected) {
      setAddressSuggestions([]);
      return;
    }

    if (!text || text.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setAddressLoading(true);

        const response = await fetch(
          `/api/locations/search?text=${encodeURIComponent(
            text
          )}&countryCode=us`
        );

        if (!response.ok) {
          throw new Error("Address search failed");
        }

        const data = await response.json();

        const usLocations = Array.isArray(data)
          ? data.filter((location) => {
              const countryCode = String(
                location.countryCode || ""
              ).toLowerCase();

              const country = String(
                location.country || ""
              ).toLowerCase();

              return (
                countryCode === "us" ||
                country === "united states" ||
                country === "united states of america"
              );
            })
          : [];

        setAddressSuggestions(usLocations);
      } catch (error) {
        console.error("Address search failed:", error);

        setAddressSuggestions([]);
      } finally {
        setAddressLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.addressLine, isAddressSelected]);

  // ==========================================
  // ZIPCODE SEARCH
  // ONLY UNITED STATES
  // ==========================================
  useEffect(() => {
    const zipcode = formData.zipcode?.trim();

    if (!zipcode || zipcode.length < 3) {
      setZipSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setZipLoading(true);

        const response = await fetch(
          `/api/locations/search?text=${encodeURIComponent(
            zipcode
          )}&countryCode=us`
        );

        if (!response.ok) {
          throw new Error("Zipcode search failed");
        }

        const data = await response.json();

        const usLocations = Array.isArray(data)
          ? data.filter((location) => {
              const countryCode = String(
                location.countryCode || ""
              ).toLowerCase();

              const country = String(
                location.country || ""
              ).toLowerCase();

              return (
                countryCode === "us" ||
                country === "united states" ||
                country === "united states of america"
              );
            })
          : [];

        setZipSuggestions(usLocations);
      } catch (error) {
        console.error("Zipcode search failed:", error);

        setZipSuggestions([]);
      } finally {
        setZipLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.zipcode]);

  // ==========================================
  // ADDRESS SUGGESTION CLICK
  // ==========================================
  const handleAddressSuggestionClick = (location) => {
    console.log("SELECTED STREET ADDRESS:", location);

    const selectedAddress =
      location.addressLine1 || location.formatted || "";

    const selectedZipcode =
      location.zipCode || location.zipcode || "";

    setIsAddressSelected(true);

    // Street Address
    handleChange({
      target: {
        name: "addressLine",
        value: selectedAddress,
      },
    });

    // ZIP Code
    if (selectedZipcode) {
      handleChange({
        target: {
          name: "zipcode",
          value: selectedZipcode,
        },
      });
    }

    // State
    if (location.state) {
      handleChange({
        target: {
          name: "state",
          value: location.state,
        },
      });
    }

    // City
    if (location.city) {
      handleChange({
        target: {
          name: "city",
          value: location.city,
        },
      });
    }

    // Country is always United States
    handleChange({
      target: {
        name: "country",
        value: "United States",
      },
    });

    setAddressSuggestions([]);
    setZipSuggestions([]);
  };

  // ==========================================
  // ZIPCODE SUGGESTION CLICK
  // ==========================================
  const handleZipSuggestionClick = (location) => {
    console.log("SELECTED ZIP LOCATION:", location);

    const selectedZipcode =
      location.zipCode || location.zipcode || "";

    // ZIP CODE
    handleChange({
      target: {
        name: "zipcode",
        value: selectedZipcode,
      },
    });

    // CITY
    if (location.city) {
      handleChange({
        target: {
          name: "city",
          value: location.city,
        },
      });
    }

    // STATE
    if (location.state) {
      handleChange({
        target: {
          name: "state",
          value: location.state,
        },
      });
    }

    // COUNTRY
    handleChange({
      target: {
        name: "country",
        value: "United States",
      },
    });

    // IMPORTANT:
    // DO NOT update addressLine here.
    // ZIP result is NOT a street address.
    // Street Address must remain separate.

    setZipSuggestions([]);
    setAddressSuggestions([]);
  };

  // ==========================================
  // VISA / EAD LOGIC
  // ==========================================
  const selectedVisaObj = visaOptions?.find(
    (v) =>
      String(v.visaId) === String(formData.visaType) ||
      v.visaName === formData.visaType
  );

  const isEadSelected =
    formData.visaType === "EAD" ||
    selectedVisaObj?.visaName === "EAD" ||
    String(formData.visaType || "")
      .toUpperCase()
      .includes("EAD");

  const showEadType = isEadSelected;

  const showOtherEadType =
    showEadType && formData.eadType === "Other";

  const showExpiryDate = isEadSelected;

  // ==========================================
  // STEP 0: PERSONAL INFORMATION
  // ==========================================
  if (currentStep === 0) {
    return (
      <div className="form-step-container">
        <div className="form-section-header">
          <div className="section-header-icon">
            <User size={20} />
          </div>

          <div>
            <h2 className="form-section-title">
              Personal Information
            </h2>

            <p className="form-section-subtitle">
              Candidate information and visa details
            </p>
          </div>
        </div>

        <div className="form-grid">
          {/* FIRST NAME */}
          <div className="field-box">
            <label>
              First Name <span className="required">*</span>
            </label>

            <input
              type="text"
              name="firstName"
              placeholder="e.g. John"
              value={formData.firstName || ""}
              onChange={handleChange}
              className={
                errors.firstName ? "invalid-field" : ""
              }
            />

            {errors.firstName && (
              <span className="error-text">
                {errors.firstName}
              </span>
            )}
          </div>

          {/* MIDDLE NAME */}
          <div className="field-box">
            <label>Middle Name</label>

            <input
              type="text"
              name="middleName"
              placeholder="Optional"
              value={formData.middleName || ""}
              onChange={handleChange}
            />
          </div>

          {/* LAST NAME */}
          <div className="field-box">
            <label>
              Last Name <span className="required">*</span>
            </label>

            <input
              type="text"
              name="lastName"
              placeholder="e.g. Doe"
              value={formData.lastName || ""}
              onChange={handleChange}
              className={
                errors.lastName ? "invalid-field" : ""
              }
            />

            {errors.lastName && (
              <span className="error-text">
                {errors.lastName}
              </span>
            )}
          </div>

          {/* EMAIL */}
          <div className="field-box">
            <label>
              Email Address <span className="required">*</span>
            </label>

            <input
              type="email"
              name="email"
              value={formData.email || ""}
              readOnly
              className="readonly-bg"
            />
          </div>

          {/* ALTERNATE EMAIL */}
          <div className="field-box">
            <label>Alternate Email</label>

            <input
              type="email"
              name="alternateEmail"
              placeholder="you@example.com"
              value={formData.alternateEmail || ""}
              onChange={handleChange}
              className={
                errors.alternateEmail ? "invalid-field" : ""
              }
            />

            {errors.alternateEmail && (
              <span className="error-text">
                {errors.alternateEmail}
              </span>
            )}
          </div>

          {/* PRIMARY PHONE */}
          <div className="field-box">
            <label>Primary Phone</label>

            <div className="phone-wrapper">
              <div className="static-country-code">
                <Phone size={14} />
                <span>
                  {formData.phoneCountryCode || "+1"}
                </span>
              </div>

              <input
                name="phone"
                placeholder="000-000-0000"
                value={formData.phone || ""}
                readOnly
                className={`readonly-bg ${
                  errors.phone ? "invalid-field" : ""
                }`}
              />
            </div>

            {errors.phone && (
              <span className="error-text">
                {errors.phone}
              </span>
            )}
          </div>

          {/* ALTERNATE PHONE */}
          <div className="field-box">
            <label>Alternate Phone</label>

            <div className="phone-wrapper">
              <select
                name="alternateCountryCode"
                value={
                  formData.alternateCountryCode || "+1"
                }
                onChange={handleChange}
              >
                <option value="+1">+1</option>
              </select>

              <input
                type="text"
                name="alternatePhone"
                placeholder="000-000-0000"
                value={formData.alternatePhone || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* VISA TYPE */}
          <div className="field-box">
            <label>
              Visa Type <span className="required">*</span>
            </label>

            <div className="select-icon-wrapper">
              <select
                name="visaType"
                value={formData.visaType || ""}
                onChange={handleChange}
                className={
                  errors.visaType ? "invalid-field" : ""
                }
              >
                <option value="">Select Visa</option>

                {visaOptions?.map((visa) => (
                  <option
                    key={visa.visaId}
                    value={String(visa.visaId)}
                  >
                    {visa.visaName}
                  </option>
                ))}
              </select>
            </div>

            {errors.visaType && (
              <span className="error-text">
                {errors.visaType}
              </span>
            )}
          </div>

          {/* EAD TYPE */}
          {showEadType && (
            <div className="field-box">
              <label>
                Type of EAD{" "}
                <span className="required">*</span>
              </label>

              <select
                name="eadType"
                value={formData.eadType || ""}
                onChange={handleChange}
                className={
                  errors.eadType ? "invalid-field" : ""
                }
              >
                <option value="">
                  Select Type of EAD
                </option>

                {eadTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {errors.eadType && (
                <span className="error-text">
                  {errors.eadType}
                </span>
              )}
            </div>
          )}

          {/* OTHER EAD TYPE */}
          {showOtherEadType && (
            <div className="field-box">
              <label>
                Specify EAD Type{" "}
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="otherEadType"
                placeholder="Enter custom EAD type"
                value={formData.otherEadType || ""}
                onChange={handleChange}
                className={
                  errors.otherEadType ? "invalid-field" : ""
                }
              />

              {errors.otherEadType && (
                <span className="error-text">
                  {errors.otherEadType}
                </span>
              )}
            </div>
          )}

          {/* VISA EXPIRY */}
          {showExpiryDate && (
            <div className="field-box">
              <label>
                Visa Expiry{" "}
                <span className="required">*</span>
              </label>

              <input
                type="date"
                name="visaExpiryDate"
                value={formData.visaExpiryDate || ""}
                onChange={handleChange}
                disabled={isVisaExpiryDisabled}
                className={
                  errors.visaExpiryDate
                    ? "invalid-field"
                    : isVisaExpiryDisabled
                    ? "readonly-field"
                    : ""
                }
              />

              {errors.visaExpiryDate && (
                <span className="error-text">
                  {errors.visaExpiryDate}
                </span>
              )}
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="step-navigation">
          <button
            type="button"
            className="next-btn1"
            onClick={nextStep}
          >
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 1: ADDRESS DETAILS
  // ==========================================
  if (currentStep === 1) {
    return (
      <div className="form-step-container">
        <div className="form-section-header">
          <div className="section-header-icon">
            <MapPin size={20} />
          </div>

          <div>
            <h2 className="form-section-title">
              Current Address
            </h2>

            <p className="form-section-subtitle">
              Your current address and location details
            </p>
          </div>
        </div>

        <div className="form-grid">
          {/* =====================================
              1. HOUSE / BUILDING NUMBER
          ====================================== */}
          <div className="field-box">
            <label>
              House / Building No.{" "}
              <span className="required">*</span>
            </label>

            <input
              type="text"
              name="houseNumber"
              placeholder="e.g. 123"
              value={formData.houseNumber || ""}
              onChange={handleChange}
              autoComplete="address-line1"
              className={
                errors.houseNumber ? "invalid-field" : ""
              }
            />

            {errors.houseNumber && (
              <span className="error-text">
                {errors.houseNumber}
              </span>
            )}
          </div>

          {/* =====================================
              2. STREET ADDRESS
          ====================================== */}
          <div className="field-box address-field">
            <label>
              Street Address{" "}
              <span className="required">*</span>
            </label>

            <div className="address-autocomplete-wrapper">
              <div className="input-with-icon">
                <Search
                  size={16}
                  className="search-icon"
                />

                <input
                  type="text"
                  name="addressLine"
                  value={formData.addressLine || ""}
                  onChange={(e) => {
                    setIsAddressSelected(false);
                    handleChange(e);
                  }}
                  autoComplete="off"
                  placeholder="Start typing your street address..."
                  className={
                    errors.addressLine ? "invalid-field" : ""
                  }
                />
              </div>

              {/* ADDRESS LOADING */}
              {addressLoading && (
                <div className="address-loading">
                  <Loader2
                    size={14}
                    className="btn-spin"
                  />

                  <span>Searching address...</span>
                </div>
              )}

              {/* ADDRESS SUGGESTIONS */}
              {!addressLoading &&
                addressSuggestions.length > 0 && (
                  <div className="address-suggestions">
                    {addressSuggestions.map(
                      (location, index) => (
                        <div
                          key={`address-${index}-${location.formatted}`}
                          className="address-suggestion"
                          onClick={() =>
                            handleAddressSuggestionClick(
                              location
                            )
                          }
                        >
                          <MapPin
                            size={14}
                            className="suggestion-icon"
                          />

                          <div>
                            {/* FULL ADDRESS */}
                            <div className="suggestion-main">
                              {location.formatted ||
                                location.addressLine1 ||
                                "Address"}
                            </div>

                            {/* LOCATION DETAILS */}
                            {location.formatted && (
                              <div className="suggestion-sub">
                                {location.city || ""}
                                {location.city &&
                                location.state
                                  ? ", "
                                  : ""}
                                {location.state || ""}
                                {location.zipCode
                                  ? ` ${location.zipCode}`
                                  : ""}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>

            {errors.addressLine && (
              <span className="error-text">
                {errors.addressLine}
              </span>
            )}
          </div>

          {/* =====================================
              3. ZIP CODE
          ====================================== */}
          <div className="field-box">
            <label>
              Zip Code <span className="required">*</span>
            </label>

            <div className="address-autocomplete-wrapper">
              <div className="input-with-icon">
                <Search
                  size={16}
                  className="search-icon"
                />

                <input
                  type="text"
                  name="zipcode"
                  placeholder="e.g. 10001"
                  value={formData.zipcode || ""}
                  onChange={handleChange}
                  autoComplete="off"
                  className={
                    errors.zipcode ? "invalid-field" : ""
                  }
                />
              </div>

              {/* ZIP LOADING */}
              {zipLoading && (
                <div className="address-loading">
                  <Loader2
                    size={14}
                    className="btn-spin"
                  />

                  <span>Searching ZIP code...</span>
                </div>
              )}

              {/* ZIP SUGGESTIONS */}
              {!zipLoading && zipSuggestions.length > 0 && (
                <div className="address-suggestions">
                  {zipSuggestions.map((location, index) => (
                    <div
                      key={`zip-${index}-${location.formatted}`}
                      className="address-suggestion"
                      onClick={() =>
                        handleZipSuggestionClick(location)
                      }
                    >
                      <MapPin
                        size={14}
                        className="suggestion-icon"
                      />

                      <div>
                        <div className="suggestion-main">
                          {location.zipCode ||
                            location.zipcode ||
                            "ZIP Code"}
                        </div>

                        <div className="suggestion-sub">
                          {location.city || ""}
                          {location.city && location.state
                            ? ", "
                            : ""}
                          {location.state || ""}
                          {location.zipCode
                            ? ` ${location.zipCode}`
                            : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.zipcode && (
              <span className="error-text">
                {errors.zipcode}
              </span>
            )}
          </div>

          {/* =====================================
              4. CITY
          ====================================== */}
          <div className="field-box">
            <label>
              City <span className="required">*</span>
            </label>

            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              placeholder="Enter city"
              className={errors.city ? "invalid-field" : ""}
            />

            {errors.city && (
              <span className="error-text">
                {errors.city}
              </span>
            )}
          </div>

          {/* =====================================
              5. STATE
          ====================================== */}
          <div className="field-box">
            <label>
              State <span className="required">*</span>
            </label>

            <input
              type="text"
              name="state"
              value={formData.state || ""}
              onChange={handleChange}
              placeholder="Enter state"
              className={
                errors.state ? "invalid-field" : ""
              }
            />

            {errors.state && (
              <span className="error-text">
                {errors.state}
              </span>
            )}
          </div>

          {/* =====================================
              6. COUNTRY
          ====================================== */}
          <div className="field-box">
            <label>
              Country <span className="required">*</span>
            </label>

            <input
              type="text"
              name="country"
              value={formData.country || "United States"}
              readOnly
              className={`readonly-field ${
                errors.country ? "invalid-field" : ""
              }`}
            />

            {errors.country && (
              <span className="error-text">
                {errors.country}
              </span>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="step-navigation">
          <button
            type="button"
            className="back-btn1"
            onClick={previousStep}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <button
            type="button"
            className="next-btn1"
            onClick={nextStep}
          >
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}