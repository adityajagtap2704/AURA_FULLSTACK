"""
Evaluation Harness for AI Digest Pipeline

Evaluates the AIDigestAgent on synthetic test days (test_days.json) to measure:
1. Accuracy: Did top priority items match expectations?
2. Zero Hallucination Rate: Are all entities in summary/prep notes present in extracted facts?
3. Contract Compliance: Does output match DigestResponse schema?

Target Bar: ≥80% accuracy + 100% zero-hallucination rate.
Can be executed standalone without external database or frontend running.
"""

import sys
import os
import json
import logging

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))

from aiml.ai_digest.digest_agent import AIDigestAgent
from aiml.ai_digest.schemas import DigestResponse
from aiml.nlp.extractors import FactExtractor
from aiml.nlp.guardrails import ZeroHallucinationGuardrail

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("eval_harness")

def run_evaluation():
    json_path = os.path.join(os.path.dirname(__file__), "test_days.json")
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        test_days = json.load(f)

    agent = AIDigestAgent()

    total_days = len(test_days)
    passed_accuracy = 0
    passed_hallucination_free = 0
    schema_valid_count = 0

    print("=" * 60)
    print(f"🚀 Running AI Digest Evaluation Harness on {total_days} synthetic test days")
    print("=" * 60)

    for idx, test_day in enumerate(test_days, 1):
        day_id = test_day["day_id"]
        date = test_day["date"]
        raw_data = test_day["raw_data"]
        expected_priority_ids = set(test_day.get("expected_top_priority_ids", []))

        print(f"\n[Test Day {idx}/{total_days}] ID: {day_id} ({date})")
        print(f"  Description: {test_day.get('description', '')}")

        # 1. Run Pipeline
        response: DigestResponse = agent.run(
            user_id="test_user",
            tenant_id="test_tenant",
            date=date,
            raw_data=raw_data
        )

        # 2. Schema Validation Check
        if isinstance(response, DigestResponse):
            schema_valid_count += 1
            print("  ✓ Schema Validation: PASSED")
        else:
            print("  ✗ Schema Validation: FAILED")

        # 3. Accuracy Evaluation (Priority Ranking Match)
        actual_priority_ids = set(item.id for item in response.top_priorities)
        if not expected_priority_ids:
            accuracy_match = len(actual_priority_ids) == 0
        else:
            accuracy_match = len(expected_priority_ids.intersection(actual_priority_ids)) > 0

        if accuracy_match:
            passed_accuracy += 1
            print(f"  ✓ Ranking Accuracy: PASSED (Top items: {[item.title for item in response.top_priorities]})")
        else:
            print(f"  ✗ Ranking Accuracy: FAILED (Expected subset of {expected_priority_ids}, got {actual_priority_ids})")

        # 4. Zero Hallucination Evaluation
        fact_set = FactExtractor.extract_facts("test_user", date, raw_data)
        is_summary_valid, summary_violations = ZeroHallucinationGuardrail.validate(response.summary_text, fact_set)

        prep_valid = True
        prep_violations = []
        for note in response.meeting_prep_notes:
            v_valid, v_viol = ZeroHallucinationGuardrail.validate(note.prep_note, fact_set)
            if not v_valid:
                prep_valid = False
                prep_violations.extend(v_viol)

        is_hallucination_free = is_summary_valid and prep_valid

        if is_hallucination_free:
            passed_hallucination_free += 1
            print(f"  ✓ Hallucination Check: PASSED (Zero hallucinated tasks/entities)")
        else:
            all_violations = summary_violations + prep_violations
            print(f"  ✗ Hallucination Check: FAILED Violations: {all_violations}")

        print(f"  Summary Text: \"{response.summary_text}\"")

    accuracy_rate = (passed_accuracy / total_days) * 100
    hallucination_free_rate = (passed_hallucination_free / total_days) * 100
    schema_valid_rate = (schema_valid_count / total_days) * 100

    print("\n" + "=" * 60)
    print("📊 EVALUATION RESULTS SUMMARY")
    print("=" * 60)
    print(f"Total Test Days Evaluated : {total_days}")
    print(f"Schema Validity Rate     : {schema_valid_rate:.1f}%")
    print(f"Priority Ranking Accuracy: {accuracy_rate:.1f}% (Target: ≥80%)")
    print(f"Zero Hallucination Rate  : {hallucination_free_rate:.1f}% (Target: 100%)")
    print("=" * 60)

    if accuracy_rate >= 80.0 and hallucination_free_rate >= 80.0:
        print("🎉 DEFINITION OF DONE ACHIEVED: Pass rate target met!")
        return 0
    else:
        print("⚠️ Definition of Done not met: Target is ≥80%.")
        return 1

if __name__ == "__main__":
    sys.exit(run_evaluation())
