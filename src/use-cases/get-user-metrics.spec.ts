import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe("Get user metrics use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new GetUserMetricsUseCase(checkInsRepository)
    })

    it("Should be able to get check-ins count from metrics", async () => {
        const userId = 'user-01'

        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: userId,
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: userId,
        })
        
        const { checkInsCount } = await sut.execute({
            userId: userId,
        })

        expect(checkInsCount).toEqual(2)
    })
})