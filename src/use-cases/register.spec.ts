import { expect, test, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository
// System Under Test, the registerUseCase
let sut: RegisterUseCase

describe("Register use case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it("Should be able to register", async () => {
        const name = "John Doe"
        const email = "johndoe@example.com"

        const { user } = await sut.execute({
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

        const { user } = await sut.execute({
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

        await sut.execute({
            name: "John Doe",
            email,
            password: "123456",
        })

        await expect(() => 
            sut.execute({
                name: "John Doe 2",
                email,
                password: "654321",
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})