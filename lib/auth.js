import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { usersTable } from "../db/schema";
import db from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    trustHost: true,
    callbacks: {
        async signIn({ user }) {
            const usersSelect = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, user.email));

            if (usersSelect.length === 0) {
                await db
                    .insert(usersTable)
                    .values({
                        name: user.name,
                        email: user.email,
                        image: user.image
                    });
            }

            return true;
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                const usersSelect = await db
                    .select()
                    .from(usersTable)
                    .where(eq(usersTable.email, user.email));

                if (usersSelect.length > 0) {
                    token.id = usersSelect[0].id;
                }
            }

            return token;
        }
    }
});
