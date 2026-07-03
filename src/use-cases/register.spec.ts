import { expect, test, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";

describe("Register use case", () => {
    it("Should be able to register", async () => {
        const name = "John Doe"
        const email = "johndoe@example.com"
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name,
            email,
            password: "123456",
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual(name)
        expect(user.email).toEqual(email)
    })

    it("Should hash user's password for registration", async () => {
        const dummyPassword = "123456"
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

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

    it("Should not be able to register with duplicate e-mail", async () => {
        const email = "johndoe@example.com"
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        await registerUseCase.execute({
            name: "John Doe",
            email,
            password: "123456",
        })

        await expect(() => 
            registerUseCase.execute({
                name: "John Doe 2",
                email,
                password: "654321",
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})