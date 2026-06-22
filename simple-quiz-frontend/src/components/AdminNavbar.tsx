import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// Import action logout của bạn ở đây (giả sử tên là logout)
// import { logout } from "../features/auth/authSlice"; 

function AdminNavbar() {
  const location = useLocation();
//   const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // dispatch(logout()); // Gọi action xóa state user
    // Nếu có token ở localStorage, bạn có thể xóa ở đây: localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand text-warning" to="/admin">
          Admin Portal
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse d-flex justify-content-between" id="adminNavbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/admin" ? "active fw-bold" : ""
                }`}
                to="/admin"
              >
                Quản lý Quiz
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/admin/questions" ? "active fw-bold" : ""
                }`}
                to="/admin/questions"
              >
                Quản lý Câu hỏi
              </Link>
            </li>
          </ul>

          {/* Nút Logout dành riêng cho Admin */}
          <button 
            className="btn btn-outline-light btn-sm" 
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;