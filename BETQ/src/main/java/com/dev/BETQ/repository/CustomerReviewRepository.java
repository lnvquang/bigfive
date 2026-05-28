package com.dev.BETQ.repository;

import com.dev.BETQ.entity.CustomerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerReviewRepository
        extends JpaRepository<CustomerReview, Long> {

}
