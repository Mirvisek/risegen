import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserListActions } from "@/components/admin/UserListActions";

export default async function AdminUsers() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes("SUPERADMIN")) {
        redirect("/admin/dashboard");
    }

    const users = await prisma.user.findMany();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Użytkownicy</h1>
                <Link href="/admin/users/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                    Dodaj Użytkownika
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rola</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwa</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {/* Parse roles for display */}
                                    {(() => {
                                        try {
                                            const r = JSON.parse(user.roles);
                                            // Add SUPERADMIN if email matches, for display
                                            if (user.email === 'admin@risegen.pl' && !r.includes('SUPERADMIN')) r.push('SUPERADMIN');
                                            return r.join(", ");
                                        } catch (e) { return user.roles }
                                    })()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <UserListActions userId={user.id} userEmail={user.email} userName={user.name} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
