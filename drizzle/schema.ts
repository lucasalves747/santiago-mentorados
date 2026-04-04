import { integer, pgEnum, pgTable, text, timestamp, varchar, json, serial } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: roleEnum().default("user").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Diagnósticos Iniciais ────────────────────────────────────────────────────

export const diagnosticos = pgTable("diagnosticos", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull().default(""),
    email: varchar("email", { length: 320 }).default(""),
    dados: json("dados").notNull(), // FormData completo como JSON
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Diagnostico = typeof diagnosticos.$inferSelect;
export type InsertDiagnostico = typeof diagnosticos.$inferInsert;

// ─── Diários de Transformação ─────────────────────────────────────────────────

export const diarios = pgTable("diarios", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull().default(""),
    data: varchar("data", { length: 10 }).notNull(), // YYYY-MM-DD
    // Escalas numéricas para gráficos
    qualidadeSono: integer("qualidadeSono").default(0),
    energiaManha: integer("energiaManha").default(0),
    energiaTarde: integer("energiaTarde").default(0),
    energiaNoite: integer("energiaNoite").default(0),
    humorGeral: integer("humorGeral").default(0),
    nivelFoco: integer("nivelFoco").default(0),
    // Dados completos como JSON
    dados: json("dados").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Diario = typeof diarios.$inferSelect;
export type InsertDiario = typeof diarios.$inferInsert;
