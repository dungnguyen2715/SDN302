import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllQuizzesAPI } from "../features/quiz/quizAPI";

import { setQuizzes } from "../features/quiz/quizSlice";

import type { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";

function QuizListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { quizzes } = useSelector((state: RootState) => state.quiz);

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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quiz List</h2>

      <div className="row">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5>

                <p className="card-text">{quiz.description}</p>

                <p>Questions: {quiz.questions.length}</p>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/quizzes/${quiz._id}`)}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizListPage;
