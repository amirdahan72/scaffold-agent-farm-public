# PM-Provided Resource Summary

## Resources Processed

| File | Type | Key Topics |
|------|------|------------|
| *(No files in `work/resources/`)* | — | No PM-provided resources for this run |
| `2026-03-09-weekly-waap/output/weekly-digest.md` | Previous digest | Full WAAP competitive digest covering Cloudflare, AWS WAF, GCP Cloud Armor, Akamai (week ending Mar 9) |
| `2026-03-09-weekly-waap/internal-context.md` | Internal signals | Customer feedback, churn risks, strategic pivot, AI WAAP pillars, API enforcement gaps |
| `2026-03-10-weekly-azure-waf/internal-context.md` | Internal signals (current run) | Azure WAF roadmap, bot strategy, ruleset versioning, API protection positioning |

> **Note:** `work/resources/` is empty — no PM-provided tracking docs, notes, or reference material were found. All context below is drawn from the previous run's output and the current run's internal context.

## Previously Reported Signals
(Signals from the Mar 9 WAAP digest — avoid re-reporting these as new)

- **Cloudflare Attack Signature Detection (Early Access)** — 700+ signatures, always-on, zero-latency detection — (from: `weekly-digest.md`)
- **Cloudflare Full-Transaction Detection (Under Development)** — request + response analysis for exfiltration/exploit correlation — (from: `weekly-digest.md`)
- **Cloudflare WAF managed rules update** — CVE detections for SmarterMail (Mar 2) — (from: `weekly-digest.md`)
- **Cloudflare 2026 Threat Intelligence Report** — 230B threats blocked daily, 31.4 Tbps DDoS record — (from: `weekly-digest.md`)
- **Cloudflare Post-Quantum SASE** (pre-window, Feb 23) — first vendor with post-quantum encryption across SASE — (from: `weekly-digest.md`)
- **Cloudflare–Mastercard partnership** (pre-window, Feb 17) — cyber defense for critical infrastructure & SMBs — (from: `weekly-digest.md`)
- **GCP Cloud Armor Hierarchical Security Policies (GA)** — org/folder-level policy enforcement — (from: `weekly-digest.md`)
- **GCP Cloud Armor ASN filtering (GA)** — filtering by Autonomous System Number — (from: `weekly-digest.md`)
- **AWS Shield Network Security Director Findings** (Mar 5) — no WAF-specific updates — (from: `weekly-digest.md`)
- **WAF market forecasts** — $22B by 2030 (Mordor), $10B cloud WAAP (Data Insights), $30.86B by 2034 (Fortune) — (from: `weekly-digest.md`)
- **A10/ThreatX acquisition** (stale, closed Mar 2025) — (from: `weekly-digest.md`)

## Active Watch Items
(Carried forward from the Mar 9 digest — track across weeks)

- **Cloudflare Full-Transaction Detection** — track progression from "Under Development" to GA; unique differentiator if shipped — (from: `weekly-digest.md`)
- **Cloudflare Attack Signature Detection** — monitor Early Access adoption and operational issues with always-on model — (from: `weekly-digest.md`)
- **RSA Conference (upcoming)** — expect burst of announcements from Akamai, Cloudflare, and others — (from: `weekly-digest.md`)
- **KuppingerCole WAAP Leadership Compass** — track publication date and positioning implications — (from: `weekly-digest.md`)
- **AWS Bedrock → WAF AI integration** — watch for signs AWS embeds AI/ML into WAF via Bedrock — (from: `weekly-digest.md`)
- **GCP Cloud Armor + Gemini** — monitor whether Google integrates Gemini AI into Cloud Armor detection — (from: `weekly-digest.md`)
- **API enforcement gap closure** — track WAF + Defender for APIs POC progress and customer feedback — (from: `weekly-digest.md`)
- **External "Azure WAF end-of-life" blog** — rebuttal planning triggered internally; monitor for narrative spread — (from: `internal-context.md`, current run)

## Competitor Notes & Context

### AWS WAF
- **Quiet period continues.** No WAF-specific product announcements in the Mar 2–9 window — (from: `weekly-digest.md`)
- Last major update was simplified console (Jun 2025) reducing config steps by 80% — (from: `weekly-digest.md`)
- AWS 2026 investment priorities center on Bedrock AI and Graviton5; WAF/security not highlighted — (from: `weekly-digest.md`)
- Internally viewed as a baseline/native-cloud WAF, not a WAAP leader; customers layer Cloudflare/Akamai on top — (from: `internal-context.md`)
- Appears minimally in recent internal customer feedback; not primary competitive pressure — (from: `internal-context.md`, current run)
- Bot features cited internally as "catch-up if done now" — (from: `internal-context.md`, prior run)

### Cloudflare
- **Confirmed #1 churn risk.** Customers benchmark Azure against Cloudflare; some leaving AFD/App Gateway — (from: `internal-context.md`)
- Cited by customers for **multi-cloud simplicity** — single control plane for CDN/WAF/DDoS across clouds reduces operational overhead vs. Azure WAF tuning burden — (from: `internal-context.md`, current run)
- Attack Signature Detection and Full-Transaction Detection represent bold architectural bets that pressure Azure WAF's rule-engine architecture — (from: `weekly-digest.md`)
- Primary pressure areas: advanced bot management, AI agent controls, L7 DDoS — framed internally as table-stakes — (from: `internal-context.md`, prior run)
- 4 in-window signals in Mar 2–9 digest; highest activity of any competitor — (from: `weekly-digest.md`)

### Akamai
- **No WAAP-specific announcements** in Mar 2–9 window — (from: `weekly-digest.md`)
- Internally assessed as **most complete WAAP** due to NoName + NeoSec acquisitions giving API-native-in-WAAP capabilities — (from: `internal-context.md`)
- Noted for **integrated API+WAF enforcement** — customers (incl. Chevron) expect inline API security at the WAF/gateway layer, a gap Azure WAF is closing — (from: `internal-context.md`, current run)
- Most recent major releases: App & API Protector Hybrid (Apr 2025) and Firewall for AI — (from: `weekly-digest.md`)
- Likely holding announcements for RSA Conference — (from: `weekly-digest.md`)

## Gaps & Missing Coverage
- **No PM-provided resources** — the `work/resources/` directory is empty. No tracking docs, competitor profiles, or week-specific PM notes were available to guide this run.
- **No GCP Cloud Armor context for this run** — GCP is not a target competitor for this Azure WAF digest, but the Mar 9 digest covered it; cross-reference if needed.
- **No pricing/packaging intelligence** for any competitor in available resources.
- **No analyst report content** — KuppingerCole WAAP Leadership Compass referenced but not available as a resource.
- **No formal win/loss data** — customer signals are qualitative preferences, not structured deal outcomes.
