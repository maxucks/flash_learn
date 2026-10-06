import { sqliteTable, integer, text, primaryKey, uniqueIndex, check } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name"),
    username: text("username").notNull().unique(),
    xp: integer("xp").notNull().default(0),
  },
  (t) => [check("xp_non_negative", sql`${t.xp} >= 0`)],
)

export const languages = sqliteTable("languages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
})

export const words = sqliteTable("words", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  languageId: integer("language_id")
    .notNull()
    .references(() => languages.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
})

export const usecases = sqliteTable("usecases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imgUrl: text("img_url"),
  description: text("description"),
  translation: text("translation"),
  rudeness: integer("rudeness").notNull().default(0),
  formality: integer("formality").notNull().default(0),
})

export const wordsUsecases = sqliteTable(
  "words_usecases",
  {
    wordId: integer("word_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
    usecaseId: integer("usecase_id")
      .notNull()
      .references(() => usecases.id, { onDelete: "cascade" }),
    usedAs: text("used_as"),
  },
  (t) => [primaryKey({ columns: [t.wordId, t.usecaseId] })],
)

export const examples = sqliteTable("examples", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usecaseId: integer("usecase_id")
    .notNull()
    .references(() => usecases.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
})

// antonym, synonim - symmetrical
// hypernym/hyponym → directional → needs broader_id / narrower_id
// meronym/holonym → directional → part_id / whole_id
//
// So I need to manually add 2 relations on symetrical relations
export const usecasesRelations = sqliteTable(
  "usecases_relations",
  {
    leftUsecaseId: integer("left_usecase_id")
      .notNull()
      .references(() => usecases.id, { onDelete: "cascade" }),
    rightUsecaseId: integer("right_usecase_id")
      .notNull()
      .references(() => usecases.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
  },
  (t) => [primaryKey({ columns: [t.leftUsecaseId, t.rightUsecaseId] })],
)

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
})

export const usecaseNotes = sqliteTable(
  "usecase_notes",
  {
    usecaseId: integer("usecase_id")
      .notNull()
      .references(() => usecases.id, { onDelete: "cascade" }),
    noteId: integer("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.usecaseId, t.noteId] })],
)

export const vocabulary = sqliteTable(
  "vocabulary",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    usecaseId: integer("usecase_id")
      .notNull()
      .references(() => usecases.id, { onDelete: "cascade" }),
    lastRepetitionDate: integer("last_repetition_date", { mode: "timestamp" }),
    overallScore: integer("overall_score").notNull().default(0),
    repetitionsCount: integer("repetitions_count").notNull().default(0),

    // Usecase overrides (shadowing)
    imgUrl: text("img_url"),
    description: text("description"),
    translation: text("translation"),
    rudeness: integer("rudeness").notNull().default(0),
    formality: integer("formality").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.usecaseId] }),
    check("vocab_score_non_negative", sql`${t.overallScore} >= 0`),
    check("vocab_reps_non_negative", sql`${t.repetitionsCount} >= 0`),
  ],
)
