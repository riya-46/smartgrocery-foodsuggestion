import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔥 FAKE LOGIN (NO BACKEND)
    localStorage.setItem("sg_token", "dummy-token");
    localStorage.setItem(
      "sg_user",
      JSON.stringify({ email })
    );

    // simulate delay (optional)
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="container">
      <div className="card auth-card">
        <h2>Login</h2>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br /><br />

          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
