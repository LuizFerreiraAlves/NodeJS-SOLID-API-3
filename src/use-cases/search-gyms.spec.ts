import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe("Search gyms use case", () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })

    it("Should be able to search for gyms", async () => {
        await gymsRepository.create({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -22.2215722,
            longitude: -49.9486152,
        })

        await gymsRepository.create({
            title: 'TypeScript Gym',
            description: null,
            phone: null,
            latitude: -22.2215722,
            longitude: -49.9486152,
        })
        
        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
        ])
    })

    it("Should be able to fetch paginated gyms search", async () => {
        const numberOfGyms = 25
        const page = 2

        for (let i = 1; i <= numberOfGyms; i++) {
            await gymsRepository.create({
                title: `JavaScript Gym ${i}`,
                description: null,
                phone: null,
                latitude: -22.2215722,
                longitude: -49.9486152,
            })
        }
        
        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: page,
        })

        // The page size is 20, so the second page of a 25 items list has 5 items
        expect(gyms).toHaveLength(5)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' }),
            expect.objectContaining({ title: 'JavaScript Gym 23' }),
            expect.objectContaining({ title: 'JavaScript Gym 24' }),
            expect.objectContaining({ title: 'JavaScript Gym 25' }),
        ])
    })
})