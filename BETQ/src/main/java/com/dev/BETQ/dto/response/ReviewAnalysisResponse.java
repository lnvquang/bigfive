package com.dev.BETQ.dto.response;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewAnalysisResponse {
    private Long reviewId;
    private PersonalityResponse personality;
    private MultitaskResponse multitask;

}