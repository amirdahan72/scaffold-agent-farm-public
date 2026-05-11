# VP OpenAI Status — Agent Farm

A multi-agent system that produces a VP-level status report on the OpenAI customer account for Azure CVP leadership. Scans internal signals via Work IQ and outputs a polished markdown report plus an edit-ready Outlook draft email.

## What It Does

1. **Collects** — three collector sub-agents scan Outlook emails, Teams chats, and meeting recordings/transcripts for OpenAI-related signals
2. **Synthesizes** — combines all signals into a structured status report draft
3. **Reviews** — a Skeptic sub-agent critiques the draft for accuracy, gaps, and CVP-readiness
4. **Revises** — a Reviser sub-agent addresses valid critique items (with PM override support)
5. **Writes** — produces the final markdown status report
6. **Emails** — composes a condensed executive email and saves it as an Outlook draft (no recipients, edit-ready)

## Setup (One-Time)

### Prerequisites

| Requirement | How to Get It |
|-------------|---------------|
| **VS Code** | [Download](https://code.visualstudio.com/) |
| **GitHub Copilot** | VS Code extension — requires a Copilot license with agent mode |
| **Work IQ CLI** | `npm install -g @microsoft/workiq` then `workiq accept-eula` |
| **Node.js 18+** | [Download](https://nodejs.org/) |

### Steps

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd scaffold-agent-farm-public
   ```

2. **Install npm dependencies** (used by chart/doc skills):
   ```bash
   npm install
   ```

3. **Open the farm folder in VS Code:**
   ```
   code farms/vp-openai-status
   ```

4. **Verify MCP servers connect.** The parent repo's `.vscode/mcp.json` provides the Microsoft Outlook MCP automatically. When you open the farm subfolder as a workspace, VS Code may prompt you to approve the MCP servers — click "Allow."

5. **Authenticate Work IQ** (first run only):
   ```bash
   workiq accept-eula
   workiq ask -q "test"
   ```
   This triggers browser-based Microsoft auth. You need a Copilot-licensed M365 account.

### Troubleshooting

- **"workiq: command not found"** — run `npm install -g @microsoft/workiq` and restart your terminal.
- **MCP servers not connecting** — open the parent repo folder in VS Code first (`code scaffold-agent-farm-public`), then navigate to `farms/vp-openai-status/`. The `.vscode/mcp.json` is at the repo root.
- **No Outlook draft created** — the `microsoft-outlook-mail` MCP requires Microsoft tenant auth. Click "Sign in" when VS Code prompts.

## How to Run

1. Open `farms/vp-openai-status/` in VS Code (or the parent repo workspace).
2. Open GitHub Copilot Chat in **Agent mode**.
3. Select **vp-openai-status** from the agents dropdown.
4. Type **"run"** and follow the prompts.
5. The agent will pause at multiple checkpoints for your review and approval.

The agent automatically resolves shared skills from the parent repo using relative paths.

## Outputs

Each run produces files under `work/runs/YYYY-MM-DD-<slug>/`:

| File | Description |
|------|-------------|
| `sources/email-signals.md` | Outlook email intelligence |
| `sources/chat-signals.md` | Teams chat intelligence |
| `sources/meeting-signals.md` | Meeting recordings/transcript intelligence |
| `output/combined-draft.md` | Synthesized status report draft |
| `output/review-notes.md` | Skeptic's critique |
| `output/revised-draft.md` | Revised draft with revision log |
| `output/<customer>-status-report.md` | Final polished MD report |
| `output/email-draft.md` | Email body reference copy |

Plus an Outlook draft email saved to your Drafts folder.

## Optional Resources

Drop files into `work/resources/` before running:

- **Example status email** (`.txt` or `.md`) — helps the Email Writer match your preferred format
- **Account context notes** — key contacts, history, strategic priorities

## Skills & Tools Used

| Skill / Tool | Purpose |
|--------------|---------|
| Work IQ CLI | Internal M365 context (emails, chats, meetings) |
| doc-writer | Structured markdown output |
| send-email | Outlook draft email via MCP |
| writing-style-guide | Amir Dahan's writing style for all prose |

## PM Checkpoints

The orchestrator pauses for your review at three points:
1. **After collection** — review source files before synthesis
2. **After synthesis** — review the draft before critique
3. **After critique** — review the Skeptic's findings, optionally override items before revision
