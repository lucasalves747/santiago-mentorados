import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock do Resend para não fazer chamadas reais de e-mail
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "mock-email-id" }),
    },
  })),
}));

function createCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

const baseDiario = {
  data: "2026-03-23",
  nome: "João Silva",
  horasDormir: "23:00",
  horaAcordar: "06:30",
  qualidadeSono: 8,
  acordouNoite: "Não acordei",
  observacoesSono: "Dormi bem",
  energiaManha: 7,
  energiaTarde: 6,
  energiaNoite: 5,
  fatoresEnergia: ["Boa noite de sono", "Exercício físico"],
  humorGeral: 8,
  emocaoPredominante: "Paz",
  situacaoDesafiadora: "Reunião difícil, mantive a calma",
  refeicoes: "Café: ovos. Almoço: frango e salada.",
  hidratacao: "2,5L",
  suplementos: "Vitamina D, Magnésio",
  transgressoes: "Nenhuma",
  devocional: "Sim, completo",
  oracao: "15–30 min",
  versiculoDia: "Filipenses 4:13",
  gratidao: "1. Família\n2. Saúde\n3. Propósito",
  aprendizado: "Aprendi a delegar melhor",
  missaoDia: "Cumpri totalmente",
  nivelFoco: 9,
  observacoesGerais: "Dia produtivo e com propósito",
};

describe("diario.submit", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test_key";
  });

  it("retorna sucesso ao submeter diário completo", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.diario.submit(baseDiario);

    expect(result.success).toBe(true);
    expect(result.emailSent).toBe(true);
    expect(result.emailError).toBeNull();
  });

  it("retorna sucesso mesmo sem RESEND_API_KEY (sem e-mail)", async () => {
    delete process.env.RESEND_API_KEY;
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.diario.submit(baseDiario);

    expect(result.success).toBe(true);
    expect(result.emailSent).toBe(false);
    expect(result.emailError).toBe("RESEND_API_KEY não configurada");
  });

  it("aceita diário com campos opcionais vazios", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.diario.submit({
      ...baseDiario,
      nome: "",
      observacoesSono: "",
      situacaoDesafiadora: "",
      transgressoes: "",
      versiculoDia: "",
      observacoesGerais: "",
      fatoresEnergia: [],
    });

    expect(result.success).toBe(true);
  });

  it("aceita escalas com valor zero (não preenchidas)", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.diario.submit({
      ...baseDiario,
      qualidadeSono: 0,
      energiaManha: 0,
      energiaTarde: 0,
      energiaNoite: 0,
      humorGeral: 0,
      nivelFoco: 0,
    });

    expect(result.success).toBe(true);
  });
});
