import { defineConfig } from "vitest/config";
import path from 'path';
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    resolve: {
        alias: {
            './generated/prisma/client': path.resolve(__dirname, './generated/prisma/client'),
        },
    },
    plugins: [tsconfigPaths()],
    test: {
        dir: 'src',
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    dir: 'src/use-cases',
                },
            },
            {
                extends: true,
                test: {
                    name: 'e2e',
                    dir: 'src/http/controllers',
                    environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
                },
            },
        ],
    },
})