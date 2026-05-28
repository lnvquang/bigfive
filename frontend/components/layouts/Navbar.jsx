"use client";

import "./Navbar.css";
import { useUser } from "@/app/context/UserContext";

export default function Navbar() {
    const { user } = useUser();
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

    return (
        <nav className="h-16 border-b border-zinc-800 flex items-center px-6 justify-between">
            <h1 className="text-3xl font-bold">
                Predict
            </h1>

            {fullName ? (
                <div className="text-sm font-semibold text-slate-200">{fullName}</div>
            ) : (
                <div />
            )}
        </nav>
    );
}