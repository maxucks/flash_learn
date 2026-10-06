import { drizzle } from "drizzle-orm/bun-sqlite"
import { Database } from "bun:sqlite"

const sqlite = new Database("data.db")

sqlite.run("PRAGMA journal_mode = WAL;")
sqlite.run("PRAGMA foreign_keys = ON;")

export const db = drizzle(sqlite)
