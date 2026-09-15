import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case"
import { FastifyRequest, FastifyReply } from "fastify"

export async function profile(
    request: FastifyRequest, 
    response: FastifyReply
) {
    const getUserProfile = makeGetUserProfileUseCase()

    const { user } = await getUserProfile.execute({
        userId: request.user.sub,
    })

    return response.status(200).send({ 
        user: {
            ...user,
            password_hash: undefined, // Hide the password hash from the response for security reasons
        },
    })
}