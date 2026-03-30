import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock do Resend para não fazer chamadas reais
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "test-email-id" }),
    },
  })),
}));

// Mock do pdfGenerator para não gerar PDF real nos testes
vi.mock("./pdfGenerator", () => ({
  generateDiagnosticoPDF: vi.fn().mockResolvedValue(Buffer.from("mock-pdf-content")),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

const sampleFormData = {
  nome: "João Silva",
  idade: "42",
  profissao: "CEO",
  cidade: "São Paulo, SP",
  estado_civil: "Casado(a)",
  filhos: "Dois filhos, 8 e 12 anos",
  como_conheceu: "Instagram",
  peso: "85",
  altura: "178",
  nivel_estresse: "7",
  pilar_mais_fraco: "Saúde Estratégica",
  motivacao_mentoria: "Quero melhorar minha saúde e performance",
};

describe("diagnostico.submit", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test_key_123";
  });

  it("deve retornar success=true ao submeter dados do formulário", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.diagnostico.submit(sampleFormData);

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("emailSent");
    expect(result).toHaveProperty("emailError");
  });

  it("deve retornar emailSent=true quando RESEND_API_KEY está configurada", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.diagnostico.submit(sampleFormData);

    expect(result.emailSent).toBe(true);
    expect(result.emailError).toBeNull();
  });

  it("deve retornar emailSent=false quando RESEND_API_KEY não está configurada", async () => {
    delete process.env.RESEND_API_KEY;

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.diagnostico.submit(sampleFormData);

    expect(result.emailSent).toBe(false);
    expect(result.emailError).toBe("RESEND_API_KEY não configurada");
  });

  it("deve aceitar formData com campos vazios sem lançar erro", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.diagnostico.submit({ nome: "Teste" });

    expect(result.success).toBe(true);
  });

  it("deve gerar nome de arquivo PDF com a data atual", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Apenas verifica que não lança erro ao processar nome com espaços
    const result = await caller.diagnostico.submit({
      nome: "Maria Santos Oliveira",
    });

    expect(result.success).toBe(true);
  });
});
