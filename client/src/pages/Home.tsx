/*
 * Home.tsx — Formulário de Diagnóstico Inicial — Dr. Santiago Vecina
 * Design: Luxury Editorial
 * Fundo quase-preto (oklch 0.08), dourado (oklch 0.72 0.12 75), Cormorant Garamond + Nunito Sans
 * Formulário multi-etapas com 10 seções, barra de progresso dourada, navegação lateral
 */

import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Menu, X, Loader2 } from "lucide-react";
import { api as trpc } from "@/lib/api";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = Record<string, string | string[]>;

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 1, label: "Identificação", roman: "I", subtitle: "Contexto" },
  { id: 2, label: "Saúde Física", roman: "II", subtitle: "Biomarcadores" },
  { id: 3, label: "Sono", roman: "III", subtitle: "Qualidade" },
  { id: 4, label: "Nutrição", roman: "IV", subtitle: "Alimentação" },
  { id: 5, label: "Atividade Física", roman: "V", subtitle: "Exercício" },
  { id: 6, label: "Saúde Mental", roman: "VI", subtitle: "Emocional" },
  { id: 7, label: "Vida Espiritual", roman: "VII", subtitle: "Fé" },
  { id: 8, label: "Liderança", roman: "VIII", subtitle: "Negócios" },
  { id: 9, label: "Família", roman: "IX", subtitle: "Relacionamentos" },
  { id: 10, label: "Objetivos", roman: "X", subtitle: "Mentoria" },
];

const GOLD = "oklch(0.72 0.12 75)";
const GOLD_DIM = "oklch(0.72 0.12 75 / 0.5)";
const GOLD_FAINT = "oklch(0.72 0.12 75 / 0.08)";
const BG = "oklch(0.08 0.005 285)";
const CARD_BG = "oklch(0.11 0.005 285)";
const BORDER = "oklch(0.22 0.006 285)";
const FG = "oklch(0.96 0.008 80)";
const MUTED = "oklch(0.55 0.010 80)";
const LABEL_COLOR = "oklch(0.72 0.12 75 / 0.75)";

// ─── Helper Components ────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: "block",
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "0.7rem",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: LABEL_COLOR,
      marginBottom: "0.4rem",
    }}>
      {children}
    </label>
  );
}

function TextInput({
  name, placeholder, value, onChange, type = "text", small = false
}: {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (name: string, val: string) => void;
  type?: string;
  small?: boolean;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      className="field-input"
      style={small ? { maxWidth: "180px" } : {}}
    />
  );
}

function TextArea({
  name, placeholder, value, onChange, rows = 4
}: {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (name: string, val: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="field-textarea"
    />
  );
}

function OptionGroup({
  name, options, value, onChange, multi = false
}: {
  name: string;
  options: string[];
  value: string | string[];
  onChange: (name: string, val: string | string[]) => void;
  multi?: boolean;
}) {
  const handleClick = (opt: string) => {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      if (arr.includes(opt)) {
        onChange(name, arr.filter((v) => v !== opt));
      } else {
        onChange(name, [...arr, opt]);
      }
    } else {
      onChange(name, value === opt ? "" : opt);
    }
  };

  const isSelected = (opt: string) => {
    if (multi) return Array.isArray(value) && value.includes(opt);
    return value === opt;
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => handleClick(opt)}
          className={`option-pill${isSelected(opt) ? " selected" : ""}`}
        >
          {isSelected(opt) && (
            <span style={{ color: GOLD, fontSize: "0.6rem", marginRight: "0.15rem" }}>◆</span>
          )}
          {opt}
        </button>
      ))}
    </div>
  );
}

function ScaleInput({
  name, value, onChange, min = 1, max = 10
}: {
  name: string;
  value: string;
  onChange: (name: string, val: string) => void;
  min?: number;
  max?: number;
}) {
  const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.25rem" }}>
      {nums.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(name, String(n))}
          style={{
            width: "2.25rem",
            height: "2.25rem",
            border: `1px solid ${value === String(n) ? GOLD : BORDER}`,
            background: value === String(n) ? GOLD_FAINT : "transparent",
            color: value === String(n) ? GOLD : MUTED,
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.875rem",
            fontWeight: value === String(n) ? 700 : 400,
            borderRadius: "2px",
            transition: "all 0.15s ease",
            cursor: "pointer",
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function EnergyTable({
  value, onChange
}: {
  value: string;
  onChange: (name: string, val: string) => void;
}) {
  const rows = [
    { key: "ao_acordar", label: "Ao acordar" },
    { key: "manha", label: "Manhã (8h–12h)" },
    { key: "tarde", label: "Tarde (12h–17h)" },
    { key: "final_tarde", label: "Final da tarde (17h–20h)" },
    { key: "noite", label: "Noite (20h–23h)" },
  ];

  let parsed: Record<string, { nota: string; obs: string }> = {};
  try { parsed = JSON.parse(value || "{}"); } catch {}

  const update = (key: string, field: "nota" | "obs", val: string) => {
    const next = { ...parsed, [key]: { ...parsed[key], [field]: val } };
    onChange("energia_tabela", JSON.stringify(next));
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
        <thead>
          <tr>
            {["Período", "Nota (1–10)", "Observações"].map((h) => (
              <th key={h} style={{
                padding: "0.5rem 0.75rem",
                textAlign: "left",
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: LABEL_COLOR,
                borderBottom: `1px solid ${BORDER}`,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.key} style={{ background: i % 2 === 0 ? "transparent" : "oklch(0.10 0.005 285 / 0.5)" }}>
              <td style={{ padding: "0.5rem 0.75rem", color: FG, fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                {row.label}
              </td>
              <td style={{ padding: "0.375rem 0.75rem" }}>
                <ScaleInput
                  name={`energia_${row.key}_nota`}
                  value={parsed[row.key]?.nota || ""}
                  onChange={(_, v) => update(row.key, "nota", v)}
                />
              </td>
              <td style={{ padding: "0.375rem 0.75rem" }}>
                <input
                  type="text"
                  value={parsed[row.key]?.obs || ""}
                  onChange={(e) => update(row.key, "obs", e.target.value)}
                  placeholder="Observações..."
                  className="field-input"
                  style={{ fontSize: "0.8125rem" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeader({
  roman, title, subtitle, quote
}: {
  roman: string;
  title: string;
  subtitle?: string;
  quote?: string;
}) {
  return (
    <div style={{ marginBottom: "2rem", position: "relative" }}>
      <span className="section-number">{roman}</span>
      {subtitle && (
        <p style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: GOLD,
          marginBottom: "0.5rem",
        }}>
          {subtitle}
        </p>
      )}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
        fontWeight: 600,
        color: FG,
        lineHeight: 1.15,
        marginBottom: quote ? "1rem" : "0",
      }}>
        {title}
      </h2>
      {quote && (
        <blockquote style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "0.9375rem",
          color: `${GOLD}cc`,
          borderLeft: `2px solid ${GOLD_DIM}`,
          paddingLeft: "1rem",
          marginTop: "0.75rem",
        }}>
          {quote}
        </blockquote>
      )}
      <div className="gold-divider" style={{ marginTop: "1.5rem" }} />
    </div>
  );
}

function FieldGroup({ children, columns = 1 }: { children: React.ReactNode; columns?: number }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: columns > 1 ? `repeat(${columns}, 1fr)` : "1fr",
      gap: "1.25rem",
      marginBottom: "1.5rem",
    }}>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────

function Section1({ data, onChange }: { data: FormData; onChange: (n: string, v: string | string[]) => void }) {
  return (
    <div>
      <SectionHeader roman="I" title="Identificação e Contexto" subtitle="Seção 1" />
      <FieldGroup>
        <Field label="Nome Completo">
          <TextInput name="nome" placeholder="Seu nome completo" value={String(data.nome || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup columns={2}>
        <Field label="Idade">
          <TextInput name="idade" placeholder="Ex: 38" value={String(data.idade || "")} onChange={onChange} type="number" />
        </Field>
        <Field label="Data de Nascimento">
          <TextInput name="data_nascimento" placeholder="DD/MM/AAAA" value={String(data.data_nascimento || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Profissão / Negócio">
          <TextInput name="profissao" placeholder="Ex: CEO, Empresário, Médico..." value={String(data.profissao || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup columns={2}>
        <Field label="Cidade / Estado">
          <TextInput name="cidade" placeholder="Ex: São Paulo, SP" value={String(data.cidade || "")} onChange={onChange} />
        </Field>
        <Field label="Estado Civil">
          <OptionGroup name="estado_civil" options={["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"]} value={String(data.estado_civil || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Filhos (idades)">
          <TextInput name="filhos" placeholder="Ex: Dois filhos, 8 e 12 anos" value={String(data.filhos || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Como você conheceu o Dr. Santiago?">
          <TextInput name="como_conheceu" placeholder="Instagram, indicação, evento..." value={String(data.como_conheceu || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function Section2({ data, onChange }: { data: FormData; onChange: (n: string, v: string | string[]) => void }) {
  return (
    <div>
      <SectionHeader roman="II" title="Saúde Física e Biomarcadores" subtitle="Seção 2" />
      <FieldGroup columns={3}>
        <Field label="Peso Atual (kg)">
          <TextInput name="peso" placeholder="Ex: 82" value={String(data.peso || "")} onChange={onChange} type="number" />
        </Field>
        <Field label="Altura (cm)">
          <TextInput name="altura" placeholder="Ex: 178" value={String(data.altura || "")} onChange={onChange} type="number" />
        </Field>
        <Field label="IMC Estimado">
          <TextInput name="imc" placeholder="Ex: 25.8" value={String(data.imc || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você realiza check-ups médicos regulares?">
          <OptionGroup name="checkup" options={["Sim", "Não", "Raramente"]} value={String(data.checkup || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Quando foi seu último exame de sangue completo?">
          <TextInput name="ultimo_exame" placeholder="Ex: Há 6 meses, em Janeiro/2025" value={String(data.ultimo_exame || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você tem diagnóstico de alguma condição médica?">
          <OptionGroup name="condicao_medica" options={["Sim", "Não"]} value={String(data.condicao_medica || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      {data.condicao_medica === "Sim" && (
        <FieldGroup>
          <Field label="Se sim, quais condições?">
            <TextInput name="condicao_medica_quais" placeholder="Descreva as condições diagnosticadas" value={String(data.condicao_medica_quais || "")} onChange={onChange} />
          </Field>
        </FieldGroup>
      )}
      <FieldGroup>
        <Field label="Você usa algum medicamento regularmente?">
          <OptionGroup name="medicamento" options={["Sim", "Não"]} value={String(data.medicamento || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      {data.medicamento === "Sim" && (
        <FieldGroup>
          <Field label="Quais medicamentos?">
            <TextInput name="medicamento_quais" placeholder="Liste os medicamentos e dosagens" value={String(data.medicamento_quais || "")} onChange={onChange} />
          </Field>
        </FieldGroup>
      )}
      <FieldGroup>
        <Field label="Você usa algum suplemento regularmente?">
          <OptionGroup name="suplemento" options={["Sim", "Não"]} value={String(data.suplemento || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      {data.suplemento === "Sim" && (
        <FieldGroup>
          <Field label="Quais suplementos?">
            <TextInput name="suplemento_quais" placeholder="Liste os suplementos e dosagens" value={String(data.suplemento_quais || "")} onChange={onChange} />
          </Field>
        </FieldGroup>
      )}
      <FieldGroup>
        <Field label="Avalie sua energia ao longo do dia (1 = péssima, 10 = excelente)">
          <EnergyTable value={String(data.energia_tabela || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Consumo de Cafeína">
          <OptionGroup name="cafeina" options={["Não", "1 café/dia", "2–3 cafés/dia", "4+ cafés/dia"]} value={String(data.cafeina || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Consumo de Álcool">
          <OptionGroup name="alcool" options={["Não", "Raramente", "Fins de semana", "Diariamente"]} value={String(data.alcool || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você fuma ou usa tabaco?">
          <OptionGroup name="tabaco" options={["Não", "Sim"]} value={String(data.tabaco || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      {data.tabaco === "Sim" && (
        <FieldGroup>
          <Field label="Quantidade (cigarros/dia)">
            <TextInput name="tabaco_quantidade" placeholder="Ex: 5 cigarros por dia" value={String(data.tabaco_quantidade || "")} onChange={onChange} />
          </Field>
        </FieldGroup>
      )}
    </div>
  );
}

function Section3({ data, onChange }: { data: FormData; onChange: (n: string, v: string | string[]) => void }) {
  return (
    <div>
      <SectionHeader roman="III" title="Qualidade do Sono" subtitle="Seção 3" />
      <FieldGroup>
        <Field label="Quantas horas você dorme por noite em média?">
          <TextInput name="horas_sono" placeholder="Ex: 6.5 horas" value={String(data.horas_sono || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você tem dificuldade para adormecer?">
          <OptionGroup name="dificuldade_adormecer" options={["Nunca", "Raramente", "Frequentemente", "Sempre"]} value={String(data.dificuldade_adormecer || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você acorda durante a noite?">
          <OptionGroup name="acorda_noite" options={["Nunca", "Raramente", "Frequentemente", "Sempre"]} value={String(data.acorda_noite || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você acorda descansado?">
          <OptionGroup name="acorda_descansado" options={["Sempre", "Frequentemente", "Raramente", "Nunca"]} value={String(data.acorda_descansado || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup columns={2}>
        <Field label="Que horas você costuma dormir?">
          <TextInput name="hora_dormir" placeholder="Ex: 23h30" value={String(data.hora_dormir || "")} onChange={onChange} />
        </Field>
        <Field label="Que horas você costuma acordar?">
          <TextInput name="hora_acordar" placeholder="Ex: 06h00" value={String(data.hora_acordar || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você usa telas antes de dormir?">
          <OptionGroup name="telas_antes_dormir" options={["Não", "Às vezes", "Sempre"]} value={String(data.telas_antes_dormir || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você usa algum recurso para melhorar o sono?">
          <TextInput name="recurso_sono" placeholder="Ex: melatonina, máscara, meditação..." value={String(data.recurso_sono || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Descreva a qualidade do seu sono em suas próprias palavras">
          <TextArea name="qualidade_sono" placeholder="Como você descreveria seu sono? O que funciona? O que não funciona?" value={String(data.qualidade_sono || "")} onChange={onChange} rows={5} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function Section4({ data, onChange }: { data: FormData; onChange: (n: string, v: string | string[]) => void }) {
  return (
    <div>
      <SectionHeader roman="IV" title="Nutrição e Alimentação" subtitle="Seção 4" />
      <FieldGroup>
        <Field label="Como você descreveria sua alimentação atual?">
          <OptionGroup name="qualidade_alimentacao" options={["Excelente", "Boa", "Regular", "Ruim"]} value={String(data.qualidade_alimentacao || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você segue algum protocolo alimentar específico?">
          <OptionGroup name="protocolo_alimentar" options={["Não", "Sim"]} value={String(data.protocolo_alimentar || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      {data.protocolo_alimentar === "Sim" && (
        <FieldGroup>
          <Field label="Qual protocolo alimentar?">
            <TextInput name="protocolo_alimentar_qual" placeholder="Ex: Low carb, Jejum intermitente, Carnívoro..." value={String(data.protocolo_alimentar_qual || "")} onChange={onChange} />
          </Field>
        </FieldGroup>
      )}
      <FieldGroup columns={2}>
        <Field label="Quantas refeições você faz por dia?">
          <TextInput name="num_refeicoes" placeholder="Ex: 3" value={String(data.num_refeicoes || "")} onChange={onChange} type="number" />
        </Field>
        <Field label="Você pula refeições com frequência?">
          <OptionGroup name="pula_refeicoes" options={["Não", "Às vezes", "Frequentemente"]} value={String(data.pula_refeicoes || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <div style={{ marginBottom: "1.5rem" }}>
        <FieldLabel>Descreva uma refeição típica do seu dia</FieldLabel>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {[
            { name: "cafe_manha", label: "Café da manhã" },
            { name: "almoco", label: "Almoço" },
            { name: "jantar", label: "Jantar" },
            { name: "lanches", label: "Lanches" },
          ].map((r) => (
            <div key={r.name} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0.75rem", alignItems: "center" }}>
              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8125rem", color: MUTED }}>{r.label}:</span>
              <TextInput name={r.name} placeholder={`O que você costuma comer no ${r.label.toLowerCase()}?`} value={String(data[r.name] || "")} onChange={onChange} />
            </div>
          ))}
        </div>
      </div>
      <FieldGroup>
        <Field label="Você tem compulsão alimentar ou come emocionalmente?">
          <OptionGroup name="compulsao_alimentar" options={["Nunca", "Raramente", "Frequentemente"]} value={String(data.compulsao_alimentar || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você tem alguma intolerância ou alergia alimentar?">
          <OptionGroup name="intolerancia" options={["Não", "Sim"]} value={String(data.intolerancia || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      {data.intolerancia === "Sim" && (
        <FieldGroup>
          <Field label="Quais intolerâncias/alergias?">
            <TextInput name="intolerancia_qual" placeholder="Ex: Lactose, Glúten, Amendoim..." value={String(data.intolerancia_qual || "")} onChange={onChange} />
          </Field>
        </FieldGroup>
      )}
    </div>
  );
}

function Section5({ data, onChange }: { data: FormData; onChange: (n: string, v: string | string[]) => void }) {
  return (
    <div>
      <SectionHeader roman="V" title="Atividade Física" subtitle="Seção 5" />
      <FieldGroup>
        <Field label="Você pratica exercícios físicos regularmente?">
          <OptionGroup name="pratica_exercicio" options={["Sim", "Não"]} value={String(data.pratica_exercicio || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      {data.pratica_exercicio === "Sim" && (
        <>
          <FieldGroup>
            <Field label="Qual modalidade?">
              <TextInput name="modalidade_exercicio" placeholder="Ex: Musculação, Corrida, Natação, CrossFit..." value={String(data.modalidade_exercicio || "")} onChange={onChange} />
            </Field>
          </FieldGroup>
          <FieldGroup columns={2}>
            <Field label="Quantas vezes por semana?">
              <TextInput name="frequencia_exercicio" placeholder="Ex: 4x por semana" value={String(data.frequencia_exercicio || "")} onChange={onChange} />
            </Field>
            <Field label="Duração média por sessão?">
              <TextInput name="duracao_exercicio" placeholder="Ex: 60 minutos" value={String(data.duracao_exercicio || "")} onChange={onChange} />
            </Field>
          </FieldGroup>
        </>
      )}
      <FieldGroup>
        <Field label="Você tem personal trainer ou acompanhamento profissional?">
          <OptionGroup name="personal_trainer" options={["Sim", "Não"]} value={String(data.personal_trainer || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Como você se sente após o exercício?">
          <OptionGroup name="sensacao_exercicio" options={["Energizado", "Esgotado", "Indiferente"]} value={String(data.sensacao_exercicio || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Qual é o maior obstáculo para você se exercitar mais?">
          <TextArea name="obstaculo_exercicio" placeholder="Descreva o que impede você de se exercitar com mais frequência ou consistência..." value={String(data.obstaculo_exercicio || "")} onChange={onChange} rows={3} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function Section6({ data, onChange }: { data: FormData; onChange: (n: string, v: string | string[]) => void }) {
  return (
    <div>
      <SectionHeader roman="VI" title="Saúde Mental e Emocional" subtitle="Seção 6" />
      <FieldGroup>
        <Field label="Avalie seu nível de estresse atual (1 = mínimo, 10 = máximo)">
          <ScaleInput name="nivel_estresse" value={String(data.nivel_estresse || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Quais são as principais fontes de estresse na sua vida?">
          <TextArea name="fontes_estresse" placeholder="Descreva as principais situações, pessoas ou contextos que geram estresse..." value={String(data.fontes_estresse || "")} onChange={onChange} rows={4} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você tem ansiedade?">
          <OptionGroup name="ansiedade" options={["Não", "Leve", "Moderada", "Intensa"]} value={String(data.ansiedade || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você tem episódios de depressão ou tristeza persistente?">
          <OptionGroup name="depressao" options={["Não", "Raramente", "Frequentemente"]} value={String(data.depressao || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Como você gerencia o estresse atualmente?">
          <TextArea name="gestao_estresse" placeholder="Quais estratégias, hábitos ou recursos você usa para lidar com o estresse?" value={String(data.gestao_estresse || "")} onChange={onChange} rows={4} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você tem uma prática regular de meditação, oração ou reflexão?">
          <OptionGroup name="pratica_meditacao" options={["Sim", "Não"]} value={String(data.pratica_meditacao || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      {data.pratica_meditacao === "Sim" && (
        <FieldGroup>
          <Field label="Descreva sua prática">
            <TextInput name="pratica_meditacao_desc" placeholder="Ex: Oração diária, meditação guiada, journaling..." value={String(data.pratica_meditacao_desc || "")} onChange={onChange} />
          </Field>
        </FieldGroup>
      )}
      <FieldGroup>
        <Field label="Você tem um terapeuta ou psicólogo?">
          <OptionGroup name="terapeuta" options={["Sim", "Não"]} value={String(data.terapeuta || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function Section7({ data, onChange }: { data: FormData; onChange: (n: string, v: string | string[]) => void }) {
  return (
    <div>
      <SectionHeader
        roman="VII"
        title="Vida Espiritual"
        subtitle="Seção 7"
        quote='"Examina-me, ó Deus, e conhece o meu coração; prova-me e conhece os meus pensamentos." — Salmo 139:23'
      />
      <FieldGroup>
        <Field label="Você se considera uma pessoa de fé?">
          <OptionGroup name="pessoa_fe" options={["Sim", "Não", "Em desenvolvimento"]} value={String(data.pessoa_fe || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Qual é a sua denominação ou tradição cristã?">
          <TextInput name="denominacao" placeholder="Ex: Católico, Evangélico, Batista, Presbiteriano..." value={String(data.denominacao || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você frequenta uma igreja ou comunidade de fé?">
          <OptionGroup name="frequenta_igreja" options={["Sim", "Não"]} value={String(data.frequenta_igreja || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      {data.frequenta_igreja === "Sim" && (
        <FieldGroup>
          <Field label="Com que frequência?">
            <OptionGroup name="frequencia_igreja" options={["Toda semana", "Quinzenalmente", "Mensalmente", "Raramente"]} value={String(data.frequencia_igreja || "")} onChange={onChange} />
          </Field>
        </FieldGroup>
      )}
      <FieldGroup>
        <Field label="Você tem uma prática regular de leitura bíblica?">
          <OptionGroup name="leitura_biblica" options={["Diária", "Semanal", "Raramente", "Não"]} value={String(data.leitura_biblica || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você tem um mentor espiritual ou pastor de referência?">
          <OptionGroup name="mentor_espiritual" options={["Sim", "Não"]} value={String(data.mentor_espiritual || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Como você descreveria sua vida espiritual atual?">
          <TextArea name="vida_espiritual_desc" placeholder="Compartilhe como está sua conexão com Deus, sua fé e sua prática espiritual neste momento..." value={String(data.vida_espiritual_desc || "")} onChange={onChange} rows={5} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Qual versículo ou passagem bíblica mais ressoa com você neste momento?">
          <TextArea name="versiculo_favorito" placeholder="Compartilhe o versículo e o que ele significa para você agora..." value={String(data.versiculo_favorito || "")} onChange={onChange} rows={4} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function Section8({ data, onChange }: { data: FormData; onChange: (n: string, v: string | string[]) => void }) {
  return (
    <div>
      <SectionHeader roman="VIII" title="Liderança e Negócios" subtitle="Seção 8" />
      <FieldGroup columns={2}>
        <Field label="Quantas pessoas você lidera diretamente?">
          <TextInput name="pessoas_lideradas" placeholder="Ex: 12 pessoas" value={String(data.pessoas_lideradas || "")} onChange={onChange} />
        </Field>
        <Field label="Há quanto tempo você está no seu negócio/posição atual?">
          <TextInput name="tempo_negocio" placeholder="Ex: 7 anos" value={String(data.tempo_negocio || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Qual é o maior desafio de liderança que você enfrenta hoje?">
          <TextArea name="desafio_lideranca" placeholder="Descreva o principal obstáculo ou dificuldade que você enfrenta como líder..." value={String(data.desafio_lideranca || "")} onChange={onChange} rows={4} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Seu negócio funciona sem você por 30 dias?">
          <OptionGroup name="negocio_sem_voce" options={["Sim", "Não", "Parcialmente"]} value={String(data.negocio_sem_voce || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você tem um sócio?">
          <OptionGroup name="tem_socio" options={["Sim", "Não"]} value={String(data.tem_socio || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      {data.tem_socio === "Sim" && (
        <FieldGroup>
          <Field label="Como é a dinâmica da sociedade?">
            <TextArea name="dinamica_sociedade" placeholder="Descreva como funciona a parceria, os pontos fortes e os desafios..." value={String(data.dinamica_sociedade || "")} onChange={onChange} rows={3} />
          </Field>
        </FieldGroup>
      )}
      <FieldGroup>
        <Field label="Qual é a sua maior conquista profissional dos últimos 2 anos?">
          <TextArea name="conquista_profissional" placeholder="Descreva sua maior realização ou vitória profissional recente..." value={String(data.conquista_profissional || "")} onChange={onChange} rows={3} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Qual é o maior obstáculo para o crescimento do seu negócio?">
          <TextArea name="obstaculo_negocio" placeholder="O que está impedindo seu negócio de crescer no ritmo que você deseja?" value={String(data.obstaculo_negocio || "")} onChange={onChange} rows={4} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function Section9({ data, onChange }: { data: FormData; onChange: (n: string, v: string | string[]) => void }) {
  return (
    <div>
      <SectionHeader roman="IX" title="Família e Relacionamentos" subtitle="Seção 9" />
      <FieldGroup>
        <Field label="Como você descreveria a qualidade do seu casamento/relacionamento principal?">
          <OptionGroup name="qualidade_casamento" options={["Excelente", "Bom", "Regular", "Precisa de atenção", "Não se aplica"]} value={String(data.qualidade_casamento || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você sente que está presente de verdade para sua família?">
          <OptionGroup name="presenca_familia" options={["Sempre", "Frequentemente", "Raramente", "Nunca"]} value={String(data.presenca_familia || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Qual filho ou membro da família você sente que mais precisa de mais atenção sua?">
          <TextArea name="membro_atencao" placeholder="Compartilhe com honestidade quem precisa de mais presença sua e por quê..." value={String(data.membro_atencao || "")} onChange={onChange} rows={3} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Você tem conversas profundas e regulares com seu cônjuge?">
          <OptionGroup name="conversas_conjuge" options={["Sim", "Raramente", "Não"]} value={String(data.conversas_conjuge || "")} onChange={onChange} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Como você descreveria o legado que está construindo para sua família?">
          <TextArea name="legado_familia" placeholder="Que valores, patrimônio e impacto você quer deixar para as próximas gerações?" value={String(data.legado_familia || "")} onChange={onChange} rows={5} />
        </Field>
      </FieldGroup>
    </div>
  );
}

function Section10({ data, onChange }: { data: FormData; onChange: (n: string, v: string | string[]) => void }) {
  return (
    <div>
      <SectionHeader
        roman="X"
        title="Objetivos e Expectativas da Mentoria"
        subtitle="Seção 10"
        quote='"Examina-me, ó Deus, e conhece o meu coração." — Salmo 139:23'
      />
      <FieldGroup>
        <Field label="O que te motivou a investir nesta mentoria agora?">
          <TextArea name="motivacao_mentoria" placeholder="O que aconteceu ou o que você está sentindo que te trouxe até aqui neste momento?" value={String(data.motivacao_mentoria || "")} onChange={onChange} rows={4} />
        </Field>
      </FieldGroup>
      <div style={{ marginBottom: "1.5rem" }}>
        <FieldLabel>Quais são os 3 resultados mais importantes que você quer alcançar nos próximos 90 dias?</FieldLabel>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{
                minWidth: "1.75rem",
                height: "1.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${GOLD_DIM}`,
                color: GOLD,
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: "2px",
                marginTop: "0.125rem",
                flexShrink: 0,
              }}>
                {n}
              </span>
              <TextArea
                name={`resultado_${n}`}
                placeholder={`Resultado ${n}: Descreva com clareza o que você quer alcançar...`}
                value={String(data[`resultado_${n}`] || "")}
                onChange={onChange}
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
      <FieldGroup>
        <Field label="Em qual dos 5 Pilares você sente que está mais fraco hoje?">
          <OptionGroup
            name="pilar_mais_fraco"
            options={["Saúde Estratégica", "Mente e Clareza", "Liderança com Propósito", "Negócios Sustentáveis", "Legado e Família"]}
            value={String(data.pilar_mais_fraco || "")}
            onChange={onChange}
          />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="O que você está disposto a mudar para alcançar esses resultados?">
          <TextArea name="disposicao_mudanca" placeholder="Que hábitos, crenças ou comportamentos você está pronto para transformar?" value={String(data.disposicao_mudanca || "")} onChange={onChange} rows={4} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Existe algo que você teme que possa impedir sua transformação?">
          <TextArea name="medo_transformacao" placeholder="Seja honesto: qual é o seu maior medo ou resistência interna?" value={String(data.medo_transformacao || "")} onChange={onChange} rows={4} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Há algo importante sobre você que o Dr. Santiago precisa saber antes da primeira sessão?">
          <TextArea name="info_adicional" placeholder="Compartilhe qualquer informação relevante que não foi abordada nas seções anteriores..." value={String(data.info_adicional || "")} onChange={onChange} rows={4} />
        </Field>
      </FieldGroup>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [, navigate] = useLocation();
  const [currentSection, setCurrentSection] = useState(0); // 0 = intro, 1-10 = sections
  const [formData, setFormData] = useState<FormData>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalSections = SECTIONS.length;
  const isIntro = currentSection === 0;
  const isLast = currentSection === totalSections;
  const progress = currentSection === 0 ? 0 : (currentSection / totalSections) * 100;

  const handleChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const goTo = (section: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSection(section);
      setIsAnimating(false);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }, 200);
    setSidebarOpen(false);
  };

  const handleNext = () => {
    if (currentSection < totalSections) goTo(currentSection + 1);
  };

  const handlePrev = () => {
    if (currentSection > 0) goTo(currentSection - 1);
  };

  const submitMutation = trpc.diagnostico.submit.useMutation({
    onSuccess: (result) => {
      if (result.emailSent) {
        toast.success("PDF enviado com sucesso para sanvecmed@gmail.com!");
      } else {
        toast.warning("Diagnóstico salvo, mas houve um problema ao enviar o e-mail.");
      }
      navigate("/obrigado");
    },
    onError: (err) => {
      toast.error(`Erro ao enviar: ${err.message}`);
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate(formData);
  };

  const renderSection = () => {
    const props = { data: formData, onChange: handleChange };
    switch (currentSection) {
      case 1: return <Section1 {...props} />;
      case 2: return <Section2 {...props} />;
      case 3: return <Section3 {...props} />;
      case 4: return <Section4 {...props} />;
      case 5: return <Section5 {...props} />;
      case 6: return <Section6 {...props} />;
      case 7: return <Section7 {...props} />;
      case 8: return <Section8 {...props} />;
      case 9: return <Section9 {...props} />;
      case 10: return <Section10 {...props} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column" }}>

      {/* ── Top Progress Bar ── */}
      <div style={{ height: "3px", background: BORDER, position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Header ── */}
      <header style={{
        position: "fixed",
        top: "3px",
        left: 0,
        right: 0,
        zIndex: 90,
        background: `${BG}f0`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BORDER}`,
        padding: "0.875rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "2rem",
            height: "2rem",
            background: GOLD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "2px",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "0.875rem", color: BG }}>SV</span>
          </div>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9375rem", fontWeight: 600, color: FG, lineHeight: 1.2 }}>
              Dr. Santiago Vecina
            </p>
            <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, lineHeight: 1 }}>
              Performance Integral
            </p>
          </div>
        </div>

        {/* Center: section indicator */}
        {!isIntro && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>
              {currentSection}/{totalSections}
            </span>
            <span style={{ color: BORDER }}>·</span>
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.7rem", color: GOLD }}>
              {SECTIONS[currentSection - 1]?.label}
            </span>
          </div>
        )}

        {/* Menu toggle (mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: "transparent", border: "none", color: MUTED, padding: "0.25rem", display: "flex", alignItems: "center" }}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        position: "fixed",
        top: 0,
        right: sidebarOpen ? 0 : "-280px",
        bottom: 0,
        width: "260px",
        zIndex: 85,
        background: CARD_BG,
        borderLeft: `1px solid ${BORDER}`,
        padding: "5rem 1.25rem 2rem",
        overflowY: "auto",
        transition: "right 0.3s ease",
      }}>
        <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, marginBottom: "1.25rem" }}>
          Navegação
        </p>
        {/* Intro */}
        <button
          onClick={() => goTo(0)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "0.625rem 0.75rem",
            marginBottom: "0.25rem",
            background: currentSection === 0 ? GOLD_FAINT : "transparent",
            border: `1px solid ${currentSection === 0 ? GOLD_DIM : "transparent"}`,
            borderRadius: "2px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8125rem", color: currentSection === 0 ? GOLD : MUTED }}>
            Introdução
          </span>
        </button>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => goTo(s.id)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "0.625rem 0.75rem",
              marginBottom: "0.25rem",
              background: currentSection === s.id ? GOLD_FAINT : "transparent",
              border: `1px solid ${currentSection === s.id ? GOLD_DIM : "transparent"}`,
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.75rem", color: GOLD_DIM, minWidth: "1.25rem" }}>{s.roman}</span>
              <div>
                <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8125rem", color: currentSection === s.id ? GOLD : FG, lineHeight: 1.3 }}>{s.label}</p>
                <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", color: MUTED, lineHeight: 1 }}>{s.subtitle}</p>
              </div>
            </div>
          </button>
        ))}
      </aside>

      {/* ── Main Content ── */}
      <main
        ref={contentRef}
        style={{
          flex: 1,
          paddingTop: "4rem",
          paddingBottom: "6rem",
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 1.5rem" }}>

          {/* ── Intro Screen ── */}
          {isIntro && (
            <div className="animate-fade-in-up">
              {/* Hero image */}
              <div style={{
                width: "100%",
                height: "220px",
                borderRadius: "2px",
                overflow: "hidden",
                marginBottom: "2.5rem",
                position: "relative",
              }}>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029042428/fFCzkfBDtaE7bpa9SSzAtV/hero-diagnostico-Zc7jS6Rz5pK2pSqrY8sgm9.webp"
                  alt="Diagnóstico Inicial"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, transparent 40%, rgba(2,2,2,0.85) 100%)",
                }} />
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.25rem, 6vw, 4rem)",
                fontWeight: 600,
                color: FG,
                lineHeight: 1.1,
                marginBottom: "0.5rem",
              }}>
                Formulário de
                <br />
                <span style={{ color: GOLD }}>Diagnóstico Inicial</span>
              </h1>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.125rem", color: MUTED, marginBottom: "2rem" }}>
                Anamnese Expandida — O Ponto de Partida da Sua Transformação
              </p>

              <div className="gold-divider" style={{ marginBottom: "2rem" }} />

              {/* Bible quote */}
              <blockquote style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "1.125rem",
                color: `${GOLD}cc`,
                borderLeft: `2px solid ${GOLD_DIM}`,
                paddingLeft: "1.25rem",
                marginBottom: "2rem",
              }}>
                "Examina-me, ó Deus, e conhece o meu coração; prova-me e conhece os meus pensamentos."
                <footer style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontStyle: "normal",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: MUTED,
                  marginTop: "0.5rem",
                }}>
                  — Salmo 139:23
                </footer>
              </blockquote>

              {/* Instructions */}
              <div style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: "2px",
                padding: "1.5rem",
                marginBottom: "2.5rem",
              }}>
                <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.9375rem", color: FG, lineHeight: 1.75, marginBottom: "1rem" }}>
                  Este formulário deve ser preenchido com <strong style={{ color: GOLD }}>honestidade total</strong> e enviado ao Dr. Santiago com pelo menos <strong style={{ color: GOLD }}>48 horas de antecedência</strong> da Sessão 0.
                </p>
                <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.9375rem", color: MUTED, lineHeight: 1.75 }}>
                  Ele é a base do diagnóstico integral — quanto mais completo e honesto, mais personalizado e poderoso será o seu protocolo.
                </p>
              </div>

              {/* Section overview */}
              <div style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: LABEL_COLOR, marginBottom: "1rem" }}>
                  10 Seções de Diagnóstico
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  {SECTIONS.map((s) => (
                    <div key={s.id} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      padding: "0.625rem 0.75rem",
                      background: CARD_BG,
                      border: `1px solid ${BORDER}`,
                      borderRadius: "2px",
                    }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.875rem", color: GOLD_DIM, minWidth: "1.5rem" }}>{s.roman}</span>
                      <div>
                        <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8125rem", color: FG, lineHeight: 1.2 }}>{s.label}</p>
                        <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", color: MUTED }}>{s.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start button */}
              <button
                onClick={handleNext}
                className="btn-gold-shimmer"
                style={{
                  width: "100%",
                  padding: "1rem 2rem",
                  background: GOLD,
                  border: "none",
                  color: BG,
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "oklch(0.82 0.10 80)"; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = GOLD; }}
              >
                Iniciar Diagnóstico →
              </button>
            </div>
          )}

          {/* ── Form Sections ── */}
          {!isIntro && (
            <div className="animate-fade-in-up">
              {renderSection()}
            </div>
          )}

        </div>
      </main>

      {/* ── Bottom Navigation ── */}
      {!isIntro && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          background: `${BG}f5`,
          backdropFilter: "blur(12px)",
          borderTop: `1px solid ${BORDER}`,
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}>
          {/* Back */}
          <button
            onClick={handlePrev}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.625rem 1.25rem",
              background: "transparent",
              border: `1px solid ${BORDER}`,
              color: MUTED,
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = GOLD_DIM;
              el.style.color = FG;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = BORDER;
              el.style.color = MUTED;
            }}
          >
            <ChevronLeft size={14} />
            Anterior
          </button>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => goTo(s.id)}
                style={{
                  width: currentSection === s.id ? "1.5rem" : "0.375rem",
                  height: "0.375rem",
                  borderRadius: "2px",
                  background: currentSection === s.id ? GOLD : s.id < currentSection ? `${GOLD}60` : BORDER,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Next / Submit */}
          {!isLast ? (
            <button
              onClick={handleNext}
              className="btn-gold-shimmer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 1.5rem",
                background: GOLD,
                border: "none",
                color: BG,
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.background = "oklch(0.82 0.10 80)"; }}
              onMouseLeave={(e) => { (e.currentTarget).style.background = GOLD; }}
            >
              Próxima
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-gold-shimmer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 1.5rem",
                background: GOLD,
                border: "none",
                color: BG,
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.background = "oklch(0.82 0.10 80)"; }}
              onMouseLeave={(e) => { (e.currentTarget).style.background = GOLD; }}
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  Enviando...
                </>
              ) : (
                "Enviar Diagnóstico ◆"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
