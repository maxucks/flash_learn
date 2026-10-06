import { db } from "../src/db"
import * as s from "../src/schema"

function rel(a: number, b: number, value: string) {
  return [
    { leftUsecaseId: a, rightUsecaseId: b, value },
    { leftUsecaseId: b, rightUsecaseId: a, value },
  ]
}

function dir(a: number, b: number, forward: string, backward: string) {
  return [
    { leftUsecaseId: a, rightUsecaseId: b, value: forward },
    { leftUsecaseId: b, rightUsecaseId: a, value: backward },
  ]
}

async function main() {
  await db.delete(s.vocabulary)
  await db.delete(s.usecaseNotes)
  await db.delete(s.notes)
  await db.delete(s.examples)
  await db.delete(s.usecasesRelations)
  await db.delete(s.wordsUsecases)
  await db.delete(s.usecases)
  await db.delete(s.words)
  await db.delete(s.languages)
  await db.delete(s.users)

  const [eng] = await db
    .insert(s.languages)
    .values([{ name: "English", icon: "🇬🇧" }])
    .returning()

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

  type Seed = {
    word: keyof typeof W
    usedAs: string
    description: string
    translation: string
    rudeness: number
    formality: number
    examples: string[]
  }

  const seeds: Seed[] = [
    // ---------- corrode ----------
    {
      word: "corrode",
      usedAs: "verb",
      description: "to destroy or damage metal or stone by chemical action (acid, rust, oxidation)",
      translation: "разъедать (о кислоте, ржавчине)",
      rudeness: 0,
      formality: 1,
      examples: ["Acid rain corroded the bronze statue.", "Salt water corrodes the hull of the ship."],
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

    // ---------- erode ----------
    {
      word: "erode",
      usedAs: "verb",
      description: "to wear away the surface of rock, soil, or land by wind, water, or other natural forces",
      translation: "размывать, выветривать",
      rudeness: 0,
      formality: 1,
      examples: ["The river eroded the canyon walls over millions of years.", "Wind erosion shaped the desert rocks."],
    },
    {
      word: "erode",
      usedAs: "verb",
      description: "to gradually weaken or destroy something abstract such as trust, power, or value",
      translation: "подрывать, постепенно ослаблять",
      rudeness: 0,
      formality: 1,
      examples: ["Inflation erodes people's savings.", "Repeated scandals eroded public trust in the government."],
    },

    // ---------- eradicate ----------
    {
      word: "eradicate",
      usedAs: "verb",
      description: "to destroy or get rid of something completely, especially something bad and widespread",
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

    // ---------- eliminate ----------
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

    // ---------- annihilate ----------
    {
      word: "annihilate",
      usedAs: "verb",
      description: "to destroy something completely and violently; extreme physical destruction",
      translation: "уничтожать, аннигилировать",
      rudeness: 1,
      formality: 1,
      examples: ["The bomb annihilated the entire block.", "A single hurricane can annihilate coastal towns."],
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

    // ---------- obliterate ----------
    {
      word: "obliterate",
      usedAs: "verb",
      description: "to destroy something completely so that no trace remains; often dramatic",
      translation: "стирать с лица земли, уничтожать",
      rudeness: 1,
      formality: 1,
      examples: ["The explosion obliterated the building.", "Time obliterated all evidence of the settlement."],
    },

    // ---------- exterminate ----------
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

    // ---------- destroy ----------
    {
      word: "destroy",
      usedAs: "verb",
      description: "to damage something so badly that it no longer exists or can be used",
      translation: "разрушать, уничтожать",
      rudeness: 0,
      formality: 1,
      examples: ["The fire destroyed the warehouse.", "The earthquake destroyed hundreds of homes."],
    },

    // ---------- damage ----------
    {
      word: "damage",
      usedAs: "verb",
      description: "to harm something so that it is less useful or valuable",
      translation: "повреждать, наносить ущерб",
      rudeness: 0,
      formality: 1,
      examples: ["The storm damaged the roof.", "Smoking damages your lungs."],
    },

    // ---------- remove ----------
    {
      word: "remove",
      usedAs: "verb",
      description: "to take something away from a place or position",
      translation: "удалять, убирать",
      rudeness: 0,
      formality: 1,
      examples: ["Please remove your shoes before entering.", "The surgeon removed the tumor successfully."],
    },

    // ---------- weaken ----------
    {
      word: "weaken",
      usedAs: "verb",
      description: "to make or become less strong",
      translation: "ослаблять",
      rudeness: 0,
      formality: 1,
      examples: ["The illness weakened him considerably."],
    },

    // ---------- create ----------
    {
      word: "create",
      usedAs: "verb",
      description: "to bring something into existence",
      translation: "создавать",
      rudeness: 0,
      formality: 1,
      examples: ["She created a beautiful painting."],
    },

    // ---------- build ----------
    {
      word: "build",
      usedAs: "verb",
      description: "to construct something by putting parts together",
      translation: "строить, возводить",
      rudeness: 0,
      formality: 1,
      examples: ["They built a new bridge over the river.", "She built a successful career from scratch."],
    },
  ]

  const usecaseRows = await db
    .insert(s.usecases)
    .values(
      seeds.map((u) => ({
        imgUrl: null,
        description: u.description,
        translation: u.translation,
        rudeness: u.rudeness,
        formality: u.formality,
      })),
    )
    .returning()

  const U = {} as Record<string, number[]>
  seeds.forEach((u, i) => {
    ;(U[u.word] ??= []).push(usecaseRows[i].id)
  })

  const P = Object.fromEntries(Object.entries(U).map(([w, ids]) => [w, ids[0]])) as Record<string, number>

  await db.insert(s.wordsUsecases).values(
    seeds.map((u, i) => ({
      wordId: W[u.word],
      usecaseId: usecaseRows[i].id,
      usedAs: u.usedAs,
    })),
  )

  await db
    .insert(s.examples)
    .values(seeds.flatMap((u, i) => u.examples.map((value) => ({ usecaseId: usecaseRows[i].id, value }))))

  await db.insert(s.usecasesRelations).values([
    // synonyms (symmetric → both directions)
    ...rel(P.corrode, P.erode, "synonym"),
    ...rel(P.eradicate, P.eliminate, "synonym"),
    ...rel(P.eliminate, P.annihilate, "synonym"),
    ...rel(P.eradicate, P.annihilate, "synonym"),
    ...rel(P.annihilate, P.obliterate, "synonym"),
    ...rel(P.eradicate, P.exterminate, "synonym"),

    // antonyms (symmetric → both directions)
    ...rel(P.destroy, P.create, "antonym"),
    ...rel(P.destroy, P.build, "antonym"),
    ...rel(P.eliminate, P.create, "antonym"),

    // hypernym / hyponym (directional → both directions, mirrored value)
    ...dir(P.destroy, P.annihilate, "hypernym", "hyponym"),
    ...dir(P.destroy, P.eradicate, "hypernym", "hyponym"),
    ...dir(P.destroy, P.obliterate, "hypernym", "hyponym"),
    ...dir(P.destroy, P.exterminate, "hypernym", "hyponym"),
    ...dir(P.remove, P.eliminate, "hypernym", "hyponym"),
    ...dir(P.weaken, P.erode, "hypernym", "hyponym"),
    ...dir(P.damage, P.corrode, "hypernym", "hyponym"),
    ...dir(P.damage, P.erode, "hypernym", "hyponym"),
  ])

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
          "• stored as two rows with mirrored values so the graph is traversable from either side.",
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

  const [alice] = await db.insert(s.users).values({ name: "Alice", username: "alice", xp: 120 }).returning()

  await db.insert(s.vocabulary).values([
    {
      userId: alice.id,
      usecaseId: P.corrode,
      overallScore: 42,
      repetitionsCount: 3,
      lastRepetitionDate: new Date(),
    },
    {
      userId: alice.id,
      usecaseId: P.eradicate,
      description: "Alice's note: only used in formal writing",
      rudeness: 0,
      formality: 2,
      overallScore: 10,
      repetitionsCount: 1,
    },
  ])

  console.log(`seeded: ${wordRows.length} words, ${usecaseRows.length} usecases, ` + `${noteRows.length} notes, 1 user`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
