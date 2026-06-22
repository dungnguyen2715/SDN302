import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../app/store";
import { useState } from "react";

function QuizDetailPage() {
  const { id } = useParams();
  console.log("id quiz: ", id);

  const { quizzes } = useSelector((state: RootState) => state.quiz);
  console.log("quiz: ", quizzes);

  const quiz = quizzes.find((q) => q._id === id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quiz) return;

    if (Object.keys(answers).length !== quiz.questions.length) {
      alert("Please answer all questions");
      return;
    }

    let totalScore = 0;

    quiz.questions.forEach((question) => {
      const selectedAnswer = answers[question._id];

      if (selectedAnswer === question.correctAnswerIndex) {
        totalScore++;
      }
    });

    setScore(totalScore);
  };

  if (!quiz) {
    return <div className="container mt-4">Quiz not found</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{quiz.title}</h2>

      <p>{quiz.description}</p>

      <hr />

      {quiz.questions.map((question, index) => (
        <div key={question._id} className="card mb-3">
          <div className="card-body">
            <h5>Question {index + 1}</h5>

            <p>{question.text}</p>

            <div>
              {question.options.map((option, i) => (
                <div className="form-check" key={i}>
                  <input
                    type="radio"
                    className="form-check-input"
                    name={question._id}
                    checked={answers[question._id] === i}
                    onChange={() => handleSelectAnswer(question._id, i)}
                  />

                  <label className="form-check-label">{option}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <hr />

      <button className="btn btn-success" onClick={handleSubmitQuiz}>
        Submit Quiz
      </button>
      {score !== null && (
        <div className="alert alert-info mt-3">
          <h4>
            Your Score: {score} / {quiz.questions.length}
          </h4>
        </div>
      )}
    </div>
  );
}

export default QuizDetailPage;
