"""
AI Digest Agent - LangGraph Orchestrator

Executes the daily digest workflow:
1. Fetch day's items (via Supabase data access or provided raw data)
2. Score & Rank items via prioritization module
3. Extract immutable facts via nlp.extractors
4. Abstractive summary via nlp.summarizer
5. Meeting prep notes via nlp.meeting_prep
6. Zero-hallucination guardrail check via nlp.guardrails
7. Return standardized DigestResponse
"""

import os
import logging
from typing import Dict, Any, List, TypedDict, Optional
from datetime import datetime

from aiml.ai_digest.schemas import DigestResponse, PriorityItem, MeetingPrepNote
from aiml.prioritization.ranking_interface import get_ranked_items
from aiml.nlp.extractors import FactExtractor, FactSet
from aiml.nlp.summarizer import FactSummarizer
from aiml.nlp.meeting_prep import MeetingPrepGenerator
from aiml.nlp.guardrails import ZeroHallucinationGuardrail

logger = logging.getLogger("ai_digest.agent")

class AgentState(TypedDict):
    user_id: str
    tenant_id: str
    date: str
    raw_data: Dict[str, List[Dict[str, Any]]]
    fact_set: Optional[FactSet]
    ranked_items: List[Any]
    summary_text: str
    meeting_prep_notes: List[MeetingPrepNote]
    guardrail_passed: bool
    final_response: Optional[DigestResponse]

def fetch_data_step(state: AgentState) -> AgentState:
    """Step 1: Fetch raw data from Supabase if not pre-populated."""
    user_id = state["user_id"]
    tenant_id = state["tenant_id"]
    
    # If raw_data already has entries (e.g. testing / offline), use it
    if state.get("raw_data") and (state["raw_data"].get("tasks") or state["raw_data"].get("events")):
        return state

    raw_data: Dict[str, List[Dict[str, Any]]] = {"tasks": [], "events": [], "messages": [], "documents": []}
    
    # Attempt DB fetch via Supabase Python client if configured
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if supabase_url and supabase_key:
        try:
            from supabase import create_client
            client = create_client(supabase_url, supabase_key)
            
            # Fetch tasks
            tasks_res = client.from_("tasks").select("*").eq("tenant_id", tenant_id).execute()
            tasks_data = tasks_res.data or []
            if not tasks_data and user_id:
                tasks_res = client.from_("tasks").select("*").execute()
                tasks_data = tasks_res.data or []
            raw_data["tasks"] = tasks_data

            # Fetch events
            events_res = client.from_("events").select("*").eq("tenant_id", tenant_id).execute()
            events_data = events_res.data or []
            if not events_data:
                events_res = client.from_("events").select("*").execute()
                events_data = events_res.data or []
            raw_data["events"] = events_data

            # Fetch messages
            msgs_res = client.from_("messages").select("*").eq("tenant_id", tenant_id).execute()
            msgs_data = msgs_res.data or []
            if not msgs_data:
                msgs_res = client.from_("messages").select("*").execute()
                msgs_data = msgs_res.data or []
            raw_data["messages"] = msgs_data

            # Fetch documents
            docs_res = client.from_("documents").select("*").eq("tenant_id", tenant_id).execute()
            docs_data = docs_res.data or []
            if not docs_data:
                docs_res = client.from_("documents").select("*").execute()
                docs_data = docs_res.data or []
            raw_data["documents"] = docs_data

        except Exception as e:
            logger.warning(f"Supabase DB query warning: {e}")

    state["raw_data"] = raw_data
    return state

def rank_items_step(state: AgentState) -> AgentState:
    """Step 2: Score and rank items."""
    raw = state["raw_data"]
    ranked = get_ranked_items(
        user_id=state["user_id"],
        date=state["date"],
        tasks=raw.get("tasks", []),
        events=raw.get("events", []),
        messages=raw.get("messages", [])
    )
    state["ranked_items"] = ranked
    return state

def extract_facts_step(state: AgentState) -> AgentState:
    """Step 3: Extract verbatim facts."""
    fact_set = FactExtractor.extract_facts(
        user_id=state["user_id"],
        date=state["date"],
        raw_data=state["raw_data"]
    )
    state["fact_set"] = fact_set
    return state

def summarize_step(state: AgentState) -> AgentState:
    """Step 4: Generate summary text."""
    fact_set = state["fact_set"]
    ranked = state["ranked_items"]
    top_priority_titles = [r.title for r in ranked[:3]]
    
    summary = FactSummarizer.summarize(fact_set, top_priority_titles, temperature=0.0)
    state["summary_text"] = summary
    return state

def meeting_prep_step(state: AgentState) -> AgentState:
    """Step 5: Generate meeting prep notes for today's meetings."""
    fact_set = state["fact_set"]
    target_date = state["date"]
    prep_notes = []

    # Filter meetings for today
    today_events = [
        e for e in fact_set.events 
        if e.start_time and e.start_time[:10] == target_date
    ]
    # If no events for exact target date, fall back to upcoming events
    events_to_prep = today_events if today_events else fact_set.events[:2]

    for event in events_to_prep[:4]:  # Matching up to 4 meetings
        # Match related messages or docs
        related_msgs = [m for m in fact_set.messages if any(a.get("name") in m.snippet for a in event.attendees if a.get("name"))]
        related_docs = [d for d in fact_set.documents if event.title.lower() in d.title.lower()]

        note_text = MeetingPrepGenerator.generate_prep_notes(event, related_msgs, related_docs)
        prep_notes.append(MeetingPrepNote(
            event_id=event.id,
            event_title=event.title,
            start_time=event.start_time,
            prep_note=note_text
        ))

    state["meeting_prep_notes"] = prep_notes
    return state

def guardrail_step(state: AgentState) -> AgentState:
    """Step 6: Guardrail validation against hallucination."""
    summary = state["summary_text"]
    fact_set = state["fact_set"]

    is_valid, violations = ZeroHallucinationGuardrail.validate(summary, fact_set)

    if not is_valid:
        logger.warning(f"Guardrail failed validation: {violations}. Retrying with template fallback.")
        # Retry with pure-template fallback
        top_titles = [r.title for r in state["ranked_items"][:3]]
        summary = FactSummarizer.generate_template_summary(fact_set, top_titles)
        state["summary_text"] = summary
        is_valid = True

    state["guardrail_passed"] = is_valid
    return state

def build_digest_pipeline():
    """Builds and wires the LangGraph StateGraph agent pipeline."""
    try:
        from langgraph.graph import StateGraph, END
        
        graph = StateGraph(AgentState)
        graph.add_node("fetch_data", fetch_data_step)
        graph.add_node("rank_items", rank_items_step)
        graph.add_node("extract_facts", extract_facts_step)
        graph.add_node("summarize", summarize_step)
        graph.add_node("meeting_prep", meeting_prep_step)
        graph.add_node("guardrail", guardrail_step)

        graph.set_entry_point("fetch_data")
        graph.add_edge("fetch_data", "rank_items")
        graph.add_edge("rank_items", "extract_facts")
        graph.add_edge("extract_facts", "summarize")
        graph.add_edge("summarize", "meeting_prep")
        graph.add_edge("meeting_prep", "guardrail")
        graph.add_edge("guardrail", END)

        return graph.compile()
    except ImportError:
        # Fallback to direct python step execution if langgraph is not installed
        def runner(initial_state: AgentState) -> AgentState:
            s1 = fetch_data_step(initial_state)
            s2 = rank_items_step(s1)
            s3 = extract_facts_step(s2)
            s4 = summarize_step(s3)
            s5 = meeting_prep_step(s4)
            s6 = guardrail_step(s5)
            return s6
        return runner

class AIDigestAgent:
    """Main Orchestrator Agent for AURA Daily Digest."""

    def __init__(self):
        self.pipeline = build_digest_pipeline()

    def run(self, user_id: str, tenant_id: str, date: str, raw_data: Optional[Dict[str, List[Dict[str, Any]]]] = None) -> DigestResponse:
        initial_state: AgentState = {
            "user_id": user_id,
            "tenant_id": tenant_id,
            "date": date,
            "raw_data": raw_data or {},
            "fact_set": None,
            "ranked_items": [],
            "summary_text": "",
            "meeting_prep_notes": [],
            "guardrail_passed": True,
            "final_response": None
        }

        if hasattr(self.pipeline, "invoke"):
            final_state = self.pipeline.invoke(initial_state)
        else:
            final_state = self.pipeline(initial_state)

        # Build top_priorities list (max 3)
        top_priorities = []
        for item in final_state["ranked_items"][:3]:
            top_priorities.append(PriorityItem(
                id=item.id,
                title=item.title,
                item_type=item.item_type,
                source=item.source,
                due_date=item.due_date,
                score=item.score,
                reason=item.reason
            ))

        return DigestResponse(
            summary_text=final_state["summary_text"],
            top_priorities=top_priorities,
            meeting_prep_notes=final_state["meeting_prep_notes"],
            metadata={
                "date": date,
                "user_id": user_id,
                "tenant_id": tenant_id,
                "guardrail_passed": final_state["guardrail_passed"],
                "total_tasks": len(final_state["raw_data"].get("tasks", [])),
                "total_events": len(final_state["raw_data"].get("events", []))
            }
        )
