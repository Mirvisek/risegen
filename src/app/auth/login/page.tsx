import { LoginForm } from "@/components/auth/LoginForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    return (
        <LoginForm recaptchaSiteKey={config?.recaptchaSiteKey} />
    );
}
