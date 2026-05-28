import api from "../api";

export const analyzeReview = async (text) => {
    const response = await api.post("/reviews/analyze", {
        text,
    });

    return response.data.result;
};