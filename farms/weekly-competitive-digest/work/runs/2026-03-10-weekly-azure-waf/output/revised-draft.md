# Weekly Competitive Digest: Azure WAF (Web Application Firewall)
**Week ending:** March 10, 2026
**Competitors tracked:** AWS WAF, Cloudflare, Akamai

## 🔥 Top 3 This Week

1. **Cloudflare launches Web & API Vulnerability Scanner (Open Beta)** — AI-powered active DAST scanner that auto-builds API call graphs from OpenAPI specs and tests for BOLA vulnerabilities, signaling Cloudflare's push to own the full vulnerability lifecycle inside its WAF platform. This is directly WAF-competitive: it extends Cloudflare's API protection from passive enforcement to active vulnerability discovery, raising the bar for what "API security" means in a WAF context. — [source](https://blog.cloudflare.com/vulnerability-scanner/)
2. **Cloudflare expands AI-powered security tooling (Cloudy agent + LLM phishing gap detection)** — Cloudy AI agent now covers Phishnet and API CASB with LLM-powered security explanations, and a new LLM-powered engine detects invisible email phishing gaps. While these target Cloudflare One (not WAF directly), they demonstrate Cloudflare's strategy of embedding AI across every security surface — a pattern that will inevitably extend to WAF detection and response. — [source 1](https://blog.cloudflare.com/cloudy-upgrades-for-cloudflare-one/), [source 2](https://blog.cloudflare.com/email-security-phishing-gap-llm/)
3. **Cloudflare discloses and patches Pingora request smuggling vulnerabilities (0.8.0)** — Proactive disclosure of HTTP request smuggling flaws in Pingora, their Rust-based proxy, reinforces their transparency narrative and underscores the complexity of modern L7 proxying. For Azure WAF, this is relevant because Pingora underpins Cloudflare's WAF/CDN stack — vulnerabilities in L7 proxying are a shared challenge, and Cloudflare's rapid open-source disclosure sets a benchmark for response transparency. — [source](https://blog.cloudflare.com/pingora-oss-smuggling-vulnerabilities/)

## Signal Dashboard

| Competitor | Product | Pricing | Partnerships | Funding/M&A | People | Overall Heat |
|-----------|---------|---------|-------------|-------------|--------|-------------|
| AWS WAF | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |
| Cloudflare | 🔴 | ⚪ | ⚪ | ⚪ | ⚪ | 🔴 |
| Akamai | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |

> 🔴 = significant activity  🟡 = minor activity  🟢 = positive for us  ⚪ = no signals

## Competitor Activity

### AWS WAF
**Heat:** ⚪

| Date | Signal | Type | Impact | Source |
|------|--------|------|--------|--------|
| — | No signals detected this week | — | — | — |

**So what:** AWS WAF remains in a quiet period with no product, pricing, or partnership announcements for the second consecutive week. Their investment priorities continue to center on Bedrock AI and Graviton5 rather than WAF/security. This absence of activity creates a window for Azure WAF to advance its roadmap without competitive pressure from AWS — but also means AWS may be building silently. Watch for signs of Bedrock-powered WAF intelligence.

---

### Cloudflare
**Heat:** 🔴

| Date | Signal | Type | Impact | Source |
|------|--------|------|--------|--------|
| 2026-03-09 | Web & API Vulnerability Scanner (Open Beta) — AI-powered DAST for BOLA, auto-builds API call graphs from OpenAPI specs | Product Launch | High | [source](https://blog.cloudflare.com/vulnerability-scanner/) |
| 2026-03-09 | Pingora OSS 0.8.0 — disclosed and fixed HTTP request smuggling vulnerabilities | Security Fix | Medium | [source](https://blog.cloudflare.com/pingora-oss-smuggling-vulnerabilities/) |
| 2026-03-03 | Cloudy AI agent expanded into Phishnet + API CASB with LLM-powered explanations | Product Update | Medium | [source](https://blog.cloudflare.com/cloudy-upgrades-for-cloudflare-one/) |
| 2026-03-03 | LLM-powered phishing gap detection for email security | Product Update | Medium | [source](https://blog.cloudflare.com/email-security-phishing-gap-llm/) |

> *Previously reported (not counted as new):* Attack Signature Detection (Early Access, Mar 4), Full-Transaction Detection (under dev, Mar 4), 2026 Threat Intelligence Report (Mar 3). See prior digest for details.

**So what:** Cloudflare continues to be the most active competitor, now pushing into active vulnerability scanning (DAST) inside their WAF/API protection platform. The Vulnerability Scanner directly competes with the API enforcement and OWASP API Top 10 coverage that Azure WAF is building toward. Their use of AI (Workers AI + LLMs) to auto-build API call graphs raises the bar for what "API protection" means — it's no longer just request filtering, it's intelligent vulnerability discovery. Combined with last week's Attack Signature Detection and Full-Transaction Detection, Cloudflare is building a WAF that detects, validates, and proactively scans — a full-loop security platform. Azure WAF needs to articulate a response narrative that is equally ambitious in scope.

---

### Akamai
**Heat:** ⚪

| Date | Signal | Type | Impact | Source |
|------|--------|------|--------|--------|
| — | No signals detected this week | — | — | — |

**So what:** Akamai had no WAAP-specific announcements this week — likely holding product news for RSA Conference. Akamai's NoName and NeoSec acquisitions have given them native API+WAF enforcement capabilities, making them a formidable player in integrated API security at the WAF/gateway layer. Don't mistake silence for inactivity — Akamai's recent Firewall for AI and App & API Protector Hybrid releases (Apr 2025) set a high baseline.

## Industry & Market Signals
- Cloudflare 2026 Threat Intelligence Report: attackers shifting from "breaking in" to "logging in" via AI-generated deepfakes and credential-based attacks; DDoS reached record 31.4 Tbps; North Korean operatives using AI deepfakes to embed in Western payrolls. — [source](https://www.cloudflare.com/press/press-releases/2026/cloudflare-2026-threat-intelligence-report-nation-state-actors-and/) *(previously reported)*
- No WAF-specific funding or M&A activity detected in the last 7 days.

### Background Context (pre-window)
- Akamai 2026 APAC Security Outlook: APIs overtaking web as primary attack vector (80% of APAC orgs had API incidents), full ransomware commoditization expected in 2026, AI compressing attack timelines. — [source](https://www.akamai.com/newsroom/press-release/akamai-unveils-2026-cloud-and-security-outlook-for-apac-as-ai-reshapes-risk-and-cloud-transformation) *(Dec 2025)*
- Forrester Wave Q1 2025 named both Akamai and Cloudflare as WAF Leaders; Akamai received highest possible scores in vision, roadmap, detection models, pricing flexibility. — [source](https://www.akamai.com/newsroom/press-release/akamai-named-a-web-application-firewall-leader) *(Mar 2025)*

## Internal Signals
> ⚠️ Internal — do not distribute externally.

- **Cloudflare confirmed #1 churn risk.** Customers benchmark Azure against Cloudflare; some leaving AFD/App Gateway for Cloudflare's multi-cloud simplicity — single control plane for CDN/WAF/DDoS across clouds reduces operational overhead vs. Azure WAF tuning burden. *(Work IQ — Feb 24 MBR transcript)*
- **Akamai's integrated API+WAF enforcement** cited by customers (incl. Chevron) as expectation for inline API security at the WAF/gateway layer — a gap Azure WAF is closing. *(Work IQ — Feb 23 WAF & API Security meeting)*
- **External "Azure WAF end-of-life" blog** referencing CRS 3.2 usage triggered internal rebuttal planning. Teams actively preparing messaging corrections backed by DRS 2.2 testing results. *(Work IQ — Teams threads)*
- **Azure WAF AI Security Initiative** formalized — strategy pivot to AI-adaptive protection beyond static rulesets, including Copilot for Security in WAF workflows and WAF4AI (prompt shield, content safety). *(Work IQ)*
- **2026 Investment Plan** in motion: DRS 2.2 rollout, advanced bot mitigation (JA4, ASN, JS challenge, CAPTCHA, AI bot detection), L7 HTTP flood prevention, <2-day CVE response SLA. *(Work IQ)*
- **Bot Strategy** introduces "AI Crawler Bots" category and self-service good-bot registry — directly addressing gaps vs. Cloudflare and Akamai bot platforms. *(Work IQ)*
- **AWS WAF** appears minimally in recent internal customer feedback; not highlighted as primary competitive pressure. *(Work IQ)*

## Watch List
(Items to track in future weeks — carried forward + new)

- [ ] **Cloudflare Web & API Vulnerability Scanner** — monitor beta adoption, expansion beyond BOLA to OWASP Web Top 10 (SQLi, XSS announced on roadmap) — first flagged: 2026-03-10
- [ ] **Cloudflare Full-Transaction Detection** — track progression from "Under Development" to GA; unique differentiator if shipped — first flagged: 2026-03-09
- [ ] **Cloudflare Attack Signature Detection** — monitor Early Access adoption and operational issues with always-on model — first flagged: 2026-03-09
- [ ] **RSA Conference (upcoming)** — expect burst of announcements from Akamai, Cloudflare, and others — first flagged: 2026-03-09
- [ ] **KuppingerCole WAAP Leadership Compass** — track publication date and positioning implications — first flagged: 2026-03-09
- [ ] **AWS Bedrock → WAF AI integration** — watch for signs AWS embeds AI/ML into WAF via Bedrock — first flagged: 2026-03-09
- [ ] **GCP Cloud Armor + Gemini** — monitor whether Google integrates Gemini AI into Cloud Armor detection *(carried from Mar 9 digest; GCP not a tracked competitor in this digest but signal remains relevant to Azure WAF positioning)* — first flagged: 2026-03-09
- [ ] **API enforcement gap closure** — track WAF + Defender for APIs POC progress and customer feedback — first flagged: 2026-03-09
- [ ] **External "Azure WAF end-of-life" blog** — monitor for narrative spread; rebuttal in preparation — first flagged: 2026-03-09

## Recommended Actions

| Priority | Action | Owner (suggested) | Rationale |
|----------|--------|-------------------|-----------|
| 🔴 High | Accelerate API protection positioning and OWASP API Top 10 coverage in Azure WAF | PM / Eng | Cloudflare's Vulnerability Scanner raises the bar — they now offer AI-powered active vulnerability scanning inside the WAF platform. Azure WAF's API enforcement gap is the #1 capability delta cited by customers. |
| 🔴 High | Finalize and publish "Azure WAF end-of-life" rebuttal with DRS 2.2 evidence | PM / Marketing | External blog is creating FUD; internal teams have the data to counter — needs to ship before the narrative spreads. |
| 🟡 Medium | Produce a decision doc evaluating Cloudflare's Attack Signature Detection "always-on" model for Azure WAF detection architecture — deliverable: architecture decision record (ADR) with go/no-go recommendation by next sprint planning | Eng | The "detect everything, mitigate selectively" approach addresses a real customer pain point (log vs. block trade-off) and could inform Azure WAF's roadmap. |
| 🟡 Medium | Prepare RSA Conference competitive brief | PM | Akamai and Cloudflare likely holding announcements for RSA; team should be ready to rapid-response. |
| 🟡 Medium | Ship bot strategy milestones (JA4, JS challenge, AI bot detection) | Eng | Bot management is table-stakes cited internally; every week without shipping widens the gap vs. Cloudflare and Akamai. |

## Quiet Competitors
These tracked competitors had no detectable activity this week:
- AWS WAF
- Akamai

## Sources

| URL | Competitor | Signal Type | Date Fetched |
|-----|------------|-------------|--------------|
| https://blog.cloudflare.com/vulnerability-scanner/ | Cloudflare | Product Launch | 2026-03-10 |
| https://blog.cloudflare.com/pingora-oss-smuggling-vulnerabilities/ | Cloudflare | Security Fix | 2026-03-10 |
| https://blog.cloudflare.com/attack-signature-detection/ | Cloudflare | Product Launch / Preview | 2026-03-10 |
| https://www.cloudflare.com/press/press-releases/2026/cloudflare-2026-threat-intelligence-report-nation-state-actors-and/ | Cloudflare | Report/Analyst | 2026-03-10 |
| https://blog.cloudflare.com/cloudy-upgrades-for-cloudflare-one/ | Cloudflare | Product Update | 2026-03-10 |
| https://blog.cloudflare.com/email-security-phishing-gap-llm/ | Cloudflare | Product Update | 2026-03-10 |
| https://www.akamai.com/newsroom/press-release/akamai-unveils-2026-cloud-and-security-outlook-for-apac-as-ai-reshapes-risk-and-cloud-transformation | Akamai | Report/Analyst | 2026-03-10 |
| https://www.akamai.com/newsroom/press-release/akamai-firewall-for-ai-enables-secure-ai-applications-with-advanced-threat-protection | Akamai | Product (pre-window) | 2026-03-10 |
| https://www.akamai.com/newsroom/press-release/akamai-announces-app-and-api-protector-hybrid-for-expanded-waf-defense | Akamai | Product (pre-window) | 2026-03-10 |
| https://www.akamai.com/newsroom/press-release/akamai-named-a-web-application-firewall-leader | Akamai | Analyst (pre-window) | 2026-03-10 |
| https://aws.amazon.com/waf/ | AWS WAF | Product overview | 2026-03-10 |
| https://aws.amazon.com/waf/features/ | AWS WAF | Product features | 2026-03-10 |
| https://blog.cloudflare.com/tag/waf/ | Cloudflare | Blog index | 2026-03-10 |
| https://www.cloudflare.com/press-releases/ | Cloudflare | Press releases index | 2026-03-10 |

## Revision Log

| # | Critique Item | Section Changed | What Was Done |
|---|--------------|----------------|---------------|
| 1 | Critical #1 — Internal/external bleed: customer name "Chevron" in Akamai "So what" | Akamai → So what | Removed customer name "Chevron" and internal meeting reference. Rewrote to use only publicly known facts (NoName/NeoSec acquisitions are public). Customer-specific detail remains in the Internal Signals section where it is properly labeled. |
| 2 | Critical #2 — Internal/external bleed: "DRS 2.2" in Cloudflare + AWS WAF "So what" | Cloudflare → So what; AWS WAF → So what | Removed "DRS 2.2", "Copilot for Security integration", and "bot features" from both non-internal "So what" sections. Replaced with generic language ("articulate a response narrative", "advance its roadmap"). Internal roadmap details remain in Internal Signals section. |
| 3 | Critical #3 — Internal/external bleed: "Internally assessed" phrasing in Akamai "So what" | Akamai → So what | Removed "Internally, Akamai remains assessed as the most complete WAAP" framing. Rewrote to state publicly observable facts about their acquisitions and capabilities without internal attribution. |
| 4 | Minor #1 — Top 3 #2 combines two signals + missing source URL | Top 3 This Week → #2 | Added second source URL for LLM phishing gap detection (`email-security-phishing-gap-llm`). Entry now cites both sources. |
| 5 | Minor #2 — Top 3 #2, #3 missing WAF-competitive "So what" | Top 3 This Week → #2, #3 | Added 1-2 sentence WAF-competitive relevance explanation to both Top 3 entries explaining why they matter for Azure WAF positioning despite not being direct WAF products. |
| 6 | Minor #3 — Stale news (Akamai APAC Dec 2025, Forrester Mar 2025) in main Industry section | Industry & Market Signals | Moved pre-window items to a new "Background Context (pre-window)" subsection to prevent reader confusion about recency. In-window items remain in the main section. |
| 7 | Minor #4 — Weak action item: "Evaluate" with no deliverable | Recommended Actions → row 3 | Rewritten to specify a concrete deliverable: "Produce a decision doc… deliverable: architecture decision record (ADR) with go/no-go recommendation by next sprint planning." |
| 8 | Minor #5 — GCP Cloud Armor + Gemini watch item silently dropped | Watch List | Restored GCP Cloud Armor + Gemini watch item with annotation explaining GCP is not a tracked competitor in this digest but the signal remains relevant to Azure WAF positioning. |
| 9 | Minor #6 — Top 3 #2 missing second source URL | Top 3 This Week → #2 | Addressed together with Minor #1 — both source URLs now cited. |

### Unresolved Items
| # | Critique Item | Why Not Fixed |
|---|--------------|---------------|
| — | None | All 3 critical and 6 minor issues were resolved. |
