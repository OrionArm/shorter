import { InferSelectModel } from 'drizzle-orm';
import { inet, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { shortUrls } from './short_url.schema';

export const urlVisits = pgTable('url_visits', {
  id: serial('id').primaryKey(),
  alias: varchar('alias', { length: 20 })
    .notNull()
    .references(() => shortUrls.alias),
  ipAddress: inet('ip_address').notNull(),
  visitedAt: timestamp('visited_at').defaultNow(),
});

export type UrlVisits = InferSelectModel<typeof urlVisits>;
