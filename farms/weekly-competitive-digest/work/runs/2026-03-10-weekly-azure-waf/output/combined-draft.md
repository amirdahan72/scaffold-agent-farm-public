# Weekly Competitive Digest: Azure WAF (Web Application Firewall)
**Week ending:** March 10, 2026
**Competitors tracked:** AWS WAF, Cloudflare, Akamai

## 🔥 Top 3 This Week

1. **Cloudflare launches Web & API Vulnerability Scanner (Open Beta)** — AI-powered active DAST scanner that auto-builds API call graphs from OpenAPI specs and tests for BOLA vulnerabilities, signaling Cloudflare's push to own the full vulnerability lifecycle inside its WAF platform. — [source](https://blog.cloudflare.com/vulnerability-scanner/)
2. **Cloudflare expands AI-powered security tooling (Cloudy agent + LLM phishing gap detection)** — Cloudy AI agent now covers Phishnet and API CASB with LLM-powered security explanations, and a new LLM-powered engine detects invisible email phishing gaps — Cloudflare is embedding AI across every security surface. — [source](https://blog.cloudflare.com/cloudy-upgrades-for-cloudflare-one/)
3. **Cloudflare discloses and patches Pingora request smuggling vulnerabilities (0.8.0)** — Proactive disclosure of HTTP request smuggling flaws in Pingora, their Rust-based proxy, reinforces their transparency narrative and underscores the complexity of modern L7 proxying. — [source](https://blog.cloudflare.com/pingora-oss-smuggling-vulnerabilities/)

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

**So what:** AWS WAF remains in a quiet period with no product, pricing, or partnership announcements for the second consecutive week. Their investment priorities continue to center on Bedrock AI and Graviton5 rather than WAF/security. This gives Azure WAF a window to ship DRS 2.2 and bot features without competitive pressure from AWS — but also means AWS may be building silently. Watch for signs of Bedrock-powered WAF intelligence.

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

**So what:** Cloudflare continues to be the most active competitor, now pushing into active vulnerability scanning (DAST) inside their WAF/API protection platform. The Vulnerability Scanner directly competes with the API enforcement and OWASP API Top 10 coverage that Azure WAF is building toward. Their use of AI (Workers AI + LLMs) to auto-build API call graphs raises the bar for what "API protection" means — it's no longer just request filtering, it's intelligent vulnerability discovery. Combined with last week's Attack Signature Detection and Full-Transaction Detection, Cloudflare is building a WAF that detects, validates, and proactively scans — a full-loop security platform. Azure WAF's response via DRS 2.2 and Copilot for Security integration needs to be positioned as equally ambitious.

---

### Akamai
**Heat:** ⚪

| Date | Signal | Type | Impact | Source |
|------|--------|------|--------|--------|
| — | No signals detected this week | — | — | — |

**So what:** Akamai had no WAAP-specific announcements this week — likely holding product news for RSA Conference. Internally, Akamai remains assessed as the most complete WAAP due to their NoName + NeoSec acquisitions giving native API+WAF enforcement. Customers (incl. Chevron) continue to expect inline API security at the WAF/gateway layer, a capability gap Azure WAF is actively closing. Don't mistake silence for inactivity — Akamai's recent Firewall for AI and App & API Protector Hybrid releases (Apr 2025) set a high baseline.

## Industry & Market Signals
- Cloudflare 2026 Threat Intelligence Report: attackers shifting from "breaking in" to "logging in" via AI-generated deepfakes and credential-based attacks; DDoS reached record 31.4 Tbps; North Korean operatives using AI deepfakes to embed in Western payrolls. — [source](https://www.cloudflare.com/press/press-releases/2026/cloudflare-2026-threat-intelligence-report-nation-state-actors-and/) *(previously reported)*
- Akamai 2026 APAC Security Outlook: APIs overtaking web as primary attack vector (80% of APAC orgs had API incidents), full ransomware commoditization expected in 2026, AI compressing attack timelines. — [source](https://www.akamai.com/newsroom/press-release/akamai-unveils-2026-cloud-and-security-outlook-for-apac-as-ai-reshapes-risk-and-cloud-transformation) *(pre-window, Dec 2025)*
- Forrester Wave Q1 2025 named both Akamai and Cloudflare as WAF Leaders; Akamai received highest possible scores in vision, roadmap, detection models, pricing flexibility. — [source](https://www.akamai.com/newsroom/press-release/akamai-named-a-web-application-firewall-leader) *(pre-window, Mar 2025)*
- No WAF-specific funding or M&A activity detected in the last 7 days.

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
- [ ] **API enforcement gap closure** — track WAF + Defender for APIs POC progress and customer feedback — first flagged: 2026-03-09
- [ ] **External "Azure WAF end-of-life" blog** — monitor for narrative spread; rebuttal in preparation — first flagged: 2026-03-09

## Recommended Actions

| Priority | Action | Owner (suggested) | Rationale |
|----------|--------|-------------------|-----------|
| 🔴 High | Accelerate API protection positioning and OWASP API Top 10 coverage in Azure WAF | PM / Eng | Cloudflare's Vulnerability Scanner raises the bar — they now offer AI-powered active vulnerability scanning inside the WAF platform. Azure WAF's API enforcement gap is the #1 capability delta cited by customers. |
| 🔴 High | Finalize and publish "Azure WAF end-of-life" rebuttal with DRS 2.2 evidence | PM / Marketing | External blog is creating FUD; internal teams have the data to counter — needs to ship before the narrative spreads. |
| 🟡 Medium | Evaluate Cloudflare's Attack Signature Detection "always-on" model for Azure WAF detection architecture | Eng | The "detect everything, mitigate selectively" approach addresses a real customer pain point (log vs. block trade-off) and could inform Azure WAF's roadmap. |
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
