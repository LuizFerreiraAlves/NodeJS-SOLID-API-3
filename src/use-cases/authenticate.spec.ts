import { expect, describe, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate use case", () => {
    it("Should be able to authenticate", async () => {
        const name = "John Doe"
        const email = "johndoe@example.com"
        const password = "123456"

        const usersRepository = new InMemoryUsersRepository()

        // We can call the main tested variable as sut - System Under Test
        const sut = new AuthenticateUseCase(usersRepository)

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
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

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

        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: "John Doe",
            email, 
            password_hash: await hash(password, 6),
        })

        await expect(() => 
            sut.execute({
                email: "johndoe@example.com",
                password: "12345678",
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})