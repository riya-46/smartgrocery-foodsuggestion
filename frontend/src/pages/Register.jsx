import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [msg, setMsg] = useState("");

  const sendOtp = async () => {
    if (!email) {
      setMsg("Please enter email first");
      return;
    }

    const res = await api.post("/auth/send-otp", { email });
    if (res.data.success) {
      setOtpSent(true);
      setMsg("OTP sent to your email");
    } else {
      setMsg(res.data.message);
    }
  };

  const verifyAndRegister = async (e) => {
    e.preventDefault();

    const res = await api.post("/auth/verify-otp", {
      name,
      email,
      password,
      otp,
    });

    if (res.data.success) {
      alert("Registration successful. Please login.");
      navigate("/login");
    } else {
      setMsg(res.data.message);
    }
  };

  return (
    <div className="container">
      <div className="card auth-card">
        <h2>Register</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        {!otpSent && (
          <button type="button" className="secondary" onClick={sendOtp}>
            Send OTP
          </button>
        )}

        {otpSent && (
          <form onSubmit={verifyAndRegister}>
            <br />
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <br /><br />

            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />

            <button className="primary">
              Verify OTP & Register
            </button>
          </form>
        )}

        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}

        <p style={{ marginTop: 12 }}>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
