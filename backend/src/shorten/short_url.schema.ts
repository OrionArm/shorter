import { InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const shortUrls = pgTable('short_urls', {
  id: serial('id').primaryKey(),
  url: varchar('url', { length: 2048 }).notNull(),
  alias: varchar('alias', { length: 20 }).notNull().unique(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type ShortUrl = InferSelectModel<typeof shortUrls>;
