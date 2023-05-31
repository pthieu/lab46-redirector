import { InferModel } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const UrlTable = pgTable(
  'urls',
  {
    id: serial('id').primaryKey().notNull(),
    key: varchar('key', { length: 255 }),
    url: text('url').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      keyIdx: index().on(table.key),
    };
  },
);

export const EventTable = pgTable('events', {
  id: serial('id').primaryKey().notNull(),
  key: varchar('key', { length: 255 }).notNull(),
  data: jsonb('data'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
});

export type Url = InferModel<typeof UrlTable>;
export type NewUrl = InferModel<typeof UrlTable, 'insert'>;

export type Event = InferModel<typeof EventTable>;
export type NewEvent = InferModel<typeof EventTable, 'insert'>;
