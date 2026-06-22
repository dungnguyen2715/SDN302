import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginAPI } from "../features/auth/authAPI";

import { loginSuccess, setError, setLoading } from "../features/auth/authSlice";

function LoginPage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const data = await loginAPI({
        username,
        password,
      });

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        }),
      );

      if (data.user.admin) {
        navigate("/admin");
      } else {
        navigate("/quizzes");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || "Login failed"));

      alert(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="mb-4 text-center">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>

            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>

            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="mt-3 text-center">
          <Link to="/signup">Don't have an account? Signup</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
