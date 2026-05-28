package com.dev.BETQ.dto.response;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class ReviewHistoryResponse {

    private Long id;

    private String reviewText;

    private Double openness;
    private Double conscientiousness;
    private Double extraversion;
    private Double agreeableness;
    private Double neuroticism;
    private Double sentimentNegative;
    private Double sentimentNeutral;
    private Double sentimentPositive;
    private Double helpfulnessTotal;

    private Date createdAt;
}