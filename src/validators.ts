import { sValidator } from "@hono/standard-validator"
import z from "zod"

export const idParam = sValidator(
  "param",
  z.object({
    id: z.coerce.number().int().positive(),
  }),
)

export const wordUsecaseParams = sValidator(
  "param",
  z.object({
    wordId: z.coerce.number().int().positive(),
    usecaseId: z.coerce.number().int().positive(),
  }),
)

export const createWordValidators = [
  sValidator(
    "json",
    z.object({
      translation: z.string().min(1),
      meaning: z.string().optional(),
      imgUrl: z.string().optional(),
    }),
  ),
] as const

export const updateWordValidators = [
  idParam,
  sValidator(
    "json",
    z.object({
      translation: z.string().min(1).optional(),
      meaning: z.string().optional(),
      imgUrl: z.string().optional(),
    }),
  ),
] as const

export const createRelationValidators = [
  sValidator(
    "json",
    z.object({
      wordA: z.number().int().positive(),
      wordB: z.number().int().positive(),
      type: z.string().min(1),
    }),
  ),
] as const

export const createUsecaseValidators = [
  sValidator(
    "json",
    z.object({
      content: z.string().min(1),
    }),
  ),
] as const

export const updateUsecaseValidators = [
  idParam,
  sValidator(
    "json",
    z.object({
      content: z.string().min(1),
    }),
  ),
] as const

export const linkUsecaseValidators = [
  idParam,
  sValidator(
    "json",
    z.object({
      usecaseId: z.number().int().positive(),
    }),
  ),
] as const
