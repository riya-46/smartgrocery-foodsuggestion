import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FoodForHealth from "./pages/FoodForHealth.jsx";

export default function App() {
  // 🔑 JWT token is the source of truth
  const token = localStorage.getItem("sg_token");

  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
         path="/food-for-health"
         element={
             localStorage.getItem("sg_token")
             ? <FoodForHealth />
             : <Navigate to="/login" /> }
      />
  
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
