import path from "node:path"
import { loadEnv } from "vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
    test: {
        environment: "node",
        setupFiles: ["./tests/setup.ts"],
        include: ["tests/**/*.test.ts"],
        // integration tests hit one shared local DB — don't run files in parallel
        fileParallelism: false,
        // load ALL vars (empty prefix) from .env + .env.test into process.env
        env: loadEnv("test", process.cwd(), ""),
        reporters: "verbose"
    },
})
