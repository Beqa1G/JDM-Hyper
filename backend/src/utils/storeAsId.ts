import { eq } from "drizzle-orm";
import { db } from "../db/database";

export async function storeAsId(
  propertyName: string,
  propertyValue: string,
  referenceTable: any
) {
  const selectedId = await db
    .select({ [propertyName]: referenceTable.id })
    .from(referenceTable)
    .where(eq(referenceTable.name, propertyValue));

  const id = selectedId[0][propertyName];

  return id
}
