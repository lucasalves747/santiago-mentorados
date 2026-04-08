/**
 * GuiaMentorado.tsx — Guia Completo do Mentorado
 * Manual de Bordo para os 90 Dias — Protocolo das Raízes Profundas
 * Design: Luxury Editorial — fundo escuro + azul-aço + dourado + cobre
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

// ─── Paleta ───────────────────────────────────────────────────────────────────
const GOLD        = "oklch(0.72 0.12 75)";
const COPPER      = "oklch(0.62 0.10 52)";
const STEEL       = "oklch(0.55 0.06 240)";       // azul-aço — tom principal desta página
const STEEL_LIGHT = "oklch(0.65 0.07 240)";
const BG          = "oklch(0.07 0.008 240)";       // fundo azul-escuro profundo
const BG_WARM     = "oklch(0.09 0.006 240)";
const CARD_BG     = "oklch(0.11 0.007 240)";
const BORDER      = "oklch(0.20 0.010 240)";
const BORDER_GOLD = "oklch(0.72 0.12 75 / 0.25)";
const BORDER_STEEL= "oklch(0.55 0.06 240 / 0.35)";
const FG          = "oklch(0.95 0.008 80)";
const FG_WARM     = "oklch(0.88 0.012 80)";
const MUTED       = "oklch(0.55 0.010 80)";

// ─── Dados ────────────────────────────────────────────────────────────────────

const FASES = [
  { num: 1, nome: "Diagnóstico",  semanas: "1–2",   sessoes: "Sessão 0 + 1", foco: "Linha de base clínica, espiritual e estratégica", color: GOLD },
  { num: 2, nome: "Fundação",     semanas: "3–6",   sessoes: "Sessões 2–5",  foco: "Saúde fisiológica: cortisol, neuroplasticidade, hormônios, nutrição", color: COPPER },
  { num: 3, nome: "Construção",   semanas: "7–8",   sessoes: "Sessões 6–7",  foco: "Sono, revisão de meio de jornada, recalibração", color: STEEL_LIGHT },
  { num: 4, nome: "Aceleração",   semanas: "9–11",  sessoes: "Sessões 8–10", foco: "Biohacking, liderança fisiológica, negócios do reino", color: GOLD },
  { num: 5, nome: "Legado",       semanas: "12–13", sessoes: "Sessões 11–12",foco: "Família, integração e comissionamento", color: COPPER },
];

const RAIZ = [
  {
    letra: "R",
    titulo: "Revisão",
    tempo: "5 minutos",
    desc: "O Dr. Santiago revisa as missões da semana anterior, analisa os dados clínicos relevantes (sono, energia, humor, marcadores laboratoriais quando disponíveis) e celebra os avanços.",
    citacao: "O que é medido é gerenciado, e o que é celebrado é repetido.",
    color: GOLD,
  },
  {
    letra: "A",
    titulo: "Âncora",
    tempo: "5 minutos",
    desc: "O versículo bíblico da sessão é lido e meditado. O princípio milenar é apresentado. O conceito científico central é introduzido. Os três pilares do método se encontram em um único momento de orientação.",
    citacao: "Ciência, sabedoria e fé — em um único momento.",
    color: COPPER,
  },
  {
    letra: "I",
    titulo: "Insight Clínico",
    tempo: "15–20 minutos",
    desc: "O Dr. Santiago apresenta o tema da sessão com a profundidade de um médico especialista — dados científicos reais, mecanismos fisiológicos, protocolos clínicos — integrados com a sabedoria bíblica e milenar.",
    citacao: "O coração intelectual da sessão.",
    color: STEEL_LIGHT,
  },
  {
    letra: "Z",
    titulo: "Zona de Ação",
    tempo: "15–20 minutos",
    desc: "O mentorado e o Dr. Santiago co-criam o protocolo personalizado para a semana. As missões são específicas, mensuráveis, com prazo definido e baseadas no perfil clínico único do mentorado.",
    citacao: "Onde o conhecimento se torna protocolo.",
    color: GOLD,
  },
];

const COMPROMISSOS = [
  {
    icon: "◉",
    titulo: "Presença total nas sessões",
    desc: "Cada sessão é um espaço sagrado. Sem celular, sem interrupções, sem multitarefa. 40–60 minutos de presença total, uma vez por semana.",
    color: GOLD,
  },
  {
    icon: "◉",
    titulo: "Execução das missões semanais",
    desc: "O conhecimento sem ação é apenas entretenimento intelectual. As missões semanais são onde o aprendizado se torna hábito e o hábito se torna identidade.",
    color: COPPER,
  },
  {
    icon: "◉",
    titulo: "Honestidade radical",
    desc: "O Dr. Santiago não pode ajudá-lo se você não for honesto sobre o que está acontecendo — nos seus exames, na sua vida, nos seus medos e nas suas resistências.",
    color: STEEL_LIGHT,
  },
  {
    icon: "◉",
    titulo: "Realização dos exames laboratoriais",
    desc: "Os exames são a base da medicina de precisão. Sem dados objetivos, o protocolo é genérico. Com dados objetivos, ele é personalizado e poderoso.",
    color: GOLD,
  },
  {
    icon: "◉",
    titulo: "Registro no Diário de Transformação",
    desc: "Registre diariamente: sono, energia, humor, alimentação, espiritualidade e insights. Este registro vai revelar padrões que você nunca veria de outra forma.",
    color: COPPER,
  },
];

const INCLUIDOS = [
  { item: "12 sessões individuais",         desc: "40–60 minutos cada, via Zoom" },
  { item: "Interpretação de exames",        desc: "Análise clínica completa dos seus biomarcadores pelo Dr. Santiago" },
  { item: "Protocolos personalizados",      desc: "Nutrição, sono, exercício, suplementação e biohacking baseados no seu perfil" },
  { item: "Workbook de Performance Integral", desc: "Exercícios práticos para cada pilar" },
  { item: "Diário de Transformação",        desc: "Ferramenta de registro e autoconhecimento dos 90 dias" },
  { item: "Missões semanais",               desc: "Protocolo de ação específico para cada semana" },
  { item: "Acesso ao Grupo VIP",            desc: "Comunidade exclusiva de mentorados do Dr. Santiago" },
  { item: "Suporte entre sessões",          desc: "Canal direto via WhatsApp para dúvidas clínicas urgentes" },
  { item: "Manifesto de Legado",            desc: "Documento personalizado criado na sessão final" },
  { item: "Plano dos Próximos 90 Dias",     desc: "Protocolo de manutenção e continuidade pós-mentoria" },
];

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "0.62rem", fontWeight: 700,
      letterSpacing: "0.25em", textTransform: "uppercase" as const,
      color: STEEL_LIGHT, marginBottom: "0.75rem",
    }}>
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
      fontWeight: 600, color: FG,
      margin: "0 0 2rem",
      lineHeight: 1.15,
    }}>
      {children}
    </h2>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "4rem 0" }}>
      <div style={{ height: "1px", flex: 1, background: BORDER }} />
      <div style={{ width: "5px", height: "5px", background: GOLD, transform: "rotate(45deg)", opacity: 0.5 }} />
      <div style={{ height: "1px", flex: 1, background: BORDER }} />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function GuiaMentorado() {
  const [visible, setVisible] = useState(false);
  const [activeRaiz, setActiveRaiz] = useState(0);
  const [, navigate] = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: FG, fontFamily: "'Nunito Sans', sans-serif" }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem", height: "56px",
        background: "oklch(0.07 0.008 240 / 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "none",
              color: MUTED,
              padding: "0.5rem",
              borderRadius: "3px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${BORDER}40`;
              e.currentTarget.style.color = FG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = MUTED;
            }}
          >
            <ArrowLeft size={16} />
            <span style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}>
              Voltar
            </span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: "30px", height: "30px", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px" }}>
              <span style={{ color: BG, fontSize: "11px", fontWeight: 800 }}>SV</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: FG }}>Dr. Santiago Vecina</p>
              <p style={{ margin: 0, fontSize: "8px", color: MUTED, letterSpacing: "1.5px", textTransform: "uppercase" as const }}>Performance Integral</p>
            </div>
          </div>
        </div>
        <span style={{ fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase" as const, color: STEEL_LIGHT, fontWeight: 700 }}>
          Guia do Mentorado
        </span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Fundo */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 30% 50%, oklch(0.55 0.06 240 / 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 30%, oklch(0.72 0.12 75 / 0.07) 0%, transparent 50%)
          `,
        }} />
        {/* Grade sutil */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 59px, oklch(0.55 0.06 240 / 0.04) 60px),
            repeating-linear-gradient(90deg, transparent, transparent 59px, oklch(0.55 0.06 240 / 0.04) 60px)
          `,
        }} />

        {/* Conteúdo hero */}
        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "900px", padding: "8rem 2rem 4rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: `oklch(0.55 0.06 240 / 0.15)`,
            border: `1px solid ${BORDER_STEEL}`,
            borderRadius: "2px", padding: "0.35rem 0.875rem",
            marginBottom: "2rem",
          }}>
            <div style={{ width: "5px", height: "5px", background: STEEL_LIGHT, borderRadius: "50%" }} />
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: STEEL_LIGHT }}>
              Manual de Bordo · 90 Dias
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 600, lineHeight: 1.05,
            margin: "0 0 1.5rem",
          }}>
            Guia Completo<br />
            <span style={{ color: GOLD, fontStyle: "italic" }}>do Mentorado</span>
          </h1>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: MUTED, marginBottom: "3rem", maxWidth: "560px",
          }}>
            O seu manual de bordo para os 90 dias do Protocolo das Raízes Profundas
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" as const }}>
            {[
              { num: "90", label: "Dias de jornada" },
              { num: "12", label: "Sessões individuais" },
              { num: "5",  label: "Fases do protocolo" },
              { num: "3",  label: "Dimensões integradas" },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 600, color: GOLD, margin: 0, lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: MUTED, margin: "0.25rem 0 0" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.4rem", opacity: 0.5 }}>
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: MUTED }}>Role para ler</span>
          <div style={{ width: "1px", height: "36px", background: `linear-gradient(to bottom, ${STEEL_LIGHT}, transparent)` }} />
        </div>
      </div>

      {/* ── Corpo ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem 8rem" }}>

        {/* ── Seção 1: O que é o Protocolo ─────────────────────────────────── */}
        <section>
          <SectionLabel>O Protocolo</SectionLabel>
          <SectionTitle>O que é o Protocolo das Raízes Profundas</SectionTitle>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.05rem, 2vw, 1.2rem)", lineHeight: 1.85, color: FG_WARM, marginBottom: "2.5rem" }}>
            O Protocolo das Raízes Profundas é a metodologia exclusiva desenvolvida pelo Dr. Santiago Vecina ao longo de mais de uma década de prática clínica com empresários e líderes de alto nível. Ele integra três dimensões que raramente se encontram em um único programa:
          </p>

          {/* 3 Dimensões */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "1rem" }}>
            {[
              {
                icon: "🔬",
                titulo: "A Ciência Médica",
                desc: "Cada sessão é fundamentada em evidências clínicas reais — fisiologia, endocrinologia, neurociência, nutrigenômica e medicina preventiva. Você não vai receber opiniões ou motivação vazia. Vai receber ciência aplicada ao seu caso específico.",
                color: STEEL_LIGHT,
                border: BORDER_STEEL,
              },
              {
                icon: "⚖️",
                titulo: "A Sabedoria Milenar",
                desc: "As grandes civilizações — gregos, estoicos, japoneses, hebreus — chegaram a conclusões profundas sobre a natureza humana e a excelência. Esses princípios são incorporados em cada sessão como âncoras de sabedoria que transcendem modas e tendências.",
                color: COPPER,
                border: `oklch(0.62 0.10 52 / 0.3)`,
              },
              {
                icon: "✝️",
                titulo: "A Base Cristã",
                desc: "A Palavra de Deus é o fundamento de tudo. Cada sessão tem um versículo âncora que não é decoração — é a verdade que sustenta e direciona todo o conteúdo clínico e estratégico.",
                color: GOLD,
                border: BORDER_GOLD,
              },
            ].map((dim) => (
              <div key={dim.titulo} style={{
                background: CARD_BG,
                border: `1px solid ${dim.border}`,
                borderTop: `3px solid ${dim.color}`,
                borderRadius: "2px",
                padding: "1.75rem",
              }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.875rem" }}>{dim.icon}</div>
                <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: dim.color, marginBottom: "0.625rem" }}>{dim.titulo}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", color: FG_WARM, lineHeight: 1.7, margin: 0 }}>{dim.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Seção 2: Estrutura dos 90 dias ───────────────────────────────── */}
        <section>
          <SectionLabel>Estrutura</SectionLabel>
          <SectionTitle>Os 90 Dias em 5 Fases</SectionTitle>

          <div style={{ position: "relative" }}>
            {/* Linha vertical */}
            <div style={{
              position: "absolute", left: "28px", top: "24px", bottom: "24px",
              width: "1px",
              background: `linear-gradient(to bottom, ${GOLD}, ${COPPER}, ${STEEL_LIGHT}, ${GOLD}, ${COPPER})`,
              opacity: 0.3,
            }} />

            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
              {FASES.map((fase, i) => (
                <div key={fase.num} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  {/* Número */}
                  <div style={{
                    width: "56px", height: "56px", flexShrink: 0,
                    background: CARD_BG,
                    border: `2px solid ${fase.color}`,
                    borderRadius: "2px",
                    display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
                    position: "relative", zIndex: 1,
                  }}>
                    <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: fase.color, lineHeight: 1 }}>Fase</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600, color: fase.color, lineHeight: 1 }}>{fase.num}</span>
                  </div>

                  {/* Conteúdo */}
                  <div style={{
                    flex: 1, background: CARD_BG,
                    border: `1px solid ${BORDER}`,
                    borderLeft: `3px solid ${fase.color}`,
                    borderRadius: "0 2px 2px 0",
                    padding: "1rem 1.25rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" as const, marginBottom: "0.4rem" }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 600, color: FG, margin: 0 }}>{fase.nome}</p>
                      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: fase.color }}>Semanas {fase.semanas}</span>
                      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.6rem", color: MUTED }}>{fase.sessoes}</span>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.95rem", color: FG_WARM, margin: 0, lineHeight: 1.6 }}>{fase.foco}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Seção 3: Protocolo RAIZ ───────────────────────────────────────── */}
        <section>
          <SectionLabel>Metodologia</SectionLabel>
          <SectionTitle>O Protocolo <span style={{ color: GOLD, fontStyle: "italic" }}>RAIZ</span> — Como Funciona Cada Sessão</SectionTitle>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.05rem, 2vw, 1.15rem)", lineHeight: 1.85, color: FG_WARM, marginBottom: "2.5rem" }}>
            Cada uma das 12 sessões segue o mesmo protocolo estruturado, garantindo consistência, profundidade e progresso mensurável:
          </p>

          {/* Tabs RAIZ */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" as const }}>
            {RAIZ.map((r, i) => (
              <button
                key={r.letra}
                onClick={() => setActiveRaiz(i)}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1rem", fontWeight: 600,
                  padding: "0.5rem 1.25rem",
                  background: activeRaiz === i ? r.color : "transparent",
                  color: activeRaiz === i ? BG : r.color,
                  border: `1px solid ${r.color}`,
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.05em",
                }}
              >
                {r.letra} — {r.titulo}
              </button>
            ))}
          </div>

          {/* Card ativo */}
          {RAIZ.map((r, i) => (
            <div
              key={r.letra}
              style={{
                display: activeRaiz === i ? "block" : "none",
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderTop: `3px solid ${r.color}`,
                borderRadius: "2px",
                padding: "2rem 2.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{
                  width: "52px", height: "52px",
                  background: `${r.color}20`,
                  border: `2px solid ${r.color}`,
                  borderRadius: "2px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 700, color: r.color }}>{r.letra}</span>
                </div>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, color: FG, margin: 0 }}>{r.titulo}</p>
                  <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: r.color, margin: "0.2rem 0 0" }}>{r.tempo}</p>
                </div>
              </div>

              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", lineHeight: 1.8, color: FG_WARM, marginBottom: "1.25rem" }}>{r.desc}</p>

              <div style={{ borderLeft: `2px solid ${r.color}`, paddingLeft: "1rem", opacity: 0.8 }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", color: r.color, margin: 0 }}>"{r.citacao}"</p>
              </div>
            </div>
          ))}
        </section>

        <Divider />

        {/* ── Seção 4: Compromissos ─────────────────────────────────────────── */}
        <section>
          <SectionLabel>Seus Compromissos</SectionLabel>
          <SectionTitle>O que o Dr. Santiago pede de você</SectionTitle>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
            {COMPROMISSOS.map((c, i) => (
              <div key={i} style={{
                display: "flex", gap: "1.25rem", alignItems: "flex-start",
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: "2px",
                padding: "1.25rem 1.5rem",
                transition: "border-color 0.2s",
              }}>
                <span style={{ color: c.color, fontSize: "0.75rem", marginTop: "0.3rem", flexShrink: 0 }}>{c.icon}</span>
                <div>
                  <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: c.color, margin: "0 0 0.4rem", letterSpacing: "0.05em" }}>{c.titulo}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", color: FG_WARM, margin: 0, lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Seção 5: O que está incluído ─────────────────────────────────── */}
        <section>
          <SectionLabel>Incluído na sua mentoria</SectionLabel>
          <SectionTitle>O que você recebe</SectionTitle>

          <div style={{
            background: CARD_BG,
            border: `1px solid ${BORDER_GOLD}`,
            borderRadius: "2px",
            overflow: "hidden",
          }}>
            {INCLUIDOS.map((inc, i) => (
              <div key={i} style={{
                display: "flex", gap: "1.5rem", alignItems: "flex-start",
                padding: "1rem 1.5rem",
                borderBottom: i < INCLUIDOS.length - 1 ? `1px solid ${BORDER}` : "none",
                background: i % 2 === 0 ? "transparent" : `oklch(0.55 0.06 240 / 0.03)`,
              }}>
                <div style={{ width: "5px", height: "5px", background: GOLD, transform: "rotate(45deg)", marginTop: "0.5rem", flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", gap: "1rem", flexWrap: "wrap" as const, alignItems: "baseline" }}>
                  <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: FG, margin: 0, minWidth: "200px" }}>{inc.item}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.95rem", color: MUTED, margin: 0, flex: 1 }}>{inc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Seção 6: Logística ───────────────────────────────────────────── */}
        <section>
          <SectionLabel>Logística</SectionLabel>
          <SectionTitle>Informações Práticas</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            {[
              { icon: "📅", titulo: "Agendamento", desc: "Sessões agendadas semanalmente, preferencialmente no mesmo dia e horário para criar consistência e ritual. Você receberá o link do calendário na primeira semana." },
              { icon: "🔄", titulo: "Reagendamento", desc: "Avise com no mínimo 48 horas de antecedência. Sessões canceladas com menos de 24 horas sem justificativa serão consideradas realizadas." },
              { icon: "💻", titulo: "Plataforma", desc: "Sessões via Zoom. Certifique-se de ter conexão estável, ambiente privado e sem interrupções." },
              { icon: "🧪", titulo: "Exames laboratoriais", desc: "Os exames recomendados devem ser realizados antes da Sessão 1. O Dr. Santiago enviará a lista completa após a Sessão 0." },
              { icon: "💬", titulo: "Suporte entre sessões", desc: "Canal de WhatsApp para dúvidas clínicas e de protocolo — não para coaching contínuo. Respostas em até 24 horas nos dias úteis." },
            ].map((log) => (
              <div key={log.titulo} style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: "2px",
                padding: "1.5rem",
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{log.icon}</div>
                <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: STEEL_LIGHT, marginBottom: "0.5rem" }}>{log.titulo}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.95rem", color: FG_WARM, margin: 0, lineHeight: 1.65 }}>{log.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Versículo final ───────────────────────────────────────────────── */}
        <section style={{ textAlign: "center" }}>
          <div style={{
            background: `linear-gradient(135deg, oklch(0.55 0.06 240 / 0.08) 0%, oklch(0.72 0.12 75 / 0.05) 100%)`,
            border: `1px solid ${BORDER_STEEL}`,
            borderRadius: "2px",
            padding: "3rem 2.5rem",
            marginBottom: "3rem",
          }}>
            <div style={{ fontSize: "2rem", color: STEEL_LIGHT, opacity: 0.3, fontFamily: "Georgia, serif", marginBottom: "1rem" }}>"</div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)",
              fontStyle: "italic", color: FG_WARM,
              lineHeight: 1.7, margin: "0 0 1rem",
            }}>
              Porque eu bem sei os planos que tenho a vosso respeito, diz o Senhor; planos de paz, e não de mal,{" "}
              <span style={{ color: STEEL_LIGHT }}>para vos dar um futuro e uma esperança.</span>
            </p>
            <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: STEEL_LIGHT, margin: 0, fontWeight: 700 }}>
              — Jeremias 29:11
            </p>
          </div>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 2vw, 1.3rem)", lineHeight: 1.85, color: FG_WARM, marginBottom: "1.5rem" }}>
            Esses 90 dias são um presente que você está se dando. Um investimento não apenas no seu negócio ou na sua saúde — mas na versão mais completa, mais alinhada e mais poderosa de quem você foi criado para ser.
          </p>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem", color: GOLD, marginBottom: "2.5rem" }}>
            Estamos juntos nessa jornada.
          </p>

          {/* Assinatura */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "44px", height: "44px", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px" }}>
              <span style={{ color: BG, fontSize: "14px", fontWeight: 800 }}>SV</span>
            </div>
            <div style={{ textAlign: "left" as const }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, color: FG, margin: 0 }}>Dr. Santiago Vecina</p>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: COPPER, margin: "0.2rem 0 0" }}>
                Médico · Nutrólogo · Especialista em Performance Integral
              </p>
            </div>
          </div>

          {/* Ornamento final */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "3rem" }}>
            <div style={{ height: "1px", flex: 1, background: `linear-gradient(to right, transparent, ${BORDER})` }} />
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <div style={{ width: "4px", height: "4px", background: STEEL, transform: "rotate(45deg)", opacity: 0.5 }} />
              <div style={{ width: "6px", height: "6px", background: GOLD, transform: "rotate(45deg)" }} />
              <div style={{ width: "4px", height: "4px", background: STEEL, transform: "rotate(45deg)", opacity: 0.5 }} />
            </div>
            <div style={{ height: "1px", flex: 1, background: `linear-gradient(to left, transparent, ${BORDER})` }} />
          </div>
        </section>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${BORDER}`,
        padding: "1.5rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap" as const, gap: "0.5rem",
        background: BG_WARM,
      }}>
        <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em", color: MUTED, margin: 0 }}>
          Protocolo das Raízes Profundas · Documento Confidencial
        </p>
        <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em", color: STEEL_LIGHT, margin: 0 }}>
          Dr. Santiago Vecina · Performance Integral
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Nunito+Sans:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: oklch(0.55 0.06 240 / 0.3); color: oklch(0.95 0.008 80); }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}
