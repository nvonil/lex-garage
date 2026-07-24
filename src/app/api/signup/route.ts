import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { email, username, password } = await request.json();

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
        data: { email, username, password: hashed },
    });

    return NextResponse.json({ id: user.id, email: user.email });
}
