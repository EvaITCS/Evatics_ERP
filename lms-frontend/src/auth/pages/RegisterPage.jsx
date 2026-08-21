import { useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import logo from "../../assets/eva logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function RegisterPage() {
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [form, setForm] = useState({
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

  const register = async () => {
    if (form.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    try {
      await api.post("/auth/register", form);

      alert("Registered Successfully");
      navigate("/");
    } catch (error) {
  alert(
    error.response?.data?.message ||
    error.response?.data ||
    "Registration Failed"
  );
}
  };

  return (
    <div className="auth-page">
      <nav className="auth-navbar">
        <div className="nav-left">
          <img src={logo} alt="EVA Logo" className="nav-logo" />
        </div>

        <div className="nav-center">
          <h1 className="nav-heading">Welcome to EVA IT CS ERP</h1>
        </div>
      </nav>

      <main className="auth-main">
        <div className="auth-box">
          <h2>Quick Registration</h2>

          <h4 onClick={() => navigate("/")}>Already registered? Login</h4>

          <input
            placeholder="First Name"
            onChange={(e) =>
              setForm({
                ...form,
                firstName: e.target.value,
              })
            }
          />
      {/* <input
            placeholder="Middle Name"
            onChange={(e) =>
              setForm({
                ...form,
                middleName: e.target.value,
              })
            }
          /> */}
          <input
            placeholder="Last Name"
            onChange={(e) =>
              setForm({
                ...form,
                lastName: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="tel"
            placeholder="Phone"
            maxLength="10"
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");

              if (value.length <= 10) {
                setForm({
                  ...form,
                  phone: value,
                });
              }
            }}
          />
     <div className="password-container">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={form.password}
    onChange={(e) =>
      setForm({
        ...form,
        password: e.target.value,
      })
    }
  />

  <span
    className="eye-icon"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>
<div className="password-container">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    value={form.confirmPassword}
    onChange={(e) =>
      setForm({
        ...form,
        confirmPassword: e.target.value,
      })
    }
  />

  <span
    className="eye-icon"
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
  >
    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

          <button onClick={register} style={{background:"linear-gradient(135deg, #0f2b5c 0%, #1a52e1 100%)"}}>Register</button>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
