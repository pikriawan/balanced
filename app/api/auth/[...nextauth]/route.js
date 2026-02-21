import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "../../../../lib/db";
import { users } from "../../../../db/schema";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ user }) {
            const existingUsers = await db
                .select()
                .from(users)
                .where(eq(users.email, user.email));
            const exists = existingUsers.length > 0;

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

export { handler as GET, handler as POST };
