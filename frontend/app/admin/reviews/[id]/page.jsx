import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getReviewDetailMock } from "@/app/admin/mockData";

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

function normalize01(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return 0;
    if (value <= 1) return Math.max(0, Math.min(1, value));
    return Math.max(0, Math.min(1, value / 100.0));
}

export default function AdminReviewDetailPage({ params }) {
    const review = getReviewDetailMock(params?.id);
    if (!review) notFound();

    const positive = normalize01(review.sentimentPositive);
    const negative = normalize01(review.sentimentNegative);
    const neutral = Math.max(0, Math.min(1, 1 - positive - negative));

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-100">Chi tiết review</h2>
                    <p className="mt-1 text-sm text-slate-400">Dữ liệu mock.</p>
                </div>
                <Link href="/admin/reviews">
                    <Button variant="outline" size="sm">Quay lại</Button>
                </Link>
            </div>

            <section className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-lg font-semibold text-slate-100">Review #{review.id}</div>
                        <div className="text-sm text-slate-400">
                            {review.fullName} · User #{review.userId} · {formatDateTime(review.createdAt)}
                        </div>
                    </div>
                    <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-200">
                        Helpfulness: {Math.round(normalize01(review.helpfulnessTotal) * 100)}%
                    </div>
                </div>

                <div className="mt-4 whitespace-pre-wrap text-slate-100">{review.reviewText}</div>

                <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                    <div className="text-sm font-semibold text-slate-200">Sentiment</div>

                    <div className="mt-3 grid gap-3">
                        {[
                            {
                                key: "negative",
                                label: "Negative",
                                value: negative,
                                bar: "bg-red-500",
                                text: "text-red-300",
                            },
                            {
                                key: "neutral",
                                label: "Neutral",
                                value: neutral,
                                bar: "bg-yellow-500",
                                text: "text-yellow-300",
                            },
                            {
                                key: "positive",
                                label: "Positive",
                                value: positive,
                                bar: "bg-green-500",
                                text: "text-green-300",
                            },
                        ].map((row) => (
                            <div key={row.key} className="grid gap-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-300">{row.label}</span>
                                    <span className={row.text}>{Math.round(row.value * 100)}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-800">
                                    <div
                                        className={`h-2 rounded-full ${row.bar}`}
                                        style={{ width: `${Math.round(row.value * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
