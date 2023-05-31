import {
  index,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const urls = pgTable(
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

export const events = pgTable('events', {
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
