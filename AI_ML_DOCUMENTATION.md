# AURA AI/ML System Architecture & Prioritization Documentation

## 📌 Executive Summary

This document provides a comprehensive, plain-English explanation of the **AURA AI Engine**, including the **Rule-Based Prioritization Engine**, **NLP Extractor & Summarizer**, **Zero-Hallucination Guardrails**, and **Multi-Source Priority Scoring**.

---

## 🎯 1. How Prioritization Scoring Works (Detailed Breakdown)

Every item in the system—whether a **Notion Task**, a **Google Calendar Event**, or a **Gmail Message**—is evaluated dynamically against the user's target date (local `YYYY-MM-DD`). 

Items are scored on a **0.0 to 100.0 Normalized Scale** (`Math.min(100.0, Math.max(0.0, raw_score))`) and sorted in **Strict Descending Score Order**:
- `#1 Priority`: Highest score (e.g. `Score: 98.0 / 100`)
- `#2 Priority`: Second highest score (e.g. `Score: 88.0 / 100`)
- `#3 Priority`: Third highest score (e.g. `Score: 75.0 / 100`)
- `#4 Priority`: Fourth highest score (e.g. `Score: 65.0 / 100`)

---

### 🧮 2. Scoring Criteria & Points Table (Bounded 0-100)

| Criteria | Points | Condition / Rule |
| :--- | :---: | :--- |
| **Base Score** | `+40.0` | Starting baseline score for every canonical record. |
| **Scheduled / Due Today** | `+25.0` | Item's date matches local target date (`YYYY-MM-DD`). |
| **High Urgency Keyword** | `+20.0` | Contains *"urgent"*, *"high"*, *"asap"*, *"p0"*, *"action required"*, *"critical"*, *"nlp"*, *"ai"*, *"bug"*, *"fix"*, *"auth"*, or *"redesign"*. |
| **Flagged / Starred Email** | `+20.0` | Email is flagged or starred in Gmail. |
| **VIP Sender Email** | `+15.0` | Email from team lead, manager, boss, or key stakeholder. |
| **Active Task Status** | `+15.0` | Notion task status is *"in progress"*, *"doing"*, or *"urgent"*. |
| **Specific Topic Focus** | `+10.0` | Item title describes a concrete task/meeting (e.g. *"Testing on NLP"*). |
| **Generic Title Penalty** | `-15.0` | Item title is generic placeholder (e.g. *"Team meet"*, *"Sync"*, *"Call"*). |
| **Past Event Penalty** | `-30.0` | Event date is before today (yesterday or older). Ensures past meetings never pollute today's priorities. |
| **Score Normalization Cap** | `[0, 100]` | Final score is capped at `100.0` maximum so scores never exceed 100. |

---

### 📝 3. Scoring Example Calculations

#### Example A: Flagged Urgent Email from Manager
- **Base Score**: `50.0`
- **Received Today**: `+30.0`
- **Flagged Email**: `+30.0`
- **Urgent Action Keyword ("Review Action Required")**: `+25.0`
- **VIP Sender**: `+20.0`
- **TOTAL SCORE**: **`155.0`** ➔ **Ranks #1 Priority**

#### Example B: Specific Deliverable Task ("Testing on NLP and AIDIGEST")
- **Base Score**: `50.0`
- **Due Today**: `+30.0`
- **High Urgency Keywords ("NLP", "AIDIGEST", "Testing")**: `+25.0`
- **Active Task Status**: `+20.0`
- **Specific Topic Focus**: `+15.0`
- **TOTAL SCORE**: **`140.0`** ➔ **Ranks #2 Priority**

#### Example C: Scheduled Today Meeting ("UI Redesign Sprint Sync")
- **Base Score**: `50.0`
- **Scheduled Today**: `+30.0`
- **High Urgency Keyword ("Redesign")**: `+25.0`
- **Scheduled Meeting**: `+15.0`
- **Specific Topic Focus**: `+15.0`
- **TOTAL SCORE**: **`135.0`** ➔ **Ranks #3 Priority**

#### Example D: Generic Team Meeting ("Team meet")
- **Base Score**: `50.0`
- **Scheduled Today**: `+30.0`
- **Scheduled Meeting**: `+15.0`
- **Generic Title Penalty**: `-20.0`
- **TOTAL SCORE**: **`75.0`** ➔ **Ranks #4 Priority**

---

## 📑 4. Meeting Prep Notes Generation

For every meeting present in the top priority list, the AI engine generates an actionable meeting prep note:

1. **Attendee Identification**: Extracts participant names/emails.
2. **Context Matching**: Cross-references recent emails or Notion documents matching the meeting title.
3. **Actionable Prep Focus**:
   - **AI/NLP Focus**: *"Review AI/NLP module metrics, evaluation accuracy, and pipeline endpoints."*
   - **UI/Redesign Focus**: *"Review design mockups, component states, and responsive layout guidelines."*
   - **Sprint/Standup Focus**: *"Prepare updates on completed tasks, current blockers, and today's deliverables."*

---

## 🛡️ 5. Zero-Hallucination Guarantee

The AI Digest uses a strict 2-tier guardrail:
1. **Verbatim Fact Whitelist**: Dates, times, titles, and attendee names are extracted directly from canonical database rows.
2. **Entity Validation Step**: The output text is validated against the whitelist. Any entity not present in verbatim facts is automatically stripped or rejected.
