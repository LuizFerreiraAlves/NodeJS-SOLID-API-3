import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe("Check-in use case", () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository)
    })

    it("Should be able to check in", async () => {
        const gymId = "gym-01"
        const userId = "user-01"

        const { checkIn } = await sut.execute({
            gymId,
            userId,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})