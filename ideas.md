# Ideias de Design — Formulário de Diagnóstico Dr. Santiago Vecina

## Contexto
Formulário de anamnese expandida para mentoria de alta performance. Público: líderes empresariais cristãos, executivos de alto nível. Tom: sofisticado, íntimo, transformador.

---

<response>
<probability>0.07</probability>
<idea>

**Design Movement:** Luxury Editorial — Revista de Alto Padrão (Vogue Business / Forbes Life)

**Core Principles:**
1. Contraste extremo: fundo quase-preto (#020202) com dourado puro como único acento
2. Tipografia editorial: Cormorant Garamond em tamanhos grandes para títulos, Nunito Sans para campos
3. Formulário como jornada narrativa — cada seção tem uma introdução poética antes dos campos
4. Minimalismo de luxo: muito espaço em branco escuro, sem ruído visual

**Color Philosophy:**
- Background: `oklch(0.08 0.005 285)` — quase preto com leve toque azulado (como couro escuro)
- Gold: `oklch(0.72 0.12 75)` — dourado quente, não amarelo, para acentos e CTAs
- Gold Light: `oklch(0.82 0.10 80)` — dourado claro para hover states
- Foreground: `oklch(0.96 0.008 80)` — branco-creme, nunca branco puro
- Muted: `oklch(0.55 0.010 80)` — cinza-dourado para labels e textos secundários
- Card BG: `oklch(0.12 0.005 285)` — cartão levemente mais claro que o fundo

**Layout Paradigm:**
- Formulário em etapas (stepper) com barra de progresso dourada no topo
- Cada seção ocupa tela cheia (full-screen step), com scroll interno se necessário
- Sidebar esquerda fixa com lista de seções (desktop) / barra de progresso (mobile)
- Campos alinhados à esquerda, labels acima, sem colunas múltiplas (foco e clareza)

**Signature Elements:**
1. Linha divisória dourada fina (`1px solid gold/30`) entre seções e grupos de campos
2. Numeração romana das seções em dourado grande e translúcido (I, II, III...) como watermark
3. Citação bíblica em itálico Cormorant Garamond no cabeçalho de cada seção

**Interaction Philosophy:**
- Campos ganham borda dourada ao focar (sem sombra colorida, apenas borda)
- Botões de opção (radio/checkbox) customizados: círculo/quadrado dourado ao selecionar
- Transição suave entre seções (fade + slide lateral)
- Indicador de progresso animado no topo

**Animation:**
- Entrada de cada seção: fade-in + translateY(20px → 0) em 400ms ease-out
- Campos: aparecem sequencialmente com stagger de 50ms
- Barra de progresso: transição width em 600ms cubic-bezier
- Botão CTA: shimmer dourado no hover

**Typography System:**
- Títulos de seção: Cormorant Garamond 700, 2.5rem–3rem, tracking-wide
- Subtítulos/intro: Cormorant Garamond 400 italic, 1.25rem
- Labels: Nunito Sans 600, 0.75rem, uppercase, letter-spacing 0.1em, cor gold/70
- Campos: Nunito Sans 400, 1rem, cor foreground
- Citações bíblicas: Cormorant Garamond 400 italic, 1rem, cor gold/60

</idea>
</response>

<response>
<probability>0.05</probability>
<idea>

**Design Movement:** Sacred Geometry Meets Corporate Brutalism

**Core Principles:**
1. Grid assimétrico com elementos geométricos sutis (linhas, ângulos) como textura de fundo
2. Tipografia bold e impactante para criar autoridade visual
3. Seções como "capítulos" de um livro sagrado — numeradas, com epígrafes
4. Contraste alto entre zonas de conteúdo e espaços vazios

**Color Philosophy:**
- Fundo: preto absoluto com textura de grain sutil
- Dourado como único acento cromático
- Texto em off-white
- Cards com borda dourada fina, sem preenchimento

**Layout Paradigm:**
- Formulário em scroll contínuo com âncoras de seção
- Barra lateral fixa com progresso e navegação
- Campos em grid de 2 colunas em desktop

**Signature Elements:**
1. Ornamentos geométricos dourados (losangos, linhas cruzadas) como separadores
2. Números de seção em tamanho display (100px+) como elemento decorativo
3. Fundo com textura de papel/grain em baixa opacidade

**Interaction Philosophy:**
- Hover nos campos revela borda dourada animada
- Seleções de opção com preenchimento dourado sólido

**Animation:**
- Scroll-triggered reveals para cada seção
- Contadores animados no progresso

**Typography System:**
- Títulos: Playfair Display 900
- Corpo: Source Sans Pro 400/600

</idea>
</response>

<response>
<probability>0.08</probability>
<idea>

**Design Movement:** Monastic Luxury — Manuscrito Iluminado Digital

**Core Principles:**
1. Evoca a seriedade de um documento sagrado e transformador
2. Cada seção como um "capítulo" com iluminura (elemento dourado decorativo)
3. Tipografia clássica com detalhes ornamentais
4. Formulário como ritual de autoconhecimento

**Color Philosophy:**
- Fundo muito escuro com leve textura
- Dourado quente e âmbar para todos os acentos
- Off-white para texto principal
- Sepia/âmbar para elementos decorativos

**Layout Paradigm:**
- Coluna central estreita (max 680px) para leitura focada
- Margens largas com ornamentos laterais
- Progresso como "capítulos" de livro

**Signature Elements:**
1. Drop caps dourados no início de cada seção
2. Ornamentos de borda dourada nos cards
3. Separadores com padrão de cruz/diamante

**Interaction Philosophy:**
- Campos com estilo de manuscrito (borda inferior apenas)
- Seleções com ícone de marca dourada

**Animation:**
- Fade suave entre seções
- Ornamentos aparecem com delay

**Typography System:**
- Títulos: EB Garamond 700
- Corpo: Lora 400

</idea>
</response>

---

## Escolha Final: Luxury Editorial (Resposta 1)

Design escolhido: **Luxury Editorial** — fundo quase-preto, dourado como único acento, Cormorant Garamond para títulos, Nunito Sans para corpo, formulário em etapas com sidebar de navegação e barra de progresso dourada animada.
