"""
Abstractive Summarizer Module

Given extracted facts, produces 1-2 fluent sentences using low-temperature / 
deterministic LLM decoding (Gemini API or Groq API). Fallbacks to template-based
generation if no LLM key is configured.
"""

import os
import logging
from typing import List, Dict, Any, Optional
from aiml.nlp.extractors import FactSet
from aiml.nlp.prompts.digest_prompt import DIGEST_SYSTEM_PROMPT, DIGEST_USER_PROMPT_TEMPLATE

logger = logging.getLogger("nlp.summarizer")

class FactSummarizer:
    """Produces 1-2 sentence abstractive summary based on extracted facts."""

    @staticmethod
    def _call_gemini_api(system_instruction: str, prompt: str, temperature: float = 0.0) -> Optional[str]:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return None
        
        try:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=temperature,
                    max_output_tokens=150
                )
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            logger.warning(f"Gemini API call failed: {e}")
        return None

    @staticmethod
    def _call_groq_api(system_instruction: str, prompt: str, temperature: float = 0.0) -> Optional[str]:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            return None
        
        try:
            from groq import Groq
            client = Groq(api_key=api_key)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                max_tokens=150
            )
            if completion and completion.choices:
                return completion.choices[0].message.content.strip()
        except Exception as e:
            logger.warning(f"Groq API call failed: {e}")
        return None

    @staticmethod
    def generate_template_summary(fact_set: FactSet, top_priority_titles: List[str]) -> str:
        """Deterministic summary with clear daily focus and motivational closing."""
        task_count = len(fact_set.tasks)
        event_count = len(fact_set.events)
        msg_count = len(fact_set.messages)

        if task_count == 0 and event_count == 0 and msg_count == 0:
            return "Your schedule is clear today with no pending tasks or meetings. Take this opportunity to focus on long-term strategic goals!"

        summary_parts = []
        if top_priority_titles:
            p_str = f"'{top_priority_titles[0]}'" if len(top_priority_titles) == 1 else f"'{top_priority_titles[0]}' and '{top_priority_titles[1]}'"
            summary_parts.append(f"Your top priority for today is {p_str}.")

        counts = []
        if task_count > 0:
            counts.append(f"{task_count} pending task{'s' if task_count != 1 else ''}")
        if event_count > 0:
            counts.append(f"{event_count} scheduled meeting{'s' if event_count != 1 else ''}")
        if msg_count > 0:
            counts.append(f"{msg_count} message update{'s' if msg_count != 1 else ''}")

        if counts:
            summary_parts.append(f"Overall, you have {', '.join(counts)} needing your attention.")

        summary_parts.append("Stay focused, tackle high-impact items first, and make today great!")
        return " ".join(summary_parts)

    @classmethod
    def summarize(cls, fact_set: FactSet, top_priority_titles: List[str], temperature: float = 0.0) -> str:
        """Generates summary using available LLM or deterministic fallback."""
        tasks_text = "\n".join([f"- {t.title} (Due: {t.due_date or 'Today'})" for t in fact_set.tasks[:5]]) or "None"
        events_text = "\n".join([f"- {e.title} at {e.start_time}" for e in fact_set.events[:5]]) or "None"
        messages_text = "\n".join([f"- From {m.sender}: {m.subject or m.snippet[:40]}" for m in fact_set.messages[:3]]) or "None"

        user_prompt = DIGEST_USER_PROMPT_TEMPLATE.format(
            date=fact_set.date,
            tasks_summary=tasks_text,
            events_summary=events_text,
            messages_summary=messages_text
        )

        # Attempt Gemini -> Groq -> Pure Template
        llm_response = cls._call_gemini_api(DIGEST_SYSTEM_PROMPT, user_prompt, temperature=temperature)
        if not llm_response:
            llm_response = cls._call_groq_api(DIGEST_SYSTEM_PROMPT, user_prompt, temperature=temperature)

        if llm_response:
            return llm_response

        # Fallback to pure template
        return cls.generate_template_summary(fact_set, top_priority_titles)
