export const adminDashboardMock = {
    totalUsers: 120,
    totalReviews: 2500,
    positiveReviews: 1800,
    neutralReviews: 300,
    negativeReviews: 400,
};

export const sentimentCountsMock = {
    positive: 1800,
    neutral: 300,
    negative: 400,
};

export const bigFiveCountsMock = {
    openness: 100,
    conscientiousness: 220,
    extraversion: 140,
    agreeableness: 280,
    neuroticism: 60,
};

const baseUsers = [
    {
        id: 1,
        firstName: "Huynh",
        lastName: "Nguyen",
        email: "huynh@gmail.com",
        phone: "0123456789",
        role: "USER",
        createdAt: "2026-05-29T10:00:00",
        totalReviews: 15,
    },
    {
        id: 2,
        firstName: "Admin",
        lastName: "System",
        email: "admin@gmail.com",
        phone: "0987654321",
        role: "ADMIN",
        createdAt: "2026-05-28T08:30:00",

        totalReviews: 0,
    },
];

function pad2(value) {
    return String(value).padStart(2, "0");
}

function buildGeneratedUsers(total = 20) {
    const users = [...baseUsers];

    for (let id = 3; id <= total; id += 1) {
        const day = 10 + ((id - 1) % 20);
        const hour = 8 + (id % 10);
        const minute = (id * 7) % 60;

        users.push({
            id,
            firstName: `User${id}`,
            lastName: `Demo${id}`,
            email: `user${id}@example.com`,
            phone: `09${String(10000000 + id * 123).slice(0, 8)}`,
            role: "USER",
            createdAt: `2026-05-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:00`,
            totalReviews: (id * 3) % 22,
        });
    }

    return users;
}

export const allUsersMock = buildGeneratedUsers(20);

export function getUsersPageMock(page = 0, size = 2) {
    const safePage = Math.max(0, Number(page) || 0);
    const safeSize = Math.max(1, Number(size) || 2);

    const totalElements = allUsersMock.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / safeSize));
    const effectivePage = Math.min(safePage, totalPages - 1);
    const start = effectivePage * safeSize;
    const content = allUsersMock.slice(start, start + safeSize).map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt,
    }));

    return {
        content,
        page: effectivePage,
        size: safeSize,
        totalElements,
        totalPages,
        last: effectivePage >= totalPages - 1,
    };
}

export const usersPageMock = getUsersPageMock(0, 2);

export function getUserDetailMock(id) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return null;

    const found = allUsersMock.find((u) => u.id === numericId);
    if (!found) return null;

    return {
        id: found.id,
        firstName: found.firstName,
        lastName: found.lastName,
        email: found.email,
        phone: found.phone,
        role: found.role,
        createdAt: found.createdAt,
        totalReviews: found.totalReviews ?? 0,
    };
}

export const reviewsPageMock = {
    content: [],
    page: 0,
    size: 2,
    totalElements: 50,
    totalPages: 25,
    last: false,
};

const baseReviews = [
    {
        id: 1,
        userId: 1,
        fullName: "Huynh Nguyen",
        reviewText: "Giao hàng lâu, hàng không giống mô tả",
        sentimentPositive: 0.14,
        sentimentNegative: 0.72,
        helpfulnessTotal: 0.7,
        createdAt: "2026-05-29T11:00:00",
    },
    {
        id: 2,
        userId: 1,
        fullName: "Huynh Nguyen",
        reviewText: "Sản phẩm rất tốt",
        sentimentPositive: 0.91,
        sentimentNegative: 0.02,
        helpfulnessTotal: 0.85,
        createdAt: "2026-05-29T10:30:00",
    },
];

function clamp01(value) {
    return Math.max(0, Math.min(1, value));
}

function buildGeneratedReviews(total = 50) {
    const reviews = [...baseReviews];

    for (let id = 3; id <= total; id += 1) {
        const userId = ((id - 1) % allUsersMock.length) + 1;
        const user = getUserDetailMock(userId);
        const fullName = user ? `${user.firstName} ${user.lastName}` : `User ${userId}`;

        const positive = clamp01(((id * 11) % 100) / 100);
        const negative = clamp01(((id * 7) % 80) / 100);
        const helpfulness = clamp01(((id * 13) % 100) / 100);

        const day = 1 + ((id - 1) % 28);
        const hour = 8 + (id % 12);
        const minute = (id * 9) % 60;

        reviews.push({
            id,
            userId,
            fullName,
            reviewText: `Review mock #${id}: Nội dung đánh giá mẫu để demo lịch sử.`,
            sentimentPositive: positive,
            sentimentNegative: negative,
            helpfulnessTotal: helpfulness,
            createdAt: `2026-05-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:00`,
        });
    }

    return reviews;
}

export const allReviewsMock = buildGeneratedReviews(50);

export function getReviewsPageMock(page = 0, size = 2) {
    const safePage = Math.max(0, Number(page) || 0);
    const safeSize = Math.max(1, Number(size) || 2);

    const totalElements = allReviewsMock.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / safeSize));
    const effectivePage = Math.min(safePage, totalPages - 1);
    const start = effectivePage * safeSize;
    const content = allReviewsMock.slice(start, start + safeSize);

    return {
        content,
        page: effectivePage,
        size: safeSize,
        totalElements,
        totalPages,
        last: effectivePage >= totalPages - 1,
    };
}

// Keep the shape as requested (page=0, size=2)
Object.assign(reviewsPageMock, getReviewsPageMock(0, 2));

export function getReviewDetailMock(id) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return null;

    const found = allReviewsMock.find((item) => item.id === numericId);
    if (found) return found;

    return null;
}
