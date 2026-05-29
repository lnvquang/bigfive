"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getUserList } from "@/app/service/api/admin";

export default function AdminUsersPage() {
    const size = 10;
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [appliedKeyword, setAppliedKeyword] = useState("");
    const [enabledOverride, setEnabledOverride] = useState({});

    const [usersPage, setUsersPage] = useState({
        content: [],
        page: 0,
        size,
        totalElements: 0,
        totalPages: 1,
        last: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError("");

            try {
                const result = await getUserList({
                    page,
                    size,
                    keyword: appliedKeyword,
                });
                if (cancelled) return;

                setUsersPage({
                    content: Array.isArray(result?.content) ? result.content : [],
                    page: typeof result?.page === "number" ? result.page : page,
                    size: typeof result?.size === "number" ? result.size : size,
                    totalElements:
                        typeof result?.totalElements === "number" ? result.totalElements : 0,
                    totalPages:
                        typeof result?.totalPages === "number" ? result.totalPages : 1,
                    last: !!result?.last,
                });
            } catch (err) {
                if (cancelled) return;
                const message = err?.response?.data?.message || err?.message || "Lỗi không xác định";
                setError(message);
                setUsersPage((prev) => ({
                    ...prev,
                    content: [],
                    totalElements: 0,
                    totalPages: 1,
                    last: true,
                }));
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [page, size, appliedKeyword]);

    const users = usersPage.content;

    const startIndex = users.length === 0 ? 0 : usersPage.page * usersPage.size + 1;
    const endIndex = Math.min(
        usersPage.totalElements,
        usersPage.page * usersPage.size + users.length
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

    function getEnabled(id) {
        if (Object.prototype.hasOwnProperty.call(enabledOverride, id)) {
            return !!enabledOverride[id];
        }
        const row = users.find((u) => u.id === id);
        if (row && typeof row.enabled === "boolean") return row.enabled;
        return true;
    }

    function toggleEnabled(id) {
        const current = getEnabled(id);
        setEnabledOverride((prev) => ({ ...prev, [id]: !current }));
    }

    function formatDate(isoString) {
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
                    <h2 className="text-2xl font-semibold text-slate-100">Quản lý user</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Danh sách user từ API.
                    </p>
                </div>
               
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-xl items-center gap-2">
                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setPage(0);
                                setAppliedKeyword(keyword.trim());
                            }
                        }}
                        placeholder="Tìm kiếm theo keyword..."
                        className="w-full rounded-lg border border-zinc-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-slate-500/30"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPage(0);
                            setAppliedKeyword(keyword.trim());
                        }}
                    >
                        Tìm
                    </Button>
                    {appliedKeyword ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setKeyword("");
                                setAppliedKeyword("");
                                setPage(0);
                            }}
                        >
                            Xóa
                        </Button>
                    ) : null}
                </div>

                <div className="text-sm text-slate-400">
                    {loading ? "Đang tải..." : error ? "Có lỗi" : `Hiển thị ${users.length} bản ghi`}
                </div>
            </div>

            {error ? (
                <div className="rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                </div>
            ) : null}

            <section className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-400">
                            <tr className="border-b border-slate-800">
                                <th className="py-3 pr-4">#</th>
                                <th className="py-3 pr-4">First name</th>
                                <th className="py-3 pr-4">Last name</th>
                                <th className="py-3 pr-4">Email</th>
                                <th className="py-3 pr-4">Phone</th>
                                <th className="py-3 pr-4">Tạo ngày</th>
                                <th className="py-3 pr-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b border-slate-900">
                                    <td className="py-3 pr-4 text-slate-200">{u.id}</td>
                                    <td className="py-3 pr-4 text-slate-100">{u.firstName}</td>
                                    <td className="py-3 pr-4 text-slate-100">{u.lastName}</td>
                                    <td className="py-3 pr-4 text-slate-300">{u.email}</td>
                                    <td className="py-3 pr-4 text-slate-300">{u.phone}</td>
                                
                                    <td className="py-3 pr-4 text-slate-300">
                                        {formatDate(u.createdAt)}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Link href={`/admin/users/${u.id}`}>
                                                <Button variant="outline" size="sm">
                                                    Chi tiết
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => toggleEnabled(u.id)}
                                            >
                                                {getEnabled(u.id) ? "Khóa" : "Mở khóa"}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-400">
                        Hiển thị {startIndex}-{endIndex} 
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={usersPage.page <= 0}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                        >
                            Prev
                        </Button>

                        {getPageItems(usersPage.page, usersPage.totalPages, 5).map((item, idx) => {
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

                            const isActive = item.page === usersPage.page;
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
                            disabled={usersPage.last}
                            onClick={() => setPage((p) => Math.min(usersPage.totalPages - 1, p + 1))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
