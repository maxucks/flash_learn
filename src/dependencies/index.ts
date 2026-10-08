import { drizzle } from "drizzle-orm/bun-sqlite"
import { Database } from "bun:sqlite"
import { LoggerService } from "../services"

const sqlite = new Database("data.db")

sqlite.run("PRAGMA journal_mode = WAL;")
sqlite.run("PRAGMA foreign_keys = ON;")

export const db = drizzle(sqlite)

export const log = new LoggerService({
  level: process.env.LOG_LEVEL ?? "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: { colorize: true },
        }
      : undefined,
})

// const EnvSchema = z.object({
//   http: z.object({
//     port: z.coerce.number().int().positive().default(3000),
//   }),
//   auth: z.object({
//     tokenTTL: z.string(),
//     secret: z.string().min(32),
//     alg: z.enum(['HS256']),
//   }),
// })

// export const env = EnvSchema.parse({
//   http: {
//     port: process.env.PORT,
//   },
//   auth: {
//     tokenTTL: process.env.AUTH_TOKEN_TTL,
//     secret: process.env.AUTH_SECRET,
//     alg: process.env.AUTH_ALG,
//   },
// })
