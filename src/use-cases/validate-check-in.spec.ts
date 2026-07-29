import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe("Validate check-in use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("Should be able to validate the check-in", async () => {
        const gymId = 'gym-01'
        const userId = 'user-01'

        const createdCheckIn = await checkInsRepository.create({
            gym_id: gymId,
            user_id: userId,
        })
        
        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0]?.validated_at).toEqual(expect.any(Date))
    })

    it("Should not be able to validate a non-existent check-in", async () => {
        await expect(() => 
            sut.execute({
                checkInId: 'non-existent check-in',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it("Should not be able to validate the check-in 20 minutes after its creation", async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 15, 20))

        const gymId = 'gym-01'
        const userId = 'user-01'

        const createdCheckIn = await checkInsRepository.create({
            gym_id: gymId,
            user_id: userId,
        })

        const twentyOneMinutesInMiliseconds = 1000 * 60 * 21

        // Advance 21 minutes
        vi.advanceTimersByTime(twentyOneMinutesInMiliseconds)

        await expect(() => 
            sut.execute({
                checkInId: createdCheckIn.id,
            })
        ).rejects.toBeInstanceOf(LateCheckInValidationError)
    }) 
})