package com.dev.BETQ.repository;

import com.dev.BETQ.entity.CustomerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerReviewRepository
        extends JpaRepository<CustomerReview, Long> {
    List<CustomerReview> findByUser_IdOrderByCreatedAtDesc(Long userId);
    Optional<CustomerReview> findByIdAndUser_Id(
            Long reviewId,
            Long userId
    );
}
