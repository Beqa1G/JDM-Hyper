import {
  integer,
  pgEnum,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const gender = pgTable("gender", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
});

export const countries = pgTable(
  "countries",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
  },
  (countries) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(countries.name),
    };
  }
);

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  countryId: integer("country_id").references(() => countries.id),
});
