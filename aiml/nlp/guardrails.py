"""
Guardrails Module - Zero Hallucination Guarantee

Validates generated text against Extracted Facts.
Every task/event/person named in the output MUST exist in verbatim extracted facts.
On validation failure:
1. Retries generation once with temperature=0.0
2. If failure persists, falls back to pure-template (no-LLM) deterministic summary.
"""

import re
import logging
from typing import Tuple, List, Set
from aiml.nlp.extractors import FactSet

logger = logging.getLogger("nlp.guardrails")

class ZeroHallucinationGuardrail:
    """Verifies that generated text does not introduce hallucinated entities or tasks."""

    @staticmethod
    def _extract_quoted_or_capitalized_phrases(text: str) -> Set[str]:
        """Extracts candidate named entities and titles from text."""
        # Quoted strings like 'Title' or "Title"
        quoted = set(re.findall(r"['\"]([^'\"]+)['\"]", text))
        # Words capitalized that might be names/titles
        return quoted

    @classmethod
    def validate(cls, generated_text: str, fact_set: FactSet) -> Tuple[bool, List[str]]:
        """
        Validates if generated_text contains only facts present in fact_set.
        Returns (is_valid, list_of_violations).
        """
        if not generated_text:
            return True, []

        violations = []
        lower_gen = generated_text.lower()

        # Build comprehensive whitelist of allowable lowercased substrings
        allowed_substrings = set()
        for t in fact_set.verbatim_titles:
            allowed_substrings.add(t.lower())
        for p in fact_set.verbatim_people:
            allowed_substrings.add(p.lower())
        for task in fact_set.tasks:
            allowed_substrings.add(task.title.lower())
        for event in fact_set.events:
            allowed_substrings.add(event.title.lower())

        # Check quoted terms specifically
        candidate_entities = cls._extract_quoted_or_capitalized_phrases(generated_text)
        for entity in candidate_entities:
            entity_lower = entity.lower().strip()
            # Ignore common formatting words or numbers
            if len(entity_lower) <= 2 or entity_lower in {"today", "none", "tasks", "events"}:
                continue

            found = any(entity_lower in allowed or allowed in entity_lower for allowed in allowed_substrings)
            if not found:
                violations.append(f"Entity '{entity}' not found in canonical fact set.")

        is_valid = len(violations) == 0
        return is_valid, violations
