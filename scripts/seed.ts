import { eq, sql } from "drizzle-orm"
import { db } from "../src/db"
import * as s from "../src/schema"

// ---- helpers ----------------------------------------------------------------

// Symmetric relation: user can traverse either direction, so we store both rows.
function symRelation(relationId: number, a: number, b: number) {
  return [
    { leftUsecaseId: a, rightUsecaseId: b, relationId },
    { leftUsecaseId: b, rightUsecaseId: a, relationId },
  ]
}

// Directional relation: forward + backward use the SAME relationId now.
// Direction is a property of the `relations` row, not the pair. If you need
// "hypernym/hyponym" as two distinct names, you need two relation rows.
function dirRelation(relationId: number, a: number, b: number) {
  return [
    { leftUsecaseId: a, rightUsecaseId: b, relationId },
    { leftUsecaseId: b, rightUsecaseId: a, relationId },
  ]
}

async function main() {
  // ---- wipe (children first) -----------------------------------------------
  await db.delete(s.vocabulary)
  await db.delete(s.usecaseNotes)
  await db.delete(s.notes)
  await db.delete(s.examples)
  await db.delete(s.usecasesRelations)
  await db.delete(s.relations)
  await db.delete(s.wordsUsecases)
  await db.delete(s.usecases)
  await db.delete(s.words)
  await db.delete(s.languages)
  await db.delete(s.users)

  // ---- language ------------------------------------------------------------
  const [eng] = await db
    .insert(s.languages)
    .values([{ name: "English", icon: "🇬🇧" }])
    .returning()

  // ---- words ---------------------------------------------------------------
  const wordValues = [
    "corrode",
    "erode",
    "eradicate",
    "eliminate",
    "annihilate",
    "destroy",
    "remove",
    "create",
    "weaken",
    "obliterate",
    "exterminate",
    "build",
    "damage",
  ]

  const wordRows = await db
    .insert(s.words)
    .values(wordValues.map((value) => ({ languageId: eng.id, value })))
    .returning()

  const W = Object.fromEntries(wordRows.map((w) => [w.value, w.id])) as Record<string, number>

  // ---- usecase seeds -------------------------------------------------------
  type Seed = {
    word: string
    usedAs: string
    description: string
    translation: string
    rudeness: number
    formality: number
    examples: string[]
  }

  const seeds: Seed[] = [
    // corrode
    {
      word: "corrode",
      usedAs: "verb",
      description: "to destroy or damage metal or stone by chemical action (acid, rust, oxidation)",
      translation: "разъедать (о кислоте, ржавчине)",
      rudeness: 0,
      formality: 1,
      examples: [
        "Acid rain corroded the bronze statue.",
        "Salt water corrodes the hull of the ship.",
      ],
    },
    {
      word: "corrode",
      usedAs: "verb",
      description: "to gradually destroy or undermine a feeling, relationship, or quality",
      translation: "подтачивать, разъедать (перен.)",
      rudeness: 0,
      formality: 1,
      examples: ["Jealousy corroded their friendship over the years."],
    },
    // erode
    {
      word: "erode",
      usedAs: "verb",
      description:
        "to wear away the surface of rock, soil, or land by wind, water, or other natural forces",
      translation: "размывать, выветривать",
      rudeness: 0,
      formality: 1,
      examples: [
        "The river eroded the canyon walls over millions of years.",
        "Wind erosion shaped the desert rocks.",
      ],
    },
    {
      word: "erode",
      usedAs: "verb",
      description:
        "to gradually weaken or destroy something abstract such as trust, power, or value",
      translation: "подрывать, постепенно ослаблять",
      rudeness: 0,
      formality: 1,
      examples: [
        "Inflation erodes people's savings.",
        "Repeated scandals eroded public trust in the government.",
      ],
    },
    // eradicate
    {
      word: "eradicate",
      usedAs: "verb",
      description:
        "to destroy or get rid of something completely, especially something bad and widespread",
      translation: "искоренять, уничтожать полностью",
      rudeness: 0,
      formality: 2,
      examples: [
        "The government vowed to eradicate corruption.",
        "We must eradicate this disease from the population.",
      ],
    },
    {
      word: "eradicate",
      usedAs: "verb",
      description: "to wipe out a disease, pest, or invasive species completely",
      translation: "истреблять, ликвидировать (болезнь)",
      rudeness: 0,
      formality: 2,
      examples: ["Smallpox was eradicated worldwide in 1980."],
    },
    // eliminate
    {
      word: "eliminate",
      usedAs: "verb",
      description: "to completely remove or get rid of something, often neutral in tone",
      translation: "устранять, удалять",
      rudeness: 0,
      formality: 1,
      examples: [
        "We need to eliminate all errors from the report.",
        "The new system eliminates the need for paperwork.",
      ],
    },
    {
      word: "eliminate",
      usedAs: "verb",
      description: "to defeat a competitor so that they leave a tournament",
      translation: "выбивать, исключать (из соревнования)",
      rudeness: 0,
      formality: 1,
      examples: ["The team was eliminated in the semifinals."],
    },
    // annihilate
    {
      word: "annihilate",
      usedAs: "verb",
      description: "to destroy something completely and violently; extreme physical destruction",
      translation: "уничтожать, аннигилировать",
      rudeness: 1,
      formality: 1,
      examples: [
        "The bomb annihilated the entire block.",
        "A single hurricane can annihilate coastal towns.",
      ],
    },
    {
      word: "annihilate",
      usedAs: "verb",
      description: "to defeat an opponent overwhelmingly",
      translation: "разгромить, разнести в пух и прах",
      rudeness: 1,
      formality: 0,
      examples: ["They annihilated the opposing team 10–0."],
    },
    // obliterate
    {
      word: "obliterate",
      usedAs: "verb",
      description: "to destroy something completely so that no trace remains; often dramatic",
      translation: "стирать с лица земли, уничтожать",
      rudeness: 1,
      formality: 1,
      examples: [
        "The explosion obliterated the building.",
        "Time obliterated all evidence of the settlement.",
      ],
    },
    // exterminate
    {
      word: "exterminate",
      usedAs: "verb",
      description: "to kill all members of a group, especially pests or a targeted population",
      translation: "истреблять, уничтожать поголовно",
      rudeness: 1,
      formality: 1,
      examples: [
        "The landlord hired a company to exterminate the rats.",
        "The regime tried to exterminate the entire ethnic group.",
      ],
    },
    // destroy
    {
      word: "destroy",
      usedAs: "verb",
      description: "to damage something so badly that it no longer exists or can be used",
      translation: "разрушать, уничтожать",
      rudeness: 0,
      formality: 1,
      examples: [
        "The fire destroyed the warehouse.",
        "The earthquake destroyed hundreds of homes.",
      ],
    },
    // damage
    {
      word: "damage",
      usedAs: "verb",
      description: "to harm something so that it is less useful or valuable",
      translation: "повреждать, наносить ущерб",
      rudeness: 0,
      formality: 1,
      examples: ["The storm damaged the roof.", "Smoking damages your lungs."],
    },
    // remove
    {
      word: "remove",
      usedAs: "verb",
      description: "to take something away from a place or position",
      translation: "удалять, убирать",
      rudeness: 0,
      formality: 1,
      examples: [
        "Please remove your shoes before entering.",
        "The surgeon removed the tumor successfully.",
      ],
    },
    // weaken
    {
      word: "weaken",
      usedAs: "verb",
      description: "to make or become less strong",
      translation: "ослаблять",
      rudeness: 0,
      formality: 1,
      examples: ["The illness weakened him considerably."],
    },
    // create
    {
      word: "create",
      usedAs: "verb",
      description: "to bring something into existence",
      translation: "создавать",
      rudeness: 0,
      formality: 1,
      examples: ["She created a beautiful painting."],
    },
    // build
    {
      word: "build",
      usedAs: "verb",
      description: "to construct something by putting parts together",
      translation: "строить, возводить",
      rudeness: 0,
      formality: 1,
      examples: [
        "They built a new bridge over the river.",
        "She built a successful career from scratch.",
      ],
    },
  ]

  // ---- usecases (app-scoped) ----------------------------------------------
  const usecaseRows = await db
    .insert(s.usecases)
    .values(
      seeds.map((u) => ({
        scope: "app" as const,
        userId: null,
        parentId: null,
        imgUrl: null,
        description: u.description,
        translation: u.translation,
        rudeness: u.rudeness,
        formality: u.formality,
      })),
    )
    .returning()

  // map word -> usecase ids, and pick first as the "primary" for relations
  const U: Record<string, number[]> = {}
  seeds.forEach((u, i) => {
    ;(U[u.word] ??= []).push(usecaseRows[i].id)
  })
  const P = Object.fromEntries(Object.entries(U).map(([w, ids]) => [w, ids[0]])) as Record<
    string,
    number
  >

  // ---- words <-> usecases --------------------------------------------------
  await db.insert(s.wordsUsecases).values(
    seeds.map((u, i) => ({
      wordId: W[u.word],
      usecaseId: usecaseRows[i].id,
      usedAs: u.usedAs,
    })),
  )

  // ---- examples ------------------------------------------------------------
  await db
    .insert(s.examples)
    .values(
      seeds.flatMap((u, i) => u.examples.map((value) => ({ usecaseId: usecaseRows[i].id, value }))),
    )

  // ---- relations configs ---------------------------------------------------
  // NOTE: your new `relations.name` is globally UNIQUE (not per-scope).
  // So "synonym" cannot exist both as app and as user. Fine for seeds — all app.
  const relationRows = await db
    .insert(s.relations)
    .values([
      { scope: "app", userId: null, name: "synonym", direction: "bidirectional" },
      { scope: "app", userId: null, name: "antonym", direction: "bidirectional" },
      { scope: "app", userId: null, name: "hypernym", direction: "unidirectional" },
      { scope: "app", userId: null, name: "hyponym", direction: "unidirectional" },
    ])
    .returning()

  const R = Object.fromEntries(relationRows.map((r) => [r.name, r.id])) as Record<string, number>

  // ---- usecase relations ---------------------------------------------------
  // Because `usecases_relations` PK is (left, right, relationId) and relations
  // are directional, we store BOTH rows for every relation. Traversal logic
  // reads direction from the `relations` row + which side you're on.
  //
  // Hypernym/hyponym: the OLD schema stored mirrored *values*. The NEW schema
  // has no `value` column on the pair — instead you record (destroy → annihilate,
  // relationId = hypernym) AND (destroy → annihilate, relationId = hyponym)?
  // That's ambiguous. Cleanest model below: use ONE direction = 'unidirectional'
  // and store (hypernym → hyponym). The inverse is inferred by flipping sides.
  await db.insert(s.usecasesRelations).values([
    // synonyms (bidirectional → 2 rows)
    ...symRelation(R.synonym, P.corrode, P.erode),
    ...symRelation(R.synonym, P.eradicate, P.eliminate),
    ...symRelation(R.synonym, P.eliminate, P.annihilate),
    ...symRelation(R.synonym, P.eradicate, P.annihilate),
    ...symRelation(R.synonym, P.annihilate, P.obliterate),
    ...symRelation(R.synonym, P.eradicate, P.exterminate),

    // antonyms (bidirectional → 2 rows)
    ...symRelation(R.antonym, P.destroy, P.create),
    ...symRelation(R.antonym, P.destroy, P.build),
    ...symRelation(R.antonym, P.eliminate, P.create),

    // hypernym: broader → narrower. One row per pair.
    { leftUsecaseId: P.destroy, rightUsecaseId: P.annihilate, relationId: R.hypernym },
    { leftUsecaseId: P.destroy, rightUsecaseId: P.eradicate, relationId: R.hypernym },
    { leftUsecaseId: P.destroy, rightUsecaseId: P.obliterate, relationId: R.hypernym },
    { leftUsecaseId: P.destroy, rightUsecaseId: P.exterminate, relationId: R.hypernym },
    { leftUsecaseId: P.remove, rightUsecaseId: P.eliminate, relationId: R.hypernym },
    { leftUsecaseId: P.weaken, rightUsecaseId: P.erode, relationId: R.hypernym },
    { leftUsecaseId: P.damage, rightUsecaseId: P.corrode, relationId: R.hypernym },
    { leftUsecaseId: P.damage, rightUsecaseId: P.erode, relationId: R.hypernym },

    // hyponym: narrower → broader (mirror rows so you can query both directions
    // without CASE logic; relation id is the same pair-type but flipped sides)
    { leftUsecaseId: P.annihilate, rightUsecaseId: P.destroy, relationId: R.hyponym },
    { leftUsecaseId: P.eradicate, rightUsecaseId: P.destroy, relationId: R.hyponym },
    { leftUsecaseId: P.obliterate, rightUsecaseId: P.destroy, relationId: R.hyponym },
    { leftUsecaseId: P.exterminate, rightUsecaseId: P.destroy, relationId: R.hyponym },
    { leftUsecaseId: P.eliminate, rightUsecaseId: P.remove, relationId: R.hyponym },
    { leftUsecaseId: P.erode, rightUsecaseId: P.weaken, relationId: R.hyponym },
    { leftUsecaseId: P.corrode, rightUsecaseId: P.damage, relationId: R.hyponym },
    { leftUsecaseId: P.erode, rightUsecaseId: P.damage, relationId: R.hyponym },
  ])

  // ---- notes ---------------------------------------------------------------
  const noteRows = await db
    .insert(s.notes)
    .values([
      {
        content:
          "corrode vs erode\n" +
          "• corrode — chemical action (acid, rust, oxidation). Typical object: metal. e.g. 'acid corrodes steel'.\n" +
          "• erode — physical/mechanical action (wind, water, friction). Typical object: rock, soil, land. e.g. 'the river erodes the bank'.\n" +
          "• Figuratively both mean 'slowly weaken'. Corrode implies internal, chemical-like decay ('jealousy corroded the bond'); erode implies external, gradual wearing ('scandals eroded trust').",
      },
      {
        content:
          "eradicate vs eliminate vs annihilate\n" +
          "• eradicate — destroy completely, usually something bad and widespread (disease, poverty, corruption). Implies rooting it out entirely. Formal register.\n" +
          "• eliminate — remove completely; neutral tone. Often about options, errors, competitors. Less violent.\n" +
          "• annihilate — destroy completely and violently; extreme. Physical destruction or total defeat.",
      },
      {
        content:
          "hypernym / hyponym direction\n" +
          "• hypernym — broader term. destroy is a hypernym of annihilate.\n" +
          "• hyponym — narrower term. annihilate is a hyponym of destroy.\n" +
          "• stored as mirrored rows so the graph is traversable from either side.",
      },
    ])
    .returning()

  await db.insert(s.usecaseNotes).values([
    { usecaseId: P.corrode, noteId: noteRows[0].id },
    { usecaseId: P.erode, noteId: noteRows[0].id },

    { usecaseId: P.eradicate, noteId: noteRows[1].id },
    { usecaseId: P.eliminate, noteId: noteRows[1].id },
    { usecaseId: P.annihilate, noteId: noteRows[1].id },

    { usecaseId: P.destroy, noteId: noteRows[2].id },
    { usecaseId: P.annihilate, noteId: noteRows[2].id },
  ])

  // ---- user + vocabulary ---------------------------------------------------
  const [alice] = await db.insert(s.users).values({ name: "Alice", username: "alice" }).returning()

  await db.insert(s.vocabulary).values([
    {
      userId: alice.id,
      usecaseId: P.corrode,
      score: 42,
      repetitionsCount: 3,
      lastRepetitionDate: new Date(),
    },
    {
      userId: alice.id,
      usecaseId: P.eradicate,
      // NOTE: shadowing fields (description/rudeness/formality) were REMOVED
      // from `vocabulary` in your new schema. To override for a user, you now
      // create a *user-scoped usecase* with parentId = original usecase.
      score: 10,
      repetitionsCount: 1,
    },
  ])

  console.log(
    `seeded: ${wordRows.length} words, ${usecaseRows.length} usecases, ` +
      `${relationRows.length} relations, ${noteRows.length} notes, 1 user`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
