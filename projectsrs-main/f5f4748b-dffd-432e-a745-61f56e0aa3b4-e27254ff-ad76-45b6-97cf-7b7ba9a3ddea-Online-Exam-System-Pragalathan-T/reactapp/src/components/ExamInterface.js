import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/api";

export default function ExamInterface(props) {
  const runtimeLocation = useLocation();
  const location = props.location || runtimeLocation;
  const { questions, studentExamId } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!questions || questions.length === 0) {
    return <div>No questions found.</div>;
  }

  const current = questions[currentIndex];

  const handleChange = (e) => {
    setAnswers({ ...answers, [current.questionId]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      for (const q of questions) {
        await api.submitAnswer(studentExamId, {
          questionId: q.questionId,
          selectedOption: answers[q.questionId] || null,
        });
      }
      await api.completeExam(studentExamId);
    } catch {
      setError("Failed to submit exam. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2>{current.questionText}</h2>
      <form>
        {["A", "B", "C", "D"].map((opt) => (
          <label key={opt} htmlFor={`${opt}-${current.questionId}`}>
            <input
              id={`${opt}-${current.questionId}`}
              type="radio"
              name={`option-${current.questionId}`}
              value={opt}
              checked={answers[current.questionId] === opt}
              onChange={handleChange}
              aria-label={`Option ${opt}`}
            />
            {current[`option${opt}`]}
          </label>
        ))}
      </form>

      <button
        onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
        disabled={currentIndex === 0}
      >
        Previous
      </button>
      <button
        onClick={() =>
          currentIndex < questions.length - 1 &&
          setCurrentIndex(currentIndex + 1)
        }
        disabled={currentIndex === questions.length - 1}
      >
        Next
      </button>

      {currentIndex === questions.length - 1 && (
        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Exam"}
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}