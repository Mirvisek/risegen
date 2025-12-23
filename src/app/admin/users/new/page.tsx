import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewUserForm } from "@/components/admin/NewUserForm";

export default async function NewUserPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes("SUPERADMIN")) {
        redirect("/admin/dashboard");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dodaj Użytkownika</h1>
            <NewUserForm />
        </div>
    );
}
