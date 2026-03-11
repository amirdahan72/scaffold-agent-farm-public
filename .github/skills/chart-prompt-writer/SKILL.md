```skill
---
name: chart-prompt-writer
description: 'Generate detailed LLM prompts for creating professional diagrams and charts. Use when a document contains chart/diagram placeholders and needs a companion chart-prompts file with structured prompts for graphical AI tools (DALL-E, Napkin.ai, Whimsical, Visio). Triggers: generate chart prompts, create diagram prompts, chart placeholder prompts, visual companion file.'
---

# Chart Prompt Writer

Generate a companion `chart-prompts.md` file containing detailed, structured LLM prompts for every chart or diagram placeholder in a document. Each prompt is designed to be pasted directly into a graphical AI tool to produce a professional visual.

## When to Use This Skill

- A document (markdown or docx) contains `> **[Chart N Placeholder: ...]**` blocks
- User asks for "chart prompts", "diagram prompts", or "visual generation prompts"
- A writer sub-agent produces a document with chart placeholders and needs the companion file
- User wants to prepare visuals for a strategy doc, PRD, architecture doc, or executive brief

## Prerequisites

No packages required. This skill produces a markdown file — the output is text, not images.

## Workflow

### Step 1 — Scan the source document

Read the source document and extract every chart placeholder. Each placeholder follows this pattern:

```markdown
> **[Chart N Placeholder: <Title>]**
> *See chart-prompts.md — Chart N*
```

For each placeholder, capture:
- **Chart number** (N)
- **Title**
- **Document section** where it appears
- **Surrounding content** (the data, tables, and narrative the chart should visualize)

### Step 2 — Classify each chart

Determine the chart type based on content:

| Chart Type | Use When |
|------------|----------|
| Architecture diagram | Showing system components, layers, or integration points |
| Sequence / flow diagram | Showing step-by-step workflows or API flows |
| Layered architecture | Showing defense-in-depth, OSI layers, or stacked components |
| Market landscape / coverage map | Showing category coverage, competitive positioning |
| Gantt / roadmap | Showing timelines, milestones, horizons |
| Comparison matrix | Showing feature or capability comparisons across entities |

### Step 3 — Write the companion file

Create `chart-prompts.md` (or `chart-prompts-for-graphical-llm.md`) in the same directory as the source document.

Structure:

```markdown
# <Document Title> — Chart Prompts for Graphical LLM

**Purpose:** Use these prompts in a graphical AI tool to generate charts for the document.
**Document reference:** [<source-document>](<source-document>)

**Style Guide for All Charts:**
- Clean, modern, professional aesthetic
- Color palette: <derive from document context or use defaults>
- Sans-serif fonts, high contrast for accessibility
- Export at 300 DPI minimum for document insertion

---

## Chart N: <Title>

**Document section:** <section number and name>

### Prompt

\```
<Detailed prompt — see Step 4 for structure>
\```

### Data Requirements
- <bullet list of data points the chart must include>
- <reference to specific document section tables or content>
```

### Step 4 — Write each chart prompt

Each prompt should include:

1. **Layout specification** — describe the spatial arrangement (layers, swim lanes, flow direction, quadrants)
2. **Content for each element** — box labels, bullet points, connection labels
3. **Arrow/connection details** — what connects to what, directionality, labels
4. **Emphasis** — which element is the focal point, callout text
5. **Style directives** — colors, icon style, typography notes

Keep prompts **200–400 words each** — detailed enough to reproduce, concise enough to fit one tool invocation.

### Step 5 — Add quick reference table

End the file with a summary:

```markdown
## Quick Reference — Chart Summary

| # | Chart Name | Type | Section | Key Message |
|---|-----------|------|---------|-------------|
| 1 | <name> | <type> | <section> | <one-line message> |
```

## Rules

- **One prompt per placeholder.** Every `[Chart N Placeholder]` in the source gets exactly one prompt in the companion file.
- **Data-driven.** Pull specific data (table values, flow steps, component names) from the source document into the prompt — don't leave the graphical LLM to guess.
- **Self-contained prompts.** Each prompt must work standalone — a user should be able to paste it into a graphical AI tool without reading the source document.
- **No image generation.** This skill produces text prompts, not images. The user or a graphical AI tool handles rendering.
- **Match the source.** Chart numbering, titles, and section references must exactly match the source document's placeholders.

## Output

Save the companion file next to the source document (same directory) or to `work/output/` if part of a farm run. Use the filename `chart-prompts.md` or `chart-prompts-for-graphical-llm.md`.

```
