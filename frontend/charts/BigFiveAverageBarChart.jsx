"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

function toNumber(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return 0;
    return value;
}

export default function BigFiveAverageBarChart({ values }) {
    if (!values) {
        return <div className="text-slate-400">Không có dữ liệu Big Five</div>;
    }

    const data = [
        { name: "Openness", value: toNumber(values.openness) },
        { name: "Conscientiousness", value: toNumber(values.conscientiousness) },
        { name: "Extraversion", value: toNumber(values.extraversion) },
        { name: "Agreeableness", value: toNumber(values.agreeableness) },
        { name: "Neuroticism", value: toNumber(values.neuroticism) },
    ];

    return (
        <div className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">Big Five Average</h2>
                <p className="mt-1 text-sm text-slate-400">Giá trị trung bình của các trait.</p>
            </div>

            <ResponsiveContainer width="100%" height={340}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} />
                    <XAxis dataKey="name" tick={{ fill: "#cbd5e1" }} />
                    <YAxis domain={[0, 1]} tick={{ fill: "#94a3b8" }} />
                    <Tooltip
                        formatter={(v) => {
                            const num = typeof v === "number" ? v : Number(v);
                            if (Number.isNaN(num)) return [v, "Average"];
                            return [num.toFixed(2), "Average"];
                        }}
                        contentStyle={{
                            backgroundColor: "#0b1220",
                            border: "1px solid #334155",
                            borderRadius: 8,
                            color: "#e2e8f0",
                        }}
                    />
                    <Bar dataKey="value" fill="#1d4ed8" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
