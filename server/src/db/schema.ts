// Drizzle schema (Step 2). Requires `drizzle-orm` + `pg` to be installed.
// Kept as a documented skeleton until those dependencies are added.
//
// export const genderEnum = pgEnum("gender", ["male", "female", "all-gender"]);
// export const tagEnum = pgEnum("tag", ["soapPump", "vending", "bidet", "seatCover"]);
//
// export const buildings = pgTable("buildings", {
//   id: serial("id").primaryKey(),
//   code: text("code").notNull().unique(),
//   name: text("name").notNull().unique(),
// });
//
// export const restrooms = pgTable("restrooms", {
//   restroomId: text("restroom_id").primaryKey(),
//   name: text("name").notNull(),
//   buildingId: integer("building_id").notNull().references(() => buildings.id),
//   floor: integer("floor").notNull(),
//   gender: genderEnum("gender").notNull(),
//   isPwdAccessible: boolean("is_pwd_accessible").notNull().default(false),
//   tags: tagEnum("tags").array().notNull().default(sql`'{}'`),
//   stallCount: integer("stall_count").notNull().default(0),
//   reviewCount: integer("review_count").notNull().default(0),
//   cleanliness: numeric("cleanliness", { precision: 2, scale: 1, mode: "number" }),
//   smell: numeric("smell", { precision: 2, scale: 1, mode: "number" }),
//   privacy: numeric("privacy", { precision: 2, scale: 1, mode: "number" }),
//   comfort: numeric("comfort", { precision: 2, scale: 1, mode: "number" }),
//   accessibility: numeric("accessibility", { precision: 2, scale: 1, mode: "number" }),
// }, (t) => [index("restrooms_tags_idx").using("gin", t.tags)]);
export {};
