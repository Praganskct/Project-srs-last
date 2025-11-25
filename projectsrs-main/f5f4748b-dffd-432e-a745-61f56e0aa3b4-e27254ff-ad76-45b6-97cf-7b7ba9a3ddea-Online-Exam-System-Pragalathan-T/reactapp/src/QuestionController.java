package com.examly.springapp.controller;

import com.examly.springapp.model.Exam;
import com.examly.springapp.model.Question;
import com.examly.springapp.repository.ExamRepository;
import com.examly.springapp.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/exams/{examId}/questions")
@PreAuthorize("hasRole('ADMIN')")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    /**
     * Retrieves all questions for a specific exam.
     * @param examId The ID of the exam.
     * @return A list of questions for the given exam.
     */
    @GetMapping
    public ResponseEntity<List<Question>> getQuestionsForExam(@PathVariable Long examId) {
        if (!examRepository.existsById(examId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(questionRepository.findByExamId(examId));
    }

    /**
     * Adds a new question to an existing exam.
     * @param examId The ID of the exam to add the question to.
     * @param question The question object to add.
     * @return The created question.
     */
    @PostMapping
    public ResponseEntity<Question> addQuestionToExam(@PathVariable Long examId, @Valid @RequestBody Question question) {
        return examRepository.findById(examId).map(exam -> {
            question.setExam(exam);
            return ResponseEntity.ok(questionRepository.save(question));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Updates an existing question.
     * @param examId The ID of the parent exam.
     * @param questionId The ID of the question to update.
     * @param questionDetails The new details for the question.
     * @return The updated question.
     */
    @PutMapping("/{questionId}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long examId, @PathVariable Long questionId, @Valid @RequestBody Question questionDetails) {
        if (!examRepository.existsById(examId)) {
            return ResponseEntity.notFound().build();
        }
        return questionRepository.findById(questionId).map(question -> {
            question.setQuestionText(questionDetails.getQuestionText());
            question.setOptionA(questionDetails.getOptionA());
            question.setOptionB(questionDetails.getOptionB());
            question.setOptionC(questionDetails.getOptionC());
            question.setOptionD(questionDetails.getOptionD());
            question.setCorrectAnswer(questionDetails.getCorrectAnswer());
            return ResponseEntity.ok(questionRepository.save(question));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes a question from an exam.
     * @param examId The ID of the parent exam.
     * @param questionId The ID of the question to delete.
     * @return A 200 OK response if successful.
     */
    @DeleteMapping("/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long examId, @PathVariable Long questionId) {
        return questionRepository.findByIdAndExamId(questionId, examId).map(question -> {
            questionRepository.delete(question);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}