package com.dev.BETQ.dto.response;

import lombok.Data;

@Data
public class MultitaskResponse {
    private SentimentResponse sentiment;
    private HelpfulnessResponse helpfulness;

}