import { and, eq } from "drizzle-orm"
import { db } from "../dependencies"
import { RelationDirection, relations, usecasesRelations } from "./schema"

export async function addCustomRelation(
  userId: number,
  name: string,
  direction: RelationDirection,
) {
  return db
    .insert(relations)
    .values({
      scope: "user",
      userId,
      name,
      direction,
    })
    .returning()
}

export async function renameCustomRelation(
  userId: number,
  relationId: number,
  name: string,
) {
  const result = await db
    .update(relations)
    .set({ name })
    .where(
      and(
        eq(relations.id, relationId),
        eq(relations.userId, userId),
        eq(relations.scope, "user"),
      ),
    )
    .returning()

  if (result.length === 0) {
    throw new Error("NOT_FOUND")
  }

  return result[0]
}

export async function changeCustomRelationDirection(
  userId: number,
  relationId: number,
  direction: RelationDirection,
) {
  const result = await db
    .update(relations)
    .set({ direction })
    .where(
      and(
        eq(relations.id, relationId),
        eq(relations.userId, userId),
        eq(relations.scope, "user"),
      ),
    )
    .returning()

  if (result.length === 0) {
    throw new Error("NOT_FOUND")
  }

  return result[0]
}

export async function deleteCustomRelation(userId: number, relationId: number) {
  const result = await db
    .delete(relations)
    .where(
      and(
        eq(relations.id, relationId),
        eq(relations.userId, userId),
        eq(relations.scope, "user"),
      ),
    )
    .returning()

  if (result.length === 0) {
    throw new Error("NOT_FOUND")
  }

  return true
}

export async function linkUsecasesWithRelation(
  leftUsecaseId: number,
  rightUsecaseId: number,
  relationId: number,
) {
  const relCheck = await db
    .select()
    .from(relations)
    .where(eq(relations.id, relationId))
    .limit(1)
  if (!relCheck.length) {
    throw new Error("RELATION_NOT_FOUND")
  }

  return db.insert(usecasesRelations).values({
    leftUsecaseId,
    rightUsecaseId,
    relationId,
  })
}
