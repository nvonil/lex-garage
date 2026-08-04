import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { category, brand, name, cost, url } = await request.json();

    if (!category || !brand || !name || cost === undefined) {
        return NextResponse.json({ error: "category, brand, name, and cost are required" }, { status: 400 });
    }

    const mod = await prisma.mod.create({ data: { category, brand, name, cost, url, carID: id } });

    return NextResponse.json(mod);
}
