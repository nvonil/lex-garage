import { describe, beforeEach, it, expect } from "vitest";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { POST } from "./route";
import { jsonRequest } from "@/test/helpers";

describe("POST /api/login", () => {
    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    it("returns 400 when a required field is missing", async () => {
        const request = jsonRequest({ password: "password" });

        const response = await POST(request);
        expect(response.status).toBe(400);

        const body = await response.json();
        expect(body.error).toBe("email and password are required");
    });

    it("returns 401 when the email does not exist", async () => {
        const request = jsonRequest({ email: "a@test.com", password: "password" });

        const response = await POST(request);
        expect(response.status).toBe(401);

        const body = await response.json();
        expect(body.error).toBe("invalid email or password");
    });

    it("returns 401 when the password is wrong", async () => {
        await prisma.user.create({
            data: { email: "a@test.com", username: "a", password: await hashPassword("password") },
        });

        const request = jsonRequest({ email: "a@test.com", password: "wrongpassword" });

        const response = await POST(request);
        expect(response.status).toBe(401);

        const body = await response.json();
        expect(body.error).toBe("invalid email or password");
    });
});
