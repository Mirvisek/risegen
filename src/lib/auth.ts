import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;


                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) return null;

                // Parse roles from JSON string; fallback to empty array
                let roles: string[] = [];
                try {
                    // Check if it's already an array (just in case) or string
                    if (user.roles) {
                        // In Prisma SQLite, arrays are strings. 
                        // But if we just generated it, it's string.
                        roles = JSON.parse(user.roles);
                    }
                } catch (e) {
                    // Fallback for simple string if migration failed cleanly or legacy data
                    roles = [user.roles];
                }

                // SuperAdmin Override
                if (user.email === "admin@risegen.pl") {
                    if (!roles.includes("SUPERADMIN")) roles.push("SUPERADMIN");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    roles: roles,
                    mustChangePassword: user.mustChangePassword
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.roles = user.roles;
                token.mustChangePassword = user.mustChangePassword;
            }
            // Update session if user specific data changes during session
            if (trigger === "update" && session?.mustChangePassword !== undefined) {
                token.mustChangePassword = session.mustChangePassword;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.roles = token.roles;
                session.user.mustChangePassword = token.mustChangePassword;
                session.user.iat = token.iat;
                session.user.exp = token.exp;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 1800, // 30 minutes (1800 seconds) - automatic logout
    },
    secret: process.env.NEXTAUTH_SECRET
};

