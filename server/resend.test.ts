import { describe, it, expect } from "vitest";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

describe("Resend API Key", () => {
  it("deve ter a variável RESEND_API_KEY configurada", () => {
    const key = process.env.RESEND_API_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(key?.startsWith("re_")).toBe(true);
  });

  it("deve conseguir instanciar o cliente Resend sem erros", () => {
    const key = process.env.RESEND_API_KEY ?? "re_placeholder";
    const resend = new Resend(key);
    expect(resend).toBeDefined();
  });
});
