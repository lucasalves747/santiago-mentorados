/*
 * Admin.tsx — Área Administrativa — Dr. Santiago Vecina
 * Dashboard com diagnósticos, diários e gráficos de evolução
 * Protegida: apenas usuários com role=admin
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// ─── Cores ────────────────────────────────────────────────────────────────────
const GOLD = "oklch(0.72 0.12 75)";
const BG = "oklch(0.07 0.005 285)";
const CARD = "oklch(0.10 0.005 285)";
const CARD2 = "oklch(0.13 0.005 285)";
const BORDER = "oklch(0.20 0.006 285)";
const FG = "oklch(0.96 0.008 80)";
const MUTED = "oklch(0.55 0.010 80)";
const EMERALD = "oklch(0.65 0.14 160)";
const COPPER = "oklch(0.65 0.14 50)";

type Tab = "dashboard" | "diagnosticos" | "diarios" | "evolucao";

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) {
  return (
    <div style={{
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderTop: `3px solid ${color}`,
      borderRadius: "4px",
      padding: "1.25rem 1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    }}>
      <span style={{ fontSize: "1.75rem" }}>{icon}</span>
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginTop: "0.2rem" }}>{label}</div>
      </div>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "0.15rem 0.5rem",
      borderRadius: "20px",
      border: `1px solid ${color}40`,
      background: `${color}15`,
      color,
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}>{children}</span>
  );
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ flex: 1, height: "4px", background: `${color}20`, borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${(value / 10) * 100}%`, height: "100%", background: color, borderRadius: "2px" }} />
      </div>
      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", color, fontWeight: 700, minWidth: "1.5rem" }}>{value}</span>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Admin() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [search, setSearch] = useState("");
  const [selectedMentorado, setSelectedMentorado] = useState("");
  const [selectedDiagnostico, setSelectedDiagnostico] = useState<number | null>(null);
  const [selectedDiario, setSelectedDiario] = useState<number | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────
  const stats = trpc.admin.stats.useQuery(undefined, { enabled: user?.role === "admin" });
  const diagnosticos = trpc.admin.listDiagnosticos.useQuery(
    { search: search || undefined },
    { enabled: user?.role === "admin" && tab === "diagnosticos" }
  );
  const diarios = trpc.admin.listDiarios.useQuery(
    { search: search || undefined },
    { enabled: user?.role === "admin" && tab === "diarios" }
  );
  const evolucao = trpc.admin.getDiariosByMentorado.useQuery(
    { nome: selectedMentorado },
    { enabled: user?.role === "admin" && tab === "evolucao" && selectedMentorado.length > 0 }
  );
  const diagDetail = trpc.admin.getDiagnostico.useQuery(
    { id: selectedDiagnostico! },
    { enabled: selectedDiagnostico !== null }
  );
  const diarioDetail = trpc.admin.getDiario.useQuery(
    { id: selectedDiario! },
    { enabled: selectedDiario !== null }
  );

  // ── Dados do gráfico de evolução ──────────────────────────────────────────
  const chartData = useMemo(() => {
    if (!evolucao.data) return [];
    return [...evolucao.data]
      .sort((a, b) => a.data.localeCompare(b.data))
      .map(d => ({
        data: d.data.slice(5), // MM-DD
        sono: d.qualidadeSono ?? 0,
        energiaManha: d.energiaManha ?? 0,
        humor: d.humorGeral ?? 0,
        foco: d.nivelFoco ?? 0,
      }));
  }, [evolucao.data]);

  const radarData = useMemo(() => {
    if (!chartData.length) return [];
    const last = chartData[chartData.length - 1];
    return [
      { pilar: "Sono", valor: last.sono },
      { pilar: "Energia", valor: last.energiaManha },
      { pilar: "Humor", valor: last.humor },
      { pilar: "Foco", valor: last.foco },
    ];
  }, [chartData]);

  // ── Nomes únicos para seleção de evolução ─────────────────────────────────
  const nomesUnicos = useMemo(() => {
    if (!diarios.data) return [];
    const set = new Set(diarios.data.map(d => d.nome).filter(Boolean));
    return Array.from(set).sort();
  }, [diarios.data]);

  // ── Guards de autenticação ────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: MUTED }}>Verificando acesso...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", color: GOLD, marginBottom: "1rem" }}>Área Restrita</div>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.85rem", color: MUTED, marginBottom: "1.5rem" }}>
            Esta área é exclusiva para o Dr. Santiago Vecina. Faça login para continuar.
          </p>
          <a href={"/login"} style={{
            display: "inline-block",
            background: `linear-gradient(135deg, oklch(0.72 0.12 75), oklch(0.65 0.14 60))`,
            color: "oklch(0.08 0.005 285)",
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "0.75rem 1.75rem",
            borderRadius: "3px",
            textDecoration: "none",
          }}>Fazer Login</a>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", color: "#e07a5f", marginBottom: "1rem" }}>Acesso Negado</div>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.85rem", color: MUTED }}>
            Esta área é exclusiva para administradores.
          </p>
        </div>
      </div>
    );
  }

  // ── Layout principal ──────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: BG, color: FG }}>

      {/* Header */}
      <div style={{
        background: CARD,
        borderBottom: `1px solid ${BORDER}`,
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "32px", height: "32px",
            background: GOLD,
            borderRadius: "2px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "11px", fontWeight: 700,
            color: "oklch(0.08 0.005 285)",
          }}>SV</div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: FG }}>
              Painel Administrativo
            </div>
            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED }}>
              Dr. Santiago Vecina · Performance Integral
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Badge color={EMERALD}>Admin</Badge>
          <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8rem", color: MUTED }}>{user.name}</span>
        </div>
      </div>

      {/* Navegação por abas */}
      <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: "0 1.5rem", display: "flex", gap: "0" }}>
        {([
          { key: "dashboard", label: "Dashboard", icon: "◈" },
          { key: "diagnosticos", label: "Diagnósticos", icon: "📋" },
          { key: "diarios", label: "Diários", icon: "📓" },
          { key: "evolucao", label: "Evolução", icon: "📈" },
        ] as { key: Tab; label: string; icon: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSearch(""); }}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: tab === t.key ? `2px solid ${GOLD}` : "2px solid transparent",
              padding: "0.85rem 1.25rem",
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: tab === t.key ? GOLD : MUTED,
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.25rem" }}>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 600, color: FG, marginBottom: "0.25rem" }}>
              Visão Geral
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: MUTED, marginBottom: "2rem" }}>
              Acompanhe o progresso dos seus mentorados em tempo real.
            </p>

            {stats.isLoading ? (
              <div style={{ color: MUTED, fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.85rem" }}>Carregando estatísticas...</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <StatCard label="Diagnósticos Recebidos" value={stats.data?.totalDiagnosticos ?? 0} icon="📋" color={GOLD} />
                <StatCard label="Registros no Diário" value={stats.data?.totalDiarios ?? 0} icon="📓" color={EMERALD} />
                <StatCard label="Mentorados Ativos" value={stats.data?.mentoradosAtivos ?? 0} icon="👤" color={COPPER} />
              </div>
            )}

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "1.5rem" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: GOLD, marginBottom: "1rem" }}>
                Acesso Rápido
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                {[
                  { label: "Ver Diagnósticos", tab: "diagnosticos" as Tab, color: GOLD },
                  { label: "Ver Diários", tab: "diarios" as Tab, color: EMERALD },
                  { label: "Gráficos de Evolução", tab: "evolucao" as Tab, color: COPPER },
                ].map(item => (
                  <button
                    key={item.tab}
                    onClick={() => setTab(item.tab)}
                    style={{
                      background: `${item.color}10`,
                      border: `1px solid ${item.color}40`,
                      borderRadius: "3px",
                      padding: "0.75rem 1rem",
                      color: item.color,
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DIAGNÓSTICOS ── */}
        {tab === "diagnosticos" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 600, color: FG, margin: 0 }}>
                Diagnósticos Iniciais
              </h2>
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: CARD2,
                  border: `1px solid ${BORDER}`,
                  borderRadius: "3px",
                  padding: "0.5rem 0.85rem",
                  color: FG,
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "0.8rem",
                  outline: "none",
                  width: "220px",
                }}
              />
            </div>

            {diagnosticos.isLoading && <div style={{ color: MUTED, fontFamily: "'Nunito Sans', sans-serif" }}>Carregando...</div>}
            {diagnosticos.data?.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem" }}>
                Nenhum diagnóstico recebido ainda.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {diagnosticos.data?.map(d => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDiagnostico(selectedDiagnostico === d.id ? null : d.id)}
                  style={{
                    background: selectedDiagnostico === d.id ? `${GOLD}08` : CARD,
                    border: `1px solid ${selectedDiagnostico === d.id ? GOLD + "50" : BORDER}`,
                    borderRadius: "4px",
                    padding: "1rem 1.25rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: FG }}>
                        {d.nome || "—"}
                      </span>
                      {d.email && <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", color: MUTED }}>{d.email}</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.7rem", color: MUTED }}>
                        {new Date(d.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <Badge color={GOLD}>Diagnóstico</Badge>
                    </div>
                  </div>

                  {/* Detalhe expandido */}
                  {selectedDiagnostico === d.id && diagDetail.data && (
                    <div style={{ marginTop: "1rem", borderTop: `1px solid ${BORDER}`, paddingTop: "1rem" }}>
                      <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: "0.75rem" }}>
                        Respostas do Formulário
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.5rem" }}>
                        {Object.entries(diagDetail.data.dados as Record<string, unknown>).map(([key, val]) => (
                          <div key={key} style={{ background: CARD2, borderRadius: "3px", padding: "0.5rem 0.75rem" }}>
                            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: "0.2rem" }}>{key}</div>
                            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8rem", color: FG }}>
                              {Array.isArray(val) ? val.join(", ") : String(val || "—")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DIÁRIOS ── */}
        {tab === "diarios" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 600, color: FG, margin: 0 }}>
                Diários de Transformação
              </h2>
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: CARD2,
                  border: `1px solid ${BORDER}`,
                  borderRadius: "3px",
                  padding: "0.5rem 0.85rem",
                  color: FG,
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "0.8rem",
                  outline: "none",
                  width: "220px",
                }}
              />
            </div>

            {diarios.isLoading && <div style={{ color: MUTED, fontFamily: "'Nunito Sans', sans-serif" }}>Carregando...</div>}
            {diarios.data?.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem" }}>
                Nenhum registro de diário ainda.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {diarios.data?.map(d => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDiario(selectedDiario === d.id ? null : d.id)}
                  style={{
                    background: selectedDiario === d.id ? `${EMERALD}08` : CARD,
                    border: `1px solid ${selectedDiario === d.id ? EMERALD + "50" : BORDER}`,
                    borderRadius: "4px",
                    padding: "1rem 1.25rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: FG }}>{d.nome || "—"}</span>
                      <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", color: MUTED }}>{d.data}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {[
                          { label: "Sono", val: d.qualidadeSono ?? 0, color: "#7c6af5" },
                          { label: "Energia", val: d.energiaManha ?? 0, color: GOLD },
                          { label: "Humor", val: d.humorGeral ?? 0, color: "#e07a5f" },
                          { label: "Foco", val: d.nivelFoco ?? 0, color: EMERALD },
                        ].map(m => (
                          <div key={m.label} style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: m.color }}>{m.val}</div>
                            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.55rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                      <Badge color={EMERALD}>Diário</Badge>
                    </div>
                  </div>

                  {/* Detalhe expandido */}
                  {selectedDiario === d.id && diarioDetail.data && (
                    <div style={{ marginTop: "1rem", borderTop: `1px solid ${BORDER}`, paddingTop: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                        {[
                          { label: "Sono", val: d.qualidadeSono ?? 0, color: "#7c6af5" },
                          { label: "Energia Manhã", val: d.energiaManha ?? 0, color: GOLD },
                          { label: "Energia Tarde", val: d.energiaTarde ?? 0, color: GOLD },
                          { label: "Energia Noite", val: d.energiaNoite ?? 0, color: GOLD },
                          { label: "Humor", val: d.humorGeral ?? 0, color: "#e07a5f" },
                          { label: "Foco", val: d.nivelFoco ?? 0, color: EMERALD },
                        ].map(m => (
                          <div key={m.label} style={{ background: CARD2, borderRadius: "3px", padding: "0.6rem 0.75rem" }}>
                            <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: "0.3rem" }}>{m.label}</div>
                            <ScoreBar value={m.val} color={m.color} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EVOLUÇÃO ── */}
        {tab === "evolucao" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 600, color: FG, marginBottom: "0.25rem" }}>
              Gráficos de Evolução
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: MUTED, marginBottom: "1.5rem" }}>
              Acompanhe a evolução dos pilares de cada mentorado ao longo do tempo.
            </p>

            {/* Seleção de mentorado */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: `${GOLD}80`, marginBottom: "0.5rem" }}>
                Selecionar Mentorado
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {diarios.data?.length === 0 && (
                  <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8rem", color: MUTED }}>
                    Nenhum diário registrado ainda. Acesse a aba "Diários" para carregar os dados.
                  </span>
                )}
                {/* Carregar nomes da listagem de diários */}
                {tab === "evolucao" && (
                  <NomesSelector
                    onSelect={setSelectedMentorado}
                    selected={selectedMentorado}
                  />
                )}
              </div>
            </div>

            {selectedMentorado && (
              <>
                {evolucao.isLoading && <div style={{ color: MUTED, fontFamily: "'Nunito Sans', sans-serif" }}>Carregando dados...</div>}
                {evolucao.data?.length === 0 && (
                  <div style={{ color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>Nenhum registro encontrado para este mentorado.</div>
                )}

                {chartData.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

                    {/* Gráfico de linha */}
                    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "1.25rem", gridColumn: "1 / -1" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: GOLD, marginBottom: "1rem" }}>
                        Evolução dos Pilares — {selectedMentorado}
                      </div>
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={`${BORDER}`} />
                          <XAxis dataKey="data" tick={{ fill: MUTED, fontSize: 11 }} />
                          <YAxis domain={[0, 10]} tick={{ fill: MUTED, fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: "3px", color: FG, fontFamily: "'Nunito Sans', sans-serif", fontSize: "12px" }}
                          />
                          <Legend wrapperStyle={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "11px" }} />
                          <Line type="monotone" dataKey="sono" stroke="#7c6af5" strokeWidth={2} dot={{ r: 3 }} name="Sono" />
                          <Line type="monotone" dataKey="energiaManha" stroke={GOLD} strokeWidth={2} dot={{ r: 3 }} name="Energia" />
                          <Line type="monotone" dataKey="humor" stroke="#e07a5f" strokeWidth={2} dot={{ r: 3 }} name="Humor" />
                          <Line type="monotone" dataKey="foco" stroke={EMERALD} strokeWidth={2} dot={{ r: 3 }} name="Foco" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Radar do último registro */}
                    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "1.25rem" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: COPPER, marginBottom: "1rem" }}>
                        Último Registro — Radar
                      </div>
                      <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke={BORDER} />
                          <PolarAngleAxis dataKey="pilar" tick={{ fill: MUTED, fontSize: 11 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: MUTED, fontSize: 9 }} />
                          <Radar name={selectedMentorado} dataKey="valor" stroke={GOLD} fill={GOLD} fillOpacity={0.15} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Médias */}
                    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "1.25rem" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: EMERALD, marginBottom: "1rem" }}>
                        Médias do Período
                      </div>
                      {[
                        { label: "Sono", key: "sono" as const, color: "#7c6af5" },
                        { label: "Energia (manhã)", key: "energiaManha" as const, color: GOLD },
                        { label: "Humor", key: "humor" as const, color: "#e07a5f" },
                        { label: "Foco", key: "foco" as const, color: EMERALD },
                      ].map(m => {
                        const avg = chartData.reduce((s, d) => s + d[m.key], 0) / chartData.length;
                        return (
                          <div key={m.label} style={{ marginBottom: "0.75rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", color: MUTED }}>{m.label}</span>
                              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: m.color }}>{avg.toFixed(1)}</span>
                            </div>
                            <ScoreBar value={Math.round(avg)} color={m.color} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Seletor de nomes (carrega da lista de diários) ───────────────────────────
function NomesSelector({ onSelect, selected }: { onSelect: (n: string) => void; selected: string }) {
  const diarios = trpc.admin.listDiarios.useQuery({ search: undefined });

  const nomes = useMemo(() => {
    if (!diarios.data) return [];
    const set = new Set(diarios.data.map(d => d.nome).filter(Boolean));
    return Array.from(set).sort();
  }, [diarios.data]);

  if (diarios.isLoading) return <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8rem", color: "oklch(0.55 0.010 80)" }}>Carregando mentorados...</span>;
  if (nomes.length === 0) return <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8rem", color: "oklch(0.55 0.010 80)" }}>Nenhum mentorado com diários registrados ainda.</span>;

  return (
    <>
      {nomes.map(nome => (
        <button
          key={nome}
          onClick={() => onSelect(nome)}
          style={{
            padding: "0.35rem 0.85rem",
            borderRadius: "20px",
            border: `1px solid ${selected === nome ? GOLD : BORDER}`,
            background: selected === nome ? `${GOLD}18` : "transparent",
            color: selected === nome ? GOLD : MUTED,
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.75rem",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {nome}
        </button>
      ))}
    </>
  );
}
