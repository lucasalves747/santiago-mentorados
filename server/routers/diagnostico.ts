/**
 * diagnostico.ts — Router tRPC para envio do diagnóstico
 * Gera PDF e envia por e-mail (Resend) para sanvecmed@gmail.com
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { generateDiagnosticoPDF } from "../pdfGenerator";
import { Resend } from "resend";
import { saveDiagnostico } from "../db";

// ─── Schema de validação ──────────────────────────────────────────────────────

const formDataSchema = z.record(z.string(), z.union([z.string(), z.array(z.string())]));

// ─── Router ───────────────────────────────────────────────────────────────────

export const diagnosticoRouter = router({
  submit: publicProcedure
    .input(formDataSchema)
    .mutation(async ({ input }) => {
      const data = input as Record<string, string | string[]>;
      const nome = (data["nome"] as string) || "Paciente";

      // 0. Salvar no banco de dados
      try {
        await saveDiagnostico({
          nome,
          email: (data["email"] as string) || "",
          dados: data,
        });
      } catch (err) {
        console.error("[Diagnóstico] Erro ao salvar no banco:", err);
        // Não bloqueia o fluxo — e-mail ainda será enviado
      }

      // 1. Gerar PDF
      let pdfBuffer: Buffer;
      try {
        pdfBuffer = await generateDiagnosticoPDF(data);
      } catch (err) {
        console.error("[Diagnóstico] Erro ao gerar PDF:", err);
        throw new Error("Falha ao gerar o PDF do diagnóstico.");
      }

      // 2. Enviar e-mail com PDF anexado via Resend
      const resendApiKey = process.env.RESEND_API_KEY;
      let emailSent = false;
      let emailError = "";

      if (resendApiKey) {
        try {
          const resend = new Resend(resendApiKey);
          const result = await resend.emails.send({
            from: "Diagnóstico Inicial <onboarding@resend.dev>",
            to: ["sanvecmed@gmail.com"],
            subject: `📋 Diagnóstico Inicial — ${nome}`,
            html: `
              <div style="font-family: Georgia, serif; background: #0a0a0a; color: #f5f0e8; padding: 32px; max-width: 600px; margin: 0 auto;">
                <div style="border-bottom: 1px solid #2a2a2a; padding-bottom: 16px; margin-bottom: 24px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width: 36px; height: 36px; background: #C9A84C; text-align: center; vertical-align: middle; border-radius: 2px;">
                        <span style="color: #0a0a0a; font-weight: bold; font-size: 13px;">SV</span>
                      </td>
                      <td style="padding-left: 12px;">
                        <p style="margin: 0; font-size: 14px; font-weight: bold; color: #f5f0e8;">Dr. Santiago Vecina</p>
                        <p style="margin: 0; font-size: 9px; color: #888880; letter-spacing: 1.5px; text-transform: uppercase;">Performance Integral</p>
                      </td>
                    </tr>
                  </table>
                </div>

                <h1 style="color: #C9A84C; font-size: 22px; margin: 0 0 8px 0;">Novo Diagnóstico Inicial</h1>
                <p style="color: #888880; font-style: italic; margin: 0 0 24px 0;">Anamnese Expandida — ${nome}</p>

                <div style="background: #141414; border: 1px solid #2a2a2a; border-radius: 2px; padding: 20px; margin-bottom: 24px;">
                  <p style="color: #f5f0e8; font-size: 15px; line-height: 1.7; margin: 0 0 12px 0;">
                    Um novo formulário de diagnóstico foi submetido por
                    <strong style="color: #C9A84C;">${nome}</strong>.
                  </p>
                  <p style="color: #888880; font-size: 14px; line-height: 1.6; margin: 0;">
                    O PDF completo com todas as respostas das 10 seções está anexado a este e-mail.
                    Recomenda-se revisar antes da Sessão 0.
                  </p>
                </div>

                <div style="border-left: 2px solid #C9A84C; padding-left: 14px; margin-bottom: 24px; opacity: 0.85;">
                  <p style="color: #C9A84C; font-style: italic; font-size: 13px; margin: 0 0 4px 0;">
                    "Examina-me, ó Deus, e conhece o meu coração; prova-me e conhece os meus pensamentos."
                  </p>
                  <p style="color: #888880; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; margin: 0;">— Salmo 139:23</p>
                </div>

                <p style="color: #555550; font-size: 11px; border-top: 1px solid #2a2a2a; padding-top: 16px; margin: 0;">
                  Dr. Santiago Vecina · Performance Integral · Documento Confidencial
                </p>
              </div>
            `,
            attachments: [
              {
                filename: `diagnostico-${nome.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`,
                content: pdfBuffer,
              },
            ],
          });
          emailSent = true;
          console.log("[Diagnóstico] E-mail enviado com sucesso:", result);
        } catch (err: unknown) {
          emailError = err instanceof Error ? err.message : String(err);
          console.error("[Diagnóstico] Erro ao enviar e-mail:", emailError);
        }
      } else {
        emailError = "RESEND_API_KEY não configurada";
        console.warn("[Diagnóstico] E-mail não enviado:", emailError);
      }

      return {
        success: true,
        emailSent,
        emailError: emailError || null,
      };
    }),
});
