"""
Multi-Source Intelligent Prioritization & Ranking Engine

Ranks tasks, events, and emails on a 0-100 normalized score scale:
1. Normalized Score (0.0 to 100.0): Scores are capped at 100 for clean interpretation.
2. Strict Descending Score Order: Higher priority scores always rank #1, #2, #3, #4.
3. Multi-Source Equity: High-impact emails, critical tasks, and meetings compete equally.
4. Specificity Bonus: Technical/actionable titles outrank generic placeholders ("Team meet", "Sync").
"""

from typing import List, Dict, Any, Optional, Tuple
from pydantic import BaseModel

class RankedItem(BaseModel):
    id: str
    title: str
    item_type: str  # 'task' | 'event' | 'message'
    score: float
    reason: str
    due_date: Optional[str] = None
    source: str

class RuleBasedScorer:
    """Rule-based priority scoring engine bounded strictly from 0 to 100."""

    @staticmethod
    def _calculate_score(item: Dict[str, Any], item_type: str, target_date: str) -> Tuple[float, str]:
        score = 40.0
        reasons = []

        raw_title = item.get("title") or item.get("subject") or item.get("snippet") or ""
        title = raw_title.lower().strip()
        status = (item.get("status") or "").lower()
        snippet = (item.get("snippet") or item.get("body") or "").lower()
        sender = (item.get("sender") or "").lower()
        due_date_str = str(item.get("due_date") or item.get("start_time") or item.get("created_at") or "")
        item_date = due_date_str[:10] if len(due_date_str) >= 10 else ""

        # 1. Target Date Proximity (+25 points if due/scheduled/received today)
        if item_date == target_date:
            score += 25.0
            reasons.append("Today's item")
        elif item_type == "event" and item_date and item_date < target_date:
            score -= 30.0
            reasons.append("Past event penalty")
        elif due_date_str:
            score += 10.0
            reasons.append("Deadline set")

        # 2. Title Specificity vs Generic Placeholder Penalization
        generic_terms = ["team meet", "sync", "meeting", "discussion", "call", "catchup", "untitled"]
        is_generic = any(t == title or title.startswith(t) for t in generic_terms)
        
        if is_generic:
            score -= 15.0
            reasons.append("Generic title")
        else:
            score += 10.0
            reasons.append("Specific topic focus")

        # 3. High Urgency & Technical Action Keywords (+20 points)
        urgent_keywords = ["urgent", "high", "asap", "critical", "important", "blocker", "p0", "p1", "action required", "review", "bug", "fix", "nlp", "ai", "pipeline", "redesign", "auth"]
        if any(k in title for k in urgent_keywords) or any(k in status for k in urgent_keywords) or any(k in snippet for k in urgent_keywords):
            score += 20.0
            reasons.append("High urgency keyword")

        # 4. Item-Type Specific Multi-Source Rules
        if item_type == "message":
            is_flagged = item.get("flagged") or item.get("is_starred") or False
            if is_flagged:
                score += 20.0
                reasons.append("Flagged email")
            if any(k in sender for k in ["lead", "boss", "client", "manager", "director", "aditya", "aura"]):
                score += 15.0
                reasons.append("VIP sender email")

        elif item_type == "task":
            if status in ["in progress", "doing", "urgent", "high", "p0"]:
                score += 15.0
                reasons.append("Active urgent task")
            elif status in ["todo", "pending"]:
                score += 10.0
                reasons.append("Pending task")

        elif item_type == "event":
            if item_date == target_date:
                score += 10.0
                reasons.append("Scheduled meeting")

        # Cap score strictly between 0.0 and 100.0
        final_score = round(min(100.0, max(0.0, score)), 1)
        reason_str = ", ".join(reasons) if reasons else "Standard priority"
        return final_score, reason_str

def get_ranked_items(
    user_id: str,
    date: str,
    tasks: List[Dict[str, Any]],
    events: List[Dict[str, Any]],
    messages: Optional[List[Dict[str, Any]]] = None
) -> List[RankedItem]:
    """
    Ranks input tasks, events, and messages.
    Returns strictly sorted list of RankedItem objects (0-100 score, highest score first).
    """
    ranked: List[RankedItem] = []

    # 1. Score Tasks
    for t in tasks:
        score, reason = RuleBasedScorer._calculate_score(t, "task", date)
        ranked.append(RankedItem(
            id=str(t.get("id", "")),
            title=t.get("title", "Untitled Task"),
            item_type="task",
            score=score,
            reason=reason,
            due_date=t.get("due_date"),
            source=t.get("source", "notion")
        ))

    # 2. Score Events
    for e in events:
        score, reason = RuleBasedScorer._calculate_score(e, "event", date)
        ranked.append(RankedItem(
            id=str(e.get("id", "")),
            title=e.get("title", "Untitled Event"),
            item_type="event",
            score=score,
            reason=reason,
            due_date=e.get("start_time"),
            source=e.get("source", "google_calendar")
        ))

    # 3. Score Messages (Emails)
    for m in (messages or []):
        score, reason = RuleBasedScorer._calculate_score(m, "message", date)
        ranked.append(RankedItem(
            id=str(m.get("id", "")),
            title=m.get("subject") or m.get("snippet") or "Untitled Email",
            item_type="message",
            score=score,
            reason=reason,
            due_date=m.get("created_at"),
            source=m.get("source", "gmail")
        ))

    # STRICT Descending Sort by Score: Higher scores ALWAYS rank first
    ranked.sort(key=lambda x: x.score, reverse=True)
    return ranked
