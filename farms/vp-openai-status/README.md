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

1. **Open VS Code** and open Copilot Chat (click the sparkle icon on the right sidebar). Make sure you're in **Agent mode** (click the mode dropdown at the top of the chat panel).

2. **Paste the following into the chat** and press Enter. Copilot will run each command for you:

   > Please run these commands for me:
   > 1. `git clone https://github.com/amirdahan72/scaffold-agent-farm-public.git`
   > 2. `cd scaffold-agent-farm-public`
   > 3. `npm install`
   > 4. Then open the folder `farms/vp-openai-status` in a new VS Code window

3. **Approve MCP servers.** When the new VS Code window opens, you may see a pop-up asking to approve MCP servers (Outlook, Teams, etc.). Click **"Allow"** on each one.

4. **Authenticate Work IQ** (first run only). In the new VS Code window, open Copilot Chat again and paste:

   > Please run these commands for me:
   > 1. `workiq accept-eula`
   > 2. `workiq ask -q "test"`

   A browser window will open asking you to sign in with your Microsoft account. Sign in and return to VS Code.

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "workiq: command not found" | Paste `npm install -g @microsoft/workiq` into the terminal and press Enter. Then close and reopen the terminal. |
| MCP servers not connecting | Close VS Code. Open a terminal and paste: `code scaffold-agent-farm-public` — then from inside VS Code, open the `farms/vp-openai-status` folder. |
| No Outlook draft created | When VS Code shows a "Sign in" prompt for Microsoft, click it and complete the sign-in in your browser. |

## How to Run

1. In VS Code, click the **Copilot Chat** icon on the right sidebar (the sparkle icon).
2. At the top of the chat panel, switch to **Agent mode** (click the mode dropdown if it says "Ask" or "Edit").
3. In the agent dropdown (next to the mode), select **vp-openai-status**.
4. Type **run** in the chat box and press Enter.
5. The agent will ask you a few questions (customer name, time range, etc.) — answer them using the buttons and text fields that appear.
6. It will pause at three checkpoints for your review before continuing. Just click the button to proceed, or review the files first.

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
