"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, Users } from "lucide-react";

import "./Sidebar.css";

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        {
            name: "Thống kê",
            path: "/admin/statistics",
            icon: BarChart3,
        },
        {
            name: "Quản lý user",
            path: "/admin/users",
            icon: Users,
        },
        {
            name: "Lịch sử đánh giá",
            path: "/admin/reviews",
            icon: ClipboardList,
        },
    ];

    return (
        <div className="sidebar">
            <aside className="w-64 h-screen p-3">
                <div className="logo">BigFive AI Admin</div>
                <nav className="menu">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.path || pathname?.startsWith?.(`${item.path}/`);

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`menu-item ${isActive ? "active" : ""}`}
                            >
                                <Icon size={22} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </div>
    );
}
