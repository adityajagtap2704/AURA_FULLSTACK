"""
Meeting Prep Notes Generator Module

Given an Event and related Messages/Documents from canonical schema, 
produces rich, intelligent, actionable prep notes.
"""

from typing import List, Dict, Any
from aiml.nlp.extractors import ExtractedEvent, ExtractedMessage, ExtractedDocument
from aiml.nlp.prompts.meeting_prep_prompt import MEETING_PREP_SYSTEM_PROMPT, MEETING_PREP_USER_TEMPLATE
from aiml.nlp.summarizer import FactSummarizer

class MeetingPrepGenerator:
    """Generates query-focused preparation notes for scheduled meetings."""

    @classmethod
    def generate_prep_notes(
        cls,
        event: ExtractedEvent,
        related_messages: List[ExtractedMessage],
        related_docs: List[ExtractedDocument],
        temperature: float = 0.0
    ) -> str:
        attendees_str = ", ".join([a.get("name") or a.get("email") or "" for a in event.attendees if isinstance(a, dict)]) or "Team members"
        msgs_str = "\n".join([f"- {m.sender}: {m.subject or m.snippet}" for m in related_messages]) or "No related messages found."
        docs_str = "\n".join([f"- {d.title}: {d.content or ''}" for d in related_docs]) or "No related documents found."

        user_prompt = MEETING_PREP_USER_TEMPLATE.format(
            event_title=event.title,
            start_time=event.start_time,
            attendees=attendees_str,
            related_messages=msgs_str,
            related_docs=docs_str
        )

        llm_response = FactSummarizer._call_gemini_api(MEETING_PREP_SYSTEM_PROMPT, user_prompt, temperature=temperature)
        if not llm_response:
            llm_response = FactSummarizer._call_groq_api(MEETING_PREP_SYSTEM_PROMPT, user_prompt, temperature=temperature)

        if llm_response:
            return llm_response

        # Rich, event-specific dynamic prep notes fallback
        prep_points = []

        # 1. Attendees & meeting goal
        if attendees_str and attendees_str != "Team members":
            prep_points.append(f"Meeting with {attendees_str} for '{event.title}'.")
        else:
            prep_points.append(f"Session focus: '{event.title}'.")

        # 2. Email context or document context or title-specific agenda
        if related_messages:
            top_msg = related_messages[0]
            prep_points.append(f"Recent context from {top_msg.sender}: '{top_msg.subject or top_msg.snippet[:50]}'.")
        elif related_docs:
            prep_points.append(f"Reference doc: '{related_docs[0].title}'.")
        else:
            title_lower = event.title.lower()
            if "nlp" in title_lower or "ai" in title_lower:
                prep_points.append("Review AI/NLP module metrics, evaluation accuracy, and pipeline endpoints.")
            elif "sync" in title_lower or "sprint" in title_lower or "standup" in title_lower:
                prep_points.append("Prepare updates on completed tasks, current blockers, and today's deliverables.")
            elif "redesign" in title_lower or "ui" in title_lower:
                prep_points.append("Review design mockups, component states, and responsive layout guidelines.")
            else:
                prep_points.append("Review meeting objectives, key discussion questions, and actionable next steps.")

        return " ".join(prep_points)
