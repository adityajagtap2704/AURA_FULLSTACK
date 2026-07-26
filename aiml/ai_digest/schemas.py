"""
AI Digest Schemas - Frontend Response Contract
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PriorityItem(BaseModel):
    id: str = Field(description="Unique ID of the item")
    title: str = Field(description="Title of the task or event")
    item_type: str = Field(description="type: task | event | message")
    source: str = Field(description="source: notion | google_calendar | gmail")
    due_date: Optional[str] = Field(default=None, description="ISO timestamp or due date")
    score: float = Field(default=0.0, description="Priority score calculated by ranking engine")
    reason: str = Field(default="", description="Reason for priority assignment")

class MeetingPrepNote(BaseModel):
    event_id: str = Field(description="Event ID this prep note belongs to")
    event_title: str = Field(description="Meeting title")
    start_time: str = Field(description="Meeting start time")
    prep_note: str = Field(description="Bulleted prep notes for the meeting")

class DigestResponse(BaseModel):
    summary_text: str = Field(description="1-2 sentence executive overview of the day")
    top_priorities: List[PriorityItem] = Field(default_factory=list, description="Top ranked priority items (max 3)")
    meeting_prep_notes: List[MeetingPrepNote] = Field(default_factory=list, description="Meeting preparation notes")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Execution metadata (date, total items, pass status)")
