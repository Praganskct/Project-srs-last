import React, { useState } from "react";
import api from "../utils/api";
import { validateExamData, validateQuestionData } from "../utils/validation";
import { ERROR_MESSAGES } from "../utils/constants";

export default function ExamCreator() {
  const [examData, setExamData] = useState({ title: "", description: "", duration: "", topic: "", difficulty: "EASY", expiryDate: "", timeLimit: "", maxAttempts: "", feedback: "", imageUrl: "" });
  const [errors, setErrors] = useState({});
  const [examId, setExamId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [questionData, setQuestionData] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    marks: "",
  });
  const [questions, setQuestions] = useState([]);

  const extraExamValidation = (e) => {
    const eerrs = {};
    if (examData.maxAttempts && (isNaN(examData.maxAttempts) || Number(examData.maxAttempts) < 0)) eerrs.maxAttempts = 'Max attempts must be >= 0';
    if (examData.timeLimit && (isNaN(examData.timeLimit) || Number(examData.timeLimit) < 0)) eerrs.timeLimit = 'Time limit must be >= 0';
    return eerrs;
  };

  const handleSaveExam = async () => {
    const examErrors = { ...validateExamData(examData), ...extraExamValidation() };
    if (Object.keys(examErrors).length) {
      setErrors(examErrors);
      return;
    }
    try {
      setSaving(true);
      const payload = {
        title: examData.title,
        description: examData.description,
        duration: Number(examData.duration),
        createdBy: examData.createdBy || 'teacher1',
        isActive: false,
        topic: examData.topic || null,
        difficulty: examData.difficulty || null,
        expiryDate: examData.expiryDate || null,
        timeLimit: examData.timeLimit ? Number(examData.timeLimit) : null,
        maxAttempts: examData.maxAttempts ? Number(examData.maxAttempts) : null,
        feedback: examData.feedback || null,
        imageUrl: examData.imageUrl || null,
      };
      const res = await api.createExam(payload);
      setExamId(res.data.examId);
      setErrors({});
    } catch {
      setErrors({ general: ERROR_MESSAGES.CREATE_EXAM_FAILED });
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async () => {
    const qErrors = validateQuestionData(questionData);
    if (Object.keys(qErrors).length) {
      setErrors(qErrors);
      return;
    }
    try {
      await api.addQuestionToExam(examId, questionData);
      setQuestions([...questions, { ...questionData }]);
      setQuestionData({
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        marks: "",
      });
      setErrors({});
    } catch {
      setErrors({ general: ERROR_MESSAGES.ADD_QUESTION_FAILED });
    }
  };

  return (
    <div>
      <h1>Create Exam</h1>
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
      <div>
        <label>
          Title
          <input
            aria-label="title"
            value={examData.title}
            onChange={(e) => setExamData({ ...examData, title: e.target.value })}
          />
        </label>
        {errors.title && <span style={{ color: "red" }}>{errors.title}</span>}
      </div>
      <div>
        <label>
          Description
          <input
            aria-label="description"
            value={examData.description}
            onChange={(e) => setExamData({ ...examData, description: e.target.value })}
          />
        </label>
        {errors.description && <span style={{ color: "red" }}>{errors.description}</span>}
      </div>
      <div>
        <label>
          Duration
          <input
            aria-label="duration"
            type="number"
            value={examData.duration}
            onChange={(e) => setExamData({ ...examData, duration: e.target.value })}
          />
        </label>
        {errors.duration && <span style={{ color: "red" }}>{errors.duration}</span>}
      </div>

      <div>
        <label>Topic
          <input value={examData.topic} onChange={(e)=>setExamData({...examData, topic:e.target.value})} />
        </label>
      </div>
      <div>
        <label>Difficulty
          <select value={examData.difficulty} onChange={(e)=>setExamData({...examData, difficulty:e.target.value})}>
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
        </label>
      </div>
      <div>
        <label>Expiry Date
          <input type="datetime-local" value={examData.expiryDate} onChange={(e)=>setExamData({...examData, expiryDate:e.target.value})} />
        </label>
      </div>
      <div>
        <label>Time Limit (seconds)
          <input type="number" value={examData.timeLimit} onChange={(e)=>setExamData({...examData, timeLimit:e.target.value})} />
        </label>
        {errors.timeLimit && <span style={{ color: "red" }}>{errors.timeLimit}</span>}
      </div>
      <div>
        <label>Max Attempts
          <input type="number" value={examData.maxAttempts} onChange={(e)=>setExamData({...examData, maxAttempts:e.target.value})} />
        </label>
        {errors.maxAttempts && <span style={{ color: "red" }}>{errors.maxAttempts}</span>}
      </div>
      <div>
        <label>Feedback
          <textarea value={examData.feedback} onChange={(e)=>setExamData({...examData, feedback:e.target.value})} />
        </label>
      </div>
      <div>
        <label>Image URL
          <input value={examData.imageUrl} onChange={(e)=>setExamData({...examData, imageUrl:e.target.value})} />
        </label>
      </div>

      <button onClick={handleSaveExam}>Save Exam</button>

      {(examId || saving) && (
        <div>
          <h2>Add a Question</h2>
          <div>
            <label>
              Question Text
              <input
                aria-label="question text"
                value={questionData.text}
                onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
              />
            </label>
            {errors.text && <span style={{ color: "red" }}>{errors.text}</span>}
          </div>
          <div>
            <label>
              Option A
              <input
                aria-label="option a"
                value={questionData.optionA}
                onChange={(e) => setQuestionData({ ...questionData, optionA: e.target.value })}
              />
            </label>
            {errors.optionA && <span style={{ color: "red" }}>{errors.optionA}</span>}
          </div>
          <div>
            <label>
              Option B
              <input
                aria-label="option b"
                value={questionData.optionB}
                onChange={(e) => setQuestionData({ ...questionData, optionB: e.target.value })}
              />
            </label>
            {errors.optionB && <span style={{ color: "red" }}>{errors.optionB}</span>}
          </div>
          <div>
            <label>
              Option C
              <input
                aria-label="option c"
                value={questionData.optionC}
                onChange={(e) => setQuestionData({ ...questionData, optionC: e.target.value })}
              />
            </label>
            {errors.optionC && <span style={{ color: "red" }}>{errors.optionC}</span>}
          </div>
          <div>
            <label>
              Option D
              <input
                aria-label="option d"
                value={questionData.optionD}
                onChange={(e) => setQuestionData({ ...questionData, optionD: e.target.value })}
              />
            </label>
            {errors.optionD && <span style={{ color: "red" }}>{errors.optionD}</span>}
          </div>
          <div>
            <label>
              Correct Answer
              <input
                aria-label="correct answer"
                value={questionData.correctAnswer}
                onChange={(e) =>
                  setQuestionData({ ...questionData, correctAnswer: e.target.value.toUpperCase() })
                }
                maxLength={1}
              />
            </label>
            {errors.correctAnswer && (
              <span style={{ color: "red" }}>{errors.correctAnswer}</span>
            )}
          </div>
          <div>
            <label>
              Marks
              <input
                aria-label="marks"
                type="number"
                value={questionData.marks}
                onChange={(e) => setQuestionData({ ...questionData, marks: e.target.value })}
              />
            </label>
            {errors.marks && <span style={{ color: "red" }}>{errors.marks}</span>}
          </div>
          <button onClick={handleAddQuestion}>Add Question</button>

          <div>
            <h3>Questions Added: {questions.length}</h3>
            <ul>
              {questions.map((q, idx) => (
                <li key={idx}>{q.text}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}