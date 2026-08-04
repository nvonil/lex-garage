import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "must be logged in" }, { status: 401 });
    }

    const { id } = await params;

    const mod = await prisma.mod.findUnique({ where: { id }, include: { car: true } });

    if (!mod) {
        return NextResponse.json({ error: "mod not found" }, { status: 404 });
    }

    if (mod.car.userID !== user.id) {
        return NextResponse.json({ error: "not your mod" }, { status: 403 });
    }

    const { category, brand, name, cost, url } = await request.json();

    const updated = await prisma.mod.update({ where: { id }, data: { category, brand, name, cost, url } });

    return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "must be logged in" }, { status: 401 });
    }

    const { id } = await params;

    const mod = await prisma.mod.findUnique({ where: { id }, include: { car: true } });

    if (!mod) {
        return NextResponse.json({ error: "mod not found" }, { status: 404 });
    }

    if (mod.car.userID !== user.id) {
        return NextResponse.json({ error: "not your mod" }, { status: 403 });
    }

    await prisma.mod.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
