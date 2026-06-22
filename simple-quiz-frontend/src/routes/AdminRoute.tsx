import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../app/store";
import AdminNavbar from "../components/AdminNavbar";

interface Props {
  children: React.ReactNode;
}

function AdminRoute({ children }: Props) {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user?.admin) {
    return <Navigate to="/quizzes" />;
  }

  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}

export default AdminRoute;
