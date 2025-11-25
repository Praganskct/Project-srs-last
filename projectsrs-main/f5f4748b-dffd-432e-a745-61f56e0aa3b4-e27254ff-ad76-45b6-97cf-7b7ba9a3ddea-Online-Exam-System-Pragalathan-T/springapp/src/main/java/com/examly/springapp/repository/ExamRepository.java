package com.examly.springapp.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Exam;

@Repository
public interface ExamRepository extends PagingAndSortingRepository<Exam, Long> {
}