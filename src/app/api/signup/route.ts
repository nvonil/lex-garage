import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function POST(request: Request) {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
        return NextResponse.json({ error: "email, username, and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
        return NextResponse.json({ error: "password must be at least 8 characters" }, { status: 400 });
    }

    const hashed = await hashPassword(password);

    try {
        const user = await prisma.user.create({
            data: { email, username, password: hashed },
        });

        return NextResponse.json({ id: user.id, email: user.email });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json({ error: "email or username already in use" }, { status: 409 });
        }

        throw error;
    }
}
