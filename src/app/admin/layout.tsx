import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata = {
    title: "RiseGen Admin",
    robots: "noindex, nofollow",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="flex bg-gray-100 min-h-screen">
                <AdminSidebar />
                <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}
