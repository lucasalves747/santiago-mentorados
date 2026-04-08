/*
 * Obrigado.tsx — Página de confirmação após envio do formulário
 * Design: Luxury Editorial — Dr. Santiago Vecina
 * Fundo quase-preto, dourado como acento, Cormorant Garamond + Nunito Sans
 */

import { useLocation } from "wouter";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function Obrigado() {
  const [, navigate] = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "oklch(0.08 0.005 285)" }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-white/5"
        style={{
          background: "transparent",
          border: "none",
          color: "oklch(0.55 0.010 80)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "oklch(0.96 0.008 80)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "oklch(0.55 0.010 80)";
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

      {/* Logo */}
      <div className="mb-12 text-center">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-sm mb-6"
          style={{ background: "oklch(0.72 0.12 75)", color: "oklch(0.08 0.005 285)" }}
        >
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.25rem" }}>SV</span>
        </div>
        <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.15em", color: "oklch(0.55 0.010 80)", textTransform: "uppercase" }}>
          Dr. Santiago Vecina
        </p>
      </div>

      {/* Check icon */}
      <div className="mb-8 animate-fade-in">
        <CheckCircle size={64} style={{ color: "oklch(0.72 0.12 75)" }} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h1
        className="text-center mb-4 animate-fade-in-up"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 600,
          color: "oklch(0.97 0.012 80)",
          lineHeight: 1.2,
        }}
      >
        Diagnóstico Enviado
        <br />
        <span style={{ color: "oklch(0.72 0.12 75)" }}>com Sucesso</span>
      </h1>

      {/* Divider */}
      <div className="gold-divider w-24 my-6 animate-fade-in stagger-2" />

      {/* Message */}
      <p
        className="text-center max-w-lg mb-4 animate-fade-in-up stagger-3"
        style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "1rem",
          color: "oklch(0.70 0.008 80)",
          lineHeight: 1.7,
        }}
      >
        Obrigado por dedicar tempo e honestidade a este formulário. O Dr. Santiago receberá suas respostas e entrará em contato antes da Sessão 0.
      </p>

      {/* Bible quote */}
      <blockquote
        className="text-center max-w-md mt-6 mb-10 animate-fade-in-up stagger-4"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "1.125rem",
          color: "oklch(0.72 0.12 75 / 0.8)",
          borderLeft: "2px solid oklch(0.72 0.12 75 / 0.3)",
          paddingLeft: "1.25rem",
          textAlign: "left",
        }}
      >
        "Examina-me, ó Deus, e conhece o meu coração; prova-me e conhece os meus pensamentos."
        <footer
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontStyle: "normal",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            color: "oklch(0.55 0.010 80)",
            marginTop: "0.5rem",
            textTransform: "uppercase",
          }}
        >
          — Salmo 139:23
        </footer>
      </blockquote>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="btn-gold-shimmer animate-fade-in-up stagger-5"
        style={{
          padding: "0.75rem 2.5rem",
          background: "transparent",
          border: "1px solid oklch(0.72 0.12 75 / 0.5)",
          color: "oklch(0.72 0.12 75)",
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          borderRadius: "2px",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.borderColor = "oklch(0.72 0.12 75)";
          (e.target as HTMLButtonElement).style.background = "oklch(0.72 0.12 75 / 0.1)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.borderColor = "oklch(0.72 0.12 75 / 0.5)";
          (e.target as HTMLButtonElement).style.background = "transparent";
        }}
      >
        Voltar ao Início
      </button>

      {/* Footer */}
      <p
        className="mt-16 animate-fade-in stagger-6"
        style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.75rem",
          color: "oklch(0.35 0.005 80)",
          letterSpacing: "0.05em",
        }}
      >
        drsantiagovecina.com · @drsantiagovecina
      </p>
    </div>
  );
}
