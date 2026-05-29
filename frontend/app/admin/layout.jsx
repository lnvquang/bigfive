import AdminSidebar from "@/components/layouts/AdminSidebar";

export const metadata = {
    title: "Admin | Big Five AI Dashboard",
};

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <header className="h-16 border-b border-zinc-800 flex items-center px-6">
                    <h1 className="text-2xl font-bold text-slate-100">Admin</h1>
                </header>

                <main className="p-8">{children}</main>
            </div>
        </div>
    );
}
