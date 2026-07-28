# ⚡ Multi-Source Prioritization Engine (`aiml/prioritization/`)

The **Prioritization Engine** scores, ranks, and categorizes workspace items (Tasks, Events, and Emails) on a strict **0.0 to 100.0** scale.

---

## 📈 Scoring & Ranking Flowchart

```mermaid
flowchart TD
    Raw[Raw Input: Task / Event / Email] --> Base[Base Score: +40.0 Points]
    
    Base --> CheckDate{Is item scheduled/due today?}
    CheckDate -- Yes --> TodayBonus[Add Today Bonus: +25.0 to +30.0 Points]
    CheckDate -- No, Overdue Past Date --> PastPenalty[Subtract Past Item Penalty: -30.0 Points]
    CheckDate -- No, Future Date --> FutureBonus[Add Deadline Set Bonus: +10.0 Points]

    TodayBonus & PastPenalty & FutureBonus --> CheckTitle{Title Specificity Check}
    CheckTitle -- Specific Topic --> SpecificBonus[Add Topic Focus Bonus: +10.0 to +15.0 Points]
    CheckTitle -- Generic Title --> GenericPenalty[Subtract Generic Penalty: -15.0 Points]

    SpecificBonus & GenericPenalty --> CheckUrgent{High Urgency Keyword Present?}
    CheckUrgent -- Yes --> UrgentBonus[Add Urgency Bonus: +20.0 Points]
    CheckUrgent -- No --> NoUrgent[No Bonus]

    UrgentBonus & NoUrgent --> CheckMeta{Source-Specific Metadata}
    CheckMeta -- Flagged/Starred Email --> FlaggedBonus[Add Flagged Bonus: +20.0 Points]
    CheckMeta -- VIP Sender --> VIPBonus[Add VIP Sender Bonus: +15.0 Points]
    CheckMeta -- Active Urgent Task --> TaskBonus[Add Active Task Bonus: +15.0 Points]

    FlaggedBonus & VIPBonus & TaskBonus --> ScoreCap[Cap Score Strictly 0.0 - 100.0]
    ScoreCap --> RankTier[Map to Priority Badges: High / Medium / Low]
```

---

## 🎯 Scoring Breakdown Rules

| Rule | Score Adjustment | Reason Tag |
| :--- | :---: | :--- |
| **Base Starting Score** | `+40.0` | Initial baseline |
| **Scheduled / Due Today** | `+25.0` to `+30.0` | `Due today` / `Today's meeting` / `Today's email` |
| **Overdue / Past Item Penalty** | `-30.0` | `Past item penalty` *(Deprioritizes historical clutter)* |
| **High Urgency Keyword** (`urgent`, `high`, `asap`, `critical`, `p0`, `blocker`) | `+20.0` | `High urgency keyword` |
| **Flagged / Starred Email** | `+20.0` | `Flagged email` |
| **VIP Sender** (`boss`, `lead`, `client`, `manager`) | `+15.0` | `VIP sender email` |
| **Specific Topic Focus** | `+10.0` to `+15.0` | `Specific topic focus` |
| **Generic Title** (`sync`, `meeting`, `untitled`) | `-15.0` | `Generic title` |

---

## 🏷️ Dynamic Priority Tier Mapping

After scoring, items are sorted in descending order:
- 🔴 **High Priority**: Ranked `#1` or Score `≥ 90.0`
- 🟠 **Medium Priority**: Ranked `#2` or `#3` (Score `70.0 – 89.0`)
- ⚪ **Low Priority**: Ranked `#4` (Score `< 70.0`)
