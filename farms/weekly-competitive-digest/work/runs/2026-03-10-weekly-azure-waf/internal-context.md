# Internal Competitive Signals (Work IQ)
> ⚠️ Internal — do not distribute externally.

**Period:** last 7 days ending March 10, 2026

## Recent Internal Discussions
- No discussions in the past week explicitly focused on Azure WAF competitors (Cloudflare, Akamai, Imperva, etc.) in emails, Teams, or meetings.
- Recent WAF-related activity was product- and roadmap-focused: API security enforcement gaps, WAF-Defender for Cloud integration, and AI/API protection work (Feb 23–24 meetings).
- Several emails covered Azure WAF mitigations for React RSC CVEs and rule updates — purely Azure WAF-centric, no competitor comparisons.
- Competitive analysis artifacts authored by Eden Ya'akobi exist ("Azure WAF vs WAAP Competitors" docs, last modified Feb 2026) but were not actively discussed this week.

## Customer Signals (Wins / Losses / Feedback)
- **Cloudflare** repeatedly cited by customers for **multi-cloud simplicity** — single control plane for CDN, WAF, DDoS across Azure/AWS/GCP reduces operational overhead vs. Azure WAF tuning and false-positive burden (Feb 24 MBR transcript).
- **Akamai** noted for **integrated API+WAF enforcement** — customers (incl. Chevron) expect inline API security at the WAF/gateway layer, a gap Azure WAF is working to close (Feb 23 WAF & API Security meeting).
- **AWS WAF** appears minimally in recent internal customer feedback — not highlighted as primary competitive pressure; mentioned only contextually in multi-cloud discussions.
- No explicit win/loss counts or formal deal outcomes surfaced; signals are qualitative customer preferences and capability-gap discussions.

## Internal Awareness of Competitor Moves
- Internal competitive analysis docs exist but content is restricted — titles confirm structured Azure WAF vs. WAAP competitor analysis is maintained.
- Meetings reference competitor capability approaches (Palo Alto, Akamai) around API security and WAAP enforcement models — architectural comparison, not pricing or launch tracking.
- An external blog claiming Azure WAF is "end-of-life" due to CRS 3.2 usage triggered internal action and rebuttal planning in Teams threads.
- No explicit references found to competitor pricing changes or new product launches in recent emails, chats, or transcripts.

## Our Response & Roadmap Updates
- **Strategy pivot to AI-adaptive protection**: Azure WAF moving beyond static rulesets to AI-generated, dynamically deployed protections; formalized in "Azure WAF AI Security Initiative" doc.
- **2026 Investment Plan** includes: DRS 2.2 rollout, advanced bot mitigation (JA4, ASN, JS challenge, CAPTCHA, AI bot detection), L7 HTTP flood prevention, <2-day CVE response SLA, Copilot for Security in WAF workflows, and WAF4AI (prompt shield, content safety).
- **Ruleset Versioning Strategy** is a direct competitive response to Cloudflare/AWS/GCP Cloud Armor parity claims — targets faster delivery, reduced FP cycles, and easier customer upgrades.
- **Bot Strategy** introduces new "AI Crawler Bots" category, threat-intel-driven classification, and self-service good-bot registry — directly addressing gaps vs. Cloudflare and Akamai bot platforms.
- **API Protection** repositioning WAF as inline API enforcement engine aligned with OWASP API Top 10, closing the gap with Akamai's integrated API+WAF approach.
- Internal teams explicitly reject "stagnation" narrative and are preparing messaging corrections backed by DRS 2.2 testing results.
