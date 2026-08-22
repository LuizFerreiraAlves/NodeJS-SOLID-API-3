import { FastifyRequest, FastifyReply } from "fastify"

export async function profile(
    request: FastifyRequest, 
    response: FastifyReply
) {

    return response.status(200).send()
}