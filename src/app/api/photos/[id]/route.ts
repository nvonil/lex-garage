import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "must be logged in" }, { status: 401 });
    }

    const { id } = await params;

    const photo = await prisma.photo.findUnique({ where: { id }, include: { car: true } });

    if (!photo) {
        return NextResponse.json({ error: "photo not found" }, { status: 404 });
    }

    if (photo.car.userID !== user.id) {
        return NextResponse.json({ error: "not your photo" }, { status: 403 });
    }

    await del(photo.imageURL);

    await prisma.photo.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
