import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../styles/StudentForm.css";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "../../shared/components/ToastContext";
// Static Options for Visa
const visaOptions = [
  { visaId: "US_CITIZEN", visaName: "US Citizen" },
  { visaId: "GREEN_CARD", visaName: "Green Card" },
  { visaId: "EAD", visaName: "EAD" },
];

// Static Options for EAD Types
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

// Static Options for Education
const educationOptions = [
  "High School",
  "Diploma",
  "Associate",
  "Bachelor",
  "Master",
  "PhD",
];

export default function CounselorStudentApplicationForm() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const currentYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 30 }, (_, i) =>
    String(currentYear - i)
  );

  const initialFormState = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "+1",
    phone: "",
    country: "United States",
    state: "",
    visaType: "",
    eadType: "",
    otherEadType: "",
    visaExpiryDate: "",
    city: "",
    zipcode: "",
    qualification: "",
    instituteName: "",
    fieldOfStudy: "",
    passingYear: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    visaType: "",
    eadType: "",
    otherEadType: "",
    visaExpiryDate: "",
    state: "",
    city: "",
    zipcode: "",
    qualification: "",
    passingYear: "",
  });

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [registrationResponse, setRegistrationResponse] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);



  useEffect(() => {
    if (!candidateId) return;
    loadLead();
  }, [candidateId]);

  const loadLead = async () => {
    try {
      const res = await api.get(`/api/leads/${candidateId}`);
      const lead = res.data;

      const rawPhone = lead.phone || "";
      const cleanPhone = rawPhone
        .replace(/^(\+1|\+91|\+44|\+)/, "")
        .replace(/\D/g, "")
        .slice(-10);

      setFormData((prev) => ({
        ...prev,
        firstName: lead.firstName || "",
        middleName: lead.middleName || "",
        lastName: lead.lastName || "",
        email: lead.email || "",
        phoneCountryCode: "+1",
        phone: cleanPhone,
      }));
    } catch (error) {
      console.error("Lead Load Error", error);
    }
  };

  const fetchLocationByZipcode = async (zipcode) => {
    if (!zipcode || zipcode.length !== 5) {
      setFormData((prev) => ({
        ...prev,
        state: "",
        city: "",
      }));
      return;
    }

    try {
      const response = await api.get(
        `/api/locations/search?text=${encodeURIComponent(
          zipcode
        )}&countryCode=us`
      );

      const locations = Array.isArray(response.data) ? response.data : [];

      const usLocations = locations.filter(
        (location) => location.countryCode?.toLowerCase() === "us"
      );

      const location = usLocations.find(
        (item) =>
          item.state &&
          item.state.trim() !== "" &&
          item.city &&
          item.city.trim() !== ""
      );

      if (location) {
        setFormData((prev) => ({
          ...prev,
          country: "United States",
          state: location.state,
          city: location.city,
          zipcode: location.zipcode || zipcode,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          country: "United States",
          state: "",
          city: "",
          zipcode,
        }));
      }
    } catch (error) {
      console.error("US zipcode location lookup failed:", error);
      setFormData((prev) => ({
        ...prev,
        country: "United States",
        state: "",
        city: "",
        zipcode,
      }));
    }
  };

  const formatPhoneNumber = (value) => {
    const cleanStr = value.replace(/\D/g, "");
    if (cleanStr.length <= 3) return cleanStr;
    if (cleanStr.length <= 6)
      return `${cleanStr.slice(0, 3)}-${cleanStr.slice(3)}`;
    return `${cleanStr.slice(0, 3)}-${cleanStr.slice(3, 6)}-${cleanStr.slice(6, 10)}`;
  };

  const showEadType = formData.visaType === "EAD";
  const showOtherEadType = showEadType && formData.eadType === "Other";
  const showExpiryDate = formData.visaType === "EAD";

  const validateField = (name, value) => {
    let errorMsg = "";

    if (!value || (typeof value === "string" && value.trim() === "")) {
      if (name === "visaExpiryDate" && !showExpiryDate) {
        errorMsg = "";
      } else if (name === "eadType" && !showEadType) {
        errorMsg = "";
      } else if (name === "otherEadType" && !showOtherEadType) {
        errorMsg = "";
      } else if (
        [
          "visaType",
          "eadType",
          "state",
          "city",
          "qualification",
          "passingYear",
        ].includes(name)
      ) {
        errorMsg = `Please select ${name.replace(/([A-Z])/g, " $1").toLowerCase()}`;
      } else {
        errorMsg = `Please enter ${name.replace(/([A-Z])/g, " $1").toLowerCase()}`;
      }
    } else {
      if (name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMsg = "Invalid email structure entered";
        }
      }
      if (name === "phone") {
        if (value.replace(/\D/g, "").length !== 10) {
          errorMsg = "Please enter a valid 10-digit number";
        }
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (["firstName", "middleName", "lastName", "city", "state"].includes(name)) {
      const capitalizedValue = capitalizeFirstLetter(value);
      setFormData((prev) => ({ ...prev, [name]: capitalizedValue }));
      return;
    }

    if (name === "zipcode") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 5) return;

      setFormData((prev) => ({
        ...prev,
        zipcode: numericValue,
        ...(numericValue.length < 5
          ? {
              state: "",
              city: "",
            }
          : {}),
      }));

      if (numericValue.length === 5) {
        fetchLocationByZipcode(numericValue);
      }
      return;
    }

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 10) return;
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    if (name === "visaType") {
      const isEad = value === "EAD";
      setFormData((prev) => ({
        ...prev,
        visaType: value,
        eadType: isEad ? prev.eadType : "",
        otherEadType: isEad ? prev.otherEadType : "",
        visaExpiryDate: isEad ? prev.visaExpiryDate : "",
      }));

      setErrors((prev) => ({
        ...prev,
        visaType: "",
        eadType: "",
        otherEadType: "",
        visaExpiryDate: "",
      }));
      return;
    }

    if (name === "eadType") {
      setFormData((prev) => ({
        ...prev,
        eadType: value,
        otherEadType: value === "Other" ? prev.otherEadType : "",
      }));

      setErrors((prev) => ({
        ...prev,
        eadType: "",
        otherEadType: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    let firstErrorField = null;

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "visaType",
      "state",
      "city",
      "zipcode",
      "qualification",
      "passingYear",
    ];

    if (showEadType) requiredFields.push("eadType");
    if (showOtherEadType) requiredFields.push("otherEadType");
    if (showExpiryDate) requiredFields.push("visaExpiryDate");

    requiredFields.forEach((field) => {
      const msg = validateField(field, formData[field]);
      if (msg) {
        isValid = false;
        if (!firstErrorField) firstErrorField = field;
      }
    });

    if (!isValid && firstErrorField) {
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "eadType" && formData.eadType === "Other") {
          data.append("eadType", formData.otherEadType);
        } else if (key !== "otherEadType") {
          data.append(key, formData[key]);
        }
      });

      data.append("candidateId", candidateId || "");

      const response = await api.post("/student/application", data);

      setRegistrationResponse(response.data);
      setShowEmailModal(true);
      setErrors({});
   } catch (error) {
  console.error("Submit Error:", error);
  showToast("Failed to register student.", "error");
}
  };

  const handleSendInvitationEmail = async () => {
    try {
      setSendingEmail(true);

      await api.post("/student/send-invitation-email", {
        personId: registrationResponse?.personId,
        username: registrationResponse?.username,
        temporaryPassword: registrationResponse?.temporaryPassword,
      });

      showToast("Invitation email sent successfully!", "success");

      setShowEmailModal(false);
      setFormData(initialFormState);
      setErrors({});

      setTimeout(() => {
        const role = localStorage.getItem("role");
        if (role === "COUNSELLOR") {
          navigate("/COUNSELLOR/my-students");
        } else {
          navigate("/admin/students");
        }
      }, 4000);
    } catch (error) {
      console.error("Invitation Email Error:", error);
    showToast("Failed to send invitation email.", "error");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="counselor-details-page registration-page">
  
      <div className="registration-form-wrapper">
        <form onSubmit={handleSubmit} noValidate className="registration-form">
          <div className="form-card-header">
            <h2>Candidate Registration</h2>
            <button
              type="button"
              className="back-btn"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          </div>

          <div className="registration-grid">
            <div className="registration-field">
              <label htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.firstName ? "invalid-field" : ""}
              />
              {errors.firstName && (
                <span className="error-msg-block">{errors.firstName}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="middleName">Middle Name</label>
              <input
                id="middleName"
                name="middleName"
                placeholder="Middle Name"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>

            <div className="registration-field">
              <label htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.lastName ? "invalid-field" : ""}
              />
              {errors.lastName && (
                <span className="error-msg-block">{errors.lastName}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="phone">
                Phone <span className="required">*</span>
              </label>
              <div
                className={`phone-wrapper ${
                  errors.phone ? "invalid-field-wrapper" : ""
                }`}
              >
                <div className="static-country-code">+1 USA</div>
                <input
                  id="phone"
                  name="phone"
                  placeholder="312-456-7890 *"
                  value={formatPhoneNumber(formData.phone)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.phone ? "invalid-field" : ""}
                />
              </div>
              {errors.phone && (
                <span className="error-msg-block">{errors.phone}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email ? "invalid-field" : ""}
              />
              {errors.email && (
                <span className="error-msg-block">{errors.email}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="visaType">
                Visa Type <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="visaType"
                  name="visaType"
                  value={formData.visaType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.visaType ? "invalid-field" : ""}
                >
                  <option value="">Select Visa Type</option>
                  {visaOptions.map((visa) => (
                    <option key={visa.visaId} value={visa.visaId}>
                      {visa.visaName}
                    </option>
                  ))}
                </select>
              </div>
              {errors.visaType && (
                <span className="error-msg-block">{errors.visaType}</span>
              )}
            </div>

            {showEadType && (
              <div className="registration-field">
                <label htmlFor="eadType">
                  Type of EAD <span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="eadType"
                    name="eadType"
                    value={formData.eadType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.eadType ? "invalid-field" : ""}
                  >
                    <option value="">Select Type of EAD</option>
                    {eadTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.eadType && (
                  <span className="error-msg-block">{errors.eadType}</span>
                )}
              </div>
            )}

            {showOtherEadType && (
              <div className="registration-field">
                <label htmlFor="otherEadType">
                  Specify EAD Type <span className="required">*</span>
                </label>
                <input
                  id="otherEadType"
                  name="otherEadType"
                  placeholder="Enter custom EAD type"
                  value={formData.otherEadType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.otherEadType ? "invalid-field" : ""}
                />
                {errors.otherEadType && (
                  <span className="error-msg-block">
                    {errors.otherEadType}
                  </span>
                )}
              </div>
            )}

            {showExpiryDate && (
              <div className="registration-field">
                <label htmlFor="visaExpiryDate">
                  Expiry Date <span className="required">*</span>
                </label>
                <input
                  id="visaExpiryDate"
                  type="date"
                  name="visaExpiryDate"
                  value={formData.visaExpiryDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.visaExpiryDate ? "invalid-field" : ""}
                />
                {errors.visaExpiryDate && (
                  <span className="error-msg-block">
                    {errors.visaExpiryDate}
                  </span>
                )}
              </div>
            )}

            <div className="registration-field">
              <label htmlFor="zipcode">
                Zipcode <span className="required">*</span>
              </label>
              <input
                id="zipcode"
                name="zipcode"
                placeholder="Enter Zipcode *"
                value={formData.zipcode}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.zipcode ? "invalid-field" : ""}
              />
              {errors.zipcode && (
                <span className="error-msg-block">{errors.zipcode}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                value={formData.country}
                disabled
                className="readonly-field"
              />
            </div>

            <div className="registration-field">
              <label htmlFor="state">
                State <span className="required">*</span>
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="State *"
                className={errors.state ? "invalid-field" : ""}
              />
              {errors.state && (
                <span className="error-msg-block">{errors.state}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="City *"
                className={errors.city ? "invalid-field" : ""}
              />
              {errors.city && (
                <span className="error-msg-block">{errors.city}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="qualification">
                Education Level <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.qualification ? "invalid-field" : ""}
                >
                  <option value="">Select Qualification</option>
                  {educationOptions.map((qualification) => (
                    <option key={qualification} value={qualification}>
                      {qualification}
                    </option>
                  ))}
                </select>
              </div>
              {errors.qualification && (
                <span className="error-msg-block">{errors.qualification}</span>
              )}
            </div>

            <div className="registration-field">
              <label htmlFor="passingYear">
                Passing Year <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="passingYear"
                  name="passingYear"
                  value={formData.passingYear}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.passingYear ? "invalid-field" : ""}
                >
                  <option value="">Select Year</option>
                  {yearsArray.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              {errors.passingYear && (
                <span className="error-msg-block">{errors.passingYear}</span>
              )}
            </div>
          </div>

          <div className="registration-actions">
            <button type="submit" className="registration-submit-btn">
              Register Candidate
            </button>
          </div>
        </form>
      </div>

      {showEmailModal && (
        <div className="email-modal-overlay">
          <div className="email-modal">
            <div className="success-icon">
              <CheckCircle2 size={28} />
            </div>

            <h2>Student Account Created Successfully</h2>

            <p>The student account has been created successfully.</p>

            <div className="invitation-status-box">
              <h4>Invitation Email Status</h4>
              <span className="pending-status">Not Sent Yet</span>
              <p>
                You can send the invitation email now or close this dialog and
                send it later from the Student Details page.
              </p>
            </div>

            <div className="email-modal-buttons">
              <button
                type="button"
                className="close-btn"
                onClick={() => {
                  setShowEmailModal(false);
                  const role = localStorage.getItem("role");

                  if (role === "COUNSELLOR") {
                    navigate("/COUNSELLOR/my-students");
                  } else {
                    navigate("/admin/my-students");
                  }
                }}
              >
                Close
              </button>

              <button
                type="button"
                className="send-btn"
                disabled={sendingEmail}
                onClick={handleSendInvitationEmail}
              >
                {sendingEmail ? (
                  <>
                    <Loader2 size={16} className="btn-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation Email"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}