import fastify from "fastify";
import { prisma } from "@/lib/prisma";

export const app = fastify()

// prisma.user.create({
//     data: {
//         name: 'Luiz Ferreira Alves',
//         email: 'luiz.ferreira.alves30@gmail.com'
//     }
// })