/*
 * DiarioTransformacao.tsx — Diário de Transformação — Dr. Santiago Vecina
 * 6 pilares diários: Sono, Energia, Humor, Alimentação, Espiritualidade, Insights
 * Design: Luxury Editorial — fundo escuro, dourado, verde-esmeralda como segundo tom
 */

import { useState } from "react";
import { api as trpc } from "@/lib/api";
import { toast } from "sonner";

// ─── Cores ────────────────────────────────────────────────────────────────────
const GOLD = "oklch(0.72 0.12 75)";
const EMERALD = "oklch(0.65 0.14 160)";
const BG = "oklch(0.07 0.008 160)";
const CARD = "oklch(0.10 0.008 160)";
const BORDER = "oklch(0.20 0.010 160)";
const FG = "oklch(0.96 0.008 80)";
const MUTED = "oklch(0.55 0.010 80)";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type DiarioData = {
  data: string;
  nome: string;
  // Sono
  horasDormir: string;
  horaAcordar: string;
  qualidadeSono: number;
  acordouNoite: string;
  observacoesSono: string;
  // Energia
  energiaManha: number;
  energiaTarde: number;
  energiaNoite: number;
  fatoresEnergia: string[];
  // Humor
  humorGeral: number;
  emocaoPredominante: string;
  situacaoDesafiadora: string;
  // Alimentação
  refeicoes: string;
  hidratacao: string;
  suplementos: string;
  transgressoes: string;
  // Espiritualidade
  devocional: string;
  oracao: string;
  versiculoDia: string;
  gratidao: string;
  // Insights
  aprendizado: string;
  missaoDia: string;
  nivelFoco: number;
  observacoesGerais: string;
};

const emocoes = [
  "Paz", "Alegria", "Gratidão", "Esperança", "Confiança",
  "Ansiedade", "Estresse", "Irritação", "Tristeza", "Cansaço",
  "Motivação", "Clareza", "Confusão", "Sobrecarga", "Outro"
];

const fatoresEnergia = [
  "Boa noite de sono", "Exercício físico", "Alimentação adequada",
  "Hidratação", "Tempo em oração", "Conexão familiar",
  "Trabalho com propósito", "Estresse elevado", "Má alimentação",
  "Pouco sono", "Conflitos relacionais", "Excesso de telas"
];

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: "block",
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: `oklch(0.72 0.12 75 / 0.75)`,
      marginBottom: "0.4rem",
    }}>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: `oklch(0.13 0.008 160)`,
        border: `1px solid ${BORDER}`,
        borderRadius: "3px",
        padding: "0.55rem 0.75rem",
        color: FG,
        fontFamily: "'Nunito Sans', sans-serif",
        fontSize: "0.85rem",
        outline: "none",
      }}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%",
        background: `oklch(0.13 0.008 160)`,
        border: `1px solid ${BORDER}`,
        borderRadius: "3px",
        padding: "0.55rem 0.75rem",
        color: FG,
        fontFamily: "'Nunito Sans', sans-serif",
        fontSize: "0.85rem",
        outline: "none",
        resize: "vertical",
      }}
    />
  );
}

function ScaleInput({ value, onChange, color = GOLD }: {
  value: number; onChange: (v: number) => void; color?: string;
}) {
  return (
    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
      {[1,2,3,4,5,6,7,8,9,10].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            width: "2.2rem",
            height: "2.2rem",
            borderRadius: "3px",
            border: `1px solid ${value === n ? color : BORDER}`,
            background: value === n ? `${color}22` : "transparent",
            color: value === n ? color : MUTED,
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.8rem",
            fontWeight: value === n ? 700 : 400,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function PillSelect({ options, value, onChange, multi = false, color = GOLD }: {
  options: string[]; value: string | string[]; onChange: (v: string | string[]) => void;
  multi?: boolean; color?: string;
}) {
  const isSelected = (opt: string) =>
    multi ? (value as string[]).includes(opt) : value === opt;

  const handleClick = (opt: string) => {
    if (multi) {
      const arr = value as string[];
      onChange(arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt]);
    } else {
      onChange(value === opt ? "" : opt);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => handleClick(opt)}
          style={{
            padding: "0.3rem 0.75rem",
            borderRadius: "20px",
            border: `1px solid ${isSelected(opt) ? color : BORDER}`,
            background: isSelected(opt) ? `${color}18` : "transparent",
            color: isSelected(opt) ? color : MUTED,
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.75rem",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function SectionCard({ icon, title, color, children }: {
  icon: string; title: string; color: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderTop: `3px solid ${color}`,
      borderRadius: "4px",
      padding: "1.5rem",
      marginBottom: "1.25rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <span style={{ fontSize: "1.4rem" }}>{icon}</span>
        <div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: FG,
            lineHeight: 1.2,
          }}>{title}</div>
        </div>
        <div style={{ flex: 1, height: "1px", background: `${color}30`, marginLeft: "0.5rem" }} />
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function DiarioTransformacao() {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<DiarioData>({
    data: today,
    nome: "",
    horasDormir: "",
    horaAcordar: "",
    qualidadeSono: 0,
    acordouNoite: "",
    observacoesSono: "",
    energiaManha: 0,
    energiaTarde: 0,
    energiaNoite: 0,
    fatoresEnergia: [],
    humorGeral: 0,
    emocaoPredominante: "",
    situacaoDesafiadora: "",
    refeicoes: "",
    hidratacao: "",
    suplementos: "",
    transgressoes: "",
    devocional: "",
    oracao: "",
    versiculoDia: "",
    gratidao: "",
    aprendizado: "",
    missaoDia: "",
    nivelFoco: 0,
    observacoesGerais: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof DiarioData, value: DiarioData[typeof key]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const submitMutation = trpc.diario.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (err: unknown) => {
      toast.error("Erro ao enviar o diário. Tente novamente.");
      console.error(err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(form);
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          maxWidth: "480px",
          textAlign: "center",
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderTop: `3px solid ${GOLD}`,
          borderRadius: "4px",
          padding: "3rem 2rem",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✦</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.75rem",
            fontWeight: 600,
            color: GOLD,
            marginBottom: "0.75rem",
          }}>Registro Salvo</div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "1rem",
            color: MUTED,
            marginBottom: "1.5rem",
            lineHeight: 1.7,
          }}>
            Seu diário de hoje foi registrado com sucesso. A consistência diária é o que transforma intenção em identidade.
          </p>
          <p style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: `${GOLD}80`,
            marginBottom: "2rem",
          }}>
            "Examine-me, ó Deus, e conhece o meu coração." — Salmos 139:23
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm(prev => ({ ...prev, data: new Date().toISOString().split("T")[0] }));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              background: "transparent",
              border: `1px solid ${GOLD}`,
              borderRadius: "3px",
              color: GOLD,
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.65rem 1.5rem",
              cursor: "pointer",
            }}
          >
            Novo Registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, color: FG }}>

      {/* ── Hero ── */}
      <div style={{
        background: `linear-gradient(180deg, oklch(0.10 0.015 160) 0%, ${BG} 100%)`,
        borderBottom: `1px solid ${BORDER}`,
        padding: "3rem 1.5rem 2.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 60% 80% at 50% 0%, oklch(0.65 0.14 160 / 0.06) 0%, transparent 60%)`,
          pointerEvents: "none",
        }} />

        <div style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: EMERALD,
          marginBottom: "1rem",
        }}>
          Protocolo das Raízes Profundas
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 600,
          color: FG,
          lineHeight: 1.15,
          marginBottom: "0.5rem",
        }}>
          Diário de{" "}
          <span style={{ color: GOLD, fontStyle: "italic" }}>Transformação</span>
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "1.05rem",
          color: MUTED,
          maxWidth: "520px",
          margin: "0 auto 1.5rem",
          lineHeight: 1.7,
        }}>
          Registre seus 6 pilares diários. A consistência revela padrões que nenhum exame consegue capturar.
        </p>

        {/* Pilares */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
          maxWidth: "600px",
          margin: "0 auto",
        }}>
          {[
            { icon: "🌙", label: "Sono", color: "#7c6af5" },
            { icon: "⚡", label: "Energia", color: GOLD },
            { icon: "🧠", label: "Humor", color: "#e07a5f" },
            { icon: "🥗", label: "Alimentação", color: "#81b29a" },
            { icon: "✝️", label: "Espiritualidade", color: EMERALD },
            { icon: "💡", label: "Insights", color: "#f2cc8f" },
          ].map(p => (
            <div key={p.label} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.3rem 0.7rem",
              border: `1px solid ${p.color}40`,
              borderRadius: "20px",
              background: `${p.color}10`,
            }}>
              <span style={{ fontSize: "0.85rem" }}>{p.icon}</span>
              <span style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: p.color,
              }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Formulário ── */}
      <form onSubmit={handleSubmit} style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>

        {/* Identificação */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.5rem",
          padding: "1.25rem",
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: "4px",
        }}>
          <Field label="Seu nome">
            <TextInput value={form.nome} onChange={v => set("nome", v)} placeholder="Nome completo" />
          </Field>
          <Field label="Data do registro">
            <TextInput type="date" value={form.data} onChange={v => set("data", v)} />
          </Field>
        </div>

        {/* ── 1. SONO ── */}
        <SectionCard icon="🌙" title="Sono" color="#7c6af5">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Hora que dormiu">
              <TextInput type="time" value={form.horasDormir} onChange={v => set("horasDormir", v)} />
            </Field>
            <Field label="Hora que acordou">
              <TextInput type="time" value={form.horaAcordar} onChange={v => set("horaAcordar", v)} />
            </Field>
          </div>
          <Field label="Qualidade do sono (1–10)">
            <ScaleInput value={form.qualidadeSono} onChange={v => set("qualidadeSono", v)} color="#7c6af5" />
          </Field>
          <Field label="Acordou durante a noite?">
            <PillSelect
              options={["Não acordei", "1–2 vezes", "3+ vezes", "Insônia parcial", "Insônia total"]}
              value={form.acordouNoite}
              onChange={v => set("acordouNoite", v as string)}
              color="#7c6af5"
            />
          </Field>
          <Field label="Observações sobre o sono">
            <TextArea value={form.observacoesSono} onChange={v => set("observacoesSono", v)} placeholder="Sonhos, sensações ao acordar, ambiente..." />
          </Field>
        </SectionCard>

        {/* ── 2. ENERGIA ── */}
        <SectionCard icon="⚡" title="Energia" color={GOLD}>
          <Field label="Nível de energia — Manhã (1–10)">
            <ScaleInput value={form.energiaManha} onChange={v => set("energiaManha", v)} color={GOLD} />
          </Field>
          <Field label="Nível de energia — Tarde (1–10)">
            <ScaleInput value={form.energiaTarde} onChange={v => set("energiaTarde", v)} color={GOLD} />
          </Field>
          <Field label="Nível de energia — Noite (1–10)">
            <ScaleInput value={form.energiaNoite} onChange={v => set("energiaNoite", v)} color={GOLD} />
          </Field>
          <Field label="Fatores que influenciaram sua energia hoje (selecione todos que se aplicam)">
            <PillSelect
              options={fatoresEnergia}
              value={form.fatoresEnergia}
              onChange={v => set("fatoresEnergia", v as string[])}
              multi
              color={GOLD}
            />
          </Field>
        </SectionCard>

        {/* ── 3. HUMOR ── */}
        <SectionCard icon="🧠" title="Humor & Emoções" color="#e07a5f">
          <Field label="Humor geral do dia (1–10)">
            <ScaleInput value={form.humorGeral} onChange={v => set("humorGeral", v)} color="#e07a5f" />
          </Field>
          <Field label="Emoção predominante">
            <PillSelect
              options={emocoes}
              value={form.emocaoPredominante}
              onChange={v => set("emocaoPredominante", v as string)}
              color="#e07a5f"
            />
          </Field>
          <Field label="Houve alguma situação desafiadora? Como você reagiu?">
            <TextArea value={form.situacaoDesafiadora} onChange={v => set("situacaoDesafiadora", v)} placeholder="Descreva brevemente a situação e sua reação..." />
          </Field>
        </SectionCard>

        {/* ── 4. ALIMENTAÇÃO ── */}
        <SectionCard icon="🥗" title="Alimentação & Hidratação" color="#81b29a">
          <Field label="Refeições do dia (café, almoço, jantar, lanches)">
            <TextArea value={form.refeicoes} onChange={v => set("refeicoes", v)} placeholder="Ex: Café — ovos + abacate. Almoço — frango, arroz, salada..." rows={4} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Hidratação (litros de água)">
              <TextInput value={form.hidratacao} onChange={v => set("hidratacao", v)} placeholder="Ex: 2,5L" />
            </Field>
            <Field label="Suplementos tomados">
              <TextInput value={form.suplementos} onChange={v => set("suplementos", v)} placeholder="Ex: Magnésio, Vitamina D..." />
            </Field>
          </div>
          <Field label="Houve alguma transgressão alimentar? Qual?">
            <TextInput value={form.transgressoes} onChange={v => set("transgressoes", v)} placeholder="Ex: Açúcar, álcool, ultraprocessados..." />
          </Field>
        </SectionCard>

        {/* ── 5. ESPIRITUALIDADE ── */}
        <SectionCard icon="✝️" title="Vida Espiritual" color={EMERALD}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Fez devocional hoje?">
              <PillSelect
                options={["Sim, completo", "Sim, parcial", "Não consegui"]}
                value={form.devocional}
                onChange={v => set("devocional", v as string)}
                color={EMERALD}
              />
            </Field>
            <Field label="Tempo em oração">
              <PillSelect
                options={["Não orei", "< 5 min", "5–15 min", "15–30 min", "+ 30 min"]}
                value={form.oracao}
                onChange={v => set("oracao", v as string)}
                color={EMERALD}
              />
            </Field>
          </div>
          <Field label="Versículo ou palavra que marcou o dia">
            <TextInput value={form.versiculoDia} onChange={v => set("versiculoDia", v)} placeholder="Ex: Filipenses 4:13..." />
          </Field>
          <Field label="3 motivos de gratidão hoje">
            <TextArea value={form.gratidao} onChange={v => set("gratidao", v)} placeholder="1.\n2.\n3." rows={3} />
          </Field>
        </SectionCard>

        {/* ── 6. INSIGHTS ── */}
        <SectionCard icon="💡" title="Insights & Missão do Dia" color="#f2cc8f">
          <Field label="Principal aprendizado ou insight do dia">
            <TextArea value={form.aprendizado} onChange={v => set("aprendizado", v)} placeholder="O que você aprendeu hoje sobre si mesmo, sobre liderança, sobre Deus..." />
          </Field>
          <Field label="Missão do dia — você cumpriu?">
            <PillSelect
              options={["Cumpri totalmente", "Cumpri parcialmente", "Não cumpri", "Não tinha missão definida"]}
              value={form.missaoDia}
              onChange={v => set("missaoDia", v as string)}
              color="#f2cc8f"
            />
          </Field>
          <Field label="Nível de foco e produtividade (1–10)">
            <ScaleInput value={form.nivelFoco} onChange={v => set("nivelFoco", v)} color="#f2cc8f" />
          </Field>
          <Field label="Observações gerais — algo que queira registrar para o Dr. Santiago">
            <TextArea value={form.observacoesGerais} onChange={v => set("observacoesGerais", v)} placeholder="Sintomas, percepções, dúvidas, conquistas..." rows={4} />
          </Field>
        </SectionCard>

        {/* ── Botão de envio ── */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <div style={{
            width: "60px",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
            margin: "0 auto 1.5rem",
          }} />
          <button
            type="submit"
            disabled={submitMutation.isPending}
            style={{
              background: submitMutation.isPending
                ? `oklch(0.72 0.12 75 / 0.5)`
                : `linear-gradient(135deg, oklch(0.72 0.12 75), oklch(0.65 0.14 60))`,
              border: "none",
              borderRadius: "3px",
              color: "oklch(0.08 0.005 285)",
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.9rem 2.5rem",
              cursor: submitMutation.isPending ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {submitMutation.isPending ? "Enviando..." : "Salvar Registro do Dia"}
          </button>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "0.85rem",
            color: MUTED,
            marginTop: "1rem",
          }}>
            "Examine-me, ó Deus, e conhece o meu coração." — Salmos 139:23
          </p>
        </div>
      </form>
    </div>
  );
}
