import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../shared/components/ToastContext";
// =====================================================
// EMPLOYEE
// =====================================================

import EmployeeForm from "../components/EmployeeForm";
import employeeService from "../services/employeeService";
import"../styles/employeefrom.css"
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

  personId: null,

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

  employmentType: "",

  employeeStatusId: "",
  workModeId: "",
  shiftId: "",
  locationId: "",

  probationEndDate: "",

  // =================================================
  // CONTACTS
  // =================================================

  contacts: [
    {
      contactId: null,

      contactTypeId:
      primaryEmailTypeId,

      contactValue: "",

      isPrimary: true,

      countryId: null,
    },

    {
      contactId: null,

      contactTypeId:
      primaryPhoneTypeId,

      contactValue: "",

      isPrimary: true,

      countryId: null,
    },

    {
      contactId: null,

      contactTypeId:
      alternateEmailTypeId,

      contactValue: "",

      isPrimary: false,

      countryId: null,
    },

    {
      contactId: null,

      contactTypeId:
      alternatePhoneTypeId,

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
      addressId: null,

      addressTypeId:
      permanentAddressTypeId,

      addressLine1: "",
      addressLine2: "",

      city: "",
      state: "",
      country: "",

      zipcode: "",

      formattedAddress: "",

      latitude: null,
      longitude: null,
    },

    {
      addressId: null,

      addressTypeId:
      currentAddressTypeId,

      addressLine1: "",
      addressLine2: "",

      city: "",
      state: "",
      country: "",

      zipcode: "",

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
      educationId: null,

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
      experienceId: null,

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
      visaId: null,

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
      personDocumentId: null,
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
      emergencyContactId: null,

      contactName: "",
      relationship: "",
      phoneNumber: "",

      addressLine1: "",
      addressLine2: "",

      city: "",
      state: "",
      country: "",

      zipcode: "",
    },
  ],
});

// =====================================================
// COMPONENT
// =====================================================

function UpdateEmployeePage() {

  // =================================================
  // ROUTE
  // =================================================
  //
  // IMPORTANT:
  //
  // URL:
  //
  // /admin/employees/update/:personId
  //
  // =================================================
  const { showToast } = useToast();
  const {
    personId: routePersonId,
  } = useParams();

  const navigate = useNavigate();

  // =================================================
  // MASTER DATA
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

  const [loading, setLoading] =
      useState(true);

  const [saving, setSaving] =
      useState(false);

  // =================================================
  // NORMALIZE MASTER NAME
  // =================================================

  const normalizeName = (value) => {

    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");
  };

  // =================================================
  // NUMBER OR EMPTY
  // =================================================

  const toNumberOrEmpty = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
      return "";
    }

    const number =
        Number(value);

    return Number.isNaN(number)
        ? ""
        : number;
  };

  // =================================================
  // DATE NORMALIZATION
  // =================================================

  const normalizeDate = (value) => {

    if (!value) {
      return "";
    }

    return String(value).slice(0, 10);
  };

  // =================================================
  // LOAD PAGE
  // =================================================

  useEffect(() => {

    void loadPage();

  }, [routePersonId]);

  // =====================================================
  // LOAD EVERYTHING
  // =====================================================

  const loadPage = async () => {

    // =================================================
    // PERSON ID VALIDATION
    // =================================================

    if (!routePersonId) {

      showToast(
          "Person ID is missing.",
          "error"
      );

      navigate(
          "/admin/employees"
      );

      return;
    }

    try {

      setLoading(true);

      // =================================================
      // LOAD MASTERS + EMPLOYEE
      // =================================================

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

        employeeResponse,

      ] = await Promise.all([

        departmentService
            .getAllDepartments(),

        designationService
            .getAllDesignations(),

        employeeStatusService
            .getAllEmployeeStatuses(),

        workModeService
            .getAllWorkModes(),

        shiftService
            .getAllShifts(),

        locationService
            .getAllLocations(),

        genderService
            .getAllGenders(),

        nationalityService
            .getAllNationalities(),

        contactTypeService
            .getAllContactTypes(),

        addressTypeService
            .getAllAddressTypes(),

        // =============================================
        // GET EMPLOYEE BY PERSON ID
        // =============================================

        employeeService
            .getEmployeeById(
                routePersonId
            ),
      ]);

      // =================================================
      // MASTER ARRAYS
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
      // SAVE MASTER DATA
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

      setGenders(
          genderData
      );

      setNationalities(
          nationalityData
      );

      // =================================================
      // ADDRESS TYPE IDS
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

      setPermanentAddressTypeId(
          permanentId
      );

      setCurrentAddressTypeId(
          currentId
      );

      // =================================================
      // CONTACT TYPE FINDER
      // =================================================

      const findContactTypeId = (
          ...possibleNames
      ) => {

        const names =
            possibleNames.map(
                (name) =>
                    normalizeName(name)
            );

        const found =
            contactTypeData.find(
                (item) =>
                    names.includes(
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
      // CONTACT TYPE IDS
      // =================================================

      const primaryEmailId =
          findContactTypeId(
              "PRIMARY_EMAIL",
              "PRIMARY EMAIL",
              "EMAIL"
          );

      const primaryPhoneId =
          findContactTypeId(
              "PRIMARY_PHONE",
              "PRIMARY PHONE",
              "PHONE",
              "MOBILE"
          );

      const alternateEmailId =
          findContactTypeId(
              "ALTERNATE_EMAIL",
              "ALTERNATE EMAIL",
              "SECONDARY_EMAIL",
              "SECONDARY EMAIL"
          );

      const alternatePhoneId =
          findContactTypeId(
              "ALTERNATE_PHONE",
              "ALTERNATE PHONE",
              "SECONDARY_PHONE",
              "SECONDARY PHONE"
          );

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
      // EMPLOYEE RESPONSE
      // =================================================

      const employee =
          employeeResponse?.data;

      if (!employee) {

        throw new Error(
            "Employee data was not returned by the server."
        );
      }

      console.log(
          "UPDATE EMPLOYEE RESPONSE:",
          employee
      );

      // =================================================
      // BUILD FORM
      // =================================================

      const mappedForm =
          mapEmployeeToForm(
              employee,
              {
                primaryEmailId,
                primaryPhoneId,
                alternateEmailId,
                alternatePhoneId,
                permanentId,
                currentId,
              }
          );

      console.log(
          "MAPPED UPDATE FORM:",
          mappedForm
      );

      setFormData(
          mappedForm
      );

    } catch (error) {

      console.error(
          "Failed to load employee:",
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
          error?.message ||
          "Failed to load employee.";

      showToast(message, "error");

      navigate(
          "/admin/employees"
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // MAP BACKEND -> FORM
  // =====================================================

  const mapEmployeeToForm = (
      employee,
      typeIds
  ) => {

    // =================================================
    // CONTACTS
    // =================================================

    const backendContacts =
        Array.isArray(
            employee?.contacts
        )
            ? employee.contacts
            : [];

    const contacts = [

      {
        contactId: null,

        contactTypeId:
        typeIds.primaryEmailId,

        contactValue: "",

        isPrimary: true,

        countryId: null,
      },

      {
        contactId: null,

        contactTypeId:
        typeIds.primaryPhoneId,

        contactValue: "",

        isPrimary: true,

        countryId: null,
      },

      {
        contactId: null,

        contactTypeId:
        typeIds.alternateEmailId,

        contactValue: "",

        isPrimary: false,

        countryId: null,
      },

      {
        contactId: null,

        contactTypeId:
        typeIds.alternatePhoneId,

        contactValue: "",

        isPrimary: false,

        countryId: null,
      },
    ];

    // =================================================
    // MAP BACKEND CONTACTS
    // =================================================

    backendContacts.forEach(
        (contact) => {

          const typeName =
              normalizeName(
                  contact?.contactTypeName ||
                  contact?.typeName ||
                  ""
              );

          const typeId =
              contact?.contactTypeId;

          const value =
              contact?.contactValue ||
              "";

          const normalizedTypeId =
              typeId !== null &&
              typeId !== undefined
                  ? Number(typeId)
                  : null;

          // =============================================
          // PRIMARY EMAIL
          // =============================================

          if (
              typeName === "PRIMARY_EMAIL" ||
              typeName === "PRIMARY_EMAIL_ADDRESS" ||
              normalizedTypeId ===
              Number(
                  typeIds.primaryEmailId
              )
          ) {

            contacts[0] = {

              contactId:
                  contact?.contactId ??
                  contact?.personContactId ??
                  null,

              contactTypeId:
                  normalizedTypeId ??
                  typeIds.primaryEmailId,

              contactValue:
              value,

              isPrimary:
                  contact?.isPrimary !== false,

              countryId:
                  contact?.countryId ??
                  null,
            };

            return;
          }

          // =============================================
          // PRIMARY PHONE
          // =============================================

          if (
              typeName === "PRIMARY_PHONE" ||
              typeName === "PHONE" ||
              typeName === "MOBILE" ||
              normalizedTypeId ===
              Number(
                  typeIds.primaryPhoneId
              )
          ) {

            contacts[1] = {

              contactId:
                  contact?.contactId ??
                  contact?.personContactId ??
                  null,

              contactTypeId:
                  normalizedTypeId ??
                  typeIds.primaryPhoneId,

              contactValue:
              value,

              isPrimary:
                  contact?.isPrimary !== false,

              countryId:
                  contact?.countryId ??
                  null,
            };

            return;
          }

          // =============================================
          // ALTERNATE EMAIL
          // =============================================

          if (
              typeName === "ALTERNATE_EMAIL" ||
              typeName === "SECONDARY_EMAIL" ||
              normalizedTypeId ===
              Number(
                  typeIds.alternateEmailId
              )
          ) {

            contacts[2] = {

              contactId:
                  contact?.contactId ??
                  contact?.personContactId ??
                  null,

              contactTypeId:
                  normalizedTypeId ??
                  typeIds.alternateEmailId,

              contactValue:
              value,

              isPrimary: false,

              countryId:
                  contact?.countryId ??
                  null,
            };

            return;
          }

          // =============================================
          // ALTERNATE PHONE
          // =============================================

          if (
              typeName === "ALTERNATE_PHONE" ||
              typeName === "SECONDARY_PHONE" ||
              normalizedTypeId ===
              Number(
                  typeIds.alternatePhoneId
              )
          ) {

            contacts[3] = {

              contactId:
                  contact?.contactId ??
                  contact?.personContactId ??
                  null,

              contactTypeId:
                  normalizedTypeId ??
                  typeIds.alternatePhoneId,

              contactValue:
              value,

              isPrimary: false,

              countryId:
                  contact?.countryId ??
                  null,
            };
          }
        }
    );

    // =================================================
    // ADDRESSES
    // =================================================

    const backendAddresses =
        Array.isArray(
            employee?.addresses
        )
            ? employee.addresses
            : [];

    let permanent =
        backendAddresses.find(
            (address) =>
                normalizeName(
                    address?.addressTypeName ||
                    address?.typeName ||
                    ""
                ) === "PERMANENT"
        );

    let current =
        backendAddresses.find(
            (address) =>
                normalizeName(
                    address?.addressTypeName ||
                    address?.typeName ||
                    ""
                ) === "CURRENT"
        );

    // =================================================
    // FALLBACK BY INDEX
    // =================================================

    if (
        !permanent &&
        backendAddresses[0]
    ) {

      permanent =
          backendAddresses[0];
    }

    if (
        !current &&
        backendAddresses[1]
    ) {

      current =
          backendAddresses[1];
    }

    // =================================================
    // ADDRESS MAPPER
    // =================================================

    const mapAddress = (
        address,
        typeId,
        typeName
    ) => {

      if (!address) {

        return {

          addressId: null,

          addressTypeId:
          typeId,

          addressTypeName:
          typeName,

          addressLine1: "",
          addressLine2: "",

          city: "",
          state: "",
          country: "",

          zipcode: "",

          formattedAddress: "",

          latitude: null,
          longitude: null,
        };
      }

      return {

        addressId:
            address?.addressId ??
            address?.personAddressId ??
            null,

        addressTypeId:
            address?.addressTypeId ??
            typeId,

        addressTypeName:
            address?.addressTypeName ??
            typeName,

        addressLine1:
            address?.addressLine1 ??
            "",

        addressLine2:
            address?.addressLine2 ??
            "",

        city:
            address?.city ??
            "",

        state:
            address?.state ??
            "",

        country:
            address?.country ??
            "",

        zipcode:
            address?.zipcode ??
            address?.zipCode ??
            "",

        formattedAddress:
            address?.formattedAddress ??
            address?.formatted ??
            "",

        latitude:
            address?.latitude ??
            null,

        longitude:
            address?.longitude ??
            null,
      };
    };

    const permanentAddress =
        mapAddress(
            permanent,
            typeIds.permanentId,
            "PERMANENT"
        );

    const currentAddress =
        mapAddress(
            current,
            typeIds.currentId,
            "CURRENT"
        );

    // =================================================
    // SAME AS PERMANENT
    // =================================================

    const sameAsPermanent =
        Boolean(

            permanentAddress?.addressLine1 &&
            currentAddress?.addressLine1 &&

            permanentAddress.addressLine1 ===
            currentAddress.addressLine1 &&

            permanentAddress.city ===
            currentAddress.city &&

            permanentAddress.state ===
            currentAddress.state &&

            permanentAddress.country ===
            currentAddress.country &&

            permanentAddress.zipcode ===
            currentAddress.zipcode
        );

    // =================================================
    // EDUCATIONS
    // =================================================

    const educations =
        Array.isArray(
            employee?.educations
        ) &&
        employee.educations.length > 0

            ? employee.educations.map(
                (education) => ({

                  educationId:
                      education?.educationId ??
                      null,

                  qualification:
                      education?.qualification ??
                      "",

                  instituteName:
                      education?.instituteName ??
                      "",

                  fieldOfStudy:
                      education?.fieldOfStudy ??
                      "",

                  passingYear:
                      education?.passingYear ??
                      "",
                })
            )

            : [

              {
                educationId: null,

                qualification: "",
                instituteName: "",
                fieldOfStudy: "",
                passingYear: "",
              },
            ];

    // =================================================
    // WORK EXPERIENCE
    // =================================================

    const workExperiences =
        Array.isArray(
            employee?.workExperiences
        ) &&
        employee.workExperiences.length > 0

            ? employee.workExperiences.map(
                (experience) => ({

                  experienceId:
                      experience?.experienceId ??
                      experience?.workExperienceId ??
                      null,

                  companyName:
                      experience?.companyName ??
                      "",

                  designation:
                      experience?.designation ??
                      "",

                  startDate:
                      normalizeDate(
                          experience?.startDate
                      ),

                  endDate:
                      normalizeDate(
                          experience?.endDate
                      ),

                  currentlyWorking:
                      Boolean(
                          experience?.currentlyWorking
                      ),

                  skillsUsed:
                      experience?.skillsUsed ??
                      "",

                  jobDescription:
                      experience?.jobDescription ??
                      "",
                })
            )

            : [

              {
                experienceId: null,

                companyName: "",
                designation: "",

                startDate: "",
                endDate: "",

                currentlyWorking: false,

                skillsUsed: "",
                jobDescription: "",
              },
            ];

    // =================================================
    // VISAS
    // =================================================

    const visas =
        Array.isArray(
            employee?.visas
        ) &&
        employee.visas.length > 0

            ? employee.visas.map(
                (visa) => ({

                  visaId:
                      visa?.visaId ??
                      null,

                  visaType:
                      visa?.visaType ??
                      "",

                  eadType:
                      visa?.eadType ??
                      "",

                  otherEadType:
                      visa?.otherEadType ??
                      "",

                  visaExpiryDate:
                      normalizeDate(
                          visa?.visaExpiryDate
                      ),
                })
            )

            : [

              {
                visaId: null,

                visaType: "",
                eadType: "",
                otherEadType: "",

                visaExpiryDate: "",
              },
            ];

    // =================================================
    // DOCUMENTS
    // =================================================

    const documents =
        Array.isArray(
            employee?.documents
        ) &&
        employee.documents.length > 0

            ? employee.documents.map(
                (document) => ({

                  personDocumentId:
                      document?.personDocumentId ??
                      document?.documentId ??
                      null,

                  documentType:
                      document?.documentType ??
                      "",

                  documentNumber:
                      document?.documentNumber ??
                      "",

                  fileName:
                      document?.fileName ??
                      "",

                  file: null,
                })
            )

            : [

              {
                personDocumentId: null,
                documentType: "",
                documentNumber: "",
                fileName: "",
                file: null,

              },
            ];

    // =================================================
    // EMERGENCY CONTACTS
    // =================================================

    const emergencyContacts =
        Array.isArray(
            employee?.emergencyContacts
        ) &&
        employee.emergencyContacts.length > 0

            ? employee.emergencyContacts.map(
                (contact) => ({

                  emergencyContactId:
                      contact?.emergencyContactId ??
                      null,

                  contactName:
                      contact?.contactName ??
                      "",

                  relationship:
                      contact?.relationship ??
                      "",

                  phoneNumber:
                      contact?.phoneNumber ??
                      "",

                  addressLine1:
                      contact?.addressLine1 ??
                      "",

                  addressLine2:
                      contact?.addressLine2 ??
                      "",

                  city:
                      contact?.city ??
                      "",

                  state:
                      contact?.state ??
                      "",

                  country:
                      contact?.country ??
                      "",

                  zipcode:
                      contact?.zipcode ??
                      contact?.zipCode ??
                      "",
                })
            )

            : [

              {
                emergencyContactId: null,

                contactName: "",
                relationship: "",
                phoneNumber: "",

                addressLine1: "",
                addressLine2: "",

                city: "",
                state: "",
                country: "",

                zipcode: "",
              },
            ];

    // =================================================
    // FINAL FORM
    // =================================================

    return {

      // =================================================
      // IMPORTANT:
      // EMPLOYEE IS IDENTIFIED BY PERSON ID
      // =================================================

      personId:
          employee?.personId ??
          Number(routePersonId),

      // =================================================
      // PERSON
      // =================================================

      firstName:
          employee?.firstName ??
          "",

      middleName:
          employee?.middleName ??
          "",

      lastName:
          employee?.lastName ??
          "",

      genderId:
          toNumberOrEmpty(
              employee?.genderId
          ),

      birthYear:
          toNumberOrEmpty(
              employee?.birthYear
          ),

      nationalityId:
          toNumberOrEmpty(
              employee?.nationalityId
          ),

      isMarried:
          Boolean(
              employee?.isMarried
          ),

      // =================================================
      // EMPLOYEE DETAILS
      // =================================================

      employeeCode:
          employee?.employeeCode ??
          "",

      joiningDate:
          normalizeDate(
              employee?.joiningDate
          ),

      departmentId:
          toNumberOrEmpty(
              employee?.departmentId
          ),

      designationId:
          toNumberOrEmpty(
              employee?.designationId
          ),

      employmentType:
          employee?.employmentType ??
          "",

      employeeStatusId:
          toNumberOrEmpty(
              employee?.employeeStatusId
          ),

      workModeId:
          toNumberOrEmpty(
              employee?.workModeId
          ),

      shiftId:
          toNumberOrEmpty(
              employee?.shiftId
          ),

      locationId:
          toNumberOrEmpty(
              employee?.locationId
          ),

      probationEndDate:
          normalizeDate(
              employee?.probationEndDate
          ),

      // =================================================
      // CHILD DATA
      // =================================================

      contacts,

      addresses: [
        permanentAddress,
        currentAddress,
      ],

      sameAsPermanent,

      educations,

      workExperiences,

      visas,

      documents,

      emergencyContacts,
    };
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
        formData?.contacts || []
    )
        .filter(Boolean)
        .map((contact) => ({

          contactId:
              contact?.contactId ??
              contact?.personContactId ??
              null,

          contactTypeId:
              contact?.contactTypeId
                  ? Number(
                      contact.contactTypeId
                  )
                  : null,

          contactValue:
              String(
                  contact?.contactValue ||
                  ""
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

  const cleanAddresses = () => {

    return (
        formData?.addresses || []
    )
        .filter(Boolean)
        .map((address) => ({

          addressId:
              address?.addressId ??
              address?.personAddressId ??
              null,

          addressTypeId:
              address?.addressTypeId
                  ? Number(
                      address.addressTypeId
                  )
                  : null,

          addressLine1:
              String(
                  address?.addressLine1 ||
                  ""
              ).trim(),

          addressLine2:
              String(
                  address?.addressLine2 ||
                  ""
              ).trim(),

          city:
              String(
                  address?.city ||
                  ""
              ).trim(),

          state:
              String(
                  address?.state ||
                  ""
              ).trim(),

          country:
              String(
                  address?.country ||
                  ""
              ).trim(),

          zipcode:
              String(
                  address?.zipcode ||
                  address?.zipCode ||
                  ""
              )
                  .replace(/\D/g, "")
                  .slice(0, 10)
                  .trim(),
        }));
  };

  // =====================================================
  // CLEAN EDUCATIONS
  // =====================================================

  const cleanEducations = () => {

    return (
        formData?.educations || []
    )
        .filter(Boolean)
        .map((education) => ({

          educationId:
              education?.educationId ??
              null,

          qualification:
              String(
                  education?.qualification ||
                  ""
              ).trim(),

          instituteName:
              String(
                  education?.instituteName ||
                  ""
              ).trim(),

          fieldOfStudy:
              String(
                  education?.fieldOfStudy ||
                  ""
              ).trim(),

          passingYear:
              education?.passingYear === "" ||
              education?.passingYear === null ||
              education?.passingYear === undefined

                  ? null

                  : Number(
                      education.passingYear
                  ),
        }));
  };

  // =====================================================
  // CLEAN WORK EXPERIENCE
  // =====================================================

  const cleanWorkExperiences = () => {

    return (
        formData?.workExperiences || []
    )
        .filter(Boolean)
        .map((experience) => ({

          experienceId:
              experience?.experienceId ??
              experience?.workExperienceId ??
              null,

          companyName:
              String(
                  experience?.companyName ||
                  ""
              ).trim(),

          designation:
              String(
                  experience?.designation ||
                  ""
              ).trim(),

          startDate:
              experience?.startDate ||
              null,

          endDate:
              experience?.currentlyWorking
                  ? null
                  : (
                      experience?.endDate ||
                      null
                  ),

          currentlyWorking:
              Boolean(
                  experience?.currentlyWorking
              ),

          skillsUsed:
              String(
                  experience?.skillsUsed ||
                  ""
              ).trim(),

          jobDescription:
              String(
                  experience?.jobDescription ||
                  ""
              ).trim(),
        }));
  };

  // =====================================================
  // CLEAN VISAS
  // =====================================================

  const cleanVisas = () => {

    return (
        formData?.visas || []
    )
        .filter(Boolean)
        .map((visa) => ({

          visaId:
              visa?.visaId ??
              null,

          visaType:
              String(
                  visa?.visaType ||
                  ""
              ).trim(),

          eadType:
              String(
                  visa?.eadType ||
                  ""
              ).trim(),

          otherEadType:
              String(
                  visa?.otherEadType ||
                  ""
              ).trim(),

          visaExpiryDate:
              visa?.visaExpiryDate ||
              null,
        }));
  };

  // =====================================================
  // CLEAN DOCUMENTS
  // =====================================================

  const cleanDocuments = () => {

    return (
        formData?.documents || []
    )
        .filter(Boolean)
        .map((document) => ({

          personDocumentId:
              document?.personDocumentId ??
              null,

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

          file:
              document?.file || null,
        }));
  };
  // =====================================================
  // CLEAN EMERGENCY CONTACTS
  // =====================================================

  const cleanEmergencyContacts = () => {

    return (
        formData?.emergencyContacts || []
    )
        .filter(Boolean)
        .map((contact) => ({

          emergencyContactId:
              contact?.emergencyContactId ??
              null,

          contactName:
              String(
                  contact?.contactName ||
                  ""
              ).trim(),

          relationship:
              String(
                  contact?.relationship ||
                  ""
              ).trim(),

          phoneNumber:
              String(
                  contact?.phoneNumber ||
                  ""
              )
                  .replace(/\D/g, "")
                  .slice(0, 10),

          addressLine1:
              String(
                  contact?.addressLine1 ||
                  ""
              ).trim(),

          addressLine2:
              String(
                  contact?.addressLine2 ||
                  ""
              ).trim(),

          city:
              String(
                  contact?.city ||
                  ""
              ).trim(),

          state:
              String(
                  contact?.state ||
                  ""
              ).trim(),

          country:
              String(
                  contact?.country ||
                  ""
              ).trim(),

          zipcode:
              String(
                  contact?.zipcode ||
                  contact?.zipCode ||
                  ""
              )
                  .replace(/\D/g, "")
                  .slice(0, 10)
                  .trim(),
        }));
  };

  // =====================================================
  // SUBMIT UPDATE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (saving) {
      return;
    }

    // =================================================
    // EMAIL ERROR
    // =================================================

    if (emailError) {

      showToast(
          "Please fix the email error before updating.",
          "error"
      );

      return;
    }

    // =================================================
    // PRIMARY PHONE
    // =================================================

    const primaryPhone =
        String(
            formData?.contacts?.[1]
                ?.contactValue ||
            ""
        )
            .replace(/\D/g, "")
            .trim();

    if (
        !/^\d{10}$/.test(
            primaryPhone
        )
    ) {

      showToast(
          "Primary Phone Number must be exactly 10 digits.",
          "error"
      );

      return;
    }

    // =================================================
    // ALTERNATE PHONE
    // =================================================

    const alternatePhone =
        String(
            formData?.contacts?.[3]
                ?.contactValue ||
            ""
        )
            .replace(/\D/g, "")
            .trim();

    if (
        alternatePhone &&
        !/^\d{10}$/.test(
            alternatePhone
        )
    ) {

      showToast(
          "Alternate Phone Number must be exactly 10 digits.",
          "error"
      );
      return;
    }

    // =================================================
    // EMERGENCY PHONE
    // =================================================

    for (
        const contact
        of formData?.emergencyContacts || []
        ) {

      const phone =
          String(
              contact?.phoneNumber ||
              ""
          )
              .replace(/\D/g, "")
              .trim();

      if (
          phone &&
          !/^\d{10}$/.test(
              phone
          )
      ) {

        showToast(
            "Emergency Contact Phone Number must be exactly 10 digits.",
            "error"
        );

        return;
      }
    }

    // =================================================
    // PERSON ID
    // =================================================
    //
    // IMPORTANT:
    //
    // Employee table primary key = personId
    //
    // Therefore:
    //
    // PUT /api/employees/{personId}
    //
    // =================================================

    const personId =
        formData?.personId ??
        Number(routePersonId);

    if (!personId) {

      showToast(
          "Person ID is missing.",
          "error"
      );

      console.error(
          "Person ID missing from formData:",
          formData
      );

      return;
    }

    // =================================================
    // PAYLOAD
    // =================================================

    const payload = {

      // =============================================
      // PERSON ID
      // =============================================

      personId:

          Number(personId),

      // =============================================
      // PERSON
      // =============================================

      firstName:
          String(
              formData?.firstName ||
              ""
          ).trim(),

      middleName:
          String(
              formData?.middleName ||
              ""
          ).trim(),

      lastName:
          String(
              formData?.lastName ||
              ""
          ).trim(),

      genderId:
          formData?.genderId
              ? Number(
                  formData.genderId
              )
              : null,

      birthYear:
          formData?.birthYear
              ? Number(
                  formData.birthYear
              )
              : null,

      nationalityId:
          formData?.nationalityId
              ? Number(
                  formData.nationalityId
              )
              : null,

      isMarried:
          Boolean(
              formData?.isMarried
          ),

      // =============================================
      // EMPLOYEE
      // =============================================

      employeeCode:
          String(
              formData?.employeeCode ||
              ""
          ).trim(),

      joiningDate:
          formData?.joiningDate ||
          null,

      departmentId:
          formData?.departmentId
              ? Number(
                  formData.departmentId
              )
              : null,

      designationId:
          formData?.designationId
              ? Number(
                  formData.designationId
              )
              : null,

      employmentType:
          String(
              formData?.employmentType ||
              ""
          ).trim() || null,

      employeeStatusId:
          formData?.employeeStatusId
              ? Number(
                  formData.employeeStatusId
              )
              : null,

      workModeId:
          formData?.workModeId
              ? Number(
                  formData.workModeId
              )
              : null,

      shiftId:
          formData?.shiftId
              ? Number(
                  formData.shiftId
              )
              : null,

      locationId:
          formData?.locationId
              ? Number(
                  formData.locationId
              )
              : null,

      probationEndDate:
          formData?.probationEndDate ||
          null,

      // =============================================
      // CHILD COLLECTIONS
      // =============================================

      contacts:
          cleanContacts(),

      addresses:
          cleanAddresses(),

      educations:
          cleanEducations(),

      workExperiences:
          cleanWorkExperiences(),

      visas:
          cleanVisas(),

      documents:
          cleanDocuments(),

      emergencyContacts:
          cleanEmergencyContacts(),
    };

    // =================================================
    // DEBUG
    // =================================================

    console.log(
        "===================================="
    );

    console.log(
        "UPDATE EMPLOYEE"
    );

    console.log(
        "PERSON ID:",
        personId
    );

    console.log(
        "UPDATE URL:",
        `/api/employees/${personId}`
    );

    console.log(
        "UPDATE PAYLOAD:",
        JSON.stringify(
            payload,
            null,
            2
        )
    );

    console.log(
        "===================================="
    );

    // =================================================
    // UPDATE
    // =================================================

    try {

      setSaving(true);

      // =============================================
      // IMPORTANT:
      //
      // Employee is identified by personId.
      //
      // PUT /api/employees/{personId}
      // =============================================

      // =================================================
// CREATE MULTIPART FORM DATA
// =================================================

      const multipartData = new FormData();

      multipartData.append(
          "employee",
          new Blob(
              [
                JSON.stringify({
                  ...payload,

                  // File object JSON mein nahi bhejna
                  documents: payload.documents.map((document) => ({
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

// =================================================
// ADD NEW / REPLACED FILES
// =================================================

      payload.documents.forEach((document) => {

        if (document.file instanceof File) {

          multipartData.append(
              "documents",
              document.file
          );
        }
      });

// =================================================
// UPDATE EMPLOYEE
// =================================================

      await employeeService.updateEmployee(
          personId,
          multipartData
      );
      // =============================================
      // SUCCESS
      // =============================================

      showToast(
          "Employee Updated Successfully.",
          "success"
      );

      // =============================================
      // REDIRECT
      // =============================================

      navigate(
          "/admin/employees"
      );

    } catch (error) {

      console.error(
          "Employee update failed:",
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
          error?.message ||
          "Failed to update employee.";

      showToast(message, "error");

    } finally {

      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

        <div className="update-employee-page">

          <div className="page-header">

            <PageTitle
                title="Update Employee"
            />

          </div>

          <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
          >
            Loading employee...
          </div>

        </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (

      <div className="update-employee-page">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="page-header">

          <PageTitle
              title="Update Employee"
          />

        </div>

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <EmployeeForm

            formData={
              formData
            }

            setFormData={
              setFormData
            }

            handleChange={
              handleChange
            }

            handleSubmit={
              handleSubmit
            }

            isUpdate={
              true
            }

            emailError={
              emailError
            }

            setEmailError={
              setEmailError
            }

            genders={
              genders
            }

            nationalities={
              nationalities
            }

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

        {/* ================================================= */}
        {/* SAVING */}
        {/* ================================================= */}

        {saving && (

            <div
                style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "20px",
                  padding: "12px 18px",
                  background: "#222",
                  color: "#fff",
                  borderRadius: "8px",
                  zIndex: 9999,
                }}
            >
              Updating employee...
            </div>

        )}

      </div>
  );
}

export default UpdateEmployeePage;