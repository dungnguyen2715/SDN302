import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <>
      <div className="container mt-3">
        <div className="btn-group mb-4">
          <NavLink
            to="/admin"
            className="btn btn-outline-primary"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/quizzes"
            className="btn btn-outline-primary"
          >
            Manage Quizzes
          </NavLink>

          <NavLink
            to="/admin/questions"
            className="btn btn-outline-primary"
          >
            Manage Questions
          </NavLink>
        </div>

        <Outlet />
      </div>
    </>
  );
}

export default AdminLayout;