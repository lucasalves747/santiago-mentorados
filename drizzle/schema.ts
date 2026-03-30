import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, float } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Diagnósticos Iniciais ────────────────────────────────────────────────────

export const diagnosticos = mysqlTable("diagnosticos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull().default(""),
  email: varchar("email", { length: 320 }).default(""),
  dados: json("dados").notNull(), // FormData completo como JSON
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Diagnostico = typeof diagnosticos.$inferSelect;
export type InsertDiagnostico = typeof diagnosticos.$inferInsert;

// ─── Diários de Transformação ─────────────────────────────────────────────────

export const diarios = mysqlTable("diarios", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull().default(""),
  data: varchar("data", { length: 10 }).notNull(), // YYYY-MM-DD
  // Escalas numéricas para gráficos
  qualidadeSono: int("qualidadeSono").default(0),
  energiaManha: int("energiaManha").default(0),
  energiaTarde: int("energiaTarde").default(0),
  energiaNoite: int("energiaNoite").default(0),
  humorGeral: int("humorGeral").default(0),
  nivelFoco: int("nivelFoco").default(0),
  // Dados completos como JSON
  dados: json("dados").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Diario = typeof diarios.$inferSelect;
export type InsertDiario = typeof diarios.$inferInsert;
