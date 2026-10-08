import { zValidator } from "@hono/zod-validator"
import z from "zod/v3"
import { RELATION_DIR_VALUES } from "../data/schema"

export const userIdParam = zValidator(
  "param",
  z.object({
    userId: z.coerce.number().int().positive(),
  }),
)

export const addVocabBody = zValidator(
  "json",
  z.object({
    usecaseId: z.coerce.number().int().positive(),
  }),
)

export const vocabParams = zValidator(
  "param",
  z.object({
    userId: z.coerce.number().int().positive(),
    usecaseId: z.coerce.number().int().positive(),
  }),
)

export const vocabQuery = zValidator(
  "query",
  z.object({
    languageId: z.coerce.number().int().positive(),
  }),
)

export const addRelationBody = zValidator(
  "json",
  z.object({
    name: z.string().min(1).max(100),
    direction: z.enum(RELATION_DIR_VALUES),
  }),
)

export const relationIdParam = zValidator(
  "param",
  z.object({
    userId: z.coerce.number().int().positive(),
    relationId: z.coerce.number().int().positive(),
  }),
)

export const renameRelationBody = zValidator(
  "json",
  z.object({
    name: z.string().min(1).max(100),
  }),
)

export const changeDirectionBody = zValidator(
  "json",
  z.object({
    direction: z.enum(RELATION_DIR_VALUES),
  }),
)
