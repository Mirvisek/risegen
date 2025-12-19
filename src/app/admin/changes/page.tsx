import { prisma } from "@/lib/prisma";
import { AuditLogViewer } from "@/components/admin/AuditLogViewer";
import { fetchAuditLogs } from "./actions";

export const dynamic = 'force-dynamic'; // Ensure we always fetch latest logs

export default async function AdminChanges() {
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Historia Zmian</h1>
            <AuditLogViewer logs={logs} onLoadMore={fetchAuditLogs} />
        </div>
    );
}
