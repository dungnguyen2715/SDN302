import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../app/store";
import { useEffect, useState } from "react";
import { getAllQuizzesAPI } from "../features/quiz/quizAPI";
import { setQuizzes } from "../features/quiz/quizSlice";
import {
  createQuizAPI,
  deleteQuizAPI,
  updateQuizAPI,
} from "../features/quiz/adminQuizAPI";

function AdminPage() {
  const dispatch = useDispatch();

  const { quizzes } = useSelector((state: RootState) => state.quiz);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzesAPI();
        dispatch(setQuizzes(data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuizzes();
  }, [dispatch]);

  const handleSaveQuiz = async () => {
    try {
      if (editingQuizId) {
        await updateQuizAPI(editingQuizId, title, description);

        alert("Quiz updated");
      } else {
        await createQuizAPI(title, description);

        alert("Quiz created");
      }

      const data = await getAllQuizzesAPI();

      dispatch(setQuizzes(data));

      setTitle("");
      setDescription("");

      setEditingQuizId(null);
    } catch (error) {
      console.error(error);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditQuiz = (quiz: any) => {
    setEditingQuizId(quiz._id);

    setTitle(quiz.title);

    setDescription(quiz.description);
  };
  const handleDeleteQuiz = async (quizId: string) => {
    const confirmed = window.confirm("Delete this quiz?");

    if (!confirmed) return;

    try {
      await deleteQuizAPI(quizId);

      const data = await getAllQuizzesAPI();

      dispatch(setQuizzes(data));

      alert("Quiz deleted");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <div className="card mb-4 ">
          <div className="card-body">
            <h4>Create Quiz</h4>

            <input
              className="form-control mb-2"
              placeholder="Quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button className="btn btn-success" onClick={handleSaveQuiz}>
              {editingQuizId ? "Update Quiz" : "Create Quiz"}
            </button>
          </div>
        </div>{" "}
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Questions</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz._id}>
              <td>{quiz.title}</td>

              <td>{quiz.description}</td>

              <td>{quiz.questions.length}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditQuiz(quiz)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                >
                  Delete
                </button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
