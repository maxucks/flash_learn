import { Hono } from "hono"
import {
  addCustomRelation,
  addUsecaseToVocabulary,
  changeCustomRelationDirection,
  deleteCustomRelation,
  getVocabularyByLangAndUser,
  removeUsecaseFromVocabulary,
  renameCustomRelation,
  resetUsecaseProgress,
} from "../data"
import { err, ok } from "../core"
import { zValidator } from "@hono/zod-validator"
import z from "zod"
import {
  addRelationBody,
  addVocabBody,
  changeDirectionBody,
  relationIdParam,
  renameRelationBody,
  userIdParam,
  vocabParams,
  vocabQuery,
} from "./validators"

const app = new Hono()

app.get("/users/:userId/vocabulary", userIdParam, vocabQuery, async (c) => {
  const { userId } = c.req.valid("param")
  const { languageId } = c.req.valid("query")

  try {
    const vocabularyItems = await getVocabularyByLangAndUser(userId, languageId)
    return ok(c, vocabularyItems)
  } catch (error) {
    return err(c, "Failed to fetch vocabulary", 500)
  }
})

app.post("/users/:userId/vocabulary", userIdParam, addVocabBody, async (c) => {
  const { userId } = c.req.valid("param")
  const { usecaseId } = c.req.valid("json")

  try {
    await addUsecaseToVocabulary(userId, usecaseId)
    return ok(c, 201)
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      return err(c, "Item already exists in vocabulary", 409)
    }
    return err(c, "Failed to add to vocabulary", 500)
  }
})

app.delete("/users/:userId/vocabulary/:usecaseId", vocabParams, async (c) => {
  const { userId, usecaseId } = c.req.valid("param")

  try {
    await removeUsecaseFromVocabulary(userId, usecaseId)
    return ok(c, {})
  } catch (error) {
    return err(c, "Failed to remove item", 500)
  }
})

app.patch("/users/:userId/vocabulary/:usecaseId/reset", vocabParams, async (c) => {
  const { userId, usecaseId } = c.req.valid("param")

  try {
    await resetUsecaseProgress(userId, usecaseId)
    return ok(c, {})
  } catch (error) {
    return err(c, "Failed to reset progress", 500)
  }
})

export default app
