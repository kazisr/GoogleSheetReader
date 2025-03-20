import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Google Sheets configuration
export const sheetsConfig = pgTable("sheets_config", {
  id: serial("id").primaryKey(),
  spreadsheetId: text("spreadsheet_id").notNull(),
  range: text("range").notNull(),
});

export const insertSheetsConfigSchema = createInsertSchema(sheetsConfig).pick({
  spreadsheetId: true,
  range: true,
});

export type InsertSheetsConfig = z.infer<typeof insertSheetsConfigSchema>;
export type SheetsConfig = typeof sheetsConfig.$inferSelect;

// Keep the users table for backend authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
