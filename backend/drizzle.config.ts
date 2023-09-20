import {Config} from "drizzle-kit"
import "dotenv/config"
import env from "./src/utils/validatedotenv"

export default {
    out: "./migrations",
    schema: "./src/schema/schema.ts",
    breakpoints: true,
    dbCredentials: {
        connectionString: env.DRIZZLE_DATABASE_URL,
      }
} satisfies Config