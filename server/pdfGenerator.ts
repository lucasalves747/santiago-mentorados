/**
 * pdfGenerator.ts — Gerador de PDF do Diagnóstico Inicial
 * Usa @react-pdf/renderer para criar um PDF formatado com as respostas
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";

// ─── Estilos ─────────────────────────────────────────────────────────────────

const GOLD = "#C9A84C";
const BG_DARK = "#0A0A0A";
const BG_SECTION = "#141414";
const BORDER_COLOR = "#2A2A2A";
const TEXT_LIGHT = "#F5F0E8";
const TEXT_MUTED = "#888880";

const styles = StyleSheet.create({
  page: {
    backgroundColor: BG_DARK,
    padding: 40,
    fontFamily: "Helvetica",
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoText: {
    color: BG_DARK,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  headerTitle: {
    color: TEXT_LIGHT,
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  headerSubtitle: {
    color: TEXT_MUTED,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 2,
  },
  // Document title
  docTitle: {
    color: GOLD,
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  docSubtitle: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontStyle: "italic",
    marginBottom: 6,
  },
  docDate: {
    color: TEXT_MUTED,
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER_COLOR,
    marginBottom: 20,
  },
  goldDivider: {
    height: 1,
    backgroundColor: GOLD,
    width: 40,
    marginBottom: 16,
    opacity: 0.6,
  },
  // Section
  sectionContainer: {
    backgroundColor: BG_SECTION,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 2,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionRoman: {
    color: GOLD,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginRight: 8,
    opacity: 0.7,
  },
  sectionTitle: {
    color: TEXT_LIGHT,
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  sectionSubtitle: {
    color: GOLD,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  // Fields
  fieldContainer: {
    marginBottom: 10,
  },
  fieldLabel: {
    color: GOLD,
    fontSize: 7,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 3,
    opacity: 0.8,
  },
  fieldValue: {
    color: TEXT_LIGHT,
    fontSize: 9.5,
    lineHeight: 1.6,
  },
  fieldEmpty: {
    color: TEXT_MUTED,
    fontSize: 9,
    fontStyle: "italic",
  },
  // Grid
  row: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    paddingTop: 10,
  },
  footerText: {
    color: TEXT_MUTED,
    fontSize: 7,
    letterSpacing: 0.8,
  },
  footerGold: {
    color: GOLD,
    fontSize: 7,
    letterSpacing: 0.8,
  },
  // Quote
  quoteContainer: {
    borderLeftWidth: 2,
    borderLeftColor: GOLD,
    paddingLeft: 10,
    marginBottom: 16,
    opacity: 0.85,
  },
  quoteText: {
    color: GOLD,
    fontSize: 9,
    fontStyle: "italic",
    lineHeight: 1.6,
  },
  quoteSource: {
    color: TEXT_MUTED,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 3,
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = Record<string, string | string[]>;

function getVal(data: FormData, key: string): string {
  const v = data[key];
  if (!v) return "";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

function renderField(label: string, value: string) {
  return React.createElement(
    View,
    { style: styles.fieldContainer, key: label },
    React.createElement(Text, { style: styles.fieldLabel }, label),
    value
      ? React.createElement(Text, { style: styles.fieldValue }, value)
      : React.createElement(Text, { style: styles.fieldEmpty }, "Não informado")
  );
}

function renderEnergyTable(data: FormData) {
  let parsed: Record<string, { nota: string; obs: string }> = {};
  try {
    parsed = JSON.parse(getVal(data, "energia_tabela") || "{}");
  } catch {}

  const rows = [
    { key: "ao_acordar", label: "Ao acordar" },
    { key: "manha", label: "Manhã (8h–12h)" },
    { key: "tarde", label: "Tarde (12h–17h)" },
    { key: "final_tarde", label: "Final da tarde (17h–20h)" },
    { key: "noite", label: "Noite (20h–23h)" },
  ];

  return React.createElement(
    View,
    { style: styles.fieldContainer },
    React.createElement(Text, { style: styles.fieldLabel }, "Energia ao longo do dia"),
    ...rows.map((row) =>
      React.createElement(
        View,
        {
          key: row.key,
          style: {
            flexDirection: "row" as const,
            marginBottom: 3,
            paddingVertical: 3,
            borderBottomWidth: 1,
            borderBottomColor: BORDER_COLOR,
          },
        },
        React.createElement(
          Text,
          { style: { color: TEXT_MUTED, fontSize: 8, width: 120 } },
          row.label
        ),
        React.createElement(
          Text,
          { style: { color: GOLD, fontSize: 8, width: 60 } },
          parsed[row.key]?.nota ? `Nota: ${parsed[row.key].nota}/10` : "—"
        ),
        React.createElement(
          Text,
          { style: { color: TEXT_LIGHT, fontSize: 8, flex: 1 } },
          parsed[row.key]?.obs || "—"
        )
      )
    )
  );
}

// ─── Seções do PDF ────────────────────────────────────────────────────────────

function buildSection(
  roman: string,
  title: string,
  subtitle: string,
  fields: React.ReactElement[]
) {
  return React.createElement(
    View,
    { style: styles.sectionContainer },
    React.createElement(
      View,
      { style: styles.sectionHeader },
      React.createElement(Text, { style: styles.sectionRoman }, roman),
      React.createElement(Text, { style: styles.sectionTitle }, title)
    ),
    React.createElement(Text, { style: styles.sectionSubtitle }, subtitle),
    React.createElement(View, { style: styles.goldDivider }),
    ...fields
  );
}

// ─── Documento Principal ──────────────────────────────────────────────────────

function DiagnosticoDocument({ data }: { data: FormData }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return React.createElement(
    Document,
    {
      title: "Diagnóstico Inicial — Dr. Santiago Vecina",
      author: "Dr. Santiago Vecina",
    },
    // ── Página 1: Capa + Seções 1–3 ──
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          { style: styles.logoBox },
          React.createElement(Text, { style: styles.logoText }, "SV")
        ),
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.headerTitle }, "Dr. Santiago Vecina"),
          React.createElement(Text, { style: styles.headerSubtitle }, "Performance Integral")
        )
      ),
      // Título
      React.createElement(Text, { style: styles.docTitle }, "Diagnóstico Inicial"),
      React.createElement(
        Text,
        { style: styles.docSubtitle },
        "Anamnese Expandida — O Ponto de Partida da Sua Transformação"
      ),
      React.createElement(Text, { style: styles.docDate }, `Enviado em: ${dateStr}`),
      React.createElement(View, { style: styles.divider }),
      // Quote
      React.createElement(
        View,
        { style: styles.quoteContainer },
        React.createElement(
          Text,
          { style: styles.quoteText },
          '"Examina-me, ó Deus, e conhece o meu coração; prova-me e conhece os meus pensamentos."'
        ),
        React.createElement(Text, { style: styles.quoteSource }, "— Salmo 139:23")
      ),
      // Seção 1
      buildSection("I", "Identificação e Contexto", "Seção 1", [
        renderField("Nome Completo", getVal(data, "nome")),
        React.createElement(
          View,
          { style: styles.row, key: "row-id" },
          React.createElement(
            View,
            { style: styles.col },
            renderField("Idade", getVal(data, "idade"))
          ),
          React.createElement(
            View,
            { style: styles.col },
            renderField("Data de Nascimento", getVal(data, "data_nascimento"))
          )
        ),
        renderField("Profissão / Negócio", getVal(data, "profissao")),
        React.createElement(
          View,
          { style: styles.row, key: "row-city" },
          React.createElement(
            View,
            { style: styles.col },
            renderField("Cidade / Estado", getVal(data, "cidade"))
          ),
          React.createElement(
            View,
            { style: styles.col },
            renderField("Estado Civil", getVal(data, "estado_civil"))
          )
        ),
        renderField("Filhos (idades)", getVal(data, "filhos")),
        renderField("Como conheceu o Dr. Santiago", getVal(data, "como_conheceu")),
      ]),
      // Footer
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(Text, { style: styles.footerText }, "Diagnóstico Inicial — Confidencial"),
        React.createElement(Text, { style: styles.footerGold }, "Dr. Santiago Vecina · Performance Integral")
      )
    ),
    // ── Página 2: Seções 2–4 ──
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Seção 2
      buildSection("II", "Saúde Física e Biomarcadores", "Seção 2", [
        React.createElement(
          View,
          { style: styles.row, key: "row-bio" },
          React.createElement(View, { style: styles.col }, renderField("Peso (kg)", getVal(data, "peso"))),
          React.createElement(View, { style: styles.col }, renderField("Altura (cm)", getVal(data, "altura"))),
          React.createElement(View, { style: styles.col }, renderField("IMC", getVal(data, "imc")))
        ),
        renderField("Check-ups regulares", getVal(data, "checkup")),
        renderField("Último exame de sangue", getVal(data, "ultimo_exame")),
        renderField("Condição médica diagnosticada", getVal(data, "condicao_medica")),
        getVal(data, "condicao_medica") === "Sim"
          ? renderField("Quais condições", getVal(data, "condicao_medica_quais"))
          : React.createElement(View, { key: "empty-cond" }),
        renderField("Medicamentos", getVal(data, "medicamento")),
        getVal(data, "medicamento") === "Sim"
          ? renderField("Quais medicamentos", getVal(data, "medicamento_quais"))
          : React.createElement(View, { key: "empty-med" }),
        renderField("Suplementos", getVal(data, "suplemento")),
        getVal(data, "suplemento") === "Sim"
          ? renderField("Quais suplementos", getVal(data, "suplemento_quais"))
          : React.createElement(View, { key: "empty-sup" }),
        renderEnergyTable(data),
        renderField("Cafeína", getVal(data, "cafeina")),
        renderField("Álcool", getVal(data, "alcool")),
        renderField("Tabaco", getVal(data, "tabaco")),
      ]),
      // Seção 3
      buildSection("III", "Qualidade do Sono", "Seção 3", [
        renderField("Horas de sono por noite", getVal(data, "horas_sono")),
        renderField("Dificuldade para adormecer", getVal(data, "dificuldade_adormecer")),
        renderField("Acorda durante a noite", getVal(data, "acorda_noite")),
        renderField("Acorda descansado", getVal(data, "acorda_descansado")),
        React.createElement(
          View,
          { style: styles.row, key: "row-sleep" },
          React.createElement(View, { style: styles.col }, renderField("Hora de dormir", getVal(data, "hora_dormir"))),
          React.createElement(View, { style: styles.col }, renderField("Hora de acordar", getVal(data, "hora_acordar")))
        ),
        renderField("Telas antes de dormir", getVal(data, "telas_antes_dormir")),
        renderField("Recursos para melhorar o sono", getVal(data, "recurso_sono")),
        renderField("Qualidade do sono (descrição)", getVal(data, "qualidade_sono")),
      ]),
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(Text, { style: styles.footerText }, "Diagnóstico Inicial — Confidencial"),
        React.createElement(Text, { style: styles.footerGold }, "Dr. Santiago Vecina · Performance Integral")
      )
    ),
    // ── Página 3: Seções 4–6 ──
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      buildSection("IV", "Nutrição e Alimentação", "Seção 4", [
        renderField("Qualidade da alimentação", getVal(data, "qualidade_alimentacao")),
        renderField("Protocolo alimentar", getVal(data, "protocolo_alimentar")),
        getVal(data, "protocolo_alimentar") === "Sim"
          ? renderField("Qual protocolo", getVal(data, "protocolo_alimentar_qual"))
          : React.createElement(View, { key: "empty-prot" }),
        React.createElement(
          View,
          { style: styles.row, key: "row-meals" },
          React.createElement(View, { style: styles.col }, renderField("Refeições por dia", getVal(data, "num_refeicoes"))),
          React.createElement(View, { style: styles.col }, renderField("Pula refeições", getVal(data, "pula_refeicoes")))
        ),
        renderField("Café da manhã típico", getVal(data, "cafe_manha")),
        renderField("Almoço típico", getVal(data, "almoco")),
        renderField("Jantar típico", getVal(data, "jantar")),
        renderField("Lanches", getVal(data, "lanches")),
        renderField("Compulsão alimentar", getVal(data, "compulsao_alimentar")),
        renderField("Intolerâncias/alergias", getVal(data, "intolerancia")),
        getVal(data, "intolerancia") === "Sim"
          ? renderField("Quais intolerâncias", getVal(data, "intolerancia_qual"))
          : React.createElement(View, { key: "empty-intol" }),
      ]),
      buildSection("V", "Atividade Física", "Seção 5", [
        renderField("Pratica exercícios", getVal(data, "pratica_exercicio")),
        renderField("Modalidade", getVal(data, "modalidade_exercicio")),
        React.createElement(
          View,
          { style: styles.row, key: "row-ex" },
          React.createElement(View, { style: styles.col }, renderField("Frequência semanal", getVal(data, "frequencia_exercicio"))),
          React.createElement(View, { style: styles.col }, renderField("Duração por sessão", getVal(data, "duracao_exercicio")))
        ),
        renderField("Personal trainer", getVal(data, "personal_trainer")),
        renderField("Sensação após exercício", getVal(data, "sensacao_exercicio")),
        renderField("Maior obstáculo para exercitar-se", getVal(data, "obstaculo_exercicio")),
      ]),
      buildSection("VI", "Saúde Mental e Emocional", "Seção 6", [
        renderField("Nível de estresse (1–10)", getVal(data, "nivel_estresse")),
        renderField("Principais fontes de estresse", getVal(data, "fontes_estresse")),
        renderField("Ansiedade", getVal(data, "ansiedade")),
        renderField("Episódios de depressão", getVal(data, "depressao")),
        renderField("Como gerencia o estresse", getVal(data, "gestao_estresse")),
        renderField("Prática de meditação/oração", getVal(data, "pratica_meditacao")),
        renderField("Terapeuta/psicólogo", getVal(data, "terapeuta")),
      ]),
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(Text, { style: styles.footerText }, "Diagnóstico Inicial — Confidencial"),
        React.createElement(Text, { style: styles.footerGold }, "Dr. Santiago Vecina · Performance Integral")
      )
    ),
    // ── Página 4: Seções 7–10 ──
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      buildSection("VII", "Vida Espiritual", "Seção 7", [
        renderField("Pessoa de fé", getVal(data, "pessoa_fe")),
        renderField("Denominação/tradição cristã", getVal(data, "denominacao")),
        renderField("Frequenta igreja", getVal(data, "frequenta_igreja")),
        renderField("Frequência na igreja", getVal(data, "frequencia_igreja")),
        renderField("Leitura bíblica", getVal(data, "leitura_biblica")),
        renderField("Mentor espiritual", getVal(data, "mentor_espiritual")),
        renderField("Vida espiritual atual", getVal(data, "vida_espiritual_desc")),
        renderField("Versículo favorito", getVal(data, "versiculo_favorito")),
      ]),
      buildSection("VIII", "Liderança e Negócios", "Seção 8", [
        React.createElement(
          View,
          { style: styles.row, key: "row-lead" },
          React.createElement(View, { style: styles.col }, renderField("Pessoas lideradas", getVal(data, "pessoas_lideradas"))),
          React.createElement(View, { style: styles.col }, renderField("Tempo no negócio", getVal(data, "tempo_negocio")))
        ),
        renderField("Maior desafio de liderança", getVal(data, "desafio_lideranca")),
        renderField("Negócio funciona sem você (30 dias)", getVal(data, "negocio_sem_voce")),
        renderField("Tem sócio", getVal(data, "tem_socio")),
        renderField("Dinâmica da sociedade", getVal(data, "dinamica_sociedade")),
        renderField("Maior conquista profissional (2 anos)", getVal(data, "conquista_profissional")),
        renderField("Maior obstáculo para crescimento", getVal(data, "obstaculo_negocio")),
      ]),
      buildSection("IX", "Família e Relacionamentos", "Seção 9", [
        renderField("Qualidade do casamento/relacionamento", getVal(data, "qualidade_casamento")),
        renderField("Presença para a família", getVal(data, "presenca_familia")),
        renderField("Membro que precisa de mais atenção", getVal(data, "membro_atencao")),
        renderField("Conversas profundas com cônjuge", getVal(data, "conversas_conjuge")),
        renderField("Legado que está construindo", getVal(data, "legado_familia")),
      ]),
      buildSection("X", "Objetivos e Expectativas da Mentoria", "Seção 10", [
        renderField("Motivação para a mentoria", getVal(data, "motivacao_mentoria")),
        renderField("Resultado 1 (90 dias)", getVal(data, "resultado_1")),
        renderField("Resultado 2 (90 dias)", getVal(data, "resultado_2")),
        renderField("Resultado 3 (90 dias)", getVal(data, "resultado_3")),
        renderField("Pilar mais fraco", getVal(data, "pilar_mais_fraco")),
        renderField("Disposição para mudança", getVal(data, "disposicao_mudanca")),
        renderField("Medo que pode impedir a transformação", getVal(data, "medo_transformacao")),
        renderField("Informações adicionais para o Dr. Santiago", getVal(data, "info_adicional")),
      ]),
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(Text, { style: styles.footerText }, "Diagnóstico Inicial — Confidencial"),
        React.createElement(Text, { style: styles.footerGold }, "Dr. Santiago Vecina · Performance Integral")
      )
    )
  );
}

// ─── Exportar função de geração ───────────────────────────────────────────────

export async function generateDiagnosticoPDF(data: FormData): Promise<Buffer> {
  const doc = React.createElement(DiagnosticoDocument, { data }) as React.ReactElement<import("@react-pdf/renderer").DocumentProps>;
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
