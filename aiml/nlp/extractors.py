"""
Extractive Fact Extractor Module

Pulls verbatim facts (titles, times, senders, deadlines) straight from 
canonical-schema records via the data-access layer. Zero generation happens here.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ExtractedTask(BaseModel):
    id: str
    title: str
    status: Optional[str] = None
    due_date: Optional[str] = None
    source: str
    source_id: str

class ExtractedEvent(BaseModel):
    id: str
    title: str
    start_time: str
    end_time: Optional[str] = None
    attendees: List[Dict[str, Any]] = Field(default_factory=list)
    source: str
    source_id: str

class ExtractedMessage(BaseModel):
    id: str
    subject: Optional[str] = None
    sender: str
    snippet: str
    created_at: str
    source: str

class ExtractedDocument(BaseModel):
    id: str
    title: str
    content: Optional[str] = None
    source: str

class FactSet(BaseModel):
    user_id: str
    date: str
    tasks: List[ExtractedTask] = Field(default_factory=list)
    events: List[ExtractedEvent] = Field(default_factory=list)
    messages: List[ExtractedMessage] = Field(default_factory=list)
    documents: List[ExtractedDocument] = Field(default_factory=list)
    verbatim_titles: List[str] = Field(default_factory=list)
    verbatim_people: List[str] = Field(default_factory=list)

class FactExtractor:
    """Extracts immutable facts from raw canonical DB records."""
    
    @staticmethod
    def extract_facts(user_id: str, date: str, raw_data: Dict[str, List[Dict[str, Any]]]) -> FactSet:
        tasks = []
        verbatim_titles = []
        verbatim_people = []

        for item in raw_data.get("tasks", []):
            title = item.get("title", "").strip()
            if title:
                verbatim_titles.append(title)
            tasks.append(ExtractedTask(
                id=str(item.get("id", "")),
                title=title,
                status=item.get("status"),
                due_date=item.get("due_date"),
                source=item.get("source", "notion"),
                source_id=str(item.get("source_id", ""))
            ))

        events = []
        for item in raw_data.get("events", []):
            title = item.get("title", "").strip()
            if title:
                verbatim_titles.append(title)
            
            raw_attendees = item.get("attendees", [])
            parsed_attendees = []
            if isinstance(raw_attendees, list):
                for att in raw_attendees:
                    if isinstance(att, dict):
                        parsed_attendees.append(att)
                        if att.get("name"):
                            verbatim_people.append(att["name"])
                        if att.get("email"):
                            verbatim_people.append(att["email"])
                    elif isinstance(att, str):
                        parsed_attendees.append({"name": att, "email": att})
                        verbatim_people.append(att)
            
            events.append(ExtractedEvent(
                id=str(item.get("id", "")),
                title=title,
                start_time=item.get("start_time", ""),
                end_time=item.get("end_time"),
                attendees=parsed_attendees,
                source=item.get("source", "google_calendar"),
                source_id=str(item.get("source_id", ""))
            ))

        messages = []
        for item in raw_data.get("messages", []):
            sender = item.get("sender", "").strip()
            if sender:
                verbatim_people.append(sender)
            subject = item.get("subject", "").strip()
            if subject:
                verbatim_titles.append(subject)

            messages.append(ExtractedMessage(
                id=str(item.get("id", "")),
                subject=item.get("subject"),
                sender=sender or "Unknown",
                snippet=item.get("snippet", item.get("body", "")),
                created_at=item.get("created_at", ""),
                source=item.get("source", "gmail")
            ))

        documents = []
        for item in raw_data.get("documents", []):
            title = item.get("title", "").strip()
            if title:
                verbatim_titles.append(title)
            documents.append(ExtractedDocument(
                id=str(item.get("id", "")),
                title=title,
                content=item.get("content"),
                source=item.get("source", "notion")
            ))

        return FactSet(
            user_id=user_id,
            date=date,
            tasks=tasks,
            events=events,
            messages=messages,
            documents=documents,
            verbatim_titles=list(set(verbatim_titles)),
            verbatim_people=list(set(verbatim_people))
        )
