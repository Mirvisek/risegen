import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "./ChangePasswordForm";

export default async function AdminProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Mój Profil</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Twoje Dane</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-semibold">Imię:</span> {session.user?.name || "Brak"}</p>
                            <p><span className="font-semibold">Email:</span> {session.user?.email}</p>
                            <p><span className="font-semibold">Rola:</span> {session.user?.roles?.join(", ")}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}
