package com.examly.springapp.repository;

import com.examly.springapp.model.Exam;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamRepository extends PagingAndSortingRepository<Exam, Long> {
}