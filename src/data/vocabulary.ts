import { and, asc, eq, sql } from "drizzle-orm"
import { vocabulary } from "./schema"
import { db } from "../dependencies"
import * as schema from "./schema"

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

export async function getVocabularyByLangAndUser(
  userId: number,
  languageId: number,
) {
  const result = await db
    .select()
    .from(schema.vocabulary)
    .innerJoin(
      schema.usecases,
      eq(schema.vocabulary.usecaseId, schema.usecases.id),
    )
    .innerJoin(
      schema.wordsUsecases,
      eq(schema.usecases.id, schema.wordsUsecases.usecaseId),
    )
    .innerJoin(schema.words, eq(schema.wordsUsecases.wordId, schema.words.id))
    .where(
      and(
        eq(schema.vocabulary.userId, userId),
        eq(schema.words.languageId, languageId),
      ),
    )

  return result.map((row) => ({
    ...row.vocabulary,
    ...row.usecases,
  }))
}

export async function addUsecaseToVocabulary(
  userId: number,
  usecaseId: number,
) {
  await db.insert(schema.vocabulary).values({
    userId,
    usecaseId,
    score: 0,
    repetitionsCount: 0,
    lastRepetitionDate: null,
  })
}

export async function removeUsecaseFromVocabulary(
  userId: number,
  usecaseId: number,
) {
  await db
    .delete(schema.vocabulary)
    .where(
      and(
        eq(schema.vocabulary.userId, userId),
        eq(schema.vocabulary.usecaseId, usecaseId),
      ),
    )
}

export async function resetUsecaseProgress(userId: number, usecaseId: number) {
  await db
    .update(schema.vocabulary)
    .set({
      score: 0,
      lastRepetitionDate: null,
    })
    .where(
      and(
        eq(schema.vocabulary.userId, userId),
        eq(schema.vocabulary.usecaseId, usecaseId),
      ),
    )
}
