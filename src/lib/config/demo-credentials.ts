/**
 * Demo-mode configuration — single source of truth for the Phase 1 demo user.
 *
 * Production switch: set AURA_DEMO_MODE=false (or unset it) and every route
 * requires a real Supabase session. See docs/PRODUCTION_SWITCH.md.
 */

export const DEMO_USER_ID = process.env.DEMO_USER_ID || '00000000-0000-0000-0000-000000000001';

export const DEMO_MODE_ENABLED = process.env.AURA_DEMO_MODE === 'true';
