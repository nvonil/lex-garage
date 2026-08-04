import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "must be logged in" }, { status: 401 });
    }

    const { model, year, color } = await request.json();

    if (!model || !year || !color) {
        return NextResponse.json({ error: "model, year, and color are required" }, { status: 400 });
    }

    const car = await prisma.car.create({
        data: { model, year, color, userID: user.id },
    });

    return NextResponse.json(car);
}

export async function GET() {
    const cars = await prisma.car.findMany({
        orderBy: { datePosted: "desc" },
    });

    return NextResponse.json(cars);
}
