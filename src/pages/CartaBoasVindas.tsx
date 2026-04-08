/**
 * CartaBoasVindas.tsx — Carta de Boas-Vindas Personalizada
 * Design: Luxury Editorial mesclado — fundo escuro + dourado + verde-musgo/cobre
 * Protocolo das Raízes Profundas — Dr. Santiago Vecina
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

// ─── Paleta mesclada ──────────────────────────────────────────────────────────
const GOLD        = "oklch(0.72 0.12 75)";      // dourado principal
const COPPER      = "oklch(0.62 0.10 52)";       // cobre/âmbar — segundo tom
const SAGE        = "oklch(0.48 0.06 155)";      // verde-musgo — terceiro tom
const BG          = "oklch(0.07 0.006 285)";     // fundo quase-preto
const BG_WARM     = "oklch(0.10 0.008 60)";      // fundo quente (papel escuro)
const CARD_BG     = "oklch(0.12 0.006 60)";      // card levemente quente
const BORDER      = "oklch(0.20 0.008 60)";      // borda sutil
const BORDER_GOLD = "oklch(0.72 0.12 75 / 0.3)"; // borda dourada suave
const FG          = "oklch(0.95 0.010 80)";      // texto principal (creme)
const FG_WARM     = "oklch(0.88 0.015 80)";      // texto levemente quente
const MUTED       = "oklch(0.55 0.012 80)";      // texto secundário

export default function CartaBoasVindas() {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const auth = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const parallax = -scrollY * 0.25;

  return (
    <div style={{ background: BG, minHeight: "100vh", color: FG, fontFamily: "'Nunito Sans', sans-serif" }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem", height: "56px",
        background: "oklch(0.07 0.006 285 / 0.92)",
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
            <div style={{
              width: "30px", height: "30px", background: GOLD,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "2px", flexShrink: 0,
            }}>
              <span style={{ color: BG, fontSize: "11px", fontWeight: 800, letterSpacing: "0.05em" }}>SV</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: FG, fontFamily: "'Nunito Sans', sans-serif" }}>Dr. Santiago Vecina</p>
              <p style={{ margin: 0, fontSize: "8px", color: MUTED, letterSpacing: "1.5px", textTransform: "uppercase" }}>Performance Integral</p>
            </div>
          </div>
        </div>
        <span style={{ fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase", color: COPPER, fontWeight: 700 }}>
          Protocolo das Raízes Profundas
        </span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div ref={heroRef} style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Fundo com gradiente quente */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.18 0.04 60 / 0.6) 0%, ${BG} 70%)`,
          transform: `translateY(${parallax}px)`,
        }} />
        {/* Ornamento central */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, oklch(0.72 0.12 75 / 0.04) 0%, transparent 60%),
            repeating-linear-gradient(0deg, transparent, transparent 79px, oklch(0.72 0.12 75 / 0.03) 80px),
            repeating-linear-gradient(90deg, transparent, transparent 79px, oklch(0.72 0.12 75 / 0.03) 80px)
          `,
        }} />
        {/* Linhas decorativas */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <line x1="720" y1="0" x2="720" y2="900" stroke={GOLD} strokeWidth="0.5" />
          <line x1="0" y1="450" x2="1440" y2="450" stroke={GOLD} strokeWidth="0.5" />
          <circle cx="720" cy="450" r="200" fill="none" stroke={GOLD} strokeWidth="0.5" />
          <circle cx="720" cy="450" r="300" fill="none" stroke={COPPER} strokeWidth="0.3" />
          <polygon points="720,250 870,550 570,550" fill="none" stroke={GOLD} strokeWidth="0.5" />
        </svg>

        {/* Conteúdo hero */}
        <div style={{
          position: "relative", zIndex: 10, textAlign: "center", padding: "0 2rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          {/* Ornamento topo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ height: "1px", width: "60px", background: `linear-gradient(to right, transparent, ${COPPER})` }} />
            <div style={{ width: "6px", height: "6px", background: COPPER, transform: "rotate(45deg)" }} />
            <div style={{ height: "1px", width: "60px", background: `linear-gradient(to left, transparent, ${COPPER})` }} />
          </div>

          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: COPPER, marginBottom: "1.25rem" }}>
            Protocolo das Raízes Profundas
          </p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            fontWeight: 600, lineHeight: 1.05, margin: "0 0 1rem 0",
            color: FG,
          }}>
            Carta de<br />
            <span style={{ color: GOLD, fontStyle: "italic" }}>Boas-Vindas</span>
          </h1>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(1rem, 2vw, 1.25rem)", color: MUTED, marginBottom: "3rem" }}>
            Uma aliança que começa com um compromisso mútuo
          </p>

          {/* Scroll indicator */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.6 }}>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>Role para ler</span>
            <div style={{ width: "1px", height: "40px", background: `linear-gradient(to bottom, ${GOLD}, transparent)`, animation: "pulse 2s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* ── Corpo da carta ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "5rem 2rem 8rem" }}>

        {/* Cabeçalho da carta */}
        <div style={{
          background: CARD_BG,
          border: `1px solid ${BORDER_GOLD}`,
          borderRadius: "2px",
          padding: "2.5rem 3rem",
          marginBottom: "3rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Detalhe de canto */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "60px", height: "60px", borderRight: `1px solid ${BORDER_GOLD}`, borderBottom: `1px solid ${BORDER_GOLD}`, opacity: 0.4 }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "60px", height: "60px", borderLeft: `1px solid ${BORDER_GOLD}`, borderTop: `1px solid ${BORDER_GOLD}`, opacity: 0.4 }} />

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", color: MUTED, marginBottom: "0.5rem" }}>
            Miami, <span style={{ color: COPPER }}>{new Date().toLocaleDateString('pt-BR')}</span>
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 600, color: FG, margin: 0,
          }}>
            <span style={{ color: GOLD }}>{auth.user?.name || 'Mentorado'}</span>,
          </p>
        </div>

        {/* Parágrafo 1 — Abertura */}
        <Paragraph>
          Há um momento na vida de todo líder em que ele para — no meio de toda a conquista,
          de todo o sucesso, de toda a correria — e se faz a pergunta que ninguém ensina a
          responder:
        </Paragraph>

        {/* Citação de abertura */}
        <PullQuote color={GOLD}>
          "Para quê tudo isso?"
        </PullQuote>

        <Paragraph>
          Se você chegou até aqui, é porque esse momento já chegou para você. Ou está
          chegando. E você teve a coragem de não ignorá-lo.
        </Paragraph>

        {/* Destaque — Bem-vindo */}
        <div style={{
          textAlign: "center",
          padding: "3rem 2rem",
          margin: "3rem 0",
          background: `linear-gradient(135deg, oklch(0.12 0.008 60) 0%, oklch(0.10 0.006 285) 100%)`,
          border: `1px solid ${BORDER_GOLD}`,
          borderRadius: "2px",
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: "1rem", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ height: "1px", width: "30px", background: GOLD, opacity: 0.5 }} />
            <div style={{ width: "4px", height: "4px", background: GOLD, transform: "rotate(45deg)" }} />
            <div style={{ height: "1px", width: "30px", background: GOLD, opacity: 0.5 }} />
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 600, color: FG, margin: "0.5rem 0 0" }}>
            Bem-vindo ao{" "}
            <span style={{ color: GOLD, fontStyle: "italic" }}>Protocolo das Raízes Profundas</span>.
          </p>
        </div>

        {/* Parágrafo 2 — A aliança */}
        <Paragraph>
          Nas próximas <strong style={{ color: GOLD }}>13 semanas</strong>, você e eu vamos trabalhar juntos de uma forma que
          provavelmente você nunca experimentou antes. Não como coach e cliente. Não como
          consultor e contratante. Mas como médico e paciente — no sentido mais profundo e
          mais antigo dessa palavra.
        </Paragraph>

        {/* Destaque etimológico */}
        <div style={{
          borderLeft: `3px solid ${COPPER}`,
          paddingLeft: "1.5rem",
          margin: "2.5rem 0",
          background: `oklch(0.62 0.10 52 / 0.05)`,
          padding: "1.25rem 1.5rem",
          borderRadius: "0 2px 2px 0",
        }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: FG_WARM, margin: 0, lineHeight: 1.7 }}>
            <span style={{ color: COPPER, fontWeight: 700 }}>Paciente</span> vem do latim{" "}
            <span style={{ color: COPPER, fontStyle: "normal", fontWeight: 700 }}>patiens</span>: aquele que suporta, que
            persevera, que tem a coragem de se deixar ser tratado.
          </p>
        </div>

        {/* Parágrafo 3 — O médico */}
        <Paragraph>
          Como médico e nutrólogo especializado em performance, eu vou olhar para você de
          uma forma que nenhum coach pode: vou analisar seus exames, interpretar seus
          biomarcadores, entender a fisiologia por trás do que você sente e do que você não
          consegue sentir mais.
        </Paragraph>

        {/* Cards de biomarcadores */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          margin: "2.5rem 0",
        }}>
          {[
            { icon: "⚡", label: "Cortisol", desc: "que está destruindo sua testosterona" },
            { icon: "🔥", label: "Inflamação silenciosa", desc: "comprometendo sua cognição" },
            { icon: "🌿", label: "Microbioma", desc: "afetando seu humor e decisões" },
          ].map((item) => (
            <div key={item.label} style={{
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderTop: `2px solid ${SAGE}`,
              borderRadius: "2px",
              padding: "1.25rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: SAGE, margin: "0 0 0.4rem" }}>{item.label}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.9rem", color: MUTED, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Parágrafo 4 — A alma */}
        <Paragraph>
          Mas também vou olhar para o que nenhum médico convencional olha:{" "}
          <strong style={{ color: GOLD }}>sua alma. Seu propósito. Suas crenças. Seu legado.</strong>{" "}
          Porque aprendi — tanto na ciência quanto na Palavra de Deus — que você não pode
          separar o cortisol da ansiedade, a testosterona da liderança, o microbioma do humor,
          e nenhum desses do propósito pelo qual você foi criado.
        </Paragraph>

        {/* Versículo */}
        <div style={{
          background: `linear-gradient(135deg, oklch(0.48 0.06 155 / 0.08) 0%, oklch(0.72 0.12 75 / 0.05) 100%)`,
          border: `1px solid oklch(0.48 0.06 155 / 0.3)`,
          borderRadius: "2px",
          padding: "2.5rem",
          margin: "3rem 0",
          textAlign: "center",
          position: "relative",
        }}>
          <div style={{ fontSize: "2rem", color: SAGE, opacity: 0.4, fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: "1rem" }}>"</div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
            fontStyle: "italic",
            color: FG_WARM,
            lineHeight: 1.7,
            margin: "0 0 1rem",
          }}>
            Amado, desejo que você prospere em tudo e goze de boa saúde,{" "}
            <span style={{ color: SAGE }}>assim como você prospera espiritualmente.</span>
          </p>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: SAGE, margin: 0, fontWeight: 700 }}>
            — 3 João 1:2
          </p>
        </div>

        {/* Parágrafo 5 — A aliança */}
        <Paragraph>
          Esta não é apenas uma mentoria. É uma aliança. E como toda aliança bíblica, ela
          começa com um compromisso mútuo: eu me comprometo a trazer tudo que tenho —
          minha formação médica, minha experiência clínica, minha fé e meu cuidado genuíno
          — para cada sessão.
        </Paragraph>

        <Paragraph>
          E peço que você traga o mesmo:{" "}
          <strong style={{ color: GOLD }}>presença total, honestidade radical e disposição para ser transformado.</strong>
        </Paragraph>

        {/* O que está por vir */}
        <div style={{
          background: CARD_BG,
          border: `1px solid ${BORDER_GOLD}`,
          borderRadius: "2px",
          padding: "2rem 2.5rem",
          margin: "3rem 0",
        }}>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: COPPER, marginBottom: "1.25rem" }}>
            O que está por vir
          </p>
          {[
            { icon: "◆", color: GOLD, text: "Vai desafiar você." },
            { icon: "◆", color: COPPER, text: "Vai incomodar você." },
            { icon: "◆", color: SAGE, text: "Vai revelar coisas que você preferia não ver." },
            { icon: "◆", color: GOLD, text: "E vai libertá-lo de correntes que você nem sabia que carregava." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", marginBottom: i < 3 ? "0.875rem" : 0 }}>
              <span style={{ color: item.color, fontSize: "0.5rem", marginTop: "0.45rem", flexShrink: 0 }}>{item.icon}</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: FG_WARM, margin: 0, lineHeight: 1.6 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Parágrafo final */}
        <Paragraph>
          Estou honrado de caminhar com você nessa jornada.
        </Paragraph>

        {/* Assinatura */}
        <div style={{
          marginTop: "4rem",
          paddingTop: "2.5rem",
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          flexDirection: "column" as const,
          gap: "0.25rem",
        }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", color: MUTED, margin: 0 }}>
            Com respeito e fé,
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.25rem" }}>
            <div style={{
              width: "44px", height: "44px", background: GOLD,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "2px", flexShrink: 0,
            }}>
              <span style={{ color: BG, fontSize: "14px", fontWeight: 800 }}>SV</span>
            </div>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600, color: FG, margin: 0, lineHeight: 1.1 }}>
                Dr. Santiago Vecina
              </p>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: COPPER, margin: "0.25rem 0 0" }}>
                Médico · Nutrólogo · Especialista em Performance Integral
              </p>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: MUTED, margin: "0.15rem 0 0" }}>
                Miami, FL
              </p>
            </div>
          </div>

          {/* Ornamento final */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "2.5rem" }}>
            <div style={{ height: "1px", flex: 1, background: `linear-gradient(to right, transparent, ${BORDER_GOLD})` }} />
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <div style={{ width: "4px", height: "4px", background: COPPER, transform: "rotate(45deg)", opacity: 0.6 }} />
              <div style={{ width: "6px", height: "6px", background: GOLD, transform: "rotate(45deg)" }} />
              <div style={{ width: "4px", height: "4px", background: COPPER, transform: "rotate(45deg)", opacity: 0.6 }} />
            </div>
            <div style={{ height: "1px", flex: 1, background: `linear-gradient(to left, transparent, ${BORDER_GOLD})` }} />
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${BORDER}`,
        padding: "1.5rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap" as const,
        gap: "0.5rem",
        background: BG_WARM,
      }}>
        <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: MUTED, margin: 0 }}>
          Protocolo das Raízes Profundas · Documento Confidencial
        </p>
        <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: COPPER, margin: 0 }}>
          Dr. Santiago Vecina · Performance Integral
        </p>
      </footer>

      {/* ── CSS global para animações ───────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Nunito+Sans:wght@300;400;600;700&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: oklch(0.72 0.12 75 / 0.3); color: oklch(0.95 0.010 80); }
      `}</style>
    </div>
  );
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
      lineHeight: 1.85,
      color: "oklch(0.88 0.015 80)",
      margin: "0 0 1.75rem",
    }}>
      {children}
    </p>
  );
}

function PullQuote({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "2rem 1.5rem",
      margin: "2.5rem 0",
    }}>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(1.4rem, 4vw, 2rem)",
        fontStyle: "italic",
        fontWeight: 500,
        color,
        margin: 0,
        lineHeight: 1.4,
      }}>
        {children}
      </p>
    </div>
  );
}
