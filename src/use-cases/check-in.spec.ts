import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/client";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase
let gymId: string
let userId: string
let latitude: Decimal
let longitude: Decimal

describe("Check-in use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)
        gymId = "gym-01"
        userId = "user-01"
        latitude = new Decimal(-22.2215722)
        longitude = new Decimal(-49.9486152)

        await gymsRepository.create({
            id: gymId,
            title: "Any gym",
            description: "Any description",
            phone: "",
            latitude: latitude,
            longitude: longitude,
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
            userLatitude: latitude.toNumber(),
            userLongitude: longitude.toNumber(),
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it("Should not be able to check in more than once a day", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
        await sut.execute({
            gymId,
            userId,
            userLatitude: latitude.toNumber(),
            userLongitude: longitude.toNumber(),
        })

        await expect(() => 
            sut.execute({
                gymId,
                userId,
                userLatitude: latitude.toNumber(),
                userLongitude: longitude.toNumber(),
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it("Should be able to check in twice but in different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
        await sut.execute({
            gymId,
            userId,
            userLatitude: latitude.toNumber(),
            userLongitude: longitude.toNumber(),
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId,
            userId,
            userLatitude: latitude.toNumber(),
            userLongitude: longitude.toNumber(),
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it("Should not be able to check in on distant gym", async () => {
        gymId = "gym-02"
        
        gymsRepository.items.push({
            id: gymId,
            title: "Any gym",
            description: "Any description",
            phone: "",
            latitude: latitude,
            longitude: longitude,
        })

        await expect(() => 
            sut.execute({
                gymId,
                userId,
                userLatitude: -22.0017324,
                userLongitude: -49.7053919,
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})