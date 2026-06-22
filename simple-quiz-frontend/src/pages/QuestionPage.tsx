import { useEffect, useState } from "react";
import {
  getAllQuestionsAPI,
  createQuestionAPI,
  updateQuestionAPI,
  deleteQuestionAPI,
} from "../features/question/questionAPI"; // Đảm bảo đường dẫn này khớp với project của bạn

// Khai báo type cho dữ liệu Question
interface QuestionType {
  _id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  keywords?: string[];
}

function QuestionPage() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  // Các State quản lý Form
  const [text, setText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [keywords, setKeywords] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );

  // 1. Hàm này giữ nguyên, chỉ dùng để gọi lại sau khi bạn Thêm/Sửa/Xóa câu hỏi
  const fetchQuestions = async () => {
    try {
      const data = await getAllQuestionsAPI();
      setQuestions(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách câu hỏi:", error);
    }
  };

  // 2. Viết trực tiếp logic lấy data vào trong useEffect bằng .then()
  // Linter sẽ hiểu rõ đây là hành động bất đồng bộ và không báo lỗi nữa
  useEffect(() => {
    getAllQuestionsAPI()
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh sách câu hỏi:", error);
      });
  }, []);

  // Xử lý khi người dùng nhập nội dung cho từng đáp án
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Làm mới form sau khi lưu hoặc hủy
  const resetForm = () => {
    setText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswerIndex(0);
    setKeywords("");
    setEditingQuestionId(null);
  };

  // Xử lý Tạo mới hoặc Cập nhật câu hỏi
  const handleSaveQuestion = async () => {
    // Validate form cơ bản
    if (!text || options.some((opt) => opt.trim() === "")) {
      alert("Vui lòng nhập đầy đủ nội dung câu hỏi và cả 4 đáp án!");
      return;
    }

    const payload = {
      text,
      options,
      correctAnswerIndex,
      // Chuyển chuỗi keywords cách nhau bằng dấu phẩy thành mảng
      keywords: keywords
        ? keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k !== "")
        : [],
    };

    try {
      if (editingQuestionId) {
        await updateQuestionAPI(editingQuestionId, payload);
        alert("Cập nhật câu hỏi thành công!");
      } else {
        await createQuestionAPI(payload);
        alert("Tạo câu hỏi mới thành công!");
      }

      resetForm();
      fetchQuestions(); // Cập nhật lại bảng danh sách
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi lưu câu hỏi.");
    }
  };

  // Đưa dữ liệu của 1 câu hỏi lên Form để chỉnh sửa
  const handleEditQuestion = (question: QuestionType) => {
    setEditingQuestionId(question._id);
    setText(question.text);

    // Đảm bảo mảng options luôn có đủ 4 ô input trên form
    const paddedOptions = [...question.options];
    while (paddedOptions.length < 4) {
      paddedOptions.push("");
    }
    setOptions(paddedOptions.slice(0, 4));

    setCorrectAnswerIndex(question.correctAnswerIndex);
    setKeywords(
      question.keywords && question.keywords.length > 0
        ? question.keywords.join(", ")
        : "",
    );
  };

  // Xử lý Xóa câu hỏi
  const handleDeleteQuestion = async (questionId: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa câu hỏi này khỏi hệ thống không?",
    );
    if (!confirmed) return;

    try {
      await deleteQuestionAPI(questionId);
      alert("Đã xóa câu hỏi thành công!");
      fetchQuestions(); // Cập nhật lại bảng
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi xóa câu hỏi.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Câu hỏi (Question Bank)</h2>
      </div>

      {/* --- FORM TẠO / SỬA CÂU HỎI --- */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-white">
          <h4 className="mb-0 text-primary">
            {editingQuestionId ? "Sửa Câu Hỏi" : "Tạo Câu Hỏi Mới"}
          </h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Nội dung câu hỏi</label>
            <textarea
              className="form-control"
              placeholder="Nhập nội dung câu hỏi của bạn..."
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Các đáp án</label>
            <p className="text-muted small mb-2">
              * Tích vào ô tròn bên trái để chỉ định đáp án đúng.
            </p>
            {options.map((option, index) => (
              <div key={index} className="input-group mb-2">
                <div className="input-group-text">
                  <input
                    className="form-check-input mt-0"
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswerIndex === index}
                    onChange={() => setCorrectAnswerIndex(index)}
                    title="Chọn làm đáp án đúng"
                  />
                </div>
                <input
                  type="text"
                  className={`form-control ${
                    correctAnswerIndex === index
                      ? "border-success bg-light"
                      : ""
                  }`}
                  placeholder={`Đáp án ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Từ khóa (Keywords)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ví dụ: HTML, CSS, Cơ bản (các từ khóa cách nhau bằng dấu phẩy)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <button
            className="btn btn-success me-2 px-4"
            onClick={handleSaveQuestion}
          >
            {editingQuestionId ? "Lưu Cập Nhật" : "Tạo Câu Hỏi"}
          </button>

          {editingQuestionId && (
            <button className="btn btn-secondary px-4" onClick={resetForm}>
              Hủy
            </button>
          )}
        </div>
      </div>

      {/* --- BẢNG DANH SÁCH CÂU HỎI --- */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "40%" }}>Câu hỏi</th>
                  <th style={{ width: "30%" }}>Đáp án đúng</th>
                  <th style={{ width: "15%" }}>Từ khóa</th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.length > 0 ? (
                  questions.map((q) => (
                    <tr key={q._id}>
                      <td className="align-middle">{q.text}</td>
                      <td className="align-middle">
                        <span className="badge bg-success text-wrap text-start lh-base">
                          {q.options[q.correctAnswerIndex] || "Chưa có"}
                        </span>
                      </td>
                      <td className="align-middle">
                        {q.keywords && q.keywords.length > 0
                          ? q.keywords.join(", ")
                          : "-"}
                      </td>
                      <td className="align-middle text-center">
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEditQuestion(q)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteQuestion(q._id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      Chưa có câu hỏi nào trong hệ thống. Hãy tạo câu hỏi đầu
                      tiên!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionPage;
