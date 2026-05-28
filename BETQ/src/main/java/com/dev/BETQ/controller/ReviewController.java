package com.dev.BETQ.controller;

import com.dev.BETQ.dto.request.ReviewRequest;
import com.dev.BETQ.dto.response.ApiResponse;
import com.dev.BETQ.dto.response.ReviewAnalysisResponse;
import com.dev.BETQ.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/analyze")
    public ApiResponse<ReviewAnalysisResponse> analyze(
            @RequestBody ReviewRequest request
    ) {
        return ApiResponse.<ReviewAnalysisResponse>builder()
                .status(200)
                .message("Lay analyze thanh cong")
                .result(reviewService.analyzeReview(request))
                .build();
    }
}