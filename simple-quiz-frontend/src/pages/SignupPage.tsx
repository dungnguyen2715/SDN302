import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { signupAPI } from "../features/auth/signupAPI";

function SignupPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signupAPI({
        username,
        password,
      });

      alert("Signup successful!");

      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="mb-4 text-center">Signup</h2>

        <form onSubmit={handleSignup}>
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

          <button className="btn btn-success w-100" type="submit">
            Signup
          </button>
        </form>

        <div className="mt-3 text-center">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
