import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe("Get user profile use case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it("Should be able to get the user profile", async () => {
        const name = "John Doe"
        const email = "johndoe@example.com"
        const password = "123456"

        const createdUser = await usersRepository.create({
            name,
            email, 
            password_hash: await hash(password, 6),
        })

        const { user } = await sut.execute({
            userId: createdUser.id,
        })

        expect(user.id).toEqual(createdUser.id)
        expect(user.name).toEqual(createdUser.name)
        expect(user.email).toEqual(createdUser.email)
    })

    it("Should not be able to get user profile with wrong ID", async () => {
        // E-mail not previously created, we could also create a user with another e-mail
        await expect(() => 
            sut.execute({
                userId: "non-existing-id"
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})