import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { EditUserForm } from "@/components/admin/EditUserForm";

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes("SUPERADMIN")) {
        redirect("/admin/dashboard");
    }

    const user = await prisma.user.findUnique({
        where: { id: params.id },
    });

    if (!user) notFound();

    return <EditUserForm user={user} />;
}
