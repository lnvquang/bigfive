"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export default function SentimentChart({ sentiment }) {
    if (!sentiment) {
        return <div className="text-slate-400">Không có dữ liệu sentiment</div>;
    }

    const { negative = 0, neutral = 0, positive = 0 } = sentiment;

    const data = [
        { name: "Negative", value: Math.round(negative * 100), color: "#ef4444" },
        { name: "Neutral", value: Math.round(neutral * 100), color: "#f1c40f" },
        { name: "Positive", value: Math.round(positive * 100), color: "#2ecc71" },
    ];

    // Filter out zero values
    const filteredData = data.filter(d => d.value > 0);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 rounded-lg border border-slate-700 p-4">
            <h2 className="text-xl font-semibold mb-4 text-white">Sentiment Distribution</h2>
            {filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={filteredData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, value }) => `${name} ${value}%`}
                        >
                            {filteredData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-slate-400 text-center py-20">
                    Không có sentiment data để hiển thị
                </div>
            )}

            {/* Summary stats below chart */}
            <div className="mt-6 grid grid-cols-3 gap-4 w-full">
                <div className="text-center p-2 rounded-lg bg-slate-900 border border-red-500/20">
                    <div className="text-sm text-slate-400">Negative</div>
                    <div className="text-lg font-semibold text-red-400">{Math.round(negative * 100)}%</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900 border border-yellow-500/20">
                    <div className="text-sm text-slate-400">Neutral</div>
                    <div className="text-lg font-semibold text-yellow-400">{Math.round(neutral * 100)}%</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900 border border-green-500/20">
                    <div className="text-sm text-slate-400">Positive</div>
                    <div className="text-lg font-semibold text-green-400">{Math.round(positive * 100)}%</div>
                </div>
            </div>
        </div>
    );
}
