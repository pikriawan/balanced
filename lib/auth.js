import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { users } from "../db/schema";
import db from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    trustHost: true,
    callbacks: {
        async signIn({ user }) {
            const exists = (await db
                .select()
                .from(users)
                .where(eq(users.email, user.email))).length > 0;

            if (!exists) {
                await db
                    .insert(users)
                    .values({
                        name: user.name,
                        email: user.email,
                        image: user.image
                    });
            }

            return true;
        }
    }
});
