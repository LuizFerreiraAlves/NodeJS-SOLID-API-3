import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository
// System Under Test, the authenticateUseCase
let sut: AuthenticateUseCase

describe("Authenticate use case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it("Should be able to authenticate", async () => {
        const name = "John Doe"
        const email = "johndoe@example.com"
        const password = "123456"

        await usersRepository.create({
            name,
            email, 
            password_hash: await hash(password, 6),
        })

        const { user } = await sut.execute({
            email,
            password,
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("Should not be able to authenticate with wrong email", async () => {
        // E-mail not previously created, we could also create a user with another e-mail
        await expect(() => 
            sut.execute({
                email: "johndoe@example.com",
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it("Should not be able to authenticate with wrong password", async () => {
        const email = "johndoe@example.com"
        const password = "123456"

        await usersRepository.create({
            name: "John Doe",
            email, 
            password_hash: await hash(password, 6),
        })

        await expect(() => 
            sut.execute({
                email,
                password: "12345678",
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})