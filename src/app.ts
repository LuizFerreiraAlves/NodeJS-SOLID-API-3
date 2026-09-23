import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { z, ZodError } from "zod";
import { env } from "./env";
import { usersRoutes } from "@/http/controllers/users/routes";
import { gymsRoutes } from "@/http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, request, response) => {
    if (error instanceof ZodError) {
        return response
            .status(400)
            .send({ message: "Validation error.", issues: z.treeifyError(error) })
    }

    if (env.NODE_ENV !== "production") {
        console.error(error)
    } else {
        // TODO: We should log the error to an external tool (DataDog/NewRelic/Sentry)
    }

    return response.status(500).send({ message: "Internal Server Error." })
})