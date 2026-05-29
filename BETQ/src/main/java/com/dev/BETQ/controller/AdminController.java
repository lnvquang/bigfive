package com.dev.BETQ.controller;

import com.dev.BETQ.dto.response.*;
import com.dev.BETQ.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ApiResponse<PageResponse<UserResponse>> getUsers(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(required = false)
            String keyword
    ) {

        return ApiResponse.<PageResponse<UserResponse>>builder()
                .status(200)
                .message("Lay danh sach user thanh cong")
                .result(adminService.getUsers(page,size,keyword))
                .build();
    }
    @GetMapping("/dashboard")
    public ApiResponse<DashboardResponse> getDashboard() {
        return ApiResponse.<DashboardResponse>builder()
                .status(200)
                .message("Lay dashboard thanh cong")
                .result(adminService.getDashboard())
                .build();
    }

    @GetMapping("/statistics/sentiment")
    public ApiResponse<SentimentResponse> getSentiment() {
       return ApiResponse.<SentimentResponse>builder()
               .status(200)
               .message("Lay sentiment thanh cong")
               .result(adminService.getSentiment())
               .build();
    }

    @GetMapping("/statistics/personality")
    public ApiResponse<BigFiveCountsResponse> getBigFive() {
        return ApiResponse.<BigFiveCountsResponse>builder()
                .status(200)
                .message("Lay big five thanh cong")
                .result(adminService.getBigFiveCounts())
                .build();
    }
    @GetMapping("/statistics/reviews-by-date")
    public ApiResponse<List<ReviewByDateResponse>> getReviewsByDate() {
        return ApiResponse.<List<ReviewByDateResponse>>builder()
                .status(200)
                .message("Lay bieu do thoi gian tao review")
                .result(adminService.getReviewStatisticsByDate())
                .build();
    }
}
