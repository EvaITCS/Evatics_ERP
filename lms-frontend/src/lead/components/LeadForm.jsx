import { useEffect, useState } from "react";

import "../../shared/styles/sidebar.css";
import { getAllLeadSources } from "../services/leadSourceService";

function LeadForm({
                      onSubmit,
                      loading,
                      isAdmin = false,
                      counsellors = [],
                      selectedCounsellor = "",
                      setSelectedCounsellor
                  }) {

    // =====================================
    // FORM STATE
    // =====================================

    const [form, setForm] = useState({

        firstName: "",
        middleName: "",
        lastName: "",

        countryCode: "+1",
        phone: "",

        email: "",

        visaType: "",

        leadSourceId: "",

        customLeadSource: "",

        computerExperience: false,

        leadPriority: "WARM"
    });


    // =====================================
    // LEAD SOURCE STATE
    // =====================================

    const [leadSourceOptions, setLeadSourceOptions] =
        useState([]);

    const [showOtherLeadSource, setShowOtherLeadSource] =
        useState(false);

    const [otherLeadSource, setOtherLeadSource] =
        useState("");


    // =====================================
    // LOAD LEAD SOURCES
    // =====================================

    useEffect(() => {

        fetchLeadSources();

    }, []);


    // =====================================
    // FETCH LEAD SOURCES
    // =====================================

    const fetchLeadSources = async () => {

        try {

            const data = await getAllLeadSources();

            if (!Array.isArray(data)) {
                setLeadSourceOptions([]);
                return;
            }

            // Convert database data into options
            const options = data.map((source) => ({
                value: source.sourceId,
                label: source.sourceName
            }));

            // Separate "Other" from remaining sources
            const otherOption = options.find(
                (option) =>
                    option.label?.trim().toLowerCase() === "other"
            );

            const otherSources = options.filter(
                (option) =>
                    option.label?.trim().toLowerCase() !== "other"
            );

            // Sort remaining sources alphabetically
            otherSources.sort((a, b) =>
                a.label.localeCompare(b.label)
            );

            // Always put "Other" at the end
            const sortedOptions = otherOption
                ? [...otherSources, otherOption]
                : otherSources;

            setLeadSourceOptions(sortedOptions);

        } catch (error) {

            console.error(
                "Failed to load lead sources:",
                error
            );

            setLeadSourceOptions([]);

        }
    };


    // =====================================
    // TITLE CASE
    // =====================================

    const toTitleCase = (value) => {

        if (!value) {
            return "";
        }

        return value
            .toLowerCase()
            .replace(
                /\b\w/g,
                (char) => char.toUpperCase()
            );
    };


    // =====================================
    // HANDLE CHANGE
    // =====================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        let finalValue =
            type === "checkbox"
                ? checked
                : value;


        // =====================================
        // NAME FORMATTING
        // =====================================

        if (
            name === "firstName" ||
            name === "middleName" ||
            name === "lastName"
        ) {

            finalValue =
                toTitleCase(finalValue);

        }


        setForm((prev) => ({

            ...prev,

            [name]: finalValue

        }));

    };


    // =====================================
    // PHONE
    // =====================================

    const handlePhoneChange = (e) => {

        const onlyNumbers =
            e.target.value.replace(
                /\D/g,
                ""
            );


        if (onlyNumbers.length > 10) {
            return;
        }


        let formatted =
            onlyNumbers;


        if (
            onlyNumbers.length > 3 &&
            onlyNumbers.length <= 6
        ) {

            formatted =
                `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3)}`;

        } else if (
            onlyNumbers.length > 6
        ) {

            formatted =
                `${onlyNumbers.slice(0, 3)}-${onlyNumbers.slice(3, 6)}-${onlyNumbers.slice(6, 10)}`;

        }


        setForm((prev) => ({

            ...prev,

            phone: formatted

        }));

    };


    // =====================================
    // LEAD SOURCE
    // =====================================

    const handleLeadSourceChange = (e) => {

        const value =
            e.target.value;

        const numericValue =
            value
                ? Number(value)
                : "";


        const selected =
            leadSourceOptions.find(
                (option) =>
                    option.value === numericValue
            );


        setForm((prev) => ({

            ...prev,

            leadSourceId: numericValue

        }));


        // =====================================
        // OTHER
        // =====================================

        if (
            selected &&
            selected.label
                .toLowerCase() === "other"
        ) {

            setShowOtherLeadSource(true);

        } else {

            setShowOtherLeadSource(false);

            setOtherLeadSource("");

        }

    };


    // =====================================
    // SUBMIT
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // =====================================
        // OTHER LEAD SOURCE VALIDATION
        // =====================================

        if (showOtherLeadSource) {

            if (!otherLeadSource.trim()) {

                alert(
                    "Please enter Lead Source"
                );

                return;
            }
        }


        // =====================================
        // ADMIN COUNSELLOR VALIDATION
        // =====================================

        if (isAdmin) {

            if (!selectedCounsellor) {

                alert(
                    "Please select a Counsellor."
                );

                return;
            }

        }


        // =====================================
        // FINAL DATA
        // =====================================

        const finalData = {

            ...form,

            leadSourceId:
                form.leadSourceId
                    ? Number(
                        form.leadSourceId
                    )
                    : null,

            customLeadSource:
                showOtherLeadSource
                    ? otherLeadSource.trim()
                    : null,

            phone:
                `${form.countryCode}${form.phone.replace(
                    /\D/g,
                    ""
                )}`

        };


        // =====================================
        // ADMIN ASSIGNMENT
        //
        // Same CreateLeadRequest field:
        // employeePersonId
        // =====================================

        if (isAdmin) {

            finalData.employeePersonId =
                Number(
                    selectedCounsellor
                );

        }


        await onSubmit(
            finalData
        );

    };


    // =====================================
    // UI
    // =====================================

    return (

        <form
            className="lead-form"
            onSubmit={handleSubmit}
        >

            {/* ================================= */}
            {/* FIRST NAME */}
            {/* ================================= */}

            <div className="form-group">

                <label>
                    First Name{" "}
                    <span style={{ color: "red" }}>
                        *
                    </span>
                </label>

                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                />

            </div>


            {/* ================================= */}
            {/* MIDDLE NAME */}
            {/* ================================= */}

            <div className="form-group">

                <label>
                    Middle Name
                </label>

                <input
                    type="text"
                    name="middleName"
                    placeholder="Middle Name"
                    value={form.middleName}
                    onChange={handleChange}
                />

            </div>


            {/* ================================= */}
            {/* LAST NAME */}
            {/* ================================= */}

            <div className="form-group">

                <label>
                    Last Name
                </label>

                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                />

            </div>


            {/* ================================= */}
            {/* PHONE */}
            {/* ================================= */}

            <div className="form-group">

                <label>
                    Phone{" "}
                    <span style={{ color: "red" }}>
                        *
                    </span>
                </label>

                <div className="phone-group">

                    <select
                        name="countryCode"
                        value={form.countryCode}
                        onChange={handleChange}
                        className="country-code"
                    >

                        <option value="+1">
                            +1 USA
                        </option>

                    </select>


                    <input
                        type="tel"
                        name="phone"
                        placeholder="312-456-7890 *"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        required
                    />

                </div>

            </div>


            {/* ================================= */}
            {/* EMAIL */}
            {/* ================================= */}

            <div className="form-group">

                <label>
                    Email{" "}
                    <span style={{ color: "red" }}>
                        *
                    </span>
                </label>

                <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

            </div>


            {/* ================================= */}
            {/* VISA TYPE */}
            {/* ================================= */}

            <div className="form-group">

                <label>
                    Visa Type
                </label>

                <select
                    name="visaType"
                    value={form.visaType}
                    onChange={handleChange}
                >

                    <option value="">
                        Select Visa Type
                    </option>

                    <option value="Green Card">
                        Green Card
                    </option>

                    <option value="US Citizen">
                        US Citizen
                    </option>

                    <option value="EAD">
                        EAD
                    </option>

                </select>

            </div>


            {/* ================================= */}
            {/* LEAD SOURCE */}
            {/* ================================= */}

            <div className="form-group">

                <label>

                    Lead Source{" "}

                    <span style={{ color: "red" }}>
                        *
                    </span>

                </label>


                <select
                    value={form.leadSourceId}
                    onChange={
                        handleLeadSourceChange
                    }
                    required
                >

                    <option value="">
                        Select Lead Source
                    </option>


                    {leadSourceOptions.map(
                        (option) => (

                            <option
                                key={option.value}
                                value={option.value}
                            >

                                {option.label}

                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ================================= */}
            {/* OTHER LEAD SOURCE */}
            {/* ================================= */}

            {showOtherLeadSource && (

                <div className="form-group">

                    <label>

                        Enter Lead Source{" "}

                        <span
                            style={{
                                color: "red"
                            }}
                        >
                            *
                        </span>

                    </label>


                    <input
                        type="text"
                        maxLength={100}
                        placeholder="Enter New Lead Source"
                        value={otherLeadSource}
                        onChange={(e) =>
                            setOtherLeadSource(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>

            )}


            {/* ================================= */}
            {/* LEAD PRIORITY */}
            {/* ================================= */}

            <div className="form-group">

                <label>
                    Lead Priority
                </label>


                <select
                    name="leadPriority"
                    value={form.leadPriority}
                    onChange={handleChange}
                >

                    <option value="HOT">
                        HOT
                    </option>

                    <option value="WARM">
                        WARM
                    </option>

                    <option value="COLD">
                        COLD
                    </option>

                </select>

            </div>


            {/* ================================= */}
            {/* ASSIGN COUNSELLOR */}

            {/* ================================= */}

            {isAdmin && (

                <div className="form-group">

                    <label>
                        Assign Counsellor
                    </label>


                    <select
                        value={
                            selectedCounsellor
                        }
                        onChange={(e) =>
                            setSelectedCounsellor(
                                e.target.value
                            )
                        }
                        disabled={loading}
                        required
                    >

                        <option value="">
                            Select Counsellor
                        </option>


                        {counsellors.map(
                            (counsellor) => (

                                <option
                                    key={
                                        counsellor.personId
                                    }
                                    value={
                                        counsellor.personId
                                    }
                                >

                                    {
                                        counsellor.fullName
                                        ||
                                        counsellor.counsellorName
                                        ||
                                        `${counsellor.firstName || ""} ${
                                            counsellor.lastName || ""
                                        }`.trim()
                                        ||
                                        `Counsellor ${
                                            counsellor.personId
                                        }`
                                    }

                                </option>

                            )
                        )}

                    </select>

                </div>

            )}


            {/* ================================= */}
            {/* COMPUTER EXPERIENCE */}
            {/* ================================= */}

            <div className="checkbox-group">

                <label>

                    <input
                        type="checkbox"
                        name="computerExperience"
                        checked={
                            form.computerExperience
                        }
                        onChange={handleChange}
                    />

                    Computer Experience

                </label>

            </div>


            {/* ================================= */}
            {/* BUTTON */}
            {/* ================================= */}

            <button
                type="submit"
                disabled={loading}
            >

                {loading
                    ? "Creating..."
                    : "Create Lead"}

            </button>

        </form>

    );
}

export default LeadForm;