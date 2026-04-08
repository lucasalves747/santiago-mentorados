import { useMemo } from "react";
import { api as trpc } from "@/lib/api";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const BG = "oklch(0.08 0.005 285)";
const CARD = "oklch(0.12 0.005 285)";
const BORDER = "oklch(0.22 0.006 285)";
const FG = "oklch(0.96 0.008 80)";
const MUTED = "oklch(0.55 0.010 80)";
const GOLD = "oklch(0.72 0.12 75)";

export default function Dashboard() {
  const auth = useAuth();
  const [, navigate] = useLocation();
  const diagnosticos = trpc.user.listDiagnosticos.useQuery(undefined, { enabled: !!auth.user });

  const title = useMemo(
    () => auth.user?.name || auth.user?.email || "Meu painel",
    [auth.user]
  );

  if (diagnosticos.isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: FG }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Carregando seus diagnósticos...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, color: FG, padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
        <header style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
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

            <div>
              <p style={{ color: MUTED, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                Painel de Diagnósticos
              </p>
              <h1 style={{ fontSize: "2.4rem", lineHeight: 1.05, marginBottom: "0.75rem" }}>{title}</h1>
              <p style={{ maxWidth: "40rem", color: MUTED, fontSize: "0.95rem" }}>
                Aqui você encontra todos os diagnósticos que realizou com sua conta. Cada resultado está protegido e pertence somente a você.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={auth.logout}
            style={{
              border: `1px solid ${BORDER}`,
              background: "transparent",
              color: FG,
              padding: "0.75rem 1rem",
              borderRadius: "0.85rem",
              cursor: "pointer",
              fontSize: "0.92rem",
            }}
          >
            Sair
          </button>
        </header>

        <div style={{ display: "grid", gap: "1.2rem" }}>
          {diagnosticos.data?.length ? (
            diagnosticos.data.map((diagnostico) => (
              <article key={diagnostico.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "1rem", padding: "1.3rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <p style={{ color: GOLD, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: "0.45rem" }}>
                      Diagnóstico #{diagnostico.id}
                    </p>
                    <h2 style={{ margin: 0, fontSize: "1.15rem" }}>{diagnostico.nome || "Sem nome informado"}</h2>
                  </div>
                  <div style={{ color: MUTED, fontSize: "0.85rem" }}>
                    {new Date(diagnostico.createdAt).toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" })}
                  </div>
                </div>

                <div style={{ marginTop: "1rem", display: "grid", gap: "0.65rem" }}>
                  <p style={{ margin: 0, color: FG, fontSize: "0.95rem" }}>
                    {diagnostico.dados?.objetivoPrincipal || diagnostico.dados?.objetivos || "Dados do diagnóstico salvos com segurança."}
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ background: `rgba(255, 214, 0, 0.09)`, color: GOLD, padding: "0.55rem 0.8rem", borderRadius: "999px", fontSize: "0.82rem" }}>
                      {diagnostico.email || auth.user?.email || "E-mail não informado"}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "1rem", padding: "2rem", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "1rem", color: MUTED }}>
                Você ainda não realizou nenhum diagnóstico. Vá para a página inicial e comece agora.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
