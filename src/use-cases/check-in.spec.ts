import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/client";

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase
let gymId: string
let userId: string

describe("Check-in use case", () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)
        gymId = "gym-01"
        userId = "user-01"

        gymsRepository.items.push({
            id: gymId,
            title: "Any gym",
            description: "Any description",
            phone: "",
            latitude: new Decimal(0),
            longitude: new Decimal(0),
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("Should be able to check in", async () => {      
        const { checkIn } = await sut.execute({
            gymId,
            userId,
            userLatitude: 0,
            userLongitude: 0,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it("Should not be able to check in more than once a day", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
        await sut.execute({
            gymId,
            userId,
            userLatitude: 0,
            userLongitude: 0,
        })

        await expect(() => 
            sut.execute({
                gymId,
                userId,
                userLatitude: 0,
                userLongitude: 0,
            })
        ).rejects.toBeInstanceOf(Error)
    })

    it("Should be able to check in twice but in different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
        await sut.execute({
            gymId,
            userId,
            userLatitude: 0,
            userLongitude: 0,
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId,
            userId,
            userLatitude: 0,
            userLongitude: 0,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})