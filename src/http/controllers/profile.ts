import { FastifyRequest, FastifyReply } from "fastify"

export async function profile(
    request: FastifyRequest, 
    response: FastifyReply
) {
    await request.jwtVerify()

    return response.status(200).send()
}