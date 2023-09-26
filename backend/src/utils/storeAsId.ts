import { eq } from "drizzle-orm";
import { db } from "../db/database";
import { cities, countries, gender } from "../schema/schema";

export type ReferenceTable = typeof countries | typeof gender | typeof cities;


export async function storeAsId(
  propertyName: string,
  propertyValue: string,
  referenceTable: ReferenceTable
) {
  const selectedId = await db
    .select({ [propertyName]: referenceTable.id })
    .from(referenceTable)
    .where(eq(referenceTable.name, propertyValue));

  const id = selectedId[0][propertyName];

  return id;
}
