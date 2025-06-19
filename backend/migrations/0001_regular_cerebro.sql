ALTER TABLE "url_visits" DROP CONSTRAINT "url_visits_alias_short_urls_alias_fk";
--> statement-breakpoint
ALTER TABLE "url_visits" ADD CONSTRAINT "url_visits_alias_short_urls_alias_fk" FOREIGN KEY ("alias") REFERENCES "public"."short_urls"("alias") ON DELETE cascade ON UPDATE no action;