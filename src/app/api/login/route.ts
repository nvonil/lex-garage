import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ error: "email, username, and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return NextResponse.json({ error: "invalid email or password" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
        return NextResponse.json({ error: "invalid email or password" }, { status: 401 });
    }

    await createSession(user.id);

    return NextResponse.json({ id: user.id, email: user.email });
}
