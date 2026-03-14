```skill
---
name: make-agent-farm
description: 'Scaffold a complete multi-agent system (agent farm) for GitHub Copilot. Use when asked to "create an agent farm", "build an agent system", "scaffold agents", or when a user wants a team of cooperating subagents for a PM task like building PRDs, competitive briefs, roadmaps, or design docs. Generates a folder under farms/ with a slim orchestrator .agent.md, sub-agent prompt templates under prompts/, skill references, Work IQ integration, and STM-aware disk persistence.'
---

# Make Agent Farm

A meta-skill that scaffolds a complete multi-agent system ("agent farm") for GitHub Copilot. Given a user's goal (e.g. "build a PRD for feature X on product Y"), this skill creates all the files needed to run a cooperating team of sub-agents — a slim **orchestrator** (`.agent.md`) that dispatches focused **sub-agents** via `runSubagent`, each defined by a **prompt template** (`prompts/*.prompt.md`).

## When to Use This Skill

- User asks to "create an agent farm", "build a multi-agent system", or "scaffold agents"
- User wants a team of subagents that research, synthesize, review, and produce a deliverable
- User describes a PM task: PRD, competitive brief, roadmap, design doc, launch checklist, etc.
- The master `scaffold-agent-farm` agent invokes this skill after understanding the user's goal

## Key Concepts (for the agent executing this skill)

### Short-Term Memory (STM)

Agents have no long-term memory. Everything lives in the **context window** during a run. To make multi-step workflows work:

- **Summarize** web pages and tool outputs — never dump full content into context.
- **Persist to disk** — write intermediate results to files so later subagents can read them.
- **Load selectively** — each subagent reads only the files it needs.

### Sub-Agent Architecture

An agent farm has two layers:

1. **Orchestrator** (`.agent.md`) — handles all PM interaction, dispatches sub-agents via `runSubagent`, reports progress.
2. **Prompt templates** (`prompts/*.prompt.md`) — focused instructions for each sub-agent, with `{{PARAMETER}}` markers injected at runtime.

Sub-agents communicate via **disk files** — each writes to a known path, the next reads from disk. Sub-agents **cannot talk to the user** — only the orchestrator can.

### Sub-Agent Roles

| Phase / Role | What it does |
|------|-------------|
| **Phase 0 — Resource Loading** | **Orchestrator pauses and asks the PM to add reference files (markdown, SharePoint/OneDrive links) to `work/resources/`, then waits for approval before proceeding.** |
| **Collector(s)** | Gathers raw information (web search, Work IQ, Azure resources) and writes summaries to disk — reads PM resources first. Each collector is a separate sub-agent. |
| **Synthesizer** | Reads all summaries, combines them into a structured document |
| **Skeptic** | Pure adversarial review — finds unsupported claims, bias, gaps, outdated data. Writes critique to `review-notes.md`. Does **NOT** fix anything. |
| **Reviser** | Systematically addresses every issue the Skeptic identified. Reads critique + draft, writes `revised-draft.md` with a revision log. |
| **Builder / Writer** | Produces the final deliverable (PRD, deck, spec, etc.) |

**Execution order:** Phase 0 (Resource Loading) → Collectors → Synthesizer → Skeptic → Reviser → Writer.

- `runSubagent` is **sequential/blocking** — sub-agents run one after another.
- However, each sub-agent can fire **parallel tool calls internally** (e.g., multiple `fetch_webpage` calls at once).
- The orchestrator inserts **mandatory PM checkpoints** between phases (after collection, after synthesis, after critique).

### PM Checkpoint Protocol (CRITICAL)

Every PM checkpoint **MUST** use the `vscode_askQuestions` tool — never plain chat text. This is a hard requirement, not a suggestion.

**Why:** Without a blocking UI interaction, the agent has an optimization bias to collapse remaining phases into a single pass when the PM says "yes" to an early checkpoint. `vscode_askQuestions` forces a true blocking gate — the agent literally cannot proceed without the PM clicking a button.

**Rules:**
1. Each checkpoint is a **separate** `vscode_askQuestions` call. Never batch multiple checkpoints.
2. The call must include a **progress summary** (what was completed) and a **proceed/adjust question**.
3. Even if the PM approved all previous checkpoints, the orchestrator MUST still pause at every remaining checkpoint. Phases are NEVER collapsed.
4. Use radio buttons for the proceed/adjust choice, and an optional freeform field for feedback.

**Example checkpoint call:**
```
vscode_askQuestions([
  {
    id: "phase1_review",
    type: "radioButtons",
    title: "Collection complete — X source files written, internal context gathered.",
    options: ["Proceed to synthesis", "Let me review first", "Add more resources"]
  },
  {
    id: "phase1_feedback",
    type: "freeform",
    title: "Any feedback or adjustments? (optional)",
    placeholder: "e.g., focus more on pricing, skip competitor Z"
  }
])
```

**Required checkpoints (minimum 3):**
| After Phase | Checkpoint purpose |
|-------------|--------------------|
| Collection (1a-1c) | PM reviews what was gathered before synthesis |
| Synthesis (2) | PM reviews the draft before critique |
| Critique (3) | PM reviews the critique before revision |

The orchestrator's Rules section must include:
```markdown
- **Mandatory interactive checkpoints** — use `vscode_askQuestions` (never plain chat text) after
  collection, after synthesis, and after critique. Each checkpoint is a separate call. Never skip
  or collapse checkpoints, even if the PM approved previous ones.
```

### Run Versioning

Agent farms support **multiple runs** — e.g., running a competitive analysis for different product categories, or regenerating a weekly plan each week. To preserve history and avoid overwriting previous outputs:

- Each run creates a **timestamped + named run folder**: `work/runs/YYYY-MM-DD-<slug>/`
- The `<slug>` is derived from the PM's primary input (product category, feature name, date range, etc.), lowercased and hyphenated.
- Run folders contain their own `sources/`, `output/`, and `internal-context.md` — isolated from other runs.
- `work/resources/` is **shared across all runs** — PM-provided reference material applies globally.

**Folder layout with runs:**
```text
work/
├── resources/                              ← shared across runs
│   ├── *.md
│   └── sharepoint-links.md
└── runs/
    ├── 2026-03-02-ai-code-tools/           ← run 1
    │   ├── sources/
    │   ├── internal-context.md
    │   └── output/
    └── 2026-03-10-pm-software/             ← run 2
        ├── sources/
        ├── internal-context.md
        └── output/
```

When referencing paths in subagent instructions, all `work/sources/`, `work/output/`, and `work/internal-context.md` references should be understood as relative to the current run folder (`work/runs/<run-slug>/`). Only `work/resources/` sits outside the run folder.

### Available Shared Skills

Generated agent farms can reference these shared skills (already in `.github/skills/`):

| Skill | When to include |
|-------|----------------|
| `web-search` | Agent needs to research public web sources |
| `workiq-context` | Agent needs internal Microsoft 365 context (emails, meetings, chats) |
| `sharepoint-reader` | PM provides SharePoint or OneDrive links that must be downloaded into farm-local resources |
| `ado-reader` | Agent needs Azure DevOps work items, sprint backlogs, or iteration status (read-only) |
| `ppt-creator` | Agent needs to produce slide decks |
| `doc-writer` | Agent needs to produce structured markdown documents (PRDs, specs, strategy docs, briefs) |
| `docx-writer` | Agent needs to produce Microsoft Word (.docx) files with Microsoft brand styling |
| `chart-prompt-writer` | Document has chart placeholders and needs a companion chart-prompts file |
| `xlsx-writer` | Agent needs to produce Excel workbooks (matrices, scorecards, trackers) |
| `chart-creator` | Agent needs to produce chart images (bar, line, pie, heatmap) for visual data |
| `send-email` | Agent needs to email deliverables to stakeholders or notify recipients (requires microsoft-outlook-mail MCP) |
| `make-skill-template` | Agent farm needs a custom skill that doesn't exist yet |

### Available MCP Servers

Generated agent farms can also use MCP servers:

| Server | Config location | When to include |
|--------|----------------|----------------|
| **Azure MCP Server** | `.vscode/mcp.json` (workspace) | Agent needs to query Azure resources (resource groups, storage, app services, etc.) |
| **microsoft-outlook-mail** | `~/.copilot/mcp-config.json` (user-level) | Agent needs to send, reply, forward, or search Outlook email (optional — requires MCP authentication) |

### Work IQ CLI

For internal Microsoft 365 context, agents should use the Work IQ CLI:

```bash
workiq ask -q "<natural language question>"
```

Example queries:
- `workiq ask -q "What have we discussed internally about feature X?"`
- `workiq ask -q "What are our differentiation points for product Y?"`
- `workiq ask -q "Summarize recent emails about the Z initiative"`

Work IQ output is **internal context** — never present it as public fact.

## Isolation Rule

**When scaffolding a new farm, do NOT read, search, or reference any files under `farms/`.** Generate entirely from this skill's instructions and the PM's inputs. Existing farms are outputs of previous runs — they must not influence new scaffolds.

## Workflow: Scaffolding an Agent Farm

### Step 1 — Understand the user's goal

Ask or infer:
1. **What is the deliverable?** (PRD, competitive brief, roadmap, design doc, etc.)
2. **What is the product/feature?** (name, brief description)
3. **What sources are needed?** (web research? internal context? Azure resources?)
4. **Does the PM have reference resources?**
   - **Markdown files** — `.md` files containing existing research, specs, notes, or requirements. Copy them into `work/resources/`.
    - **SharePoint/OneDrive links** — URLs to internal SharePoint or OneDrive folders, pages, or documents. Store them in `work/resources/sharepoint-links.md` so the Collector can fetch and summarize them at runtime.
   - These are treated as **primary context** — collectors should read them before doing external research.
5. **Who is the audience?** (engineering, leadership, PM peers, customers?)

### Step 2 — Design the sub-agent team

Based on the goal, decide which sub-agents are needed. Every farm should have at minimum:

1. **Collector(s)** — at least one, typically multiple (web researcher, WorkIQ collector, resource reader)
2. **Synthesizer** — combines collected information into a structured draft
3. **Skeptic** — pure adversarial review (flags problems, does NOT fix)
4. **Reviser** — systematically fixes every issue the Skeptic identified
5. **Writer/Builder** — formats and produces the final artifact

Additional sub-agents to consider:
- **Prioritizer** — ranks features, requirements, or items by impact
- **Estimator** — adds effort/complexity estimates
- **Competitor Analyst** — dedicated to competitive research
- **User Researcher** — gathers user feedback and pain points via Work IQ

Design a **prompt template** for each sub-agent — a focused file (~40-60 lines) with `{{PARAMETER}}` markers for the orchestrator to inject at runtime.

### Step 3 — Create the farm folder

Create the output folder structure:

```text
farms/<farm-name>/
├── .github/
│   └── agents/
│       └── <farm-name>.agent.md    # Orchestrator agent (run this)
├── prompts/                         # Sub-agent prompt templates
│   ├── <collector-1>.prompt.md      # e.g., web-researcher
│   ├── <collector-2>.prompt.md      # e.g., workiq-collector
│   ├── <collector-3>.prompt.md      # e.g., resource-reader
│   ├── synthesizer.prompt.md
│   ├── skeptic.prompt.md
│   ├── reviser.prompt.md
│   └── writer.prompt.md
├── work/
│   ├── resources/                   # PM-provided reference material (shared across runs)
│   │   ├── *.md                     # Markdown resource files (copied from PM)
│   │   └── sharepoint-links.md      # Curated list of SharePoint/OneDrive URLs
│   └── runs/                        # Each run gets its own subfolder
│       └── <run-slug>/              # e.g., 2026-03-02-ai-code-tools
│           ├── sources/             # Collector outputs for this run
│           │   └── index.md
│           ├── internal-context.md   # Work IQ findings for this run
│           └── output/              # Final deliverables for this run
└── README.md                        # How to use this agent farm
```

> If the PM provides markdown files, copy them into `work/resources/`.
> If the PM provides SharePoint/OneDrive links, create `work/resources/sharepoint-links.md` with the URLs (one per line, with optional descriptions).

### Step 4 — Generate the orchestrator + prompt templates

Generate two kinds of files:

#### A) Prompt templates (`prompts/*.prompt.md`)

Create one file per sub-agent. Each template should be **~40-60 lines** and include:

- A clear **role statement** (who the sub-agent is)
- The **exact task** to accomplish
- **Input paths** to read from (files written by previous sub-agents)
- **Output path** to write to
- **`{{PARAMETER}}`** markers for values the orchestrator will inject (e.g., `{{RUN_PATH}}`, `{{PRODUCT_CATEGORY}}`, `{{COMPETITORS}}`)
- **Quality criteria** and formatting rules
- For collectors: instructions to fire all queries in a **single parallel batch** of tool calls

Example template structure:

```markdown
# Role: Web Researcher

You are a web researcher for {{PRODUCT_CATEGORY}}.

## Task
Research the following topics and write findings to disk.

## Inputs
- PM resources: `{{FARM_ROOT}}/work/resources/`

## Outputs
- Write one file per topic to `{{RUN_PATH}}/sources/<topic>.md`
- Write `{{RUN_PATH}}/sources/index.md` listing all source files

## Queries
Fire ALL queries below in a SINGLE parallel batch:
| # | Query | Output file |
|---|-------|-------------|
| W1 | {{PRODUCT_CATEGORY}} market landscape 2025 | market-landscape.md |
| W2 | {{COMPETITOR_1}} product capabilities | competitor-{{COMPETITOR_1_SLUG}}.md |
...

## Quality
- 15-25 lines per source, cite URL
- Summarize — never dump full pages
```

#### B) Orchestrator (`.agent.md`)

The orchestrator should be a **slim file (~100-130 lines)** that:

1. Describes the farm's goal and rules
2. Lists tools, skills, and MCP servers — **always reference skills by explicit path** (e.g., `.github/skills/web-search/SKILL.md`), not by short name alone. Use a three-column table: `| Skill | Path | Purpose |`
3. Defines **Step 1: Gather PM Inputs** — questions to ask the PM
4. Defines **Step 2: Phase 0 Resource Gate** — pause for PM resources
5. Defines **Step 3: Run Setup** — create `work/runs/YYYY-MM-DD-<slug>/`
6. Defines **Step 4: Dispatch Sub-Agents** — a parameter table and dispatch sequence

##### Skill Injection Rule (CRITICAL)

Sub-agents are stateless — they cannot read files from the workspace unless the orchestrator gives them the content. When a prompt template references a skill (e.g., *"Read the `web-search` skill at `.github/skills/web-search/SKILL.md`"*), the **orchestrator must**:

1. **Before dispatching**, scan the prompt template for `.github/skills/*/SKILL.md` references
2. **Read each referenced SKILL.md** file
3. **Inline the skill content** into the sub-agent prompt under a `## Skill: <name>` section
4. **Remove the "Read the skill at..." instruction** from the prompt — the content is now inline

This ensures sub-agents have the complete workflow instructions (tool usage patterns, output formats, quality rules) without needing file access. Never assume a sub-agent can discover or read skill files on its own.

The orchestrator's Rules section must include:

```markdown
- **Skill injection** — before dispatching any sub-agent, read all `.github/skills/*/SKILL.md` files
  referenced in its prompt template and inline their content into the sub-agent prompt
```

The dispatch section should look like:

```markdown
## Step 4 — Dispatch Sub-Agents

### Parameter Table
| Parameter | Value |
|-----------|-------|
| `{{RUN_PATH}}` | `work/runs/<run-slug>` |
| `{{FARM_ROOT}}` | `farms/<farm-name>` |
| `{{PRODUCT_CATEGORY}}` | <from PM input> |
| ... | ... |

### Dispatch Sequence

For each phase, read the prompt template, replace `{{PARAMETER}}` markers
with values from the table above, and call `runSubagent`.

| Phase | Template | Description |
|-------|----------|-------------|
| 1a | `prompts/web-researcher.prompt.md` | Web research collection |
| 1b | `prompts/workiq-collector.prompt.md` | Internal M365 context |
| 1c | `prompts/resource-reader.prompt.md` | PM-provided resources |
| 2 | `prompts/synthesizer.prompt.md` | Combine into draft |
| 3 | `prompts/skeptic.prompt.md` | Adversarial review |
| 4 | `prompts/reviser.prompt.md` | Fix critique issues |
| 5 | `prompts/writer.prompt.md` | Final deliverable |

**PM checkpoints (MANDATORY — use `vscode_askQuestions`):**
After collection (1a-1c), after synthesis (2), and after critique (3), call
`vscode_askQuestions` with a progress summary and proceed/adjust options.
Never use plain chat text for checkpoints. Never collapse or skip checkpoints.
```

The orchestrator must include:

##### Run Setup

```markdown
At the start of every run, before Phase 0:
1. Derive a run slug from the PM's primary input. Format: YYYY-MM-DD-<short-descriptor>.
2. Create the run folder: work/runs/<run-slug>/ with subdirectories sources/ and output/.
3. All sub-agent paths refer to the current run folder.
4. work/resources/ is shared across runs and is NOT inside the run folder.
5. Previous runs are preserved and are never overwritten.
```

##### Phase 0 — Resource Gate

```markdown
> ⚠️ MANDATORY — The orchestrator does NOT proceed to collectors until the PM explicitly approves.

Before dispatching any collector sub-agent:
1. Use `vscode_askQuestions` to ask the PM about reference files (radio buttons: "I have files to add",
   "No resources — proceed", plus a freeform field for notes). Tell the PM: "You can drag-and-drop files
   directly, or if you have SharePoint/OneDrive files, download them via your browser and drop them here
   (programmatic SharePoint access often fails due to permissions)."
2. If the PM provides files: save them. If the PM pastes SharePoint URLs: try the sharepoint-reader skill
   first, but if it fails with 401/403, ask the PM to download the files via their browser instead.
   If not: acknowledge and proceed.
3. Use `vscode_askQuestions` again to confirm: "Resources are loaded (or skipped). Ready to start?"
   (radio buttons: "Start collection", "Wait — I need to add more").
4. Do NOT proceed until the PM clicks a button.
```

##### Sub-Agent Phase Instructions

For each sub-agent in the dispatch sequence:

**Collectors (Phases 1a-1c):**
- Each collector is a separate `runSubagent` call (sequential, not parallel between sub-agents)
- However, each collector fires its own queries in a **single parallel batch** internally
- Collectors read `work/resources/` first for PM-provided context
- If any file in `work/resources/` is not `.md` (e.g., `.docx`, `.pdf`, `.pptx`, `.xlsx`), convert it with `markitdown "<file>" -o "<file>.md"` before summarizing. Install with `pip install 'markitdown[all]'` if not available.
- If `work/resources/sharepoint-links.md` exists, the collector must invoke the `sharepoint-reader` skill first to download each link into farm-local paths (for example `work/resources/` or `work/runs/<slug>/sources/`)
- After download, summarize the local files into source notes; do not rely on direct webpage fetching for SharePoint or OneDrive file URLs
- PM-provided resources are **primary context** — prefer them over external search on the same topic
- After all collectors complete, report collected sources to the PM

**Synthesizer (Phase 2):**
- Reads all files from `work/resources/`, `work/runs/<slug>/sources/`, and `work/runs/<slug>/internal-context.md`
- Writes the combined document to `work/runs/<slug>/output/combined-draft.md`

**Skeptic (Phase 3):**
- Reads `work/runs/<slug>/output/combined-draft.md`
- Checks every claim for source/attribution
- Identifies unsupported claims, gaps, bias, outdated data
- Writes critique to `work/runs/<slug>/output/review-notes.md` — structured tables of Critical/Minor issues
- Does **NOT** fix or revise anything

**Reviser (Phase 4):**
- Reads `work/runs/<slug>/output/review-notes.md` + `work/runs/<slug>/output/combined-draft.md`
- Systematically addresses every issue from the critique
- Writes the revised draft to `work/runs/<slug>/output/revised-draft.md` with a revision log

**Writer (Phase 5):**
- Reads `work/runs/<slug>/output/revised-draft.md` (the Reviser's output, NOT the raw combined draft)
- Which skill to use (doc-writer, ppt-creator, docx-writer, etc.)
- Output location (work/runs/<slug>/output/)
- Strip internal process notes — revision log is not part of the deliverable
```

### Step 5 — Generate the farm README

Create a short README.md in the farm folder explaining:
1. What the farm does
2. How to run it (select agent in Copilot Chat, provide inputs)
3. What outputs to expect
4. What skills and tools it uses

### Step 6 — Scaffold any custom skills needed

If the farm needs a capability not covered by the shared skills, use the `make-skill-template` skill to create a new skill in `.github/skills/`.

## Validation Checklist

After generating a farm, verify:

- [ ] `farms/<name>/` folder exists with correct structure (including `prompts/`)
- [ ] Orchestrator `.agent.md` has valid frontmatter (name + description)
- [ ] Every sub-agent has a corresponding prompt template in `prompts/*.prompt.md`
- [ ] Prompt templates have `{{PARAMETER}}` markers matching the orchestrator's parameter table
- [ ] All referenced skills exist in `.github/skills/`
- [ ] Skills are referenced by explicit path (`.github/skills/<name>/SKILL.md`) in the orchestrator's skill table, not by short name alone
- [ ] Sub-agents have clear, non-overlapping responsibilities
- [ ] **Skeptic and Reviser are separate sub-agents** (Skeptic writes critique, Reviser fixes)
- [ ] Disk persistence paths are defined (where each sub-agent writes)
- [ ] `work/resources/` folder exists (even if empty) for PM-provided material
- [ ] If PM provided markdown files, they are copied to `work/resources/`
- [ ] If PM provided SharePoint/OneDrive links, they are listed in `work/resources/sharepoint-links.md`
- [ ] If `work/resources/sharepoint-links.md` exists, collector instructions explicitly invoke `sharepoint-reader` before synthesis
- [ ] **Phase 0 resource-loading gate is included** — orchestrator asks PM to add resources and waits for approval before dispatching collectors
- [ ] **Run versioning is included** — orchestrator creates `work/runs/YYYY-MM-DD-<slug>/` at the start; previous runs are preserved
- [ ] Collector instructions include reading `work/resources/` before external research
- [ ] Collector instructions include converting non-Markdown resource files with `markitdown` before summarizing
- [ ] Each collector fires its queries as a parallel batch of tool calls internally
- [ ] Collector outputs go to `work/runs/<slug>/sources/`
- [ ] Work IQ outputs go to `work/runs/<slug>/internal-context.md`
- [ ] Final deliverables go to `work/runs/<slug>/output/`
- [ ] Rules include evidence discipline (no fabrication, source URLs)
- [ ] Instructions mention installing required packages before skill use
- [ ] **PM checkpoints use `vscode_askQuestions`** — every checkpoint (after collection, synthesis, and critique) uses `vscode_askQuestions` with progress summary and proceed/adjust options — never plain chat text
- [ ] **Checkpoints are never collapsed** — orchestrator pauses at each checkpoint individually, even if PM approved all previous ones

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Agent doesn't find skills | Skills must be in the workspace's `.github/skills/` folder. If running from the farm subfolder, the shared skills are at the repo root. |
| Work IQ not working | Run `workiq version` to verify installation. Run `workiq accept-eula` if needed. |
| Azure MCP not available | Install the Azure MCP Server VS Code extension: `ms-azuretools.vscode-azure-mcp-server` |
| Context window filling up | Ensure collectors summarize (10-20 lines per source). Don't dump full web pages. |
| Sub-agents not finding files | Check disk paths match between writer and reader sub-agents. Ensure `{{RUN_PATH}}` is injected correctly. |
| runSubagent not working | Sub-agents are dispatched one at a time (blocking). Ensure the orchestrator reads the prompt template and replaces all `{{PARAMETER}}` markers before calling `runSubagent`. |

```
