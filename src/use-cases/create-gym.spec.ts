import { expect, test, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository
// System Under Test, the registerUseCase
let sut: CreateGymUseCase

describe("Create gym use case", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it("Should be able to create gym", async () => {
        const name = "John Doe"
        const email = "johndoe@example.com"

        const { gym } = await sut.execute({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -22.2215722,
            longitude: -49.9486152,
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})