# Scaffold Agent Farm

**A workspace for PMs to create multi-agent systems in GitHub Copilot — no coding required.**

Tell the master agent what you want to build (a PRD, competitive brief, roadmap, etc.) and it will generate a ready-to-run team of cooperating AI agents with web research, internal context (Work IQ), Azure access, and professional document/deck output.

## Quick Start

1. **Open this folder** in VS Code.
2. **Open Copilot Chat** → switch to **Agent mode**.
3. **Select the `scaffold-agent-farm` agent** from the agents dropdown.
4. **Describe what you want**, e.g.:
   > "Create an agent farm that builds a product requirements document for feature X on product Y."
5. The master agent will scaffold a complete agent farm under `farms/`.
6. **Run the generated agent** by selecting it in Copilot Chat and providing your inputs.

## What's in This Workspace

```
scaffold-agent-farm/
├── .github/
│   ├── agents/
│   │   └── scaffold-agent-farm.agent.md   ← master agent (you talk to this)
│   └── skills/                            ← shared skill library
│       ├── make-agent-farm/SKILL.md       ← scaffolds new agent farms
│       ├── make-skill-template/SKILL.md   ← scaffolds new skills
│       ├── web-search/SKILL.md            ← fetches & summarizes web pages
│       ├── workiq-context/SKILL.md        ← queries Work IQ for M365 context
│       ├── sharepoint-reader/SKILL.md      ← downloads SharePoint/OneDrive files into farm resources
│       ├── ppt-creator/SKILL.md           ← generates slide decks
│       ├── doc-writer/SKILL.md            ← writes structured markdown docs
│       └── docx-writer/SKILL.md           ← creates Word (.docx) documents
├── .vscode/
│   └── mcp.json                           ← Azure MCP Server config
├── farms/                                 ← generated agent farms go here
└── README.md                              ← this file
```

## Prerequisites

| Requirement | Why | Setup |
|-------------|-----|-------|
| VS Code | IDE for running GitHub Copilot | [Download](https://code.visualstudio.com/) |
| GitHub Copilot extension | Agent mode for multi-agent workflows | Install from VS Code extensions |
| Node.js 18+ | Required for Work IQ CLI and PptxGenJS | [Download](https://nodejs.org/) |
| Work IQ CLI | Internal M365 context (emails, meetings, chats) | `npm install -g @microsoft/workiq` then `workiq accept-eula` |
| Azure MCP Server extension | Azure resource access from agents | Install `ms-azuretools.vscode-azure-mcp-server` in VS Code |
| Azure CLI (optional) | Auth for Azure MCP | `az login` |

## Key Concepts

### Agent Farm
A team of cooperating subagents, each with a focused role (Collector, Synthesizer, Skeptic-Reviser, Writer). The master agent creates these teams for you.

### Skills
Reusable instruction files (`.github/skills/<name>/SKILL.md`) that teach agents specific capabilities. All generated agent farms share the same skill library.

### Short-Term Memory (STM)
Agents have no long-term memory. During a run, they work within a **context window**. To handle complex tasks:
- **Collectors** summarize information and write it to disk.
- **Synthesizers** read those files — loading them into context.
- **This prevents context overflow** from dumping full web pages.

### Work IQ CLI
A command-line tool that queries your Microsoft 365 tenant for internal context — past emails, meeting notes, Teams chats about a topic. Used as a CLI tool (`workiq ask -q "..."`), not an MCP server.

### Azure MCP Server
An MCP server that lets agents query and manage Azure resources (resource groups, storage accounts, app services, etc.). Pre-configured in `.vscode/mcp.json`.

## How Generated Agent Farms Work

When you ask the master agent to create a farm, it generates:

1. **Agent profile** (`.agent.md`) — the prompt that defines the subagent team
2. **Work directory** — where subagents write intermediate and final outputs
3. **Farm README** — instructions for running the specific farm

The generated agent uses this workflow:

```
Collectors (parallel) → Synthesizer → Skeptic-Reviser → Writer/Builder
     ↓                      ↓               ↓                ↓
  sources/*.md     combined-draft.md   revised-draft.md    output/
```

The **Skeptic-Reviser** both identifies issues (unsupported claims, gaps, weak evidence) AND fixes them in-place — producing a polished draft rather than just a list of problems. This gives every deliverable an implicit "review + fix" pass without requiring a complex feedback loop.

Each subagent writes to disk. The next subagent reads from disk. This keeps context lean and enables multi-step workflows.

## Shared Skills Reference

| Skill | What it does | When agents use it |
|-------|-------------|-------------------|
| **web-search** | Searches the web and returns concise summaries | Researching competitors, pricing, features, market trends |
| **workiq-context** | Queries Work IQ CLI for internal M365 context | Gathering internal discussions, decisions, stakeholder feedback |
| **sharepoint-reader** | Downloads SharePoint/OneDrive files from URLs into local farm resource folders | Ingesting PM-provided SharePoint links (including large files) for collector/synthesizer phases |
| **ppt-creator** | Creates `.pptx` slide decks from structured content | Producing presentation deliverables |
| **doc-writer** | Writes structured markdown (PRDs, specs, briefs) | Producing document deliverables |
| **docx-writer** | Creates Microsoft Word (.docx) documents | Exporting deliverables as formatted Word docs |
| **make-agent-farm** | Scaffolds new agent farm folders and profiles | Used by the master agent to create farms |
| **make-skill-template** | Scaffolds new skill folders and SKILL.md files | Used when a farm needs a custom skill |
| **send-email** | Sends, replies, forwards, drafts, and searches Outlook email via MCP | Distributing deliverables to stakeholders, replying to threads (optional — requires microsoft-outlook-mail MCP) |

## Example Use Cases

| You say | What gets built |
|---------|----------------|
| "Build a PRD agent farm for feature X on product Y" | Collectors research the web + Work IQ → Synthesizer writes PRD draft → Skeptic-Reviser reviews & fixes → Doc Writer produces final PRD |
| "Create a competitive analysis agent for A vs B vs C" | Parallel collectors (one per competitor) → Synthesizer builds comparison table → Skeptic-Reviser verifies claims & strengthens evidence → Doc Writer and PPT Creator produce brief + deck |
| "Scaffold a launch readiness agent for product Z" | Collectors gather internal status via Work IQ + Azure resource checks → Synthesizer creates checklist → Skeptic-Reviser validates & fills gaps → Doc Writer produces launch doc |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Agent not appearing in dropdown | Ensure this folder is open as a VS Code workspace. Check `.github/agents/` exists. |
| Skills not discovered | Skills must be in `.github/skills/`. Verify SKILL.md exists in each folder. |
| Work IQ not working | Run `workiq version`. If not found: `npm install -g @microsoft/workiq` then `workiq accept-eula`. |
| Azure MCP not available | Install the extension: search "Azure MCP Server" in VS Code extensions. Run `az login` for auth. |
| "Context too large" errors | Ensure collectors summarize (not dump) web content. Check skill instructions say "10-20 lines per source". |
