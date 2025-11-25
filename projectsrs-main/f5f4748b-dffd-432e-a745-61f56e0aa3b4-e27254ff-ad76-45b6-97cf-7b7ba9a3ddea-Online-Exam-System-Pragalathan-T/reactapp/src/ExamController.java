package com.examly.springapp.controller;

import com.examly.springapp.model.Exam;
import com.examly.springapp.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/exams")
@PreAuthorize("hasRole('ADMIN')")
public class ExamController {

    @Autowired
    private ExamRepository examRepository;

    @GetMapping
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @PostMapping
    public Exam createExam(@Valid @RequestBody Exam exam) {
        return examRepository.save(exam);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable(value = "id") Long examId) {
        return examRepository.findById(examId)
                .map(exam -> ResponseEntity.ok().body(exam))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable(value = "id") Long examId,
                                           @Valid @RequestBody Exam examDetails) {
        return examRepository.findById(examId)
                .map(exam -> {
                    exam.setTitle(examDetails.getTitle());
                    exam.setDescription(examDetails.getDescription());
                    exam.setStatus(examDetails.getStatus());
                    Exam updatedExam = examRepository.save(exam);
                    return ResponseEntity.ok(updatedExam);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable(value = "id") Long examId) {
        return examRepository.findById(examId).map(exam -> {
            examRepository.delete(exam);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping
    public ResponseEntity<?> deleteExams(@RequestBody List<Long> ids) {
        examRepository.deleteAllById(ids);
        return ResponseEntity.ok().build();
    }
}