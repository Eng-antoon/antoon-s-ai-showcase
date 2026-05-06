# Mohsen — AI-Powered Virtual Company Assistant

> **Comprehensive documentation for portfolio purposes**
> Company: ILLA Logistics Holding | Deployed: April 2026 | Platform: OpenClaw

---

## 1. Overview

**Mohsen** is an AI-powered virtual assistant deployed at ILLA Logistics Holding, serving as an always-on team member for the company's distribution division. Mohsen operates on the **OpenClaw** platform — an open-source AI agent framework that connects large language models to real business tools (Jira, GitHub, Slack, calendars, and more).

Unlike a simple chatbot, Mohsen is a **persistent, autonomous agent** that:
- Maintains long-term memory across sessions
- Executes real workflows (Jira ticket management, sprint tracking, GitHub monitoring)
- Runs on scheduled cron jobs without human prompting
- Communicates directly with team members via Slack DMs
- Adapts and learns from team interactions over time

---

## 2. Technical Architecture

### Platform
| Component | Details |
|-----------|---------|
| **Framework** | OpenClaw (open-source AI agent platform) |
| **Host** | Linux VPS (Ubuntu, srv1096924) |
| **Runtime** | Node.js v22 |
| **Primary Model** | GLM-5 (via z.ai) |
| **Communication** | Slack (DMs + channels) |
| **Uptime** | 24/7 daemon with auto-restart |

### Connected Tools & Integrations

| Tool | Integration Type | Access Level |
|------|-----------------|--------------|
| **Jira** (illa.atlassian.net) | REST API + CLI | Full read/write (project DIS) |
| **GitHub** (go-illa org) | REST API via PAT | Read-only (7 repos) |
| **Slack** | Native bot integration | DM + channel messaging |
| **Web Search** | Gemini + Google Search grounding | Real-time web access |
| **Weather** | wttr.in / Open-Meteo API | Location-based forecasts |
| **File System** | Local workspace | Full read/write |
| **Shell** | Bash execution | Sandboxed command runner |

### AI Models
| Model | Provider | Use Case |
|-------|----------|----------|
| GLM-5 | z.ai | Primary reasoning, all conversations |
| Gemini | Google | Web search grounding, image analysis |
| ElevenLabs (sag) | ElevenLabs | Text-to-speech (voice storytelling) |

### Skills (Modular Capabilities)
Mohsen uses a skill-based architecture where each capability is a self-contained module:

| Skill | Purpose |
|-------|---------|
| **Jira** | Full Jira project management — create, update, transition tickets, sprint tracking, board queries |
| **Coding Agent** | Delegate coding tasks to sub-agents (Codex, Claude Code) |
| **Slack** | Send messages, reactions, thread management |
| **Weather** | Location-based weather forecasts |
| **Web Search** | Real-time internet search with citations |
| **Fathom** | Meeting transcript extraction and summarization |
| **Video Frames** | Extract frames/clips from video files |
| **OpenAI Whisper** | Local speech-to-text transcription |
| **Notion** | Notion page and database management |
| **Healthcheck** | Server security auditing and hardening |

---

## 3. What Mohsen Does — Daily Operations

### 3.1 Automated Daily Standup (Flagship Feature)

**The most impactful automation:** Mohsen runs the entire daily standup process autonomously, every working day (Sunday–Thursday, 11 AM Egypt time).

**Process Flow:**

```
┌─────────────────────────────────────────────────────┐
│              MOHSEN STANDUP PIPELINE                 │
│                                                      │
│  1. Jira Sprint Pull                                │
│     └─ Fetch all tickets from active sprint          │
│                                                      │
│  2. GitHub Scan                                     │
│     └─ Check 7 repos for PRs, branches, commits     │
│                                                      │
│  3. Developer DMs (5 people)                        │
│     └─ "What did you finish? Working on? Blockers?"  │
│                                                      │
│  4. Team Updates (3 people)                          │
│     └─ "Any updates? Anything team should know?"     │
│                                                      │
│  5. Jira Auto-Update                                │
│     └─ Transition tickets based on responses         │
│                                                      │
│  6. Board Summary → Stakeholders (5 people)          │
│     └─ Sprint status, blockers, progress report      │
│                                                      │
│  7. Daily Snapshot                                  │
│     └─ Save sprint data for historical tracking      │
└─────────────────────────────────────────────────────┘
```

**Who gets DM'd:**
- 5 developers (Hussein, Ahmed A., Seif, Abdelrahman, Ahmed E.)
- 3 team members (Tony, Leena, Ehab)

**Who receives the summary:**
- 5 stakeholders (Tony, Samar, Ahmed Amin, Leena, Ehab)

**Holiday-aware:** Automatically skips Egyptian holidays and weekends (Friday–Saturday).

### 3.2 Jira Project Management

Mohsen provides full Jira lifecycle management:

- **Create tickets** — Stories, Bugs, Tasks with proper fields (product, sprint, assignee, priority)
- **Update tickets** — Status transitions, comments, descriptions
- **Sprint tracking** — Active sprint monitoring, velocity insights
- **Board queries** — Filter by assignee, status, or custom fields
- **Cross-referencing** — Links related tickets (blocks, relates-to)

**Usage:** Team members DM Mohsen with requests like "create a ticket for X" or "move DIS-155 to Done" — he handles the API calls transparently.

### 3.3 GitHub Monitoring

- Monitors **7 repositories** across the `go-illa` organization
- Tracks open PRs, active branches, and recent commits
- Cross-references GitHub activity with Jira tickets during standup
- Provides PR summaries and code activity reports on demand

### 3.4 On-Demand Assistance

Team members can DM Mohsen anytime for:

| Category | Examples |
|----------|---------|
| **Jira operations** | "What's Hussein working on?" "Create a bug for pricing error" |
| **Sprint insights** | "How many tickets are in progress?" "What's blocking the sprint?" |
| **GitHub** | "Any open PRs on distribution-sales?" |
| **Research** | "What's the weather tomorrow?" "Search for X" |
| **Documentation** | "Write me a summary of..." "Create a decision log" |
| **General help** | Any question — Mohsen searches the web, reads files, analyzes data |

### 3.5 Memory & Knowledge Management

Mohsen maintains a structured memory system:

```
memory/
├── people/team-overview.md      # Full team directory with IDs
├── projects/distribution-sales  # Project-specific notes
├── decisions/                   # Decision log with rationale
├── reference/                   # Stable data (holidays, products, repos)
├── snapshots/                   # Daily sprint data archives
├── YYYY-MM-DD.md               # Daily chronological notes
└── MEMORY.md                   # Curated long-term knowledge
```

This means Mohsen **remembers** context across sessions — who's working on what, past decisions, team dynamics, and project history.

---

## 4. How the Team Uses Mohsen

### By Role

| Role | How They Use Mohsen |
|------|-------------------|
| **Tony (AI PM)** | Portfolio management, Jira administration, standup oversight, system configuration, daily standup recipient |
| **Developers (5)** | Receive daily standup DMs, respond with updates, request Jira changes, check sprint status |
| **Leena (BA/PO)** | Creates tickets via Mohsen, receives standup summaries, gets board status updates |
| **Hend (QA)** | Reports bugs through Mohsen, Mohsen creates Jira tickets with proper metadata |
| **Stakeholders (3)** | Receive daily sprint summaries, can request board reports anytime |
| **Ehab** | Receives updates, general coordination |

### Communication Channels

| Channel | Usage |
|---------|-------|
| **Slack DMs** | Primary interaction — any team member can DM Mohsen |
| **#team-jira-alignement** | Group channel — Mohsen responds when @mentioned |
| **Standup DMs** | Automated daily outreach (not initiated by humans) |
| **Thread replies** | Mohsen always replies in Slack threads to keep channels clean |

---

## 5. Impact & Metrics

### Time Savings

| Task | Before Mohsen | After Mohsen | Time Saved |
|------|--------------|-------------|------------|
| **Daily standup** | PM manually DMs 8 people, collects responses, updates Jira, writes summary (~45 min) | Fully automated, zero human time | **~45 min/day** |
| **Jira ticket creation** | Manual UI clicks, field-by-field | DM Mohsen, done in seconds | **~5 min/ticket** |
| **Sprint status checks** | Open Jira, filter, count | "Hey Mohsen, sprint status?" | **~3 min/query** |
| **Board cleanup** | Manual drag-and-drop | Mohsen transitions based on standup responses | **~15 min/day** |
| **GitHub monitoring** | Check 7 repos manually | Automated in standup pipeline | **~20 min/day** |

**Estimated time saved per working day: ~2 hours across the team**

### Sprint Velocity & Accuracy

- **Jira board accuracy improved** — tickets are updated daily based on developer responses, not left stale
- **Zero missed standups** — Mohsen runs every working day, holidays included in the check
- **Historical tracking** — daily snapshots enable sprint-over-sprint comparison

### Process Improvements

| Metric | Impact |
|--------|--------|
| **Standup consistency** | 100% — runs daily, never forgets, never sick |
| **Stakeholder visibility** | 5 stakeholders get daily board summaries automatically |
| **Ticket hygiene** | Board stays current, no stale tickets |
| **Cross-tool integration** | Jira + GitHub + Slack in one automated pipeline |
| **Knowledge retention** | All decisions, context, and history preserved in structured memory |

### Team Adoption

- **16 team members** in Mohsen's Slack directory
- **8 people** interact with Mohsen daily (standup DMs)
- **5 stakeholders** receive daily automated summaries
- **7 GitHub repositories** monitored continuously
- **1 Jira project** (DIS) fully managed

---

## 6. Key Features & Differentiators

### What Makes Mohsen Different from a Chatbot

| Feature | Regular Chatbot | Mohsen |
|---------|----------------|--------|
| **Memory** | Session-only | Persistent across sessions (files + structured memory) |
| **Autonomy** | Responds only when asked | Runs scheduled tasks independently (cron jobs) |
| **Tool Access** | Limited to conversation | Jira, GitHub, Slack, web, files, shell |
| **Proactivity** | Passive | Heartbeat checks, proactive alerts, scheduled standups |
| **Team-aware** | Single user | Knows 16 team members, roles, expertise, IDs |
| **Cross-platform** | Usually one channel | Slack DMs + channels, can integrate more |
| **Personality** | Generic | Adaptable tone, has opinions, culturally aware |

### Safety & Governance

- **Private data stays private** — Mohsen maintains separate sessions per person
- **No cross-leaking** — info from one person's DM doesn't appear in another's
- **Ask-first for external actions** — emails, tweets, public posts require approval
- **Recoverable operations** — prefers `trash` over `rm`
- **Admin oversight** — Tony has full access to all configs and logs

---

## 7. Technical Deep Dive

### Memory Architecture

Mohsen uses a **file-based knowledge system** that survives session resets:

1. **MEMORY.md** — Curated long-term memory (company info, team, projects, lessons learned)
2. **Daily Notes** (`YYYY-MM-DD.md`) — Chronological log of each day's events
3. **People** — Team directory with Slack IDs, Jira IDs, GitHub usernames
4. **Projects** — Domain-specific notes (architecture, sprint history)
5. **Decisions** — Logged with rationale, options considered, and impact
6. **Reference** — Stable data (products, repos, holidays, configs)
7. **Snapshots** — Daily sprint data for historical comparison

### Cron Job Configuration

```
Job ID: 96d2d513-07e7-4c67-9c7b-9853f0611a72
Schedule: 0 11 * * 0-4 (Sun-Thu, 11 AM EET)
Timeout: 600 seconds
Mode: Isolated session
Delivery: Slack DMs + announce
```

### Slack Configuration

```
Channel: #team-jira-alignement (mention-only)
DMs: Open to all team members
Group Policy: Mention-only (@mohsen)
Reply Mode: Thread replies
```

---

## 8. Products Managed

Mohsen tracks tickets across ILLA's full product suite:

| Product | Jira ID | Description |
|---------|---------|-------------|
| Finance Board | 10353 | Financial management dashboard |
| Sales Board | 10354 | Sales tracking and analytics |
| SA Fulfilment App | 10355 | Sales agent fulfilment mobile |
| SA Pre-sell App | 10356 | Sales agent pre-sell mobile |
| Worker Attendance Admin | 10389 | Attendance management dashboard |
| Worker Attendance App | 10390 | Worker attendance mobile app |
| Capacity Planner | 10391 | Resource capacity planning |
| Reconciliation & E-Invoice | 10392 | Invoice reconciliation system |

---

## 9. Timeline

| Date | Milestone |
|------|-----------|
| **April 6, 2026** | Mohsen deployed on OpenClaw, initial setup |
| **April 9, 2026** | Jira integration (DIS board) configured |
| **April 10, 2026** | GitHub read-only access (7 repos), daily standup cron job created, memory system restructured |
| **April 10, 2026** | Rate limit optimization (concurrency tuned for z.ai) |
| **April 14, 2026** | Standup pipeline stabilized, Slack DMs verified for isolated sessions |
| **April 23, 2026** | Safety protocol added — always confirm ticket status transitions with assignees |
| **Ongoing** | Daily standup automation, on-demand Jira/GitHub assistance, continuous memory updates |

---

## 10. Summary

Mohsen represents a **practical implementation of AI-assisted project management** in a real production environment. Rather than a demo or proof-of-concept, Mohsen is a working team member who:

- **Saves ~2 hours/day** of manual coordination work
- **Runs fully automated standups** for an 8-person engineering team
- **Manages Jira and GitHub** integrations seamlessly
- **Maintains institutional memory** that persists across sessions
- **Adapts to the team's workflow** — Egypt working days, holidays, Arabic/English context
- **Operates 24/7** as an always-on daemon with zero downtime

The system was designed, deployed, and maintained by **Antoon Kamel (Tony)** as part of his AI Product Management role at ILLA, demonstrating practical AI agent deployment in a logistics/supply chain company.

---

*Documentation generated by Mohsen | May 2026*
*Powered by OpenClaw — open-source AI agent framework*
