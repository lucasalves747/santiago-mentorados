/**
 * admin.test.ts — Testes para o router admin
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock do banco de dados
vi.mock("./db", () => ({
  getAdminStats: vi.fn().mockResolvedValue({
    totalDiagnosticos: 5,
    totalDiarios: 23,
    mentoradosAtivos: 3,
  }),
  listDiagnosticos: vi.fn().mockResolvedValue([
    { id: 1, nome: "João Silva", email: "joao@test.com", dados: {}, createdAt: new Date() },
    { id: 2, nome: "Maria Santos", email: "maria@test.com", dados: {}, createdAt: new Date() },
  ]),
  getDiagnosticoById: vi.fn().mockResolvedValue({
    id: 1, nome: "João Silva", email: "joao@test.com", dados: { nome: "João" }, createdAt: new Date(),
  }),
  listDiarios: vi.fn().mockResolvedValue([
    { id: 1, nome: "João Silva", data: "2026-03-01", qualidadeSono: 8, energiaManha: 7, energiaTarde: 6, energiaNoite: 5, humorGeral: 8, nivelFoco: 7, dados: {}, createdAt: new Date() },
  ]),
  getDiariosByNome: vi.fn().mockResolvedValue([
    { id: 1, nome: "João Silva", data: "2026-03-01", qualidadeSono: 8, energiaManha: 7, energiaTarde: 6, energiaNoite: 5, humorGeral: 8, nivelFoco: 7, dados: {}, createdAt: new Date() },
  ]),
  getDiarioById: vi.fn().mockResolvedValue({
    id: 1, nome: "João Silva", data: "2026-03-01", qualidadeSono: 8, energiaManha: 7, energiaTarde: 6, energiaNoite: 5, humorGeral: 8, nivelFoco: 7, dados: {}, createdAt: new Date(),
  }),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  saveDiagnostico: vi.fn(),
  saveDiario: vi.fn(),
}));

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@test.com",
      name: "Dr. Santiago",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@test.com",
      name: "Mentorado",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("admin.stats", () => {
  it("retorna estatísticas para admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.stats();
    expect(result.totalDiagnosticos).toBe(5);
    expect(result.totalDiarios).toBe(23);
    expect(result.mentoradosAtivos).toBe(3);
  });

  it("rejeita acesso de usuário comum", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.stats()).rejects.toThrow();
  });
});

describe("admin.listDiagnosticos", () => {
  it("lista diagnósticos para admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.listDiagnosticos({});
    expect(result).toHaveLength(2);
    expect(result[0].nome).toBe("João Silva");
  });

  it("rejeita acesso de usuário comum", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.listDiagnosticos({})).rejects.toThrow();
  });
});

describe("admin.listDiarios", () => {
  it("lista diários para admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.listDiarios({});
    expect(result).toHaveLength(1);
    expect(result[0].qualidadeSono).toBe(8);
  });
});

describe("admin.getDiariosByMentorado", () => {
  it("retorna diários filtrados por nome", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.getDiariosByMentorado({ nome: "João Silva" });
    expect(result).toHaveLength(1);
    expect(result[0].nome).toBe("João Silva");
  });
});

describe("admin.getDiagnostico", () => {
  it("retorna diagnóstico por ID", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.getDiagnostico({ id: 1 });
    expect(result.nome).toBe("João Silva");
  });
});
