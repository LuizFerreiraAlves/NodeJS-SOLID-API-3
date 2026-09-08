import "dotenv/config"
import { randomUUID } from "node:crypto"
import type { Environment } from "vitest/environments"
import { execSync } from "node:child_process"
import { prisma } from "@/lib/prisma"

function generateDatabaseUrl(schema: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('Please provide a DATABASE_URL environment variable to run the tests.')
    }

    const url = new URL(process.env.DATABASE_URL)
    url.searchParams.set('schema', schema)

    return url.toString()
}

export default <Environment>{
    name: 'prisma',
    transformMode: 'ssr',
    async setup() {
        // Create the test database
        const schema = randomUUID()
        const databaseUrl = generateDatabaseUrl(schema)

        process.env.DATABASE_URL = databaseUrl

        execSync('npx prisma db push')

        return {
            async teardown() {
                // Delete the test database
                await prisma.$executeRawUnsafe(
                    `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
                )

                await prisma.$disconnect()
            },
        }
    },
}