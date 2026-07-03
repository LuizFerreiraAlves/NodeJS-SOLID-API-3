import { expect, test, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";

describe("Register use case", () => {
    it("Should hash user's password for registration", async () => {
        const dummyPassword = "123456"
        const registerUseCase = new RegisterUseCase({
            async findByEmail(email) {
                return null
            },

            async create(data) {
                return {
                    id: "user-1",
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date(),
                }
            },
        })

        const { user } = await registerUseCase.execute({
            name: "John Doe",
            email: "johndoe@example.com",
            password: dummyPassword,
        })

        const isPasswordCorrectlyHashed = await compare(
            dummyPassword,
            user.password_hash
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    })
})