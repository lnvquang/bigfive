package com.dev.BETQ.service;

import com.dev.BETQ.dto.response.*;
import com.dev.BETQ.entity.User;
import com.dev.BETQ.repository.CustomerReviewRepository;
import com.dev.BETQ.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CustomerReviewRepository customerReviewRepository;

    public PageResponse<UserResponse> getUsers(
            int page,
            int size,
            String keyword
    ) {
        Pageable pageable =
                PageRequest.of(page, size);
        Page<User> userPage;
        if (keyword == null || keyword.isBlank()) {
            userPage =
                    userRepository.findByRole("CUSTOMER", pageable);
        } else {
            userPage =
                    userRepository
                            .findCustomers(
                                    "CUSTOMER",
                                    keyword,
                                    pageable
                            );
        }

        List<UserResponse> users =
                userPage.getContent()
                        .stream()
                        .map(user -> UserResponse.builder()
                                .id(user.getId())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .email(user.getEmail())
                                .phone(user.getPhone())
                                .role(user.getRole())
                                .createdAt(user.getCreatedAt())
                                .build())
                        .toList();

        return PageResponse.<UserResponse>builder()
                .content(users)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    public DashboardResponse getDashboard() {

        return DashboardResponse.builder()
                .totalUsers(
                        userRepository.countByRole("CUSTOMER")
                )
                .totalReviews(
                        customerReviewRepository.count()
                )
                .positiveReviews(
                        customerReviewRepository.countPositiveReviews()
                )
                .neutralReviews(
                        customerReviewRepository.countNeutralReviews()
                )
                .negativeReviews(
                        customerReviewRepository.countNegativeReviews()
                )
                .build();
    }

    public BigFiveCountsResponse getBigFiveCounts() {

        BigFiveCountsResponse result =
                customerReviewRepository.getBigFiveStatistics();
        return BigFiveCountsResponse.builder()
                .openness(
                        result.getOpenness()
                )
                .conscientiousness(
                        result.getConscientiousness()
                )
                .extraversion(
                        result.getExtraversion()
                )
                .agreeableness(
                        result.getAgreeableness()
                )
                .neuroticism(
                        result.getNeuroticism()
                )
                .build();
    }
    public SentimentResponse getSentiment() {

        SentimentResponse result =
                customerReviewRepository.getSentimentStatistics();

        return SentimentResponse.builder()
                .negative(result.getNegative())
                .neutral(result.getNeutral())
                .positive(result.getPositive())
                .build();
    }
    public List<ReviewByDateResponse> getReviewStatisticsByDate() {
        return customerReviewRepository.getReviewStatisticsByDate();
    }
}
