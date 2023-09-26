import { eq } from "drizzle-orm";
import { users } from "../schema/schema";
import { db } from "../db/database";
import bcrypt from "bcrypt";
import { ReferenceTable, storeAsId } from "./storeAsId";

export async function updateUserProperty(
  userId: number,
  propertyName: string,
  propertyValue: string | number
) {
  await db
    .update(users)
    .set({ [propertyName]: propertyValue })
    .where(eq(users.id, userId));
}

export async function updatePassword(userId: number, newPassword: string) {
  const hashPassword = bcrypt.hashSync(newPassword, 10);
  await db
    .update(users)
    .set({ password: hashPassword })
    .where(eq(users.id, userId));
}

export async function updateAndStoreAsId(
  userId: number,
  propertyName: string,
  propertyValue: string,
  referenceTable: ReferenceTable
) {
  /*   const selectedId = await db
    .select({ [propertyName]: referenceTable.id })
    .from(referenceTable)
    .where(eq(referenceTable.name, propertyValue));

  const id = selectedId[0][propertyName]; */

  const id = await storeAsId(propertyName, propertyValue, referenceTable);

  await db
    .update(users)
    .set({ [propertyName]: id })
    .where(eq(users.id, userId));
}
