```skill
---
name: send-email
description: 'Send, reply, forward, draft, or search Outlook email via the microsoft-outlook-mail MCP. Use when asked to "send an email", "email this to someone", "reply to an email", "forward this email", "draft an email", "search my emails", or when a farm needs to distribute deliverables or notify stakeholders via email. Requires the microsoft-outlook-mail MCP server.'
---

# Send Email

Send, reply, forward, draft, and search Outlook email via the **microsoft-outlook-mail MCP**. All operations go through Microsoft Graph — no local Outlook installation required.

## When to Use This Skill

- User asks to "send an email", "email this to someone", or "notify stakeholders"
- Agent farm needs to distribute a finished deliverable (doc, deck, brief) to recipients
- Agent needs to reply to or forward an email thread surfaced by Work IQ
- Searching the mailbox for relevant threads before composing a response

## Prerequisites

- **microsoft-outlook-mail MCP** must be connected and authenticated (configured in your user-level `~/.copilot/mcp-config.json`)

## MCP Capabilities Reference

The microsoft-outlook-mail MCP provides the following tools:

### Sending & Composing

| Tool | Description | Optional Parameters |
|------|-------------|---------------------|
| `SendEmailWithAttachments` | Send an email with optional attachments (file URIs or base64). Recipients can be names or emails — names are auto-resolved via Microsoft Graph. | `cc`, `bcc`, `attachmentUris`, `directAttachmentFilePaths`, `directAttachments` |
| `CreateDraftMessage` | Create a draft email without sending. Returns a draft message ID. | `to`, `cc`, `bcc`, `contentType` (`"Text"` or `"HTML"`) |
| `UpdateDraft` | Update a draft's recipients, subject, body, and attachments before sending. | `to`, `cc`, `bcc`, `subject`, `body`, `attachmentUris`, `directAttachmentFilePaths`, `directAttachments` |
| `SendDraftMessage` | Send an existing draft message by its ID. | — |

### Replying & Forwarding

| Tool | Description | Optional Parameters |
|------|-------------|---------------------|
| `ReplyToMessage` | Reply to a single sender on an existing message. | `comment`, `toRecipients`, `ccRecipients`, `bccRecipients`, `preferHtml` |
| `ReplyAllToMessage` | Reply-all to an existing message. | `comment`, `toRecipients`, `ccRecipients`, `bccRecipients`, `preferHtml` |
| `ReplyWithFullThread` | Reply preserving the full quoted thread. | `introComment`, `additionalTo`, `additionalCc`, `additionalBcc`, `includeOriginalNonInlineAttachments`, `replyAll`, `preferHtml` |
| `ReplyAllWithFullThread` | Reply-all preserving the full quoted thread. | `introComment`, `additionalTo`, `additionalCc`, `additionalBcc`, `includeOriginalNonInlineAttachments`, `preferHtml` |
| `ForwardMessage` | Forward a message with optional comment and attachments. | `introComment`, `additionalTo`, `additionalCc`, `additionalBcc`, `attachmentUris`, `directAttachmentFilePaths`, `directAttachments`, `preferHtml` |
| `ForwardMessageWithFullThread` | Forward preserving the full quoted thread. | `introComment`, `additionalTo`, `additionalCc`, `additionalBcc`, `includeOriginalNonInlineAttachments`, `preferHtml` |

### Searching & Reading

| Tool | Description | Optional Parameters |
|------|-------------|---------------------|
| `SearchMessages` | Natural language or KQL search across the mailbox. | `conversationId` (follow-up queries) |
| `GetMessage` | Get a specific message by ID. | `preferHtml`, `bodyPreviewOnly` |
| `GetAttachments` | List all attachments on a message. | — |
| `DownloadAttachment` | Download attachment content as base64. | — |

### Managing Messages

| Tool | Description | Optional Parameters |
|------|-------------|---------------------|
| `UpdateMessage` | Update subject, body, categories, or importance. | `subject`, `body`, `contentType`, `categories`, `importance` |
| `DeleteMessage` | Delete a message. | — |
| `FlagEmail` | Set flag status (`Flagged`, `Complete`, `NotFlagged`). | `mailboxAddress` (shared mailbox) |

### Managing Attachments

| Tool | Description | Optional Parameters |
|------|-------------|---------------------|
| `AddDraftAttachments` | Add file URI attachments to a draft. | — |
| `UploadAttachment` | Upload a small attachment (<3 MB, base64). | `contentType` |
| `UploadLargeAttachment` | Upload a large attachment (3–150 MB, chunked). | `contentType` |
| `DeleteAttachment` | Remove an attachment from a message. | — |

### Recipient Resolution

All tools that accept recipients support **both email addresses and display names**. Names are auto-resolved via Microsoft Graph. Use WorkIQ to look up addresses if resolution fails.

### Attachment Support

Attachments can be provided in three ways:
1. **File URIs** — OneDrive, SharePoint, Teams, or Graph `/drives/{id}/items/{id}` links
2. **Local file paths** — `directAttachmentFilePaths` reads and base64-encodes automatically
3. **Base64 content** — `directAttachments` with `fileName`, `contentBase64`, `contentType`

## Key Features

### HTML Email Composition

- **Sending**: `SendEmailWithAttachments` — body is sent as-is; MCP handles content type.
- **Drafts**: Set `contentType: "HTML"` in `CreateDraftMessage`. Use `UpdateDraft` to refine.
- **Replying/Forwarding**: Set `preferHtml: true` to treat comment as HTML.
- **Reading**: Set `preferHtml: true` on `GetMessage` for HTML body.

### Search & Query

`SearchMessages` supports two modes:

1. **Natural language** — `"emails from Sarah about the budget"`
2. **KQL-style** — `from:sarah subject:budget hasattachment:true`

Use `conversationId` to maintain context across follow-up queries.

### Draft Workflow

1. `CreateDraftMessage` — create initial draft
2. `UpdateDraft` — refine recipients, subject, body, attachments
3. `AddDraftAttachments` — add file URI attachments
4. `SendDraftMessage` — send when approved

### Thread Preservation

Prefer `WithFullThread` variants (`ReplyWithFullThread`, `ForwardMessageWithFullThread`) to preserve the full quoted thread. These support `includeOriginalNonInlineAttachments: true` to re-attach original files.

## Workflow

### Step 1 — Gather Email Details

Collect from the user (ask if not provided):
- **Recipients**: One or more email addresses or names (required)
- **Subject**: The email subject line (required)
- **Body**: The email body content (required)
- **Cc / Bcc**: Optional additional recipients
- **Attachments**: Optional file URIs or local file paths

If the user provides a description rather than exact text, compose appropriate subject and body and confirm before sending.

### Step 2 — Confirm Before Sending

**CRITICAL:** Always present the composed email to the user for confirmation before sending:

```
To: <recipient1>; <recipient2>
Cc: <cc-recipient> (if any)
Subject: <subject>

<body>
```

Ask: "Does this look good to send?"

Do NOT send until the user explicitly confirms.

### Step 3 — Send the Email

Use `SendEmailWithAttachments`:
- **to**: Array of recipient email addresses or names
- **cc** / **bcc**: Optional arrays
- **subject**: The subject line
- **body**: The full body in HTML

**IMPORTANT:** Always send ONE email with all recipients — never send separate emails to each person.

### Step 4 — Confirm

Inform the user that the email was sent successfully, listing all recipients.

## Other Operations

### Replying to an Email
1. Use `SearchMessages` to find the message if no ID is provided
2. Use `GetMessage` to read the original
3. Compose the reply and confirm with the user
4. Use `ReplyToMessage`, `ReplyAllToMessage`, or the `WithFullThread` variants

### Forwarding an Email
1. Locate the message via `SearchMessages` or `GetMessage`
2. Confirm the forward recipients and intro comment with the user
3. Use `ForwardMessage` or `ForwardMessageWithFullThread`

### Searching Emails
1. Use `SearchMessages` with a natural language or KQL query
2. Present results in a concise summary
3. Use `GetMessage` to retrieve full details of a specific result
```
