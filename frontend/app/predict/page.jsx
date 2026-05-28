"use client";

import { useState } from "react";
import PersonalityRadar from "@/charts/PersonalityRadar";
import SentimentChart from "@/charts/SentimentChart";
import Navbar from "@/components/layouts/Navbar";
import Sidebar from "@/components/layouts/Sidebar";
import styles from "./page.module.css";
import ClusterCard from "@/components/cards/ClusterCard";
import HelpfulnessCard from "@/components/cards/HelpfulnessCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function PredictPage() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [multitaskResult, setMultitaskResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function formatScore(value) {
        if (typeof value !== "number") return "-";
        if (value <= 1) {
            return `${Math.round(value * 100)}%`;
        }
        return value.toFixed(0);
    }

    function getSentimentLabel(sentimentObj) {
        if (!sentimentObj) return 1; // default neutral
        const { negative, neutral, positive } = sentimentObj;
        const max = Math.max(negative || 0, neutral || 0, positive || 0);
        if (max === positive) return 2; // positive
        if (max === negative) return 0; // negative
        return 1; // neutral
    }

    async function handlePredict() {
        if (!text.trim()) {
            setError("Vui lòng nhập nội dung trước khi dự đoán.");
            return;
        }

        setError("");
        setLoading(true);
        setResult(null);
        setMultitaskResult(null);

        try {
            // Call personality predict endpoint
            const response = await fetch(`${BACKEND_URL}/predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`Backend trả về lỗi ${response.status}`);
            }

            const payload = await response.json();
            // Normalize values to 0-1 for the radar chart (accept either 0-1 or 0-100 inputs)
            const normalized = {};
            Object.entries(payload).forEach(([k, v]) => {
                if (typeof v === "number") {
                    normalized[k] = v > 1 ? v / 100.0 : v;
                } else {
                    normalized[k] = v;
                }
            });
            setResult(normalized);

            // Call multitask predict endpoint
            const multitaskResponse = await fetch(`${BACKEND_URL}/multitask-predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (multitaskResponse.ok) {
                const multitaskPayload = await multitaskResponse.json();
                setMultitaskResult(multitaskPayload);
            } else {
                console.warn("Multitask predict endpoint failed, using defaults");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi không xác định");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="p-8">
                    <div>
                        <div className={`shadow-xl flex flex-col ${styles.predictContainer}`}>
                            <h1>PSYCHOLOGICAL INPUT SOURCE</h1>

                            <textarea
                                value={text}
                                onChange={(event) => setText(event.target.value)}
                                className="w-full h-40 p-4 rounded-lg border border-zinc-700 bg-slate-950 text-white"
                                placeholder="Enter customer comment..."
                                maxLength={3000}
                            />

                            <button
                                onClick={handlePredict}
                                disabled={loading}
                                className="mt-4 px-6 py-2 self-end rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                            >
                                {loading ? "Đang dự đoán..." : "Predict"}
                            </button>

                            {error ? (
                                <div className="mt-4 rounded-md border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                    {error}
                                </div>
                            ) : null}
                        </div>

                        <div className="mt-10 flex w-full gap-4">
                            <div className="flex-1">
                                {result ? (
                                    <>
                                        <PersonalityRadar data={result} />

                                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {Object.entries(result).map(([trait, value]) => (
                                                <div
                                                    key={trait}
                                                    className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                                                >
                                                    <div className="text-sm uppercase tracking-[0.18em] text-slate-500">
                                                        {trait}
                                                    </div>
                                                    <div className="mt-2 text-3xl font-semibold text-slate-100">
                                                        {formatScore(value)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-lg border border-slate-700 bg-slate-950 p-6 text-slate-400">
                                        Nhập text và nhấn Predict để xem kết quả trên biểu đồ.
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg flex-1 flex flex-col gap-4">
                                <div className="rounded-lg flex-1">
                                    <SentimentChart sentiment={multitaskResult?.sentiment} />
                                </div>
                                <div className="rounded-lg flex w-full gap-4">
                                    <div className="rounded-lg flex-1">
                                        <HelpfulnessCard helpfulness={multitaskResult?.helpfulness} />
                                    </div>
                                    <div className="rounded-lg flex-1">
                                        <ClusterCard
                                            className=""
                                            cluster="Cluster 1"
                                            description="This is a sample cluster description."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
