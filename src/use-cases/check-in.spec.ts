import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe("Check-in use case", () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
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

    it("Should not be able to check in more than once a day", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
        const gymId = "gym-01"
        const userId = "user-01"

        await sut.execute({
            gymId,
            userId,
        })

        await expect(() => 
            sut.execute({
                gymId,
                userId,
            })
        ).rejects.toBeInstanceOf(Error)
    })

    it("Should be able to check in twice but in different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
        const gymId = "gym-01"
        const userId = "user-01"

        await sut.execute({
            gymId,
            userId,
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId,
            userId,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})