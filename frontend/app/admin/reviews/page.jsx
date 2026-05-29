"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getReviewsPageMock } from "@/app/admin/mockData";

export default function AdminReviewsPage() {
    const size = 2;
    const [page, setPage] = useState(0);

    const reviewsPage = useMemo(() => getReviewsPageMock(page, size), [page]);
    const reviews = reviewsPage.content;

    const startIndex = reviewsPage.page * reviewsPage.size + 1;
    const endIndex = Math.min(
        reviewsPage.totalElements,
        reviewsPage.page * reviewsPage.size + reviews.length
    );

    function getPageItems(currentPage, totalPages, maxButtons = 5) {
        const safeTotal = Math.max(1, totalPages);
        const safeCurrent = Math.max(0, Math.min(currentPage, safeTotal - 1));

        const max = Math.max(3, maxButtons);
        if (safeTotal <= max) {
            return Array.from({ length: safeTotal }, (_, i) => ({ type: "page", page: i }));
        }

        const items = [];
        const windowSize = max - 2; // keep first + last
        let start = Math.max(1, safeCurrent - Math.floor(windowSize / 2));
        let end = start + windowSize - 1;
        if (end > safeTotal - 2) {
            end = safeTotal - 2;
            start = end - windowSize + 1;
        }

        items.push({ type: "page", page: 0 });

        if (start > 1) items.push({ type: "ellipsis" });
        for (let p = start; p <= end; p += 1) items.push({ type: "page", page: p });
        if (end < safeTotal - 2) items.push({ type: "ellipsis" });

        items.push({ type: "page", page: safeTotal - 1 });
        return items;
    }

    function formatDateTime(isoString) {
        const date = new Date(isoString);
        if (Number.isNaN(date.getTime())) return "-";
        return new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-100">Lịch sử đánh giá</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Danh sách đánh giá (mock) để demo quản lý lịch sử.
                    </p>
                </div>
                <div className="text-sm text-slate-400">
                    {reviewsPage.totalElements} bản ghi · page {reviewsPage.page + 1}/{reviewsPage.totalPages}
                </div>
            </div>

            <section className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-400">
                            <tr className="border-b border-slate-800">
                                <th className="py-3 pr-4">#</th>
                                <th className="py-3 pr-4">UserId</th>
                                <th className="py-3 pr-4">Full name</th>
                                <th className="py-3 pr-4">Sentiment +</th>
                                <th className="py-3 pr-4">Sentiment -</th>
                                <th className="py-3 pr-4">Helpfulness</th>
                                <th className="py-3 pr-4">Thời gian</th>
                                <th className="py-3 pr-4">Nội dung</th>
                                <th className="py-3 pr-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((r) => (
                                <tr key={r.id} className="border-b border-slate-900">
                                    <td className="py-3 pr-4 text-slate-200">{r.id}</td>
                                    <td className="py-3 pr-4 text-slate-300">{r.userId}</td>
                                    <td className="py-3 pr-4 text-slate-100">{r.fullName}</td>
                                    <td className="py-3 pr-4 text-slate-300">
                                        {Math.round((r.sentimentPositive || 0) * 100)}%
                                    </td>
                                    <td className="py-3 pr-4 text-slate-300">
                                        {Math.round((r.sentimentNegative || 0) * 100)}%
                                    </td>
                                    <td className="py-3 pr-4 text-slate-300">
                                        {Math.round((r.helpfulnessTotal || 0) * 100)}%
                                    </td>
                                    <td className="py-3 pr-4 text-slate-300">
                                        {formatDateTime(r.createdAt)}
                                    </td>
                                    <td className="py-3 pr-4 text-slate-300">{r.reviewText}</td>
                                    <td className="py-3 pr-4">
                                        <Link href={`/admin/reviews/${r.id}`}>
                                            <Button variant="outline" size="sm">
                                                Xem
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-400">
                        Hiển thị {startIndex}-{endIndex} / {reviewsPage.totalElements} (size {reviewsPage.size})
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={reviewsPage.page <= 0}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                        >
                            Prev
                        </Button>

                        {getPageItems(reviewsPage.page, reviewsPage.totalPages, 5).map((item, idx) => {
                            if (item.type === "ellipsis") {
                                return (
                                    <span
                                        key={`ellipsis-${idx}`}
                                        className="px-2 text-sm text-slate-500"
                                    >
                                        …
                                    </span>
                                );
                            }

                            const isActive = item.page === reviewsPage.page;
                            return (
                                <Button
                                    key={`page-${item.page}`}
                                    variant={isActive ? "secondary" : "outline"}
                                    size="sm"
                                    onClick={() => setPage(item.page)}
                                >
                                    {item.page + 1}
                                </Button>
                            );
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={reviewsPage.last}
                            onClick={() => setPage((p) => Math.min(reviewsPage.totalPages - 1, p + 1))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
