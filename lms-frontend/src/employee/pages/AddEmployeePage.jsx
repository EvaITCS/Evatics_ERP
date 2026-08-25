import React, { useEffect, useState } from "react";

// =====================================================
// EMPLOYEE
// =====================================================

import EmployeeForm from "../components/EmployeeForm";
import employeeService from "../services/employeeService";
import "../styles/employeefrom.css";
// =====================================================
// EMPLOYEE MASTER SERVICES
// =====================================================

import departmentService from "../services/departmentService";
import designationService from "../services/designationService";
import employeeStatusService from "../services/employeeStatusService";
import workModeService from "../services/workModeService";
import shiftService from "../services/shiftService";
import locationService from "../services/locationService";

// =====================================================
// PERSON MASTER SERVICES
// =====================================================

import genderService from "../../person/services/genderService";
import nationalityService from "../../person/services/nationalityService";

import contactTypeService from "../../person/services/contactTypeService";
import addressTypeService from "../../person/services/addressTypeService";

// =====================================================
// SHARED
// =====================================================

import PageTitle from "../../shared/components/PageTitle";

// =====================================================
// STYLES
// =====================================================

import "../styles/employee.css";

// =====================================================
// INITIAL FORM DATA
// =====================================================

const getInitialFormData = (
    primaryEmailTypeId = null,
    primaryPhoneTypeId = null,
    alternateEmailTypeId = null,
    alternatePhoneTypeId = null,
    permanentAddressTypeId = null,
    currentAddressTypeId = null
) => ({
  // =================================================
  // PERSON
  // =================================================

  firstName: "",

  middleName: "",

  lastName: "",

  genderId: "",

  birthYear: "",

  nationalityId: "",

  isMarried: false,

  // =================================================
  // EMPLOYEE
  // =================================================

  employeeCode: "",

  joiningDate: "",

  departmentId: "",

  designationId: "",

  // OPTIONAL
  employmentType: "",

  // OPTIONAL
  employeeStatusId: "",

  // OPTIONAL
  workModeId: "",

  // OPTIONAL
  shiftId: "",

  // OPTIONAL
  locationId: "",

  // OPTIONAL
  probationEndDate: "",

  // =================================================
  // CONTACTS
  // =================================================

  contacts: [
    {
      contactTypeId: primaryEmailTypeId,

      contactValue: "",

      isPrimary: true,

      countryId: null,
    },

    {
      contactTypeId: primaryPhoneTypeId,

      contactValue: "",

      isPrimary: true,

      countryId: null,
    },

    {
      contactTypeId: alternateEmailTypeId,

      contactValue: "",

      isPrimary: false,

      countryId: null,
    },

    {
      contactTypeId: alternatePhoneTypeId,

      contactValue: "",

      isPrimary: false,

      countryId: null,
    },
  ],

  // =================================================
  // ADDRESSES
  // =================================================

  addresses: [
    {
      addressTypeId: permanentAddressTypeId,

      addressLine1: "",

      addressLine2: "",

      city: "",

      state: "",

      country: "",

      // Backend field
      zipcode: "",

      // Frontend compatibility
      zipCode: "",

      // Geoapify fields
      formattedAddress: "",

      latitude: null,

      longitude: null,
    },

    {
      addressTypeId: currentAddressTypeId,

      addressLine1: "",

      addressLine2: "",

      city: "",

      state: "",

      country: "",

      // Backend field
      zipcode: "",

      // Frontend compatibility
      zipCode: "",

      // Geoapify fields
      formattedAddress: "",

      latitude: null,

      longitude: null,
    },
  ],

  // =================================================
  // SAME AS PERMANENT
  // =================================================

  sameAsPermanent: false,

  // =================================================
  // EDUCATION
  // =================================================

  educations: [
    {
      qualification: "",

      instituteName: "",

      fieldOfStudy: "",

      passingYear: "",
    },
  ],

  // =================================================
  // WORK EXPERIENCE
  // =================================================

  workExperiences: [
    {
      companyName: "",

      designation: "",

      startDate: "",

      endDate: "",

      currentlyWorking: false,

      skillsUsed: "",

      jobDescription: "",
    },
  ],

  // =================================================
  // VISA
  // =================================================

  visas: [
    {
      visaType: "",

      eadType: "",

      otherEadType: "",

      visaExpiryDate: "",
    },
  ],

  // =================================================
  // DOCUMENTS
  // =================================================

  documents: [
    {
      documentType: "",
      documentNumber: "",
      fileName: "",
      file: null,
    },
  ],

  // =================================================
  // EMERGENCY CONTACTS
  // =================================================

  emergencyContacts: [
    {
      contactName: "",

      relationship: "",

      phoneNumber: "",

      addressLine1: "",

      addressLine2: "",

      city: "",

      state: "",

      country: "",

      zipcode: "",

      zipCode: "",
    },
  ],
});

// =====================================================
// COMPONENT
// =====================================================

function AddEmployeePage() {
  // =================================================
  // EMPLOYEE MASTER DATA
  // =================================================

  const [departments, setDepartments] =
      useState([]);

  const [designations, setDesignations] =
      useState([]);

  const [employeeStatuses, setEmployeeStatuses] =
      useState([]);

  const [workModes, setWorkModes] =
      useState([]);

  const [shifts, setShifts] =
      useState([]);

  const [locations, setLocations] =
      useState([]);

  // =================================================
  // PERSON MASTER DATA
  // =================================================

  const [genders, setGenders] =
      useState([]);

  const [nationalities, setNationalities] =
      useState([]);

  // =================================================
  // ADDRESS TYPE IDS
  // =================================================

  const [
    permanentAddressTypeId,
    setPermanentAddressTypeId,
  ] = useState(null);

  const [
    currentAddressTypeId,
    setCurrentAddressTypeId,
  ] = useState(null);

  // =================================================
  // CONTACT TYPE IDS
  // =================================================

  const [
    primaryEmailTypeId,
    setPrimaryEmailTypeId,
  ] = useState(null);

  const [
    primaryPhoneTypeId,
    setPrimaryPhoneTypeId,
  ] = useState(null);

  const [
    alternateEmailTypeId,
    setAlternateEmailTypeId,
  ] = useState(null);

  const [
    alternatePhoneTypeId,
    setAlternatePhoneTypeId,
  ] = useState(null);

  // =================================================
  // FORM DATA
  // =================================================

  const [formData, setFormData] =
      useState(
          getInitialFormData()
      );

  // =================================================
  // EMAIL ERROR
  // =================================================

  const [emailError, setEmailError] =
      useState("");

  // =================================================
  // LOADING
  // =================================================

  const [loadingMasters, setLoadingMasters] =
      useState(true);

  // =================================================
  // LOAD MASTER DATA
  // =================================================

  useEffect(() => {
    void fetchMasterData();
  }, []);

  // =====================================================
  // NORMALIZE MASTER NAME
  // =====================================================

  const normalizeName = (value) => {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");
  };

  // =====================================================
  // FETCH MASTER DATA
  // =====================================================

  const fetchMasterData = async () => {
    try {
      setLoadingMasters(true);

      const [
        departmentResponse,
        designationResponse,
        employeeStatusResponse,
        workModeResponse,
        shiftResponse,
        locationResponse,
        genderResponse,
        nationalityResponse,
        contactTypeResponse,
        addressTypeResponse,
      ] = await Promise.all([
        departmentService.getAllDepartments(),

        designationService.getAllDesignations(),

        employeeStatusService.getAllEmployeeStatuses(),

        workModeService.getAllWorkModes(),

        shiftService.getAllShifts(),

        locationService.getAllLocations(),

        genderService.getAllGenders(),

        nationalityService.getAllNationalities(),

        contactTypeService.getAllContactTypes(),

        addressTypeService.getAllAddressTypes(),
      ]);

      // =================================================
      // EXTRACT DATA
      // =================================================

      const departmentData =
          departmentResponse?.data || [];

      const designationData =
          designationResponse?.data || [];

      const employeeStatusData =
          employeeStatusResponse?.data || [];

      const workModeData =
          workModeResponse?.data || [];

      const shiftData =
          shiftResponse?.data || [];

      const locationData =
          locationResponse?.data || [];

      const genderData =
          genderResponse?.data || [];

      const nationalityData =
          nationalityResponse?.data || [];

      const contactTypeData =
          contactTypeResponse?.data || [];

      const addressTypeData =
          addressTypeResponse?.data || [];

      // =================================================
      // SAVE EMPLOYEE MASTERS
      // =================================================

      setDepartments(
          departmentData
      );

      setDesignations(
          designationData
      );

      setEmployeeStatuses(
          employeeStatusData
      );

      setWorkModes(
          workModeData
      );

      setShifts(
          shiftData
      );

      setLocations(
          locationData
      );

      // =================================================
      // SAVE PERSON MASTERS
      // =================================================

      setGenders(
          genderData
      );

      setNationalities(
          nationalityData
      );

      // =================================================
      // FIND ADDRESS TYPE IDS
      // =================================================

      const permanentAddress =
          addressTypeData.find(
              (type) =>
                  normalizeName(
                      type?.addressTypeName
                  ) === "PERMANENT"
          );

      const currentAddress =
          addressTypeData.find(
              (type) =>
                  normalizeName(
                      type?.addressTypeName
                  ) === "CURRENT"
          );

      const permanentId =
          permanentAddress?.addressTypeId ??
          null;

      const currentId =
          currentAddress?.addressTypeId ??
          null;

      // =================================================
      // SAVE ADDRESS TYPE IDS
      // =================================================

      setPermanentAddressTypeId(
          permanentId
      );

      setCurrentAddressTypeId(
          currentId
      );

      // =================================================
      // FIND CONTACT TYPE ID
      // =================================================

      const findContactTypeId = (
          ...possibleNames
      ) => {
        const normalizedNames =
            possibleNames.map(
                (name) =>
                    normalizeName(name)
            );

        const found =
            contactTypeData.find(
                (item) =>
                    normalizedNames.includes(
                        normalizeName(
                            item?.contactTypeName
                        )
                    )
            );

        return (
            found?.contactTypeId ??
            null
        );
      };

      // =================================================
      // PRIMARY EMAIL
      // =================================================

      const primaryEmailId =
          findContactTypeId(
              "PRIMARY_EMAIL",
              "PRIMARY EMAIL",
              "EMAIL"
          );

      // =================================================
      // PRIMARY PHONE
      // =================================================

      const primaryPhoneId =
          findContactTypeId(
              "PRIMARY_PHONE",
              "PRIMARY PHONE",
              "PHONE",
              "MOBILE"
          );

      // =================================================
      // ALTERNATE EMAIL
      // =================================================

      const alternateEmailId =
          findContactTypeId(
              "ALTERNATE_EMAIL",
              "ALTERNATE EMAIL",
              "SECONDARY_EMAIL",
              "SECONDARY EMAIL"
          );

      // =================================================
      // ALTERNATE PHONE
      // =================================================

      const alternatePhoneId =
          findContactTypeId(
              "ALTERNATE_PHONE",
              "ALTERNATE PHONE",
              "SECONDARY_PHONE",
              "SECONDARY PHONE"
          );

      // =================================================
      // SAVE CONTACT TYPE IDS
      // =================================================

      setPrimaryEmailTypeId(
          primaryEmailId
      );

      setPrimaryPhoneTypeId(
          primaryPhoneId
      );

      setAlternateEmailTypeId(
          alternateEmailId
      );

      setAlternatePhoneTypeId(
          alternatePhoneId
      );

      // =================================================
      // INITIALIZE FORM
      // =================================================

      setFormData(
          getInitialFormData(
              primaryEmailId,
              primaryPhoneId,
              alternateEmailId,
              alternatePhoneId,
              permanentId,
              currentId
          )
      );

      // =================================================
      // DEBUG
      // =================================================

      console.log(
          "EMPLOYEE MASTER DATA LOADED"
      );

      console.log(
          "Permanent Address Type ID:",
          permanentId
      );

      console.log(
          "Current Address Type ID:",
          currentId
      );

      console.log(
          "Primary Email Type ID:",
          primaryEmailId
      );

      console.log(
          "Primary Phone Type ID:",
          primaryPhoneId
      );

      console.log(
          "Alternate Email Type ID:",
          alternateEmailId
      );

      console.log(
          "Alternate Phone Type ID:",
          alternatePhoneId
      );

    } catch (error) {

      console.error(
          "Failed to load employee master data:",
          error
      );

      alert(
          error?.response?.data?.message ||
          "Failed to load employee master data."
      );

    } finally {

      setLoadingMasters(false);
    }
  };

  // =====================================================
  // GENERIC FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
          type === "checkbox"
              ? checked
              : value,
    }));
  };

  // =====================================================
  // CLEAN CONTACTS
  // =====================================================

  const cleanContacts = () => {

    return (
        formData.contacts || []
    ).map((contact) => ({

      contactTypeId:
          contact?.contactTypeId
              ? Number(
                  contact.contactTypeId
              )
              : null,

      contactValue:
          String(
              contact?.contactValue || ""
          ).trim(),

      isPrimary:
          Boolean(
              contact?.isPrimary
          ),

      countryId:
          contact?.countryId ??
          null,
    }));
  };

  // =====================================================
  // CLEAN ADDRESSES
  // =====================================================
  //
  // IMPORTANT:
  //
  // Backend requires:
  //
  //     zipcode
  //
  // Frontend may contain:
  //
  //     zipcode
  //
  // OR
  //
  //     zipCode
  //
  // We use `||` here intentionally.
  //
  // Why?
  //
  // If:
  //
  //     zipcode = ""
  //
  // and:
  //
  //     zipCode = "62992"
  //
  // then `??` would return ""
  // while `||` correctly falls back
  // to "62992".
  //
  // =====================================================

  const cleanAddresses = () => {

    return (
        formData.addresses || []
    ).map((address) => {

      const zipcode =
          String(
              address?.zipcode ||
              address?.zipCode ||
              ""
          )
              .replace(/\D/g, "")
              .slice(0, 10)
              .trim();

      return {

        // =============================================
        // ADDRESS TYPE
        // =============================================

        addressTypeId:
            address?.addressTypeId
                ? Number(
                    address.addressTypeId
                )
                : null,

        // =============================================
        // ADDRESS
        // =============================================

        addressLine1:
            String(
                address?.addressLine1 || ""
            ).trim(),

        addressLine2:
            String(
                address?.addressLine2 || ""
            ).trim(),

        // =============================================
        // LOCATION
        // =============================================

        city:
            String(
                address?.city || ""
            ).trim(),

        state:
            String(
                address?.state || ""
            ).trim(),

        country:
            String(
                address?.country || ""
            ).trim(),

        // =============================================
        // ZIPCODE
        // =============================================
        //
        // ALWAYS SEND BACKEND FIELD:
        //
        //     zipcode
        //
        // =============================================

        zipcode,
      };
    });
  };

  // =====================================================
  // CLEAN EDUCATION
  // =====================================================

  const cleanEducations = () => {

    return (
        formData.educations || []
    ).map((education) => ({

      qualification:
          String(
              education?.qualification || ""
          ).trim(),

      instituteName:
          String(
              education?.instituteName || ""
          ).trim(),

      fieldOfStudy:
          String(
              education?.fieldOfStudy || ""
          ).trim(),

      passingYear:
          education?.passingYear || "",
    }));
  };

  // =====================================================
  // CLEAN WORK EXPERIENCE
  // =====================================================

  const cleanWorkExperiences = () => {

    return (
        formData.workExperiences || []
    ).map((experience) => ({

      companyName:
          String(
              experience?.companyName || ""
          ).trim(),

      designation:
          String(
              experience?.designation || ""
          ).trim(),

      startDate:
          experience?.startDate || "",

      endDate:
          experience?.endDate || "",

      currentlyWorking:
          Boolean(
              experience?.currentlyWorking
          ),

      skillsUsed:
          String(
              experience?.skillsUsed || ""
          ).trim(),

      jobDescription:
          String(
              experience?.jobDescription || ""
          ).trim(),
    }));
  };

  // =====================================================
  // CLEAN VISAS
  // =====================================================

  const cleanVisas = () => {

    return (
        formData.visas || []
    ).map((visa) => ({

      visaType:
          String(
              visa?.visaType || ""
          ).trim(),

      eadType:
          String(
              visa?.eadType || ""
          ).trim(),

      otherEadType:
          String(
              visa?.otherEadType || ""
          ).trim(),

      visaExpiryDate:
          visa?.visaExpiryDate || "",
    }));
  };

  // =====================================================
  // CLEAN DOCUMENTS
  // =====================================================

  const cleanDocuments = () => {

    return (
        formData.documents || []
    ).map((document) => ({

      // Existing document ID
      personDocumentId:
          document?.personDocumentId || null,

      documentType:
          String(
              document?.documentType || ""
          ).trim(),

      documentNumber:
          String(
              document?.documentNumber || ""
          ).trim(),

      fileName:
          document?.fileName || "",

      // IMPORTANT:
      // Keep the actual File object
      file:
          document?.file || null,
    }));
  };

  // =====================================================
  // CLEAN EMERGENCY CONTACTS
  // =====================================================

  const cleanEmergencyContacts = () => {

    return (
        formData.emergencyContacts || []
    ).map((contact) => {

      const zipcode =
          String(
              contact?.zipcode ||
              contact?.zipCode ||
              ""
          )
              .replace(/\D/g, "")
              .slice(0, 10)
              .trim();

      return {

        contactName:
            String(
                contact?.contactName || ""
            ).trim(),

        relationship:
            String(
                contact?.relationship || ""
            ).trim(),

        phoneNumber:
            String(
                contact?.phoneNumber || ""
            )
                .replace(/\D/g, "")
                .slice(0, 10),

        addressLine1:
            String(
                contact?.addressLine1 || ""
            ).trim(),

        addressLine2:
            String(
                contact?.addressLine2 || ""
            ).trim(),

        city:
            String(
                contact?.city || ""
            ).trim(),

        state:
            String(
                contact?.state || ""
            ).trim(),

        country:
            String(
                contact?.country || ""
            ).trim(),

        // BACKEND FIELD
        zipcode,
      };
    });
  };

  // =====================================================
  // SUBMIT EMPLOYEE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // =================================================
    // EMAIL ERROR
    // =================================================

    if (emailError) {

      alert(
          "Please fix the email error before saving."
      );

      return;
    }

    // =================================================
    // PRIMARY PHONE
    // =================================================

    const primaryPhone =
        String(
            formData.contacts?.[1]
                ?.contactValue || ""
        )
            .replace(/\D/g, "")
            .trim();

    // =================================================
    // ALTERNATE PHONE
    // =================================================

    const alternatePhone =
        String(
            formData.contacts?.[3]
                ?.contactValue || ""
        )
            .replace(/\D/g, "")
            .trim();

    // =================================================
    // PRIMARY PHONE VALIDATION
    // =================================================

    if (
        !/^\d{10}$/.test(
            primaryPhone
        )
    ) {

      alert(
          "Primary Phone Number must be exactly 10 digits."
      );

      return;
    }

    // =================================================
    // ALTERNATE PHONE VALIDATION
    // =================================================

    if (
        alternatePhone &&
        !/^\d{10}$/.test(
            alternatePhone
        )
    ) {

      alert(
          "Alternate Phone Number must be exactly 10 digits."
      );

      return;
    }

    // =================================================
    // EMERGENCY PHONE VALIDATION
    // =================================================

    const emergencyContacts =
        formData.emergencyContacts || [];

    for (
        const contact of emergencyContacts
        ) {

      const phone =
          String(
              contact?.phoneNumber || ""
          )
              .replace(/\D/g, "")
              .trim();

      if (
          phone &&
          !/^\d{10}$/.test(
              phone
          )
      ) {

        alert(
            "Emergency Contact Phone Number must be exactly 10 digits."
        );

        return;
      }
    }

    // =================================================
    // PREPARE DATA
    // =================================================

    const contacts =
        cleanContacts();

    const addresses =
        cleanAddresses();

    const educations =
        cleanEducations();

    const workExperiences =
        cleanWorkExperiences();

    const visas =
        cleanVisas();

    const documents =
        cleanDocuments();

    const cleanedEmergencyContacts =
        cleanEmergencyContacts();

    // =================================================
    // ZIP CODE SAFETY CHECK
    // =================================================

    for (
        let i = 0;
        i < addresses.length;
        i++
    ) {

      const zipcode =
          String(
              addresses[i]?.zipcode ||
              addresses[i]?.zipCode ||
              ""
          )
              .replace(/\D/g, "")
              .slice(0, 10)
              .trim();

      // =============================================
      // REQUIRED ZIP
      // =============================================

      if (!zipcode) {

        alert(
            `${
                i === 0
                    ? "Permanent"
                    : "Current"
            } Address Zip Code is required.`
        );

        return;
      }

      // =============================================
      // FORCE FINAL BACKEND FIELD
      // =============================================

      addresses[i].zipcode =
          zipcode;
    }

    // =================================================
    // PAYLOAD
    // =================================================

    const payload = {

      // =============================================
      // PERSON
      // =============================================

      firstName:
          String(
              formData.firstName || ""
          ).trim(),

      middleName:
          String(
              formData.middleName || ""
          ).trim(),

      lastName:
          String(
              formData.lastName || ""
          ).trim(),

      genderId:
          formData.genderId
              ? Number(
                  formData.genderId
              )
              : null,

      birthYear:
          formData.birthYear
              ? Number(
                  formData.birthYear
              )
              : null,

      nationalityId:
          formData.nationalityId
              ? Number(
                  formData.nationalityId
              )
              : null,

      isMarried:
          Boolean(
              formData.isMarried
          ),

      // =============================================
      // EMPLOYEE
      // =============================================

      employeeCode:
          String(
              formData.employeeCode || ""
          ).trim(),

      joiningDate:
          formData.joiningDate ||
          null,

      departmentId:
          formData.departmentId
              ? Number(
                  formData.departmentId
              )
              : null,

      designationId:
          formData.designationId
              ? Number(
                  formData.designationId
              )
              : null,

      // =============================================
      // OPTIONAL EMPLOYMENT FIELDS
      // =============================================

      employmentType:
          String(
              formData.employmentType || ""
          ).trim() || null,

      employeeStatusId:
          formData.employeeStatusId
              ? Number(
                  formData.employeeStatusId
              )
              : null,

      workModeId:
          formData.workModeId
              ? Number(
                  formData.workModeId
              )
              : null,

      shiftId:
          formData.shiftId
              ? Number(
                  formData.shiftId
              )
              : null,

      locationId:
          formData.locationId
              ? Number(
                  formData.locationId
              )
              : null,

      probationEndDate:
          formData.probationEndDate ||
          null,

      // =============================================
      // CONTACTS
      // =============================================

      contacts,

      // =============================================
      // ADDRESSES
      // =============================================

      addresses,

      // =============================================
      // EDUCATION
      // =============================================

      educations,

      // =============================================
      // WORK EXPERIENCE
      // =============================================

      workExperiences,

      // =============================================
      // VISA
      // =============================================

      visas,

      // =============================================
      // DOCUMENTS
      // =============================================

      documents,

      // =============================================
      // EMERGENCY CONTACTS
      // =============================================

      emergencyContacts:
      cleanedEmergencyContacts,
    };
// =====================================================
// CREATE MULTIPART FORM DATA
// =====================================================

    const multipartData = new FormData();

    multipartData.append(
        "employee",
        new Blob(
            [
              JSON.stringify({
                ...payload,
                documents: documents.map((document) => ({
                  personDocumentId:
                  document.personDocumentId,

                  documentType:
                  document.documentType,

                  documentNumber:
                  document.documentNumber,

                  fileName:
                  document.fileName,
                })),
              }),
            ],
            {
              type: "application/json",
            }
        )
    );

// =====================================================
// ADD ACTUAL FILES
// =====================================================

    documents.forEach((document) => {

      if (document.file instanceof File) {

        multipartData.append(
            "documents",
            document.file
        );
      }
    });
    // =================================================
    // DEBUG PAYLOAD
    // =================================================

    console.log(
        "===================================="
    );

    console.log(
        "CREATE EMPLOYEE PAYLOAD"
    );

    console.log(
        JSON.stringify(
            payload,
            null,
            2
        )
    );

    console.log(
        "===================================="
    );

    console.log(
        "FINAL ADDRESS PAYLOAD:"
    );

    console.log(
        JSON.stringify(
            payload.addresses,
            null,
            2
        )
    );

    console.log(
        "PERMANENT ZIP:",
        payload.addresses?.[0]?.zipcode
    );

    console.log(
        "CURRENT ZIP:",
        payload.addresses?.[1]?.zipcode
    );

    console.log(
        "===================================="
    );

    // =================================================
    // CREATE EMPLOYEE
    // =================================================



      try {

        const response =
            await employeeService.createEmployee(
                multipartData
            );

      // =============================================
      // SUCCESS
      // =============================================

      const created = response?.data;

      if (created?.temporaryPassword) {

        alert(
            "Employee Created Successfully.\n\n" +
            "The credentials email could not be sent.\n" +
            "Hand these login details over manually:\n\n" +
            "Username: " + created.generatedUsername + "\n" +
            "Password: " + created.temporaryPassword
        );

      } else {

        alert(
            "Employee Created Successfully."
        );
      }

      // =============================================
      // RESET
      // =============================================

      setFormData(
          getInitialFormData(
              primaryEmailTypeId,
              primaryPhoneTypeId,
              alternateEmailTypeId,
              alternatePhoneTypeId,
              permanentAddressTypeId,
              currentAddressTypeId
          )
      );

      setEmailError("");

      // =============================================
      // REDIRECT
      // =============================================

      window.location.href =
          "/admin/employees";

    } catch (error) {

      console.error(
          "Employee creation failed:",
          error
      );

      console.error(
          "SERVER RESPONSE:",
          error?.response?.data
      );

      const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          "Failed to Create Employee.";

      alert(message);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingMasters) {

    return (
        <div className="add-employee-page">

          <div className="page-header">

            <PageTitle
                title="Add Employee"
            />

          </div>

          <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
          >
            Loading employee form...
          </div>

        </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
      <div className="add-employee-page">

        {/* ================================================= */}
        {/* PAGE HEADER */}
        {/* ================================================= */}

        <div className="page-header">

          <PageTitle
              title="Add Employee"
          />

        </div>

        {/* ================================================= */}
        {/* EMPLOYEE FORM */}
        {/* ================================================= */}

        <EmployeeForm

            // =============================================
            // FORM DATA
            // =============================================

            formData={
              formData
            }

            setFormData={
              setFormData
            }

            // =============================================
            // GENERIC CHANGE
            // =============================================

            handleChange={
              handleChange
            }

            // =============================================
            // SUBMIT
            // =============================================

            handleSubmit={
              handleSubmit
            }

            // =============================================
            // ADD MODE
            // =============================================

            isUpdate={
              false
            }

            // =============================================
            // EMAIL ERROR
            // =============================================

            emailError={
              emailError
            }

            setEmailError={
              setEmailError
            }

            // =============================================
            // PERSON MASTERS
            // =============================================

            genders={
              genders
            }

            nationalities={
              nationalities
            }

            // =============================================
            // EMPLOYEE MASTERS
            // =============================================

            departments={
              departments
            }

            designations={
              designations
            }

            employeeStatuses={
              employeeStatuses
            }

            workModes={
              workModes
            }

            shifts={
              shifts
            }

            locations={
              locations
            }
        />

      </div>
  );
}

export default AddEmployeePage;