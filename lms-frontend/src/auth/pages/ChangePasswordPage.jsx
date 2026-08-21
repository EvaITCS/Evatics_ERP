import { useNavigate } from "react-router-dom";
import ChangePasswordCard from "../components/ChangePasswordCard";
import "../styles/Password.css";

function ChangePasswordPage() {

  const navigate = useNavigate();


  // =====================================================
  // AFTER SUCCESSFUL PASSWORD CHANGE
  // =====================================================

  const handlePasswordChanged = () => {

    // Make sure local state is updated
    localStorage.setItem(
        "mustChangePassword",
        "false"
    );

    const role =
        localStorage.getItem("role");


    // =================================================
    // ROLE BASED DASHBOARD
    // =================================================

    switch (role) {

      case "ADMIN":

        navigate(
            "/admin",
            { replace: true }
        );

        break;


      case "COUNSELLOR":

        navigate(
            "/COUNSELLOR",
            { replace: true }
        );

        break;


      case "EMPLOYEE":

        navigate(
            "/employee",
            { replace: true }
        );

        break;


      case "TRAINER":

        navigate(
            "/trainer",
            { replace: true }
        );

        break;


      case "STUDENT":

        navigate(
            "/student/dashboard",
            { replace: true }
        );

        break;


      case "CANDIDATE":

        navigate(
            "/candidate/dashboard",
            { replace: true }
        );

        break;


      default:

        navigate(
            "/",
            { replace: true }
        );

    }

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

      <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "40px 20px"
          }}
      >

        <ChangePasswordCard
            onSuccess={handlePasswordChanged}
        />

      </div>

  );

}

export default ChangePasswordPage;