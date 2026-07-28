import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const car = await prisma.car.findUnique({ where: { id }, include: { mods: true } });

    if (!car) {
        return NextResponse.json({ error: "car not found" }, { status: 404 });
    }

    return NextResponse.json(car);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "must be logged in" }, { status: 401 });
    }

    const { id } = await params;

    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
        return NextResponse.json({ error: "car not found" }, { status: 404 });
    }

    if (car.userID !== user.id) {
        return NextResponse.json({ error: "not your car" }, { status: 403 });
    }

    const { model, year, color } = await request.json();

    const updated = await prisma.car.update({
        where: { id },
        data: { model, year, color },
    });

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

    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
        return NextResponse.json({ error: "car not found" }, { status: 404 });
    }

    if (car.userID != user.id) {
        return NextResponse.json({ error: "not your car" }, { status: 403 });
    }

    await prisma.car.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
