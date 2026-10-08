import { db } from "../src/dependencies/db"
import * as s from "../src/data/schema"
import { writeFileSync } from "fs"

async function main() {
  const dump: Record<string, unknown[]> = {
    users: await db.select().from(s.users),
    languages: await db.select().from(s.languages),
    words: await db.select().from(s.words),
    usecases: await db.select().from(s.usecases),
    words_usecases: await db.select().from(s.wordsUsecases),
    examples: await db.select().from(s.examples),
    usecases_relations: await db.select().from(s.usecasesRelations),
    notes: await db.select().from(s.notes),
    usecase_notes: await db.select().from(s.usecaseNotes),
    vocabulary: await db.select().from(s.vocabulary),
  }

  writeFileSync("dump.json", JSON.stringify(dump, null, 2))
  console.log(`dumped ${Object.keys(dump).length} tables to dump.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
