import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        error?: string; // For refresh token errors
        user: {
            id: string;
            roles: string[];
            mustChangePassword: boolean;
            iat?: number;
            exp?: number;
        } & DefaultSession["user"]
    }

    interface User {
        roles: string[];
        mustChangePassword: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        roles: string[];
        mustChangePassword: boolean;
        iat?: number;
        exp?: number;
        error?: string;
    }
}
