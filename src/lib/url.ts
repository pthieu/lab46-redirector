import { eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';

import { createDb } from '~/db';
import { UrlTable } from '~/db/schema/schema';

const ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const nanoid = customAlphabet(ALPHABET, 10);
const db = await createDb();

export async function generateKey() {
  return nanoid();
}

export async function createShortUrl(url: string) {
  let exists = true;
  let key;
  while (exists) {
    key = await generateKey();
    const rows = await db
      .select()
      .from(UrlTable)
      .where(eq(UrlTable.key, key))
      .limit(1);
    const row = rows?.[0];

    exists = Boolean(row);
  }
  const insertedRows = await db
    .insert(UrlTable)
    .values({ key, url })
    .returning();
  const inserted = insertedRows[0];
  return inserted;
}
