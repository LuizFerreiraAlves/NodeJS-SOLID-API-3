import { expect, describe, it, beforeEach } from "vitest";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe("Fetch user check-in history use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
    })

    it("Should be able to fetch check-in history", async () => {
        const userId = 'user-01'

        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: userId,
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: userId,
        })
        
        const { checkIns } = await sut.execute({
            userId: userId,
            page: 1,
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-01' }),
            expect.objectContaining({ gym_id: 'gym-02' }),
        ])
    })

    it("Should be able to fetch paginated check-in history", async () => {
        const userId = 'user-01'
        const numberOfGyms = 25
        const page = 2

        for (let i = 1; i <= numberOfGyms; i++) {
            await checkInsRepository.create({
                gym_id: `gym-${i}`,
                user_id: userId,
            })
        }
        
        const { checkIns } = await sut.execute({
            userId: userId,
            page: page,
        })

        // The page size is 20, so the second page of a 25 items list has 5 items
        expect(checkIns).toHaveLength(5)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' }),
            expect.objectContaining({ gym_id: 'gym-23' }),
            expect.objectContaining({ gym_id: 'gym-24' }),
            expect.objectContaining({ gym_id: 'gym-25' }),
        ])
    })
})