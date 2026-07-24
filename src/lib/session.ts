import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session_id";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function createSession(userID: string) {
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    const session = await prisma.session.create({
        data: { userID, expiresAt },
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session.id, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        path: "/",
    });
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionID = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionID) {
        return null;
    }

    const session = await prisma.session.findUnique({
        where: { id: sessionID },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
        return null;
    }

    return session.user;
}
