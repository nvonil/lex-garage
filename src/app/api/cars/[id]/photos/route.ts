import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "must be logged in", status: "401" });
    }

    const { id } = await params;

    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
        return NextResponse.json({ error: "car not found" }, { status: 404 });
    }

    if (car.userID != user.id) {
        return NextResponse.json({ error: "not your car" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("photo");

    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "photo file is required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ errro: "file must be jpeg, png, or webp" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: "file must be under 5MB" }, { status: 400 });
    }

    const blob = await put(`cars/${id}/${file.name}`, file, { access: "public", addRandomSuffix: true });

    const photo = await prisma.photo.create({ data: { imageURL: blob.url, carID: id } });

    return NextResponse.json(photo);
}
