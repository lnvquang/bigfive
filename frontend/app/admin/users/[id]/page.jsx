"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { allReviewsMock, getUserDetailMock } from "@/app/admin/mockData";

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

function FieldRow({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-slate-900 py-3">
            <div className="text-sm text-slate-400">{label}</div>
            <div className="text-sm font-medium text-slate-100">{value}</div>
        </div>
    );
}

export default function AdminUserDetailPage({ params }) {
    const user = useMemo(() => getUserDetailMock(Number(params?.id)), [params?.id]);
    const [enabled, setEnabled] = useState(user?.enabled ?? true);

    if (!user) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-100">Không tìm thấy user</h2>
                <Link href="/admin/users">
                    <Button variant="outline" size="sm">Quay lại</Button>
                </Link>
            </div>
        );
    }

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    const reviewsOfUser = allReviewsMock.filter((r) => r.userId === user.id);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-100">Chi tiết user</h2>
                    <p className="mt-1 text-sm text-slate-400">Dữ liệu mock.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setEnabled((v) => !v)}
                    >
                        {enabled ? "Khóa user" : "Mở khóa user"}
                    </Button>
                    <Link href="/admin/users">
                        <Button variant="outline" size="sm">Quay lại</Button>
                    </Link>
                </div>
            </div>

            <section className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div className="mb-4">
                    <div className="text-lg font-semibold text-slate-100">{fullName}</div>
                    <div className="text-sm text-slate-400">User #{user.id}</div>
                </div>

                <FieldRow label="Email" value={user.email} />
                <FieldRow label="Phone" value={user.phone} />
                <FieldRow label="Role" value={user.role} />
                <FieldRow label="CreatedAt" value={formatDateTime(user.createdAt)} />
                <FieldRow label="TotalReviews" value={user.totalReviews} />
            </section>

            <section className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-100">Reviews của user</h3>
                    <div className="text-sm text-slate-400">{reviewsOfUser.length} bản ghi (mock)</div>
                </div>

                {reviewsOfUser.length === 0 ? (
                    <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
                        Chưa có review mock cho user này.
                    </div>
                ) : (
                    <div className="mt-4 grid gap-3">
                        {reviewsOfUser.map((r) => (
                            <div
                                key={r.id}
                                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="text-sm text-slate-400">
                                        Review #{r.id} · {formatDateTime(r.createdAt)}
                                    </div>
                                    <Link href={`/admin/reviews/${r.id}`}>
                                        <Button variant="outline" size="sm">Xem chi tiết</Button>
                                    </Link>
                                </div>
                                <div className="mt-2 whitespace-pre-wrap text-slate-100">
                                    {r.reviewText}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
