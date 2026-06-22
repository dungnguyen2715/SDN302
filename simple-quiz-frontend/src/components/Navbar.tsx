import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    dispatch(logout());

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand">Simple Quiz App</span>
        {user && (
          <div className="d-flex align-items-center gap-3">
            <span className="text-white">Welcome, {user.username}</span>

            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}{" "}
      </div>
    </nav>
  );
}

export default Navbar;
