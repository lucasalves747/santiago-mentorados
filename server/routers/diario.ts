/**
 * diario.ts — Router tRPC para o Diário de Transformação
 * Recebe os 6 pilares diários e envia por e-mail (Resend) para sanvecmed@gmail.com
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { Resend } from "resend";
import { saveDiario } from "../db";

// ─── Schema ───────────────────────────────────────────────────────────────────

const diarioSchema = z.object({
  data: z.string(),
  nome: z.string(),
  // Sono
  horasDormir: z.string(),
  horaAcordar: z.string(),
  qualidadeSono: z.number(),
  acordouNoite: z.string(),
  observacoesSono: z.string(),
  // Energia
  energiaManha: z.number(),
  energiaTarde: z.number(),
  energiaNoite: z.number(),
  fatoresEnergia: z.array(z.string()),
  // Humor
  humorGeral: z.number(),
  emocaoPredominante: z.string(),
  situacaoDesafiadora: z.string(),
  // Alimentação
  refeicoes: z.string(),
  hidratacao: z.string(),
  suplementos: z.string(),
  transgressoes: z.string(),
  // Espiritualidade
  devocional: z.string(),
  oracao: z.string(),
  versiculoDia: z.string(),
  gratidao: z.string(),
  // Insights
  aprendizado: z.string(),
  missaoDia: z.string(),
  nivelFoco: z.number(),
  observacoesGerais: z.string(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stars(n: number): string {
  return n > 0 ? `${"●".repeat(n)}${"○".repeat(10 - n)} ${n}/10` : "—";
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:8px 12px; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#888880; width:38%; vertical-align:top; border-bottom:1px solid #1e1e1e;">${label}</td>
      <td style="padding:8px 12px; font-size:13px; color:#e8e0d0; vertical-align:top; border-bottom:1px solid #1e1e1e;">${value}</td>
    </tr>`;
}

function section(title: string, color: string, icon: string, rows: string): string {
  if (!rows.trim()) return "";
  return `
    <div style="margin-bottom:24px;">
      <div style="display:flex; align-items:center; gap:8px; border-bottom:2px solid ${color}; padding-bottom:8px; margin-bottom:0;">
        <span style="font-size:16px;">${icon}</span>
        <span style="font-family:Georgia,serif; font-size:15px; font-weight:bold; color:${color};">${title}</span>
      </div>
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%; background:#141414; border:1px solid #2a2a2a; border-top:none; border-radius:0 0 2px 2px;">
        ${rows}
      </table>
    </div>`;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const diarioRouter = router({
  submit: publicProcedure
    .input(diarioSchema)
    .mutation(async ({ input }) => {
      const d = input;
      const nome = d.nome || "Mentorado";

      // 0. Salvar no banco de dados
      try {
        await saveDiario({
          nome,
          data: d.data,
          qualidadeSono: d.qualidadeSono,
          energiaManha: d.energiaManha,
          energiaTarde: d.energiaTarde,
          energiaNoite: d.energiaNoite,
          humorGeral: d.humorGeral,
          nivelFoco: d.nivelFoco,
          dados: d,
        });
      } catch (err) {
        console.error("[Diário] Erro ao salvar no banco:", err);
        // Não bloqueia o fluxo
      }
      const dataFormatada = d.data
        ? new Date(d.data + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        : d.data;

      // ── Montar HTML do e-mail ──────────────────────────────────────────────
      const sonoRows = [
        row("Dormiu às", d.horasDormir),
        row("Acordou às", d.horaAcordar),
        row("Qualidade", stars(d.qualidadeSono)),
        row("Acordou à noite", d.acordouNoite),
        row("Observações", d.observacoesSono),
      ].join("");

      const energiaRows = [
        row("Manhã", stars(d.energiaManha)),
        row("Tarde", stars(d.energiaTarde)),
        row("Noite", stars(d.energiaNoite)),
        row("Fatores", d.fatoresEnergia.join(", ")),
      ].join("");

      const humorRows = [
        row("Humor geral", stars(d.humorGeral)),
        row("Emoção predominante", d.emocaoPredominante),
        row("Situação desafiadora", d.situacaoDesafiadora),
      ].join("");

      const alimentacaoRows = [
        row("Refeições", d.refeicoes.replace(/\n/g, "<br>")),
        row("Hidratação", d.hidratacao),
        row("Suplementos", d.suplementos),
        row("Transgressões", d.transgressoes),
      ].join("");

      const espiritualidadeRows = [
        row("Devocional", d.devocional),
        row("Oração", d.oracao),
        row("Versículo do dia", d.versiculoDia),
        row("Gratidão", d.gratidao.replace(/\n/g, "<br>")),
      ].join("");

      const insightsRows = [
        row("Aprendizado", d.aprendizado),
        row("Missão do dia", d.missaoDia),
        row("Foco/Produtividade", stars(d.nivelFoco)),
        row("Observações gerais", d.observacoesGerais),
      ].join("");

      const htmlBody = `
        <div style="font-family:Georgia,serif; background:#0a0a0a; color:#f5f0e8; padding:32px; max-width:680px; margin:0 auto;">

          <!-- Header -->
          <div style="border-bottom:1px solid #2a2a2a; padding-bottom:16px; margin-bottom:24px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:36px; height:36px; background:#C9A84C; text-align:center; vertical-align:middle; border-radius:2px;">
                  <span style="color:#0a0a0a; font-weight:bold; font-size:13px;">SV</span>
                </td>
                <td style="padding-left:12px;">
                  <p style="margin:0; font-size:14px; font-weight:bold; color:#f5f0e8;">Dr. Santiago Vecina</p>
                  <p style="margin:0; font-size:9px; color:#888880; letter-spacing:1.5px; text-transform:uppercase;">Diário de Transformação</p>
                </td>
              </tr>
            </table>
          </div>

          <!-- Título -->
          <h1 style="color:#C9A84C; font-size:22px; margin:0 0 4px 0;">📓 Diário de Transformação</h1>
          <p style="color:#888880; font-style:italic; margin:0 0 4px 0;">${nome}</p>
          <p style="color:#555550; font-size:12px; margin:0 0 28px 0; text-transform:capitalize;">${dataFormatada}</p>

          <!-- Seções -->
          ${section("Sono", "#7c6af5", "🌙", sonoRows)}
          ${section("Energia", "#C9A84C", "⚡", energiaRows)}
          ${section("Humor & Emoções", "#e07a5f", "🧠", humorRows)}
          ${section("Alimentação & Hidratação", "#81b29a", "🥗", alimentacaoRows)}
          ${section("Vida Espiritual", "#5aaa8a", "✝️", espiritualidadeRows)}
          ${section("Insights & Missão do Dia", "#f2cc8f", "💡", insightsRows)}

          <!-- Versículo -->
          <div style="border-left:2px solid #C9A84C; padding-left:14px; margin:24px 0; opacity:0.85;">
            <p style="color:#C9A84C; font-style:italic; font-size:13px; margin:0 0 4px 0;">
              "Examine-me, ó Deus, e conhece o meu coração; prova-me e conhece os meus pensamentos."
            </p>
            <p style="color:#888880; font-size:10px; letter-spacing:1px; text-transform:uppercase; margin:0;">— Salmo 139:23</p>
          </div>

          <!-- Footer -->
          <p style="color:#555550; font-size:11px; border-top:1px solid #2a2a2a; padding-top:16px; margin:0;">
            Dr. Santiago Vecina · Performance Integral · Documento Confidencial
          </p>
        </div>
      `;

      // ── Enviar e-mail ──────────────────────────────────────────────────────
      const resendApiKey = process.env.RESEND_API_KEY;
      let emailSent = false;
      let emailError = "";

      if (resendApiKey) {
        try {
          const resend = new Resend(resendApiKey);
          await resend.emails.send({
            from: "Diário de Transformação <onboarding@resend.dev>",
            to: ["sanvecmed@gmail.com"],
            subject: `📓 Diário — ${nome} — ${d.data}`,
            html: htmlBody,
          });
          emailSent = true;
        } catch (err: unknown) {
          emailError = err instanceof Error ? err.message : String(err);
          console.error("[Diário] Erro ao enviar e-mail:", emailError);
        }
      } else {
        emailError = "RESEND_API_KEY não configurada";
        console.warn("[Diário] E-mail não enviado:", emailError);
      }

      return { success: true, emailSent, emailError: emailError || null };
    }),
});
