# Frontend API Contract: GET `/api/digest/today`

Response JSON matching `DigestResponse` model:
- `summary_text`: string
- `top_priorities`: array of `PriorityItem`
- `meeting_prep_notes`: array of `MeetingPrepNote`
- `metadata`: object
