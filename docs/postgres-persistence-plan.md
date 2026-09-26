# Restroom Radar — Backend Persistence Roadmap (two-step plan)

> **Status: SHELVED — schedule for another session.**
> Frontend work comes first right now. This doc is the agreement for when we
> come back to it. The frontend can already be built against the API contract
> at the bottom of this file (GET `/restrooms` → `Restroom[]`), so nothing here
> blocks UI work today.

---

## Context (why this plan exists)

The Directory feature needs restroom data with floor/building/gender, PWD
accessibility, tags, and 5-dimension ratings (cleanliness, seatHeight,
bidetPressure, smell, crowdedness) at overall + per-stall level.

The repo is a BHVR-stack monorepo: **Bun + Hono + Vite + React** via Turborepo
workspaces (`client/`, `server/`, `shared/`).

**Reality check (Sep 2026):** the in-memory `RestroomRepository` was planned but
never implemented. `server/src/db/` does not exist, `shared` types are still
minimal (`{ restroomId: number; name }`), and `GET /restrooms` still serves a
hardcoded "Great Farticus" array. So the work is **two steps**: build the
in-memory foundation first, then replace it with Postgres behind the same
interface.

---

## Locked decisions (already agreed)

| Decision | Resolution |
|---|---|
| **IDs** | `restroomId: string`, user-defined campus codes (`WM301` scheme: `{building}{gender}{floor}{room}`). No auto-increment. |
| **Gender** | `"male" \| "female" \| "all-gender"` (campus terminology) |
| **Ratings** | `ratings` table + `scope` discriminator (`'overall' \| 'stall'`), one row = current aggregate `RatingSet` per entity |
| **Tags** | Postgres enum array `tag[]` on `restrooms` + GIN index |
| **Building/floor** | `buildings` lookup table (code + name), `building_id` FK; `floor` int with CHECK 1–6 |
| **Driver** | `node-postgres` (`pg`) via `drizzle-orm/node-postgres` — see rationale |
| **Repository interface** | `async` (`Promise<...>`) so both in-memory and Postgres impls satisfy it |
| **API shape** | Stays **unchanged** (nested `Restroom`/`Stall`/`RatingSet` in `shared`) no matter what storage is behind it |
| **Client** | Never touched by this roadmap — server + shared only |

### Driver rationale (for the record)

Drizzle's Bun docs push `drizzle-orm/bun-sql` ("crazy fast", zero driver dep),
but `create()` needs an atomic transaction across restrooms + stalls + ratings,
and transaction support is far more battle-tested on node-postgres. `pg` is
Drizzle's flagship Postgres driver, supports per-query type parsers, has an
optional `pg-native` speedup, and runs flawlessly under Bun's Node-compat.
`postgres.js` is the middle option but prepares statements by default (a known
AWS/serverless gotcha). → **pg for reliability; revisit bun-sql later if the
read path ever needs perf.**

---

## Step 1 — In-memory foundation (no new dependencies)

Goal: unblock feature work with a dependency-free dev DB; everything the
Postgres step needs is already in place behind clean boundaries.

### Files

| File | Purpose |
|---|---|
| `shared/src/types/index.ts` | Expand types (below) |
| `server/src/db/repository.ts` | `RestroomRepository` interface |
| `server/src/db/data/restrooms.ts` | **Single source of truth**: the 8-restroom dataset (`NewRestroom[]`) |
| `server/src/db/in-memory.ts` | Map-backed async implementation (returns copies) |
| `server/src/db/dev-account.ts` | `DevUser` + `getCurrentUser()` stub (unused for now) |
| `server/src/features/restrooms.ts` | Refactor to `createRestroomsApp(repo)` factory |
| `server/src/index.ts` | Composition root + env-based repo selection |

### Shared types (`shared/src/types/index.ts`)

```ts
export type Gender = "male" | "female" | "all-gender";
export type Tag = "vending" | "bidet" | "soapPump" | "seatCover";

export type RatingSet = {
  cleanliness: number;     // 1–5
  seatHeight: number;
  bidetPressure: number;
  smell: number;
  crowdedness: number;
};

export type Stall = {
  stallId: number;
  label: string;           // "Stall 1"
  ratings: RatingSet;      // per-stall
};

export type Restroom = {
  restroomId: string;      // "WM301"
  name: string;
  building: string;        // display name, e.g. "West Building"
  floor: number;
  gender: Gender;
  isPwdAccessible: boolean;
  tags: Tag[];
  stalls: Stall[];         // 2–4 per restroom
  ratings: RatingSet;      // overall
};

export type NewRestroom = Restroom; // id supplied by caller
```

### Repository interface (`server/src/db/repository.ts`)

```ts
export interface RestroomRepository {
  list(): Promise<Restroom[]>;
  getById(restroomId: string): Promise<Restroom | undefined>;
  create(input: NewRestroom): Promise<Restroom>; // throws on duplicate id
}
```

### Routes (`server/src/features/restrooms.ts`)

- `GET /restrooms` → `repo.list()` (replaces the hardcoded single-item array)
- `GET /restrooms/:id` → `repo.getById()` with `{ message: "Restroom not found" }` on 404
- `create()` stays in the interface only — no POST route yet.

### Env-based selection (composition root)

```ts
const repo = process.env.DATABASE_URL
  ? new PostgresRestroomRepository(getDb())          // Step 2
  : new InMemoryRestroomRepository(seedRestrooms);   // Step 1
```

Local dev runs without a DB by default (no `DATABASE_URL` set).

---

## Step 2 — Postgres persistence (Drizzle + pg)

Goal: real schema + migrations + `PostgresRestroomRepository` as a drop-in
replacement for Step 1's in-memory repo. Route handlers and shared client types
do not change.

### Dependencies (`server/`)

```
bun add drizzle-orm pg
bun add -D drizzle-kit @types/pg
```

> Drizzle docs currently target the `@rc` v1.0 line; pin the appropriate
> release at implementation time — the `pg-core` API used below is the same.

### Schema (`server/src/db/schema.ts`) — Drizzle `pg-core`

```ts
// Enums
export const genderEnum = pgEnum("gender", ["male", "female", "all-gender"]);
export const tagEnum    = pgEnum("tag", ["vending", "bidet", "soapPump", "seatCover"]);
export const scopeEnum  = pgEnum("rating_scope", ["overall", "stall"]);

// buildings — fixed Mapúa Intramuros taxonomy
export const buildings = pgTable("buildings", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),   // M | N | S | E | W
  name: text("name").notNull().unique(),   // "Main Building" | "North Building" | ...
});

// restrooms
export const restrooms = pgTable("restrooms", {
  restroomId: text("restroom_id").primaryKey(),          // "WM301"
  name: text("name").notNull(),
  buildingId: integer("building_id").notNull().references(() => buildings.id),
  floor: integer("floor").notNull().check(sql`floor between 1 and 6`),
  gender: genderEnum("gender").notNull(),
  isPwdAccessible: boolean("is_pwd_accessible").notNull().default(false),
  tags: tagEnum("tags").array().notNull().default(sql`'{}'`),
}, (t) => [index("restrooms_tags_idx").using("gin", t.tags)]);

// stalls
export const stalls = pgTable("stalls", {
  id: serial("id").primaryKey(),
  restroomId: text("restroom_id").notNull()
    .references(() => restrooms.restroomId, { onDelete: "cascade" }),
  label: text("label").notNull(),                         // "Stall 1"
}, (t) => [uniqueIndex("stalls_restroom_label_idx").on(t.restroomId, t.label)]);

// ratings — scope discriminator, exactly one FK set
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  scope: scopeEnum("scope").notNull(),
  restroomId: text("restroom_id").references(() => restrooms.restroomId, { onDelete: "cascade" }),
  stallId: integer("stall_id").references(() => stalls.id, { onDelete: "cascade" }),
  cleanliness: numeric("cleanliness", { precision: 2, scale: 1, mode: "number" }).notNull().check(sql`between 1 and 5`),
  seatHeight: numeric("seat_height",  { precision: 2, scale: 1, mode: "number" }).notNull().check(sql`between 1 and 5`),
  bidetPressure: numeric("bidet_pressure", { precision: 2, scale: 1, mode: "number" }).notNull().check(sql`between 1 and 5`),
  smell: numeric("smell",            { precision: 2, scale: 1, mode: "number" }).notNull().check(sql`between 1 and 5`),
  crowdedness: numeric("crowdedness", { precision: 2, scale: 1, mode: "number" }).notNull().check(sql`between 1 and 5`),
}, (t) => [
  check("ratings_scope_fk_check",
    sql`(scope = 'overall' and restroom_id is not null and stall_id is null)
     or (scope = 'stall'   and restroom_id is null   and stall_id is not null)`),
  unique("ratings_overall_uq").on(t.scope, t.restroomId),
  unique("ratings_stall_uq").on(t.scope, t.stallId),
]);
```

**Why this keeps the API unchanged:** `Restroom.stalls` ⇢ join+map to `Stall[]`;
`Restroom.ratings` ⇢ the one `scope='overall'` row; each stall's ratings ⇢ its
`scope='stall'` row. The UNIQUE constraints + scope CHECK preserve 1:1
"one RatingSet per entity". When real multi-person submissions arrive later,
this table gains identity columns (`submitted_by`, `created_at`) and becomes a
submission log with `AVG()` aggregates — a forward migration, not a rebuild.

### Types + mappers (`server/src/db/mappers.ts`)

- Infer row types: `export type RestroomRow = typeof restrooms.$inferSelect;` (and `$inferInsert`).
- `mapRatingSet(ratingRow)`, `mapStall(stallRow, ratingRow)`, `mapRestroom(restroomRow & buildingName, stalls, ratingRows)`.
- Mappers are the **only** place flat FK-based DB rows become the nested API shape.

### Repository (`server/src/db/postgres.ts`)

- `PostgresRestroomRepository implements RestroomRepository` — constructor takes a drizzle instance.
- `list()`: restrooms ⋈ buildings; stalls `WHERE restroom_id IN (...)`; ratings across both scopes; assemble via mappers (no N+1).
- `getById(id)`: same pattern, single restroom; `undefined` on miss.
- `create(input)`: one `db.transaction` — resolve `buildingId` by name (throw if not seeded), insert restroom → stalls (`returning id`) → overall + per-stall rating rows; map back. Duplicate id → translate `unique_violation` to the same error the in-memory repo throws.

### Client (`server/src/db/client.ts`) + selection

- `getDb()` — lazy singleton: `drizzle(new Pool({ connectionString: DATABASE_URL }))`.
- `.env.example` with `DATABASE_URL` (gitignored `.env`; Bun auto-loads it).
- Composition root picks `PostgresRestroomRepository` when `DATABASE_URL` is set, else in-memory.

### Migrations + seed

- `server/drizzle.config.ts` — `dialect: "postgresql"`, `schema: "./src/db/schema.ts"`, `out: "./drizzle"`, `dbCredentials.url` from env; generated SQL **committed**.
- Scripts (`server/package.json`): `db:generate`, `db:migrate`, `db:seed` (`bun run scripts/seed-db.ts`).
- `server/scripts/seed-db.ts` (outside `src/`, run via Bun): upsert `buildings`, then insert restrooms/stalls/ratings **derived from `data/restrooms.ts`** — identical dataset to in-memory. Seed values shaped to 1-decimal steps (`numeric(2,1)`) so both storages agree exactly.

### Verification

- `turbo build --filter=shared --filter=server` + `bun run lint` (Biome: tabs, double quotes; `verbatimModuleSyntax` ⇒ `import type`).
- `bun run db:generate` works fully offline.
- With a local `DATABASE_URL`: `db:migrate` → `db:seed` → curl `/restrooms`, `/restrooms/WM301`; then re-run curls with `DATABASE_URL` unset (in-memory) — outputs must match.

---

## API contract the frontend can build against today

```
GET /restrooms          → 200 Restroom[]
GET /restrooms/:id      → 200 Restroom | 404 { message: "Restroom not found" }
```

`Restroom` payload (nested shape, identical in both storage modes):

```jsonc
{
  "restroomId": "WM301",
  "name": "WM301",
  "building": "West Building",
  "floor": 3,
  "gender": "male",
  "isPwdAccessible": false,
  "tags": ["soapPump", "seatCover"],
  "stalls": [
    { "stallId": 1, "label": "Stall 1", "ratings": { "cleanliness": 3.5, "seatHeight": 4.0, "bidetPressure": 2.0, "smell": 3.0, "crowdedness": 4.0 } }
  ],
  "ratings": { "cleanliness": 4.0, "seatHeight": 4.5, "bidetPressure": 3.5, "smell": 4.0, "crowdedness": 3.0 }
}
```

Ratings display as 💩 emojis (1–5) client-side instead of stars.
`client/src/routes/directory.tsx` already polls `getRestrooms()` and renders
`data[0].name` — the Directory UI builds on that endpoint.

---

## Open items to confirm before implementing

1. **Mapúa building taxonomy** — default `{code, name}`: `M`/Main, `N`/North, `S`/South, `W`/West. Correct if the campus differs.
2. **Ratings precision** — `numeric(2,1)` (one decimal). Say so if you want two.
3. **Duplicate restroom `name` allowed** across buildings (codes like `WM301` stay unique; no unique constraint on `name`).