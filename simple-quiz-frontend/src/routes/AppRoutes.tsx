import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import QuizListPage from "../pages/QuizListPage";
import QuizDetailPage from "../pages/QuizDetailPage";
import ResultPage from "../pages/ResultPage";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Navbar from "../components/Navbar";
import QuestionPage from "../pages/QuestionPage";

function AppRoutes() {
  const location = useLocation();
  
  // Kiểm tra xem user có đang ở trang admin không (bất kỳ route nào bắt đầu bằng /admin)
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* CHỈ hiển thị Navbar thường nếu không phải là trang Admin */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes/:id"
          element={
            <ProtectedRoute>
              <QuizDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />

        {/* --- CÁC ROUTE CỦA ADMIN --- */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <QuestionPage />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default AppRoutes;