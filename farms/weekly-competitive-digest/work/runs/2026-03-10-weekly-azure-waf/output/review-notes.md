# Skeptic Review: Weekly Competitive Digest

**Draft reviewed:** combined-draft.md
**Review date:** March 10, 2026

## Summary Verdict

The draft is well-structured, accurately sourced, and covers all tracked competitors — but it has **three critical internal/external bleed issues** where Work IQ customer names and internal roadmap details leak into the non-internal competitor activity sections. These must be fixed before distribution. No fabricated signals, no unsourced claims.

## Critical Issues (must fix)

| # | Section | Issue Type | Specific Problem | Evidence |
|---|---------|-----------|-----------------|----------|
| 1 | Akamai → "So what" | Internal/external bleed | Customer name **"Chevron"** from Work IQ appears in the Akamai "So what" paragraph without internal labeling. Text: *"Customers (incl. Chevron) continue to expect inline API security…"* — this names a specific customer from an internal meeting (Feb 23 WAF & API Security) in a section that is not marked as internal. | Sourced from `internal-context.md` (Work IQ — Feb 23 meeting). Not present in any public source file. |
| 2 | Cloudflare → "So what" + AWS WAF → "So what" | Internal/external bleed | Internal Azure WAF roadmap detail **"DRS 2.2"** appears in two non-internal sections: (a) Cloudflare "So what": *"Azure WAF's response via DRS 2.2 and Copilot for Security integration needs to be positioned as equally ambitious"* and (b) AWS WAF "So what": *"This gives Azure WAF a window to ship DRS 2.2 and bot features…"*. These are internal roadmap items from Work IQ. | DRS 2.2, Copilot for Security integration, and bot features are sourced from `internal-context.md` (2026 Investment Plan, AI Security Initiative). Not in any public source. |
| 3 | Akamai → "So what" | Internal/external bleed | Internal competitive assessment phrasing in non-internal section: *"Internally, Akamai remains assessed as the most complete WAAP due to their NoName + NeoSec acquisitions…"* — reveals internal positioning analysis without Work IQ attribution or internal labeling. | Sourced from `internal-context.md` ("Internally assessed as most complete WAAP"). The word "Internally" signals the content is internal but the section lacks the ⚠️ Internal label. |

## Minor Issues (should fix)

| # | Section | Issue Type | Specific Problem |
|---|---------|-----------|-----------------|
| 1 | Top 3 This Week → #2 | Inconsistency | Combines two separate Medium-impact signals (Cloudy AI agent + LLM phishing gap detection) into a single Top 3 entry, inflating its apparent significance. In the Cloudflare detail table these are two distinct rows, each rated Medium. The entry also cites only one source URL (`cloudy-upgrades-for-cloudflare-one`) — the LLM phishing gap source (`email-security-phishing-gap-llm`) is missing. |
| 2 | Top 3 This Week → #2, #3 | Missing "So what" | Neither Top 3 #2 (Cloudy/email AI) nor #3 (Pingora proxy vulnerability) is directly WAF-competitive. Cloudy targets Cloudflare One (CASB, Phishnet), and Pingora is the underlying proxy, not the WAF product. The digest doesn't explain why these are the top Azure WAF-competitive signals this week, especially given that the excluded-as-previously-reported Attack Signature Detection and Full-Transaction Detection are far more directly WAF-relevant. |
| 3 | Industry & Market Signals | Stale news recycled | Akamai 2026 APAC Security Outlook (Dec 2025) and Forrester Wave Q1 2025 (Mar 2025) appear in the main Industry section. Pre-window tags help but placement alongside this-week signals may mislead readers about recency. Consider moving to a "Background Context" subsection or removing. |
| 4 | Recommended Actions → row 3 | Weak action items | "Evaluate Cloudflare's Attack Signature Detection 'always-on' model for Azure WAF detection architecture" lacks a concrete deliverable. Evaluate → what output? A decision doc? A design review? A roadmap item? Needs a specific artifact or decision point. |
| 5 | Watch List | Inconsistency | GCP Cloud Armor + Gemini watch item from the prior Mar 9 digest (`resource-summary.md` → Active Watch Items) is silently dropped. Either carry it forward or note its removal with rationale (e.g., "removed — GCP not tracked in Azure WAF digest"). |
| 6 | Top 3 This Week → #2 | Unsourced signals | The Top 3 #2 entry source link points only to `blog.cloudflare.com/cloudy-upgrades-for-cloudflare-one/` but the entry also claims "LLM phishing gap detection" which is sourced from a different post (`blog.cloudflare.com/email-security-phishing-gap-llm/`). Second source URL is missing from the Top 3 citation. |

## What's Good (keep as-is)

- **Source discipline is strong.** Every signal in the Cloudflare detail table traces back to source files with working URLs. No fabricated signals detected — all claims verified against `news-scan.md` and `competitor-signals-cloudflare.md`.
- **"Previously reported" handling is correct.** Attack Signature Detection, Full-Transaction Detection, and the 2026 Threat Intelligence Report are properly flagged as previously reported and excluded from the new signal count.
- **All three tracked competitors** (AWS WAF, Cloudflare, Akamai) have dedicated sections with "So what" interpretations. No missing competitors.
- **Signal Dashboard heat ratings are accurate.** Cloudflare 🔴 matches 4 signals with a High-impact product launch; AWS WAF and Akamai ⚪ correctly reflects zero in-window signals.
- **Internal Signals section** is properly labeled with ⚠️ and Work IQ attribution on each bullet.
- **Watch List** carries forward most relevant items from the prior digest with first-flagged dates.
- **Recommended Actions** are mostly specific with clear owners and rationale — especially the high-priority API protection and rebuttal items.

## Recommendation

The Reviser should proceed. The three critical issues are all internal/external bleed — fixable by either (a) moving internal references into the Internal Signals section, (b) adding `*(Internal)*` tags inline, or (c) removing customer names and replacing roadmap specifics with generic language in the "So what" sections. No re-run of collection is needed.
