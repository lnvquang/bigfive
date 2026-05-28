package com.dev.BETQ.service;

import com.dev.BETQ.dto.request.ReviewRequest;
import com.dev.BETQ.dto.response.MultitaskResponse;
import com.dev.BETQ.dto.response.PersonalityResponse;
import com.dev.BETQ.dto.response.ReviewAnalysisResponse;
import com.dev.BETQ.dto.response.ReviewHistoryResponse;
import com.dev.BETQ.entity.CustomerReview;
import com.dev.BETQ.repository.CustomerReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.List;


@Service
public class ReviewService {
    @Autowired
    private CustomerReviewRepository repository;
    @Autowired
    private RestTemplate restTemplate = new RestTemplate();

    public ReviewAnalysisResponse analyzeReview(ReviewRequest request) {

        PersonalityResponse personality = restTemplate.postForObject(
                "http://127.0.0.1:8000/predict",
                request,
                PersonalityResponse.class
        );

        MultitaskResponse multitask = restTemplate.postForObject(
                "http://127.0.0.1:8000/multitask-predict",
                request,
                MultitaskResponse.class
        );

        CustomerReview review = CustomerReview.builder()
                .reviewText(request.getText())
                .openness(personality.getOpenness())
                .conscientiousness(personality.getConscientiousness())
                .extraversion(personality.getExtraversion())
                .agreeableness(personality.getAgreeableness())
                .neuroticism(personality.getNeuroticism())
                .sentimentNegative(multitask.getSentiment().getNegative())
                .sentimentNeutral(multitask.getSentiment().getNeutral())
                .sentimentPositive(multitask.getSentiment().getPositive())
                .helpfulnessKeyAspects(multitask.getHelpfulness().getKey_aspects())
                .helpfulnessAdvice(multitask.getHelpfulness().getAdvice())
                .helpfulnessTotal(multitask.getHelpfulness().getTotal())
                .createdAt(new Date())
                .build();

        review = repository.save(review);

        return ReviewAnalysisResponse.builder()
                .reviewId(review.getId())
                .personality(personality)
                .multitask(multitask)
                .build();
    }
    public List<ReviewHistoryResponse> getHistory() {

        return repository.findAll(
                        Sort.by(Sort.Direction.DESC, "createdAt")
                ).stream()
                .map(this::toHistoryResponse)
                .toList();
    }
}
