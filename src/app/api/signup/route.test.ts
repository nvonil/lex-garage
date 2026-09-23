import { describe, beforeEach, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";

import { POST } from "./route";
import { jsonRequest } from "@/test/helpers";

describe("POST /api/signup", () => {
    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    it("returns 400 when a required field is missing", async () => {
        const request = jsonRequest({ email: "a@test.com", password: "password" });

        const response = await POST(request);
        expect(response.status).toBe(400);

        const body = await response.json();
        expect(body.error).toBe("email, username, and password are required");
    });

    it("returns 400 when the password is under 8 characters", async () => {
        const request = jsonRequest({ email: "a@test.com", username: "a", password: "pass" });

        const response = await POST(request);
        expect(response.status).toBe(400);

        const body = await response.json();
        expect(body.error).toBe("password must be at least 8 characters");
    });

    it("creates a user with a hashed password", async () => {
        const request = jsonRequest({ email: "a@test.com", username: "a", password: "password" });

        const response = await POST(request);
        expect(response.status).toBe(200);

        const user = await prisma.user.findUnique({ where: { email: "a@test.com" } });
        expect(user).not.toBeNull();
        expect(user?.password).not.toBe("password");
    });

    it("returns 409 when an email is taken", async () => {
        const request1 = jsonRequest({ email: "a@test.com", username: "a", password: "password" });

        const response1 = await POST(request1);
        expect(response1.status).toBe(200);

        const request2 = jsonRequest({ email: "a@test.com", username: "b", password: "password" });

        const response2 = await POST(request2);
        expect(response2.status).toBe(409);

        const body = await response2.json();
        expect(body.error).toBe("email or username already in use");
    });

    it("returns 409 when a username is taken", async () => {
        const request1 = jsonRequest({ email: "a@test.com", username: "a", password: "password" });

        const response1 = await POST(request1);
        expect(response1.status).toBe(200);

        const request2 = jsonRequest({ email: "b@test.com", username: "a", password: "password" });

        const response2 = await POST(request2);
        expect(response2.status).toBe(409);

        const body = await response2.json();
        expect(body.error).toBe("email or username already in use");
    });
});
