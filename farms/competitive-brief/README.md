# Competitive Brief Agent Farm

A multi-agent system that produces publication-ready competitive briefs. Give it a product name and competitors; it researches, synthesizes, reviews, and delivers a polished competitive brief for leadership.

## How to Run

1. Open this workspace in VS Code.
2. Open GitHub Copilot Chat and switch to **Agent mode**.
3. Select the **competitive-brief** agent from the agents dropdown.
4. Tell it what to analyze, e.g.: *"Build a competitive brief for Azure DDoS Protection vs Cloudflare, Akamai, and AWS Shield."*
5. The agent will guide you through each phase with interactive checkpoints.

## What It Does

The farm runs 5 phases with PM checkpoints between them:

| Phase | Sub-Agent | What Happens |
|-------|-----------|-------------|
| 0 | Orchestrator | Asks you for product name, competitors, and any reference resources |
| 1a | Web Researcher | Researches competitors, pricing, market landscape from public web sources |
| 1b | Work IQ Collector | Gathers internal M365 context (emails, meetings, chats) about competitive positioning |
| 2 | Synthesizer | Combines public research and internal context into a structured draft |
| 3 | Skeptic | Adversarial review — finds unsupported claims, bias, gaps |
| 4 | Reviser | Evaluates critique, fixes valid issues, disputes invalid ones |
| 5 | Writer | Produces the final polished competitive brief |

You get interactive checkpoints after Phases 1, 2, and 3 to review progress and provide feedback.

## Outputs

Each run creates a timestamped folder:

```
work/runs/YYYY-MM-DD-<product-slug>/
├── sources/              ← research summaries (one per topic)
│   └── index.md          ← source index
├── internal-context.md   ← Work IQ findings (internal M365 context)
├── output/
│   ├── combined-draft.md ← synthesized draft
│   ├── review-notes.md   ← skeptic's critique
│   ├── revised-draft.md  ← post-revision draft
│   ├── competitive-brief.md  ← final deliverable
│   └── chart-prompts.md  ← chart generation prompts (if applicable)
```

## Skills Used

| Skill | Purpose |
|-------|---------|
| web-search | Public web research and summarization |
| workiq-context | Internal M365 context gathering (emails, meetings, chats) |
| doc-writer | Structured markdown document production |
| chart-prompt-writer | Chart/diagram prompt generation for placeholders |

## MCP Servers

| Server | Purpose |
|--------|---------|
| Azure MCP Server | Query Azure resources for infrastructure context (optional) |
| microsoft-outlook-mail | Send deliverables via Outlook email (optional) |

## Adding Resources

You can provide reference material (existing research, internal docs) during Phase 0. Drop files into `work/resources/` or provide them when the agent asks. Resources are shared across all runs and treated as primary context.

## Multiple Runs

The farm supports multiple runs (e.g., analyzing different product categories or refreshing an analysis). Each run gets its own timestamped folder under `work/runs/`. Previous runs are preserved.
