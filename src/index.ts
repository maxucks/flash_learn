import { Hono } from "hono"
import { eq, and, or } from "drizzle-orm"
import { db } from "./db"
import { words, relations, usecases, wordsUsecases } from "./schema"
import {
  idParam,
  createRelationValidators,
  createUsecaseValidators,
  createWordValidators,
  linkUsecaseValidators,
  updateUsecaseValidators,
  updateWordValidators,
  wordUsecaseParams,
} from "./validators"
import { err, ok } from "./common"

// TODO: use next + pwa?

const app = new Hono()

app.get("/words", async (c) => {
  const rows = await db.select().from(words)
  return ok(c, rows)
})

app.get("/words/:id", idParam, async (c) => {
  const { id } = c.req.valid("param")

  const [row] = await db.select().from(words).where(eq(words.id, id))
  if (!row) return err(c, "Not found", 404)

  return ok(c, row)
})

app.post("/words", ...createWordValidators, async (c) => {
  const { translation, meaning, imgUrl } = c.req.valid("json")

  const [row] = await db
    .insert(words)
    .values({ translation, meaning: meaning ?? null, imgUrl: imgUrl ?? null })
    .returning()

  return ok(c, row, 201)
})

app.put("/words/:id", ...updateWordValidators, async (c) => {
  const { id } = c.req.valid("param")
  const { translation, meaning, imgUrl } = c.req.valid("json")

  const [row] = await db
    .update(words)
    .set({
      ...(translation !== undefined && { translation }),
      ...(meaning !== undefined && { meaning }),
      ...(imgUrl !== undefined && { imgUrl }),
    })
    .where(eq(words.id, id))
    .returning()
  if (!row) return err(c, "Not found", 404)

  return ok(c, row)
})

app.delete("/words/:id", idParam, async (c) => {
  const { id } = c.req.valid("param")

  const [row] = await db.delete(words).where(eq(words.id, id)).returning()
  if (!row) return err(c, "Not found", 404)

  return ok(c, { deleted: row.id })
})

app.get("/relations", async (c) => {
  const rows = await db.select().from(relations)
  return c.json(rows)
})

app.get("/words/:id/relations", idParam, async (c) => {
  const { id } = c.req.valid("param")

  const rows = await db
    .select()
    .from(relations)
    .where(or(eq(relations.word1Id, id), eq(relations.word2Id, id)))

  return ok(c, rows)
})

app.post("/relations", ...createRelationValidators, async (c) => {
  const { wordA, wordB, type } = c.req.valid("json")

  if (wordA === wordB) {
    return err(c, "A word cannot be related to itself")
  }

  const [word1Id, word2Id] = wordA < wordB ? [wordA, wordB] : [wordB, wordA]

  try {
    const [row] = await db.insert(relations).values({ word1Id, word2Id, type }).returning()
    return ok(c, row, 201)
  } catch (e: any) {
    if (String(e?.message ?? "").includes("UNIQUE")) {
      return err(c, "Relation already exists", 409)
    }
    throw e
  }
})

app.delete("/relations/:id", idParam, async (c) => {
  const { id } = c.req.valid("param")

  const [row] = await db.delete(relations).where(eq(relations.id, id)).returning()
  if (!row) return err(c, "Not found", 404)

  return ok(c, { deleted: row.id })
})

app.get("/usecases", async (c) => {
  const rows = await db.select().from(usecases)
  return ok(c, rows)
})

app.post("/usecases", ...createUsecaseValidators, async (c) => {
  const { content } = c.req.valid("json")

  const [row] = await db.insert(usecases).values({ content }).returning()

  return ok(c, row, 201)
})

app.put("/usecases/:id", ...updateUsecaseValidators, async (c) => {
  const { id } = c.req.valid("param")
  const { content } = c.req.valid("json")

  const [row] = await db.update(usecases).set({ content }).where(eq(usecases.id, id)).returning()
  if (!row) return err(c, "Not found", 404)

  return ok(c, row)
})

app.delete("/usecases/:id", idParam, async (c) => {
  const { id } = c.req.valid("param")

  const [row] = await db.delete(usecases).where(eq(usecases.id, id)).returning()
  if (!row) return err(c, "Not found", 404)

  return ok(c, { deleted: row.id })
})

app.get("/words/:id/usecases", idParam, async (c) => {
  const { id } = c.req.valid("param")

  const rows = await db
    .select({ id: usecases.id, content: usecases.content })
    .from(wordsUsecases)
    .innerJoin(usecases, eq(wordsUsecases.usecaseId, usecases.id))
    .where(eq(wordsUsecases.wordId, id))

  return ok(c, rows)
})

app.post("/words/:id/usecases", ...linkUsecaseValidators, async (c) => {
  const { id: wordId } = c.req.valid("param")
  const { usecaseId } = c.req.valid("json")

  try {
    await db.insert(wordsUsecases).values({ wordId, usecaseId })
    return ok(c, { linked: true }, 201)
  } catch (e: any) {
    if (String(e?.message ?? "").includes("UNIQUE")) {
      return err(c, "Already linked", 409)
    }
    throw e
  }
})

app.delete("/words/:wordId/usecases/:usecaseId", wordUsecaseParams, async (c) => {
  const { wordId, usecaseId } = c.req.valid("param")

  const [row] = await db
    .delete(wordsUsecases)
    .where(and(eq(wordsUsecases.wordId, wordId), eq(wordsUsecases.usecaseId, usecaseId)))
    .returning()
  if (!row) return err(c, "Not found", 404)

  return ok(c, { unlinked: true })
})

export default app
