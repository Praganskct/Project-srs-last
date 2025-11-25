package com.examly.springapp.controller;

import com.examly.springapp.model.Exam;
import com.examly.springapp.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/exams")
@PreAuthorize("hasRole('ADMIN')")
public class ExamController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ExamController.class);

    @Autowired
    private ExamRepository examRepository;

    /**
     * Retrieves all exams.
     * @return a list of all exams.
     */
    @GetMapping
    public Page<Exam> getAllExams(Pageable pageable) {
        return examRepository.findAll(pageable);
    }

    /**
     * Creates a new exam.
     * @param exam The exam object to create.
     * @return the created exam.
     */
    @PostMapping
    public Exam createExam(@Valid @RequestBody Exam exam) {
        Exam newExam = examRepository.save(exam);
        logger.info("User '{}' created exam with ID: {}", getUsername(), newExam.getId());
        return newExam;
    }

    /**
     * Retrieves a single exam by its ID.
     * @param examId The ID of the exam to retrieve.
     * @return a ResponseEntity containing the exam if found, or 404 Not Found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable(value = "id") Long examId) {
        return examRepository.findById(examId)
                .map(exam -> ResponseEntity.ok().body(exam))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Updates an existing exam.
     * @param examId The ID of the exam to update.
     * @param examDetails The new details for the exam.
     * @return a ResponseEntity containing the updated exam if found, or 404 Not Found.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable(value = "id") Long examId,
                                           @Valid @RequestBody Exam examDetails) {
        return examRepository.findById(examId)
                .map(exam -> {
                    exam.setTitle(examDetails.getTitle());
                    exam.setDescription(examDetails.getDescription());
                    exam.setStatus(examDetails.getStatus());
                    Exam updatedExam = examRepository.save(exam);
                    logger.info("User '{}' updated exam with ID: {}", getUsername(), updatedExam.getId());
                    return ResponseEntity.ok(updatedExam);
                }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes a single exam by its ID.
     * @param examId The ID of the exam to delete.
     * @return a ResponseEntity with 200 OK if successful, or 404 Not Found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable(value = "id") Long examId) {
        return examRepository.findById(examId).map(exam -> {
            logger.info("User '{}' deleted exam with ID: {}", getUsername(), examId);
            examRepository.delete(exam);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes multiple exams in a single request.
     * @param ids A list of exam IDs to delete.
     * @return a ResponseEntity with 200 OK.
     */
    @DeleteMapping
    public ResponseEntity<?> deleteExams(@RequestBody List<Long> ids) {
        logger.info("User '{}' initiated bulk delete for exam IDs: {}", getUsername(), ids);
        examRepository.deleteAllById(ids);
        return ResponseEntity.ok().build();
    }

    private String getUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}