import React, { useState } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { handleLogin, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.warning("Please enter username & password");
      return;
    }

    const toastId = toast.loading("Logging in...");

    try {
      const res = await handleLogin(username, password);

      toast.update(toastId, {
        render: "Welcome back 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      navigate("/", { replace: true });

    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "Login failed ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form onSubmit={handleSubmit}>
          <h1>Login User</h1>

          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter username"
            value={username}
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter password"
            value={password}
          />

          <button className="btn">Login</button>

          <p>
            Don't have an account?{" "}
            <Link className="toggleAuth" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;