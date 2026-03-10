# Weekly Signals: Cloudflare
**Period:** last 7 days ending March 10, 2026

## Recent Activity
| Date | Signal | Type | Impact | Source |
|------|--------|------|--------|--------|
| 2026-03-09 | Launched Web & API Vulnerability Scanner beta — stateful DAST for BOLA vulnerabilities, uses AI (Workers AI + gpt-oss-120b) to auto-build API call graphs from OpenAPI specs | Product Launch | High | https://blog.cloudflare.com/vulnerability-scanner/ |
| 2026-03-09 | Disclosed and fixed request smuggling vulnerabilities in Pingora OSS; released Pingora 0.8.0 | Security Fix | Medium | https://blog.cloudflare.com/pingora-oss-smuggling-vulnerabilities/ |
| 2026-03-04 | Introduced Attack Signature Detection — "always-on" WAF detection that runs all signatures on every request without blocking, separating detection from mitigation. Early Access available now. | Product Launch | High | https://blog.cloudflare.com/attack-signature-detection/ |
| 2026-03-04 | Announced Full-Transaction Detection (under development) — correlates HTTP request + response to detect successful exploits, data exfiltration, and misconfigurations that request-only WAFs miss | Product Preview | High | https://blog.cloudflare.com/attack-signature-detection/ |
| 2026-03-03 | Published 2026 Threat Intelligence Report — 230B threats blocked daily, record 31.4 Tbps DDoS, AI erasing barrier to entry for attacks | Report/Analyst | Medium | https://www.cloudflare.com/press/press-releases/2026/cloudflare-2026-threat-intelligence-report-nation-state-actors-and/ |
| 2026-03-03 | Cloudy AI agent expanded into Phishnet and API CASB for LLM-powered security explanations | Product Update | Medium | https://blog.cloudflare.com/cloudy-upgrades-for-cloudflare-one/ |
| 2026-03-03 | LLM-powered phishing gap detection using AI to find invisible email security weaknesses | Product Update | Medium | https://blog.cloudflare.com/email-security-phishing-gap-llm/ |

## Product & Feature Updates
- **Attack Signature Detection (Early Access):** Runs 700+ managed rule signatures on every proxied request continuously, populating Security Analytics with metadata without blocking. Customers build targeted mitigation rules based on observed data, eliminating WAF "log vs. block" trade-off. Detection runs asynchronously after origin response to add zero latency. — [source](https://blog.cloudflare.com/attack-signature-detection/)
- **Full-Transaction Detection (under development):** Inspects both request payloads and server responses to identify successful SQL injection, data exfiltration, and exposed admin panels/misconfigurations. Dramatically reduces false positives vs. request-only detection. — [source](https://blog.cloudflare.com/attack-signature-detection/)
- **Web & API Vulnerability Scanner (Open Beta):** Active DAST for API Shield customers. Uses AI to build API call graphs from OpenAPI specs and test for BOLA vulnerabilities by creating attacker/owner contexts. Credential security via HashiCorp Vault Transit Secret Engine. Built on Rust + Temporal orchestration. Plans to expand to OWASP Web Top 10 (SQLi, XSS). — [source](https://blog.cloudflare.com/vulnerability-scanner/)

## Pricing & Packaging Changes
- No pricing or packaging changes detected this week.

## Partnerships & Integrations
- ⚠️ Cloudflare + Mastercard partnership for comprehensive cyber defense across critical infrastructure and small businesses (Feb 17, 2026). — [source](https://www.cloudflare.com/press/press-releases/2026/cloudflare-and-mastercard-partner-to-extend-comprehensive-cyber-defense/)

## Leadership & Org Changes
- None detected this week.

## Media & Analyst Mentions
- Cloudflare 2026 Threat Intelligence Report received broad media attention: AI-driven attacks, "logging in" vs. "breaking in" theme, North Korean deepfake operatives in Western payrolls. CEO Matthew Prince quoted. — [source](https://www.cloudflare.com/press/press-releases/2026/cloudflare-2026-threat-intelligence-report-nation-state-actors-and/)
- ⚠️ Named WAF Leader in Forrester Wave Q1 2025 (March 20, 2025). — [source](https://blog.cloudflare.com/cloudflare-named-leader-waf-forrester-2025/)
