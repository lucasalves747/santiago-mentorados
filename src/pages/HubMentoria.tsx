/*
 * HubMentoria.tsx — Portal Central da Mentoria — Dr. Santiago Vecina
 * Hub elegante com todos os materiais do Protocolo das Raízes Profundas
 * Design: Luxury Editorial — fundo quase-preto, dourado, Cormorant + Nunito Sans
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft } from "lucide-react";

// ─── Cores ────────────────────────────────────────────────────────────────────
const BG = "oklch(0.07 0.005 285)";
const CARD = "oklch(0.10 0.005 285)";
const CARD_HOVER = "oklch(0.13 0.006 285)";
const BORDER = "oklch(0.20 0.006 285)";
const GOLD = "oklch(0.72 0.12 75)";
const GOLD_DIM = "oklch(0.72 0.12 75 / 0.6)";
const GOLD_FAINT = "oklch(0.72 0.12 75 / 0.08)";
const COPPER = "oklch(0.65 0.14 50)";
const EMERALD = "oklch(0.65 0.14 160)";
const STEEL = "oklch(0.55 0.08 240)";
const VIOLET = "oklch(0.60 0.14 290)";
const FG = "oklch(0.96 0.008 80)";
const MUTED = "oklch(0.55 0.010 80)";

// ─── Dados dos materiais ──────────────────────────────────────────────────────
const MATERIAIS = [
  {
    numero: "I",
    titulo: "Formulário de Diagnóstico",
    subtitulo: "Anamnese Expandida",
    descricao: "O ponto de partida da sua transformação. Responda com honestidade radical — cada campo revela um padrão que a ciência e a fé vão trabalhar juntos.",
    href: "/diagnostico",
    cor: GOLD,
    icone: "◈",
    tag: "Obrigatório · Início da Jornada",
    etapa: "Etapa 1",
  },
  {
    numero: "II",
    titulo: "Carta de Boas-Vindas",
    subtitulo: "Protocolo das Raízes Profundas",
    descricao: "Uma aliança. Uma carta do Dr. Santiago para você — sobre o que está por vir, o que será exigido, e o que será possível nas próximas 13 semanas.",
    href: "/carta",
    cor: COPPER,
    icone: "✦",
    tag: "Leitura · Antes da 1ª Sessão",
    etapa: "Etapa 2",
  },
  {
    numero: "III",
    titulo: "Guia do Mentorado",
    subtitulo: "Manual de Bordo — 90 Dias",
    descricao: "O mapa completo da jornada. As 5 fases, o Protocolo RAIZ, os compromissos, a logística e tudo que você precisa saber para extrair o máximo das 13 semanas.",
    href: "/guia",
    cor: STEEL,
    icone: "⬡",
    tag: "Referência · Consulte Sempre",
    etapa: "Etapa 3",
  },
  {
    numero: "IV",
    titulo: "Diário de Transformação",
    subtitulo: "Registro Diário dos 6 Pilares",
    descricao: "Registre diariamente sono, energia, humor, alimentação, espiritualidade e insights. Este registro vai revelar padrões que você nunca veria de outra forma.",
    href: "/diario",
    cor: EMERALD,
    icone: "◉",
    tag: "Diário · Preencher Todo Dia",
    etapa: "Etapa 4",
  },
];

// ─── Componente de cartão ─────────────────────────────────────────────────────
function MaterialCard({
  numero, titulo, subtitulo, descricao, href, cor, icone, tag, etapa, index
}: typeof MATERIAIS[0] & { index: number }) {
  const [hovered, setHovered] = useState(false);
  const [, navigate] = useLocation();

  return (
    <div
      onClick={() => navigate(href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? CARD_HOVER : CARD,
        border: `1px solid ${hovered ? cor + "60" : BORDER}`,
        borderTop: `3px solid ${cor}`,
        borderRadius: "4px",
        padding: "2rem",
        cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 12px 40px ${cor}15` : "none",
        position: "relative",
        overflow: "hidden",
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Ornamento de fundo */}
      <div style={{
        position: "absolute",
        top: "-20px",
        right: "-20px",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${cor}08 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Cabeçalho do cartão */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "42px", height: "42px",
            background: `${cor}15`,
            border: `1px solid ${cor}40`,
            borderRadius: "3px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            color: cor,
          }}>{icone}</div>
          <div>
            <div style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: `${cor}90`,
              marginBottom: "0.1rem",
            }}>{etapa}</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: cor,
              lineHeight: 1,
            }}>{numero}</div>
          </div>
        </div>

        {/* Seta de acesso */}
        <div style={{
          width: "28px", height: "28px",
          border: `1px solid ${cor}40`,
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: cor,
          fontSize: "0.75rem",
          transition: "all 0.2s",
          transform: hovered ? "translateX(3px)" : "none",
          background: hovered ? `${cor}15` : "transparent",
        }}>→</div>
      </div>

      {/* Título e subtítulo */}
      <div style={{ marginBottom: "0.75rem" }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.3rem",
          fontWeight: 600,
          color: FG,
          margin: "0 0 0.2rem 0",
          lineHeight: 1.2,
        }}>{titulo}</h3>
        <div style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: MUTED,
        }}>{subtitulo}</div>
      </div>

      {/* Separador dourado */}
      <div style={{
        width: "40px", height: "1px",
        background: `linear-gradient(90deg, ${cor}, transparent)`,
        marginBottom: "0.85rem",
      }} />

      {/* Descrição */}
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: "0.95rem",
        color: MUTED,
        lineHeight: 1.65,
        margin: "0 0 1.25rem 0",
      }}>{descricao}</p>

      {/* Tag */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.25rem 0.65rem",
        borderRadius: "20px",
        border: `1px solid ${cor}30`,
        background: `${cor}0a`,
        fontFamily: "'Nunito Sans', sans-serif",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: `${cor}90`,
      }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cor, display: "inline-block" }} />
        {tag}
      </div>
    </div>
  );
}

// ─── Linha do tempo das 13 semanas ───────────────────────────────────────────
const FASES = [
  { semana: "1–2", nome: "Diagnóstico", cor: GOLD, desc: "Anamnese completa e análise de exames" },
  { semana: "3–5", nome: "Fundação", cor: COPPER, desc: "Sono, nutrição e movimento básico" },
  { semana: "6–8", nome: "Construção", cor: STEEL, desc: "Protocolos avançados de performance" },
  { semana: "9–11", nome: "Integração", cor: EMERALD, desc: "Mente, fé e liderança alinhadas" },
  { semana: "12–13", nome: "Consolidação", cor: VIOLET, desc: "Autonomia e legado" },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export default function HubMentoria() {
  const auth = useAuth();
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: FG }}>

      {/* ── Header ── */}
      <header style={{
        background: `linear-gradient(180deg, oklch(0.09 0.006 285) 0%, ${BG} 100%)`,
        borderBottom: `1px solid ${BORDER}`,
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={handleBack}
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
              {auth.isAuthenticated ? "Dashboard" : "Login"}
            </span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {auth.isAuthenticated && (
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: GOLD,
                textDecoration: "none",
                padding: "0.5rem 1rem",
                border: `1px solid ${GOLD}40`,
                borderRadius: "3px",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${GOLD}10`;
                e.currentTarget.style.borderColor = GOLD;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = `${GOLD}40`;
              }}
            >
              Meu Dashboard
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "36px", height: "36px",
              background: `linear-gradient(135deg, ${GOLD}, ${COPPER})`,
              borderRadius: "3px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "12px", fontWeight: 800,
              color: "oklch(0.08 0.005 285)",
              letterSpacing: "0.05em",
            }}>SV</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 600, color: FG }}>
                Dr. Santiago Vecina
              </div>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>
                Performance Integral
              </div>
            </div>
          </div>
        </div>

        <a
          href="/admin"
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: MUTED,
            textDecoration: "none",
            padding: "0.4rem 0.85rem",
            border: `1px solid ${BORDER}`,
            borderRadius: "3px",
            transition: "all 0.15s",
          }}
        >
          Admin
        </a>
      </header>

      {/* ── Hero ── */}
      <section style={{
        padding: "4rem 1.5rem 3rem",
        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        {/* Ornamento superior */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{ flex: 1, maxWidth: "80px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD_DIM})` }} />
          <span style={{ color: GOLD, fontSize: "0.9rem", letterSpacing: "0.3em" }}>✦ ✦ ✦</span>
          <div style={{ flex: 1, maxWidth: "80px", height: "1px", background: `linear-gradient(90deg, ${GOLD_DIM}, transparent)` }} />
        </div>

        <div style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: GOLD_DIM,
          marginBottom: "0.75rem",
        }}>
          Protocolo das Raízes Profundas
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          color: FG,
          lineHeight: 1.1,
          margin: "0 0 0.5rem 0",
        }}>
          Portal do <span style={{ color: GOLD }}>Mentorado</span>
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "1.15rem",
          color: MUTED,
          maxWidth: "560px",
          margin: "0 auto 2rem",
          lineHeight: 1.7,
        }}>
          Tudo que você precisa para a sua jornada de transformação integral — em um único lugar.
        </p>

        {/* Versículo */}
        <div style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          border: `1px solid ${GOLD}25`,
          borderLeft: `3px solid ${GOLD}`,
          background: GOLD_FAINT,
          borderRadius: "0 3px 3px 0",
          textAlign: "left",
          maxWidth: "480px",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "0.95rem",
            color: GOLD_DIM,
            margin: "0 0 0.25rem 0",
            lineHeight: 1.6,
          }}>
            "Amado, desejo que você prospere em tudo e goze de boa saúde, assim como você prospera espiritualmente."
          </p>
          <div style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: `${GOLD}60`,
          }}>— 3 João 1:2</div>
        </div>
      </section>

      {/* ── Grade de materiais ── */}
      <section style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "0 1.25rem 4rem",
      }}>
        <div style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: MUTED,
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}>
          <span>Materiais da Mentoria</span>
          <div style={{ flex: 1, height: "1px", background: BORDER }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}>
          {MATERIAIS.map((m, i) => (
            <MaterialCard key={m.numero} {...m} index={i} />
          ))}
        </div>
      </section>

      {/* ── Linha do tempo das fases ── */}
      <section style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "0 1.25rem 4rem",
      }}>
        <div style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: MUTED,
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}>
          <span>As 5 Fases — 13 Semanas</span>
          <div style={{ flex: 1, height: "1px", background: BORDER }} />
        </div>

        <div style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: "4px",
          padding: "1.75rem",
          position: "relative",
        }}>
          {/* Linha conectora */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "1.75rem",
            right: "1.75rem",
            height: "1px",
            background: `linear-gradient(90deg, ${GOLD}40, ${VIOLET}40)`,
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            position: "relative",
          }}>
            {FASES.map((fase, i) => (
              <div key={fase.nome} style={{ textAlign: "center" }}>
                {/* Círculo */}
                <div style={{
                  width: "44px", height: "44px",
                  borderRadius: "50%",
                  border: `2px solid ${fase.cor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 0.75rem",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: fase.cor,
                  position: "relative",
                  zIndex: 1,
                  background: CARD,
                }}>
                  {i + 1}
                </div>
                <div style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: fase.cor,
                  marginBottom: "0.2rem",
                }}>Sem. {fase.semana}</div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: FG,
                  marginBottom: "0.3rem",
                }}>{fase.nome}</div>
                <div style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "0.7rem",
                  color: MUTED,
                  lineHeight: 1.4,
                }}>{fase.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Números de impacto ── */}
      <section style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "0 1.25rem 4rem",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1px",
          background: BORDER,
          border: `1px solid ${BORDER}`,
          borderRadius: "4px",
          overflow: "hidden",
        }}>
          {[
            { num: "90", label: "Dias de Transformação", cor: GOLD },
            { num: "13", label: "Semanas de Protocolo", cor: COPPER },
            { num: "5", label: "Fases de Evolução", cor: STEEL },
            { num: "3", label: "Dimensões Integradas", cor: EMERALD },
          ].map(item => (
            <div key={item.label} style={{
              background: CARD,
              padding: "1.5rem 1rem",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.75rem",
                fontWeight: 700,
                color: item.cor,
                lineHeight: 1,
                marginBottom: "0.4rem",
              }}>{item.num}</div>
              <div style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: MUTED,
              }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rodapé ── */}
      <footer style={{
        borderTop: `1px solid ${BORDER}`,
        padding: "2rem 1.5rem",
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: GOLD_DIM,
          marginBottom: "0.3rem",
        }}>Dr. Santiago Vecina</div>
        <div style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: MUTED,
        }}>Médico · Nutrólogo · Especialista em Performance Integral · Miami, FL</div>
      </footer>
    </div>
  );
}
