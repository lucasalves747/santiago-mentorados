import { desc, eq, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, diagnosticos, diarios, InsertDiagnostico, InsertDiario } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Diagnósticos ─────────────────────────────────────────────────────────────

export async function saveDiagnostico(data: InsertDiagnostico) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(diagnosticos).values(data);
}

export async function listDiagnosticos(search?: string) {
  const db = await getDb();
  if (!db) return [];
  if (search) {
    return db.select().from(diagnosticos)
      .where(like(diagnosticos.nome, `%${search}%`))
      .orderBy(desc(diagnosticos.createdAt))
      .limit(100);
  }
  return db.select().from(diagnosticos).orderBy(desc(diagnosticos.createdAt)).limit(100);
}

export async function getDiagnosticoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(diagnosticos).where(eq(diagnosticos.id, id)).limit(1);
  return result[0];
}

// ─── Diários ──────────────────────────────────────────────────────────────────

export async function saveDiario(data: InsertDiario) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(diarios).values(data);
}

export async function listDiarios(search?: string) {
  const db = await getDb();
  if (!db) return [];
  if (search) {
    return db.select().from(diarios)
      .where(like(diarios.nome, `%${search}%`))
      .orderBy(desc(diarios.createdAt))
      .limit(200);
  }
  return db.select().from(diarios).orderBy(desc(diarios.createdAt)).limit(200);
}

export async function getDiariosByNome(nome: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(diarios)
    .where(like(diarios.nome, `%${nome}%`))
    .orderBy(desc(diarios.data))
    .limit(90);
}

export async function getDiarioById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(diarios).where(eq(diarios.id, id)).limit(1);
  return result[0];
}

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { totalDiagnosticos: 0, totalDiarios: 0, mentoradosAtivos: 0 };
  const allDiag = await db.select({ id: diagnosticos.id }).from(diagnosticos);
  const allDiarios = await db.select({ id: diarios.id }).from(diarios);
  const nomesUnicos = await db.selectDistinct({ nome: diarios.nome }).from(diarios);
  return {
    totalDiagnosticos: allDiag.length,
    totalDiarios: allDiarios.length,
    mentoradosAtivos: nomesUnicos.length,
  };
}
