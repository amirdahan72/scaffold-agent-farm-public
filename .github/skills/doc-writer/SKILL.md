```skill
---
name: doc-writer
description: 'Write structured markdown documents such as PRDs, specs, design docs, strategy docs, competitive briefs, roadmaps, and launch checklists. Use when asked to produce a document, write a PRD, create a spec, draft a brief, write a strategy, or generate any structured markdown deliverable. Outputs clean, well-organized markdown with proper sections, tables, chart placeholders, and evidence attribution.'
---

# Doc Writer

Write structured markdown documents — PRDs, specs, design docs, strategy documents, competitive briefs, roadmaps, and other PM deliverables. Produces clean, well-organized markdown with proper headings, tables, chart placeholders, evidence attribution, and source URLs.

## When to Use This Skill

- User asks to "write a PRD", "create a spec", or "draft a document"
- A synthesizer or builder subagent needs to produce a structured markdown deliverable
- Converting collected research into a formatted document
- Any task that results in a markdown file as the final output

## Prerequisites

No external packages required. This skill uses the agent's built-in file-writing capabilities.

## Document Templates

### Product Requirements Document (PRD)

```markdown
# PRD: <Feature Name>

## Overview
- **Product:** <product name>
- **Feature:** <feature name>
- **Author:** <author>
- **Date:** <date>
- **Status:** Draft

## Problem Statement
<What problem does this solve? Who has it? How big is it?>

## Goals & Success Metrics
| Goal | Metric | Target |
|------|--------|--------|
| <goal 1> | <metric> | <target> |

## User Scenarios
### Scenario 1: <name>
- **As a** <persona>
- **I want to** <action>
- **So that** <outcome>

## Requirements
### Functional Requirements
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1 | <requirement> | P0/P1/P2 | <notes> |

### Non-Functional Requirements
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| NFR-1 | <requirement> | P0/P1/P2 | <notes> |

## Competitive Context
<Summarized competitive landscape — reference sources>

## Internal Context
<Work IQ findings — labeled as internal>

## Open Questions
- [ ] <question 1>
- [ ] <question 2>

## Appendix
### Sources
- <source URL 1>
- <source URL 2>
```

### Competitive Brief

```markdown
# Competitive Brief: <Product> vs. <Competitors>

## Executive Summary
<2–3 sentence conclusion — who wins where and why>

## Comparison Table
| Dimension | Our Product | Competitor A | Competitor B |
|-----------|-------------|-------------|-------------|
| Pricing | <details> | <details> | <details> |
| <Feature 1> | <details> | <details> | <details> |

## Detailed Analysis
### Competitor A: <name>
- **Source:** <URL>
- **Key findings:** ...

## Internal Context (Work IQ)
> Internal — do not distribute externally.
<findings>

## Recommendations
1. <recommendation with evidence>

## Sources
- <all URLs cited>
```

## Workflow

### Step 1 — Determine document type

Based on the task context, select the appropriate template (PRD, competitive brief, roadmap, design doc, etc.).

### Step 2 — Gather inputs

Read all source files specified by the calling agent:
- `work/sources/*.md` — collected research summaries
- `work/internal-context.md` — Work IQ findings
- Any other files the synthesizer has produced

### Step 3 — Structure and write

1. Use the appropriate template structure.
2. Fill in each section with evidence from sources.
3. **Include source URLs** for every factual claim.
4. **Label internal context** clearly (Work IQ findings).
5. **Flag gaps** with `[NEEDS DATA]` markers.
6. **Insert chart placeholders** for content that benefits from a visual (architecture diagrams, integration flows, competitive maps, roadmap timelines). Use this format:
   ```markdown
   > **[Chart N Placeholder: <Descriptive Title>]**
   > *See chart-prompts.md — Chart N*
   ```
   Number charts sequentially. Place each placeholder at the contextually appropriate point in the document.

### Step 3a — Generate chart prompts (if placeholders exist)

If the document contains any chart placeholders, use the `chart-prompt-writer` skill (`.github/skills/chart-prompt-writer/SKILL.md`) to generate a companion `chart-prompts.md` file with one detailed LLM prompt per placeholder.

### Step 4 — Quality check

Before delivering, verify:

- [ ] Every section has content (no empty sections; remove if not applicable)
- [ ] Factual claims have source URLs
- [ ] Internal context is clearly labeled
- [ ] Tables are well-formatted and readable
- [ ] Open questions are captured
- [ ] No fabricated information

## Rules

- **Evidence first.** Every factual claim must cite a source (URL or "Work IQ internal").
- **Label internal content.** Work IQ findings must be clearly marked as internal.
- **No fabrication.** If data is missing, use `[NEEDS DATA]` rather than making it up.
- **Clean markdown.** Proper headings, consistent table formatting, no broken links.
- **Summarize, don't dump.** Keep sections concise. Link to source files for details.

## Output

Save the document to `work/output/` (or the path specified by the calling agent) with a descriptive filename like `prd-feature-name.md` or `competitive-brief.md`.

```
