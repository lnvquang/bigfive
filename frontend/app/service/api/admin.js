import api from "../api";

export const getUserList = async ({ page = 0, size = 10, keyword } = {}) => {
    const params = {
        page,
        size,
    };

    if (keyword != null && String(keyword).trim() !== "") {
        params.keyword = String(keyword).trim();
    }

    const response = await api.get("/admin/users", { params });
    return response.data.result;
};
export const getDashboard = async () => {
    const response = await api.get("/admin/dashboard");

    return response.data.result;
};
export const getSentiment = async () => {
    const response = await api.get("/admin/statistics/sentiment");

    return response.data.result;
};
export const getBigFive = async () => {
    const response = await api.get("/admin/statistics/personality");

    return response.data.result;
};
export const getReviewsByDate = async () => {
    const response = await api.get("/admin/statistics/reviews-by-date");

    return response.data.result;
};