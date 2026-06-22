/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useEffect, useState } from "react";
import { getAllQuizzesAPI } from "../features/quiz/quizAPI";
import { setQuizzes } from "../features/quiz/quizSlice";
import {
  createQuizAPI,
  deleteQuizAPI,
  updateQuizAPI,
  addSingleQuestionToQuizAPI, // Đừng quên import hàm API mới này
} from "../features/quiz/adminQuizAPI";

function AdminPage() {
  const dispatch = useDispatch();

  // --- STATE CHO QUIZ ---
  const { quizzes } = useSelector((state: RootState) => state.quiz);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  // --- STATE CHO MODAL TẠO CÂU HỎI TRỰC TIẾP ---
  const [showModal, setShowModal] = useState(false);
  const [targetQuizId, setTargetQuizId] = useState<string | null>(null);
  
  // State form câu hỏi
  const [qText, setQText] = useState("");
  const [qOptions, setQOptions] = useState<string[]>(["", "", "", ""]);
  const [qCorrectAnswerIndex, setQCorrectAnswerIndex] = useState(0);
  const [qKeywords, setQKeywords] = useState("");

  // Fetch danh sách Quiz ban đầu
  useEffect(() => {
    getAllQuizzesAPI()
      .then((data) => dispatch(setQuizzes(data)))
      .catch((error) => console.error(error));
  }, [dispatch]);

  // ===================== LOGIC QUẢN LÝ QUIZ =====================
  const handleSaveQuiz = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Mô tả!");
      return;
    }
    try {
      if (editingQuizId) {
        await updateQuizAPI(editingQuizId, title, description);
        alert("Cập nhật Quiz thành công!");
      } else {
        await createQuizAPI(title, description);
        alert("Tạo Quiz mới thành công!");
      }
      const data = await getAllQuizzesAPI();
      dispatch(setQuizzes(data));
      resetQuizForm();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi lưu Quiz.");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditQuiz = (quiz: any) => {
    setEditingQuizId(quiz._id);
    setTitle(quiz.title);
    setDescription(quiz.description);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa Quiz này không?");
    if (!confirmed) return;
    try {
      await deleteQuizAPI(quizId);
      const data = await getAllQuizzesAPI();
      dispatch(setQuizzes(data));
      alert("Đã xóa Quiz thành công!");
    } catch (error) {
      console.error(error);
    }
  };

  const resetQuizForm = () => {
    setEditingQuizId(null);
    setTitle("");
    setDescription("");
  };

  // ===================== LOGIC TẠO CÂU HỎI VÀO QUIZ =====================
  
  // Mở modal và lưu lại ID của Quiz đang được chọn
  const handleOpenAddQuestionModal = (quizId: string) => {
    setTargetQuizId(quizId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTargetQuizId(null);
    // Reset form câu hỏi
    setQText("");
    setQOptions(["", "", "", ""]);
    setQCorrectAnswerIndex(0);
    setQKeywords("");
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...qOptions];
    newOptions[index] = value;
    setQOptions(newOptions);
  };

  const handleSaveNewQuestion = async () => {
    if (!qText.trim() || qOptions.some((opt) => opt.trim() === "")) {
      alert("Vui lòng nhập đầy đủ nội dung câu hỏi và 4 đáp án!");
      return;
    }

    if (!targetQuizId) return;

    const payload = {
      text: qText,
      options: qOptions,
      correctAnswerIndex: qCorrectAnswerIndex,
      keywords: qKeywords ? qKeywords.split(",").map((k) => k.trim()).filter(k => k !== "") : [],
    };

    try {
      await addSingleQuestionToQuizAPI(targetQuizId, payload);
      alert("Đã thêm câu hỏi mới vào Quiz thành công!");
      
      // Tải lại danh sách Quiz để cập nhật số lượng câu hỏi mới
      const data = await getAllQuizzesAPI();
      dispatch(setQuizzes(data));
      
      handleCloseModal();
    } catch (error: any) {
      console.error(error.message);
      alert("Đã xảy ra lỗi khi thêm câu hỏi vào Quiz.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Quiz (Quiz Bank)</h2>
      </div>

      {/* --- FORM TẠO / SỬA QUIZ --- */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-white">
          <h4 className="mb-0 text-primary">
            {editingQuizId ? "Sửa Quiz" : "Tạo Quiz Mới"}
          </h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Tiêu đề Quiz</label>
            <input
              className="form-control"
              placeholder="Nhập tiêu đề cho bài Quiz..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Mô tả</label>
            <textarea
              className="form-control"
              placeholder="Nhập mô tả chi tiết..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button className="btn btn-success me-2 px-4" onClick={handleSaveQuiz}>
            {editingQuizId ? "Lưu Cập Nhật" : "Tạo Quiz"}
          </button>
          {editingQuizId && (
            <button className="btn btn-secondary px-4" onClick={resetQuizForm}>
              Hủy
            </button>
          )}
        </div>
      </div>

      {/* --- BẢNG DANH SÁCH QUIZ --- */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "20%" }}>Tiêu đề</th>
                  <th style={{ width: "35%" }}>Mô tả</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Số câu hỏi</th>
                  <th style={{ width: "30%", textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <tr key={quiz._id}>
                      <td className="align-middle fw-medium">{quiz.title}</td>
                      <td className="align-middle">{quiz.description}</td>
                      <td className="align-middle text-center">
                        <span className="badge bg-info text-dark">
                          {quiz.questions?.length || 0} câu
                        </span>
                      </td>
                      <td className="align-middle text-center">
                        {/* Nút gọi Modal Thêm câu hỏi */}
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleOpenAddQuestionModal(quiz._id)}
                        >
                          + Thêm Câu Hỏi
                        </button>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEditQuiz(quiz)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteQuiz(quiz._id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      Chưa có bài Quiz nào trong hệ thống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL TẠO CÂU HỎI --- */}
      {/* Sử dụng d-block để modal tự hiển thị khi showModal = true */}
      {showModal && (
        <div 
          className="modal show d-block" 
          tabIndex={-1} 
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // Làm mờ màn hình phía sau
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              
              <div className="modal-header bg-light">
                <h5 className="modal-title text-primary fw-bold">Thêm câu hỏi mới vào Quiz</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Nội dung câu hỏi</label>
                  <textarea
                    className="form-control"
                    placeholder="Nhập nội dung câu hỏi..."
                    rows={3}
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Các đáp án</label>
                  <p className="text-muted small mb-2">* Tích vào ô tròn để chọn đáp án đúng.</p>
                  {qOptions.map((option, index) => (
                    <div key={index} className="input-group mb-2">
                      <div className="input-group-text">
                        <input
                          className="form-check-input mt-0"
                          type="radio"
                          name="quizCorrectAnswer"
                          checked={qCorrectAnswerIndex === index}
                          onChange={() => setQCorrectAnswerIndex(index)}
                        />
                      </div>
                      <input
                        type="text"
                        className={`form-control ${
                          qCorrectAnswerIndex === index ? "border-success bg-light" : ""
                        }`}
                        placeholder={`Đáp án ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Từ khóa (Keywords)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: HTML, CSS (cách nhau bằng dấu phẩy)"
                    value={qKeywords}
                    onChange={(e) => setQKeywords(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary px-4" onClick={handleSaveNewQuestion}>
                  Lưu Câu Hỏi
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPage;