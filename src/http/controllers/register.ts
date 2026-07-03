import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository"
import { RegisterUseCase } from "@/use-cases/register"

export async function register(request: FastifyRequest, response: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        await registerUseCase.execute({
            name,
            email,
            password,
        })
    } catch (err) {
        return response.status(409).send()
    }

    return response.status(201).send()
}