import { createDb } from '~/db';
import { EventTable, NewEvent } from '~/db/schema/schema';
import { EventKey } from '~/types';

interface IEventTrack {
  key: EventKey;
  data?: { [key: string]: unknown };
}

const db = await createDb();

export async function track(event: IEventTrack) {
  try {
    const { key, data } = event;
    if (!key) {
      throw new Error('`key` not specified');
    }

    const newEvent: NewEvent = { key, data };
    await db.insert(EventTable).values(newEvent).returning();
  } catch (e) {
    return console.error('Could not track event:', e);
  }
}
