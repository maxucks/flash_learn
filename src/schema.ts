import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  unique,
} from "drizzle-orm/sqlite-core";

export const words = sqliteTable("words", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  meaning: text("meaning"),
  translation: text("translation").notNull(),
  imgUrl: text("img_url"),
});

export const relations = sqliteTable(
  "relations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type").notNull(),
    word1Id: integer("word1_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
    word2Id: integer("word2_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
  },
  (table) => [unique("unique_word_pair").on(table.word1Id, table.word2Id)],
);

export const usecases = sqliteTable("usecases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
});

export const wordsUsecases = sqliteTable(
  "words_usecases",
  {
    wordId: integer("word_id")
      .notNull()
      .references(() => words.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    usecaseId: integer("usecase_id")
      .notNull()
      .references(() => usecases.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.wordId, table.usecaseId] })],
);
