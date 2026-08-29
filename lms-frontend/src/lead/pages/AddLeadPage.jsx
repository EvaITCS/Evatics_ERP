import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LeadForm from "../components/LeadForm";
import { createLead } from "../services/leadService";
import { useToast } from "../../shared/components/ToastContext";

import PageTitle from "../../shared/components/PageTitle";
import { getCounsellors } from "../../user/service/userService";

import "../styles/lead.css";


function AddLeadPage() {

  const navigate = useNavigate();

  const { showToast } = useToast();

  const role =
      localStorage.getItem("role");


  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] =
      useState(false);

  const [counsellors, setCounsellors] =
      useState([]);

  const [selectedCounsellor, setSelectedCounsellor] =
      useState("");


  // =====================================================
  // LOAD COUNSELLORS
  // ADMIN ONLY
  // =====================================================

  useEffect(() => {

    if (role !== "ADMIN") {
      return;
    }


    const loadCounsellors = async () => {

      try {

        const data =
            await getCounsellors();


        setCounsellors(
            Array.isArray(data)
                ? data
                : []
        );

      } catch (error) {

        console.error(
            "Failed to load counsellors:",
            error
        );

        showToast(
            "Failed to load counsellors.",
            "error"
        );
      }
    };


    loadCounsellors();

  }, [role]);


  // =====================================================
  // CREATE LEAD
  // =====================================================

  const submit = async (data) => {

    try {

      setLoading(true);


      // =================================================
      // ADMIN SAFETY CHECK
      // =================================================

      if (
          role === "ADMIN" &&
          !selectedCounsellor
      ) {

        showToast(
            "Please select a Counsellor.",
            "error"
        );

        setLoading(false);

        return;
      }


      // =================================================
      // FINAL PAYLOAD
      // =================================================

      const finalData = {
        ...data
      };


      // =================================================
      // COUNSELLOR
      //
      // Counsellor creates lead:
      // automatically assign to logged-in counsellor.
      // =================================================

      if (role === "COUNSELLOR") {

        const currentPersonId =
            localStorage.getItem("personId");


        if (!currentPersonId) {

          showToast(
              "Counsellor person ID not found.",
              "error"
          );

          setLoading(false);

          return;
        }


        finalData.employeePersonId =
            Number(currentPersonId);
      }


      // =================================================
      // ADMIN
      //
      // Admin selects counsellor before creating lead.
      // =================================================

      if (role === "ADMIN") {

        finalData.employeePersonId =
            Number(selectedCounsellor);
      }


      // =================================================
      // DEBUG
      // =================================================

      console.log(
          "CREATE LEAD PAYLOAD =",
          finalData
      );


      // =================================================
      // API
      // =================================================

      await createLead(
          finalData
      );


      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      if (role === "ADMIN") {

        showToast(
            "Lead Created and Assigned Successfully",
            "success"
        );

      } else {

        showToast(
            "Lead Created Successfully",
            "success"
        );
      }


      // =================================================
      // REDIRECT
      // =================================================

      if (role === "ADMIN") {

        navigate(
            "/admin/all-leads"
        );

      } else {

        navigate(
            "/COUNSELLOR/my-leads"
        );
      }


    } catch (error) {

      console.error(
          "Create lead failed:",
          error
      );


      const message =
          error.response?.data?.detail
          ||
          error.response?.data?.message
          ||
          (
              typeof error.response?.data === "string"
                  ? error.response.data
                  : null
          )
          ||
          "Failed to create lead";


      showToast(
          message,
          "error"
      );


    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (

      <div className="add-lead-page">

        <div className="lead-card-wrapper">


          {/* ===========================================
              HEADER
          =========================================== */}

          <div className="card-header">

            <div>

              <PageTitle
                  title="Add New Lead"
              />

            </div>


            <button
                type="button"
                className="back-btn"
                onClick={() =>
                    navigate(-1)
                }
                disabled={loading}
            >
              ← Back
            </button>

          </div>


          {/* ===========================================
              ADMIN OWNERSHIP

              LeadForm ke andar dropdown show hoga.
          =========================================== */}

          {role === "ADMIN" && (

              <div className="admin-form-note">


              </div>

          )}


          {/* ===========================================
              LEAD FORM
          =========================================== */}

          <LeadForm

              onSubmit={submit}

              loading={loading}

              isAdmin={
                  role === "ADMIN"
              }

              counsellors={
                counsellors
              }

              selectedCounsellor={
                selectedCounsellor
              }

              setSelectedCounsellor={
                setSelectedCounsellor
              }

          />

        </div>

      </div>
  );
}


export default AddLeadPage;