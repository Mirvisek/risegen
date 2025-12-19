import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApplicationStatusSelect } from "@/components/admin/ApplicationStatusSelect";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { ArrowLeft, User, Calendar, Mail, Phone, Clock } from "lucide-react";
import Link from "next/link";
import { logAction } from "@/lib/audit";
import { DeleteApplicationButton } from "@/components/admin/DeleteApplicationButton";
import { PermanentDeleteButton } from "@/components/admin/PermanentDeleteButton";

export default async function ApplicationDetails(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/admin/dashboard");
    }

    const application = await prisma.application.findUnique({
        where: { id: params.id },
    });

    if (!application) {
        return <div>Zgłoszenie nie znalezione</div>;
    }

    // Auto-assignment Logic
    let assigneeName = "Brak";
    let isAssignedToMe = false;
    let canEdit = session.user.roles.includes("ADMIN") || session.user.roles.includes("SUPERADMIN"); // Admins/SuperAdmin always can

    if (application.assignedUserId) {
        const assignee = await prisma.user.findUnique({ where: { id: application.assignedUserId } });
        assigneeName = assignee?.name || assignee?.email || "Nieznany";
        if (application.assignedUserId === session.user.id) {
            isAssignedToMe = true;
            canEdit = true;
        }
    } else {
        // Not assigned yet -> Assign to current user
        await prisma.application.update({
            where: { id: application.id },
            data: { assignedUserId: session.user.id },
        });

        // Log assignment
        await logAction({
            action: "UPDATE",
            entityType: "Application",
            entityId: application.id,
            details: { before: { assignedUserId: null }, after: { assignedUserId: session.user.id } },
        });

        assigneeName = session.user.name || session.user.email || "Ja";
        isAssignedToMe = true;
        canEdit = true;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/zgloszenia" className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    Zgłoszenie: {application.firstName} {application.lastName}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Informacje o kandydacie</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Imię i Nazwisko</p>
                                    <p className="text-gray-900">{application.firstName} {application.lastName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Typ Zgłoszenia</p>
                                    <p className="text-gray-900">
                                        {application.type === 'MEMBER' ? (
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Członek Stowarzyszenia</span>
                                        ) : application.type === 'VOLUNTEER' ? (
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Wolontariusz</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Data Urodzenia</p>
                                    <p className="text-gray-900">
                                        {application.birthDate
                                            ? format(application.birthDate, "d MMMM yyyy", { locale: pl })
                                            : "Nie podano"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <a href={`mailto:${application.email}`} className="text-indigo-600 hover:underline">{application.email}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Telefon</p>
                                    <a href={`tel:${application.phone}`} className="text-indigo-600 hover:underline">{application.phone}</a>
                                </div>
                            </div>
                            {application.instagram && (
                                <div className="flex items-start gap-3">
                                    <div className="h-5 w-5 flex items-center justify-center text-gray-400 mt-0.5 font-bold">IG</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Instagram</p>
                                        <a href={`https://instagram.com/${application.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                            {application.instagram}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Opis</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words">
                            {application.description}
                        </p>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Status Zgłoszenia</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                                {application.status === "DELETED" ? (
                                    <div className="space-y-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                            Usunięte
                                        </span>
                                        <div className="bg-red-50 p-3 rounded-md border border-red-100 text-sm text-red-800">
                                            <strong>Powód:</strong> {application.deletionReason}
                                        </div>
                                        {/* Super Admin and Admin Permanent Delete */}
                                        {(session.user.roles.includes("SUPERADMIN") || session.user.roles.includes("ADMIN")) && (
                                            <div className="mt-2">
                                                <PermanentDeleteButton id={application.id} />
                                            </div>
                                        )}
                                    </div>
                                ) : canEdit ? (
                                    <ApplicationStatusSelect id={application.id} currentStatus={application.status} />
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                        {application.status} (Tylko do odczytu)
                                    </span>
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Przypisany Opiekun</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                        {assigneeName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <p className="text-sm text-gray-900 font-medium">{assigneeName}</p>
                                </div>
                                {!isAssignedToMe && !canEdit && (
                                    <p className="text-xs text-red-500 mt-1">Tylko opiekun może zmieniać status.</p>
                                )}
                            </div>

                            {canEdit && application.status !== "DELETED" && (
                                <div className="pt-4 border-t border-gray-100">
                                    <DeleteApplicationButton id={application.id} />
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span>Złożono: {format(application.createdAt, "d MMM yyyy HH:mm", { locale: pl })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
