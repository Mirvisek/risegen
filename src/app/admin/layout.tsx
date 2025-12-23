import { AdminShell } from "@/components/admin/AdminShell";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata = {
    title: "RiseGen Admin",
    robots: "noindex, nofollow",
};

export const dynamic = 'force-dynamic';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <AdminShell>
                {children}
            </AdminShell>
        </AuthProvider>
    );
}
