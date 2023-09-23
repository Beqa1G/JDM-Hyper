import {
  date,
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

export type Country = typeof countries.$inferSelect;

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  countryId: integer("country_id").references(() => countries.id),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }),
  email: varchar("email", { length: 256 }),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  password: varchar("password", { length: 256 }),
  phoneNumber: varchar("phone_number", { length: 15 }),
  countryId: integer("country_id").references(() => countries.id),
  cityId: integer("city_id").references(() => cities.id),
  dateOfBirth: date("date_of_birth"),
  genderId: integer("gender_id").references(() => gender.id),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;