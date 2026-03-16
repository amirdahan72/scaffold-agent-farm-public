```skill
---
name: sharepoint-reader
description: 'Download SharePoint or OneDrive documents from URL into farm resources, including files larger than 5MB, using Microsoft Graph and Azure CLI auth. Optional Markdown conversion is supported. Triggers: sharepoint link, onedrive file, download from sharepoint, ingest internal docs, load sharepoint resources.'
---

# SharePoint Reader

Download SharePoint or OneDrive files from a URL into the current farm's `work/resources/` directory. This skill uses Microsoft Graph API + Azure CLI auth and supports files larger than 5 MB.

## When to Use This Skill

- The PM provides SharePoint or OneDrive links as source material
- A collector needs to ingest internal docs before synthesis
- A file is too large for lightweight link-based tools
- You want a local, stable copy in `work/resources/` for later phases

## Prerequisites

- Azure CLI installed and authenticated: `az login`
- Access to the SharePoint or OneDrive file URL
- Optional Markdown conversion tool: `pip install 'markitdown[all]'`
- **For MCP fallback (Step 2b):** SharePoint MCP server — install the `ms-office.copilot-sharepoint-and-onedrive` VS Code extension. Without it, the 403 fallback path is unavailable.

## Important Scope

- This skill is **download-focused** for farm resource ingestion.
- It does **not** modify SharePoint content.
- It expects file URLs. If a folder URL is supplied, ask for a specific file URL.

## Workflow

### Step 1 - Identify source links and target paths

For each input URL:

- Prefer output under the active run or farm resources directory, for example:
  - `farms/<farm-name>/work/resources/<filename>`
  - `farms/<farm-name>/work/runs/<run-id>/sources/<filename>`
- Preserve meaningful filenames where possible.

### Step 2 - Download from SharePoint URL

Use the helper script:

```powershell
powershell.exe -ExecutionPolicy Bypass -File ".github/skills/sharepoint-reader/scripts/download-from-sharepoint-url.ps1" -SharePointUrl "<sharepoint_or_onedrive_url>" -OutputFile "<output_path>"
```

What the script does:

1. Gets a Graph token via `az account get-access-token`
2. Resolves the URL via Graph `shares` API
3. Extracts `driveId` and `itemId`
4. Downloads file content via `drives/{driveId}/items/{itemId}/content`

### Step 2b - MCP fallback (if script returns 403)

The `az` CLI Graph token may lack site-level permissions for certain SharePoint sites even when you have browser access. If the script exits with 403, fall back to the SharePoint MCP server:

1. Call `getFileOrFolderMetadataByUrl` with the original SharePoint URL.
2. Extract `parentReference.driveId` and `id` from the response.
3. Call `readSmallBinaryFile` with `documentLibraryId` = driveId and `fileId` = id.
4. Base64-decode the response and save to disk:

```powershell
$bytes = [System.Convert]::FromBase64String($base64Content)
[System.IO.File]::WriteAllBytes("<output_path>", $bytes)
```

> The MCP SharePoint server uses a broader auth flow than `az` CLI delegated tokens. This fallback is capped at ~5 MB. For larger files where the script also 403s, the user needs to grant their `az` CLI identity access to the SharePoint site.

### Step 3 - Optional conversion to Markdown

If the downstream workflow needs markdown summarization input:

```bash
markitdown "<downloaded_file>" -o "<output_markdown_path>"
```

Supported conversion formats include `.docx`, `.pdf`, `.pptx`, `.xlsx`, `.html`, `.csv`, and `.json`.

### Step 4 - Write concise ingestion notes

For each file, write a short source note (for example in `sources/index.md`):

- Original URL
- Saved file path
- File size
- Conversion output path (if converted)
- Any access or parsing issues

## Rules

- **Always** keep downloaded files in farm-local folders (`work/resources` or `work/runs/.../sources`).
- **Never** hardcode or persist Graph tokens.
- **Never** claim successful ingestion without checking that output file exists.
- **If auth fails**, tell the user to run `az login` and retry.
- **If URL resolution fails**, report that access may be missing or the link is invalid.
- **Do not overwrite existing files silently** unless the caller explicitly requested overwrite behavior.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `az` not found | Install Azure CLI and restart terminal |
| Token fetch failure | Run `az login` |
| 401/403 from Graph | The `az` CLI token may lack `Sites.Read.All` for that site — try Step 2b MCP fallback. If MCP also fails, the signed-in account truly lacks access |
| 404 for URL | Verify the link points to a file and is still valid |
| Unsupported conversion format | Keep raw file and continue without conversion |

```