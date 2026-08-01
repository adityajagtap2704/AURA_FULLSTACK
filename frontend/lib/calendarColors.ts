/**
 * Calendar colour palette — shared across all calendar views.
 * Tokens are designed for both light (#FDFBF8 bg) and dark (#0F0F0F bg) themes.
 */

export interface CalendarAccent {
  hex: string;
  lightBg: string;      // tinted card bg (light mode)
  lightText: string;    // text/icon colour (light mode)
  darkCardBg: string;   // card bg (dark mode)
  darkText: string;     // text colour (dark mode)
  label: string;        // colour name for debugging
}

export const ACCENT_PALETTE: CalendarAccent[] = [
  { hex: '#F97316', lightBg: '#FFF4EA', lightText: '#7C2D00', darkCardBg: '#201408', darkText: '#FDBA74', label: 'orange' },
  { hex: '#3B82F6', lightBg: '#EFF6FF', lightText: '#1E3A8A', darkCardBg: '#06101E', darkText: '#93C5FD', label: 'blue'   },
  { hex: '#10B981', lightBg: '#ECFDF5', lightText: '#064E3B', darkCardBg: '#041410', darkText: '#6EE7B7', label: 'green'  },
  { hex: '#8B5CF6', lightBg: '#F5F3FF', lightText: '#3B0764', darkCardBg: '#0E0A1C', darkText: '#C4B5FD', label: 'purple' },
  { hex: '#F59E0B', lightBg: '#FFFBEB', lightText: '#78350F', darkCardBg: '#1A1200', darkText: '#FDE68A', label: 'yellow' },
  { hex: '#EF4444', lightBg: '#FFF1F2', lightText: '#7F1D1D', darkCardBg: '#1A0606', darkText: '#FCA5A5', label: 'red'    },
  { hex: '#EC4899', lightBg: '#FDF2F8', lightText: '#701A75', darkCardBg: '#180610', darkText: '#F9A8D4', label: 'pink'   },
  { hex: '#06B6D4', lightBg: '#ECFEFF', lightText: '#164E63', darkCardBg: '#041418', darkText: '#67E8F9', label: 'cyan'   },
];

/** Map stored colour names → palette index */
const NAME_INDEX: Record<string, number> = {
  orange: 0, blue: 1, green: 2, purple: 3,
  yellow: 4, red: 5, pink: 6, grey: 7, cyan: 7,
};

/**
 * Returns a deterministic accent for an event.
 *
 * - If the event has a meaningful stored colour (not default orange),
 *   that colour is used.
 * - If the colour is the default 'orange' we derive a stable index
 *   from the event id/title so each unique event consistently gets
 *   its own distinct colour across renders.
 */
export function getEventAccent(
  eventId: string,
  title: string,
  storedColor?: string | null,
): CalendarAccent {
  // If Google assigned a real non-default colour, honour it
  if (storedColor && storedColor !== 'orange' && NAME_INDEX[storedColor] !== undefined) {
    return ACCENT_PALETTE[NAME_INDEX[storedColor]];
  }

  // Derive a stable index from the event id (preferred) or title
  const seed = eventId || title || 'default';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length];
}
