import { asc, eq, sql } from "drizzle-orm"
import { vocabulary } from "./schema"
import { db } from "./db"

export async function getTrainingSet(userId: number, size: number) {
  return db
    .select()
    .from(vocabulary)
    .where(eq(vocabulary.userId, userId))
    .orderBy(
      sql`${vocabulary.lastRepetitionDate} ASC NULLS FIRST`,
      asc(vocabulary.score),
      sql`RANDOM()`,
    )
    .limit(size)
}
