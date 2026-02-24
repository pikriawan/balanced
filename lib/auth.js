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
            const exists = (await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, user.email))).length > 0;

            if (!exists) {
                await db
                    .insert(usersTable)
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
