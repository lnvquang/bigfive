"use client"
import Link from "next/link";
import "./Sidebar.css"
import { House, History, Radar } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Sidebar() {
    const pathname = usePathname();
    const menuItems = [
        {
            name: "Home",
            path: "/",
            icon: House,
        },
        {
            name: "Predict",
            path: "/predict",
            icon: Radar,
        },
        {
            name: "History",
            path: "/history",
            icon: History,
        }
    ];
    return (
        <div className="sidebar">
            <aside className="w-64 h-screen p-3">
                <div className="logo">
                    BigFive AI
                </div>
                <nav className="menu">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            item.path === "/history"
                                ? pathname === "/history" || pathname?.startsWith?.("/history/")
                                : pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`menu-item ${isActive ? "active" : ""
                                    }`}
                            >
                                <Icon size={22} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </div>
    );
}