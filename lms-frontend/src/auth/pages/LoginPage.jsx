import { useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/auth.css";
import logo from "../../assets/eva logo.png";

function LoginPage({ invitationFlow = false, onMustChangePassword }) {
  const navigate = useNavigate();
  const { token: invitationToken } = useParams();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        invitationToken: invitationFlow ? invitationToken : null,
      });

      localStorage.setItem("token", res.data.token || "");

      // ==========================================
      // SAVE ONLY NON-SENSITIVE USER INFORMATION
      // ==========================================

      localStorage.setItem("role", res.data.role || "");

      localStorage.setItem("userId", res.data.userId || "");

      localStorage.setItem("fullName", res.data.fullName || "");

      localStorage.setItem("firstName", res.data.firstName || "");

      localStorage.setItem("mustChangePassword", res.data.mustChangePassword);

      localStorage.setItem("personId", res.data.personId || "");

      // ==========================================
      // FIRST LOGIN PASSWORD CHANGE
      // ==========================================

      if (res.data.mustChangePassword) {
        if (onMustChangePassword) {
          onMustChangePassword();
          return;
        }

        navigate("/change-password");
        return;
      }

  

  // ==========================================
// INVITATION FLOW SUCCESS
// ==========================================

if (
    invitationFlow &&
    ["LEAD", "STUDENT"].includes(res.data.role)
) {
    navigate("/student/dashboard");
    return;
}
      // ==========================================
      // NAVIGATE BASED ON ROLE
      // ==========================================

      switch (res.data.role) {
        case "ADMIN":
          navigate("/admin");
          break;

        case "COUNSELLOR":
          navigate("/COUNSELLOR");
          break;

        case "EMPLOYEE":
          navigate("/employee");
          break;

        case "TRAINER":
          navigate("/trainer");
          break;

          case "LEAD":
    navigate("/student/dashboard");
    break;

        case "STUDENT":
          navigate("/student/dashboard");
          break;

        case "CANDIDATE":
          navigate("/candidate/dashboard");
          break;

        default:
          alert("Invalid Role");
      }
    } catch (err) {
      console.error(err);

      const msg = err.response?.data?.message || "";

     if (msg.includes("Email not found")) {

    if (invitationFlow) {
        alert("Email not found. Please use the email address registered for this application.");
        return;
    }

    alert("Email not found. Register First");
    navigate("/register");
}else if (msg.toLowerCase().includes("wrong password")) {
        alert("Wrong Password");
      } else if (msg.toLowerCase().includes("locked")) {
        alert(
          "Your account has been locked after 3 failed attempts. Please contact your administrator.",
        );
      } else {
        alert(msg || "Login Failed");
      }
    }
  };

  return (
    <div className="auth-page">
      <nav className="auth-navbar">
        <div className="nav-left">
          <img src={logo} alt="EVA Logo" className="nav-logo" />
        </div>

        <div className="nav-center">
          <h1
            className="nav-heading"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              letterSpacing: "0.5px",
            }}
          >
            <span
              style={{
                color: "#64748B",
                fontWeight: "400",
              }}
            >
              The
            </span>

            <span
              style={{
                color: "#10458A",
                fontWeight: "800",
              }}
            >
              Eva
            </span>

            <span
              style={{
                color: "#334155",
                fontWeight: "600",
              }}
            >
              WorkSpace
            </span>

            <span
              style={{
                color: "#CBD5E1",
                margin: "0 8px",
                fontWeight: "300",
              }}
            >
              ───
            </span>

            <span
              style={{
                color: "#032fc1",
                fontSize: "16px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                backgroundColor: "#F0F9FF",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid #E0F2FE",
              }}
            >
              Smart ERP
            </span>
          </h1>
        </div>
      </nav>

      <main className="auth-main">
        <div className="auth-box">
          <h2 style={{}}>Login</h2>

         {!invitationFlow && (
    <h4 onClick={() => navigate("/register")}>
        Don't have an account? Register
    </h4>
)}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button onClick={login} style={{background:"linear-gradient(135deg, #0f2b5c 0%, #1a52e1 100%)"}}>Login</button>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
