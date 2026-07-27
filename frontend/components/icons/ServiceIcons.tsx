// Faithful recreations of official brand marks (hand-built from known brand
// colors/shapes, not traced from Google's/Notion's actual asset files —
// I don't have direct access to those), shared between the auth pages and
// the dashboard chrome so there's one definition instead of duplicated
// inline SVGs per page.

export function AuraLogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="50" cy="50" r="44" />
      <line x1="15" y1="50" x2="85" y2="50" />
      <path d="M 20 60 Q 35 55 50 60 Q 65 65 80 60" />
      <path d="M 25 70 Q 37 67 50 70 Q 63 73 75 70" />
      <path d="M 30 80 Q 40 78 50 80 Q 60 82 70 80" />
      <circle cx="50" cy="35" r="12" fill="currentColor" fillOpacity="0.15" />
      <line x1="50" y1="12" x2="50" y2="18" />
      <line x1="28" y1="20" x2="33" y2="24" />
      <line x1="72" y1="20" x2="67" y2="24" />
      <line x1="20" y1="40" x2="26" y2="40" />
      <line x1="80" y1="40" x2="74" y2="40" />
    </svg>
  );
}

// Gmail's current mark — a four-color envelope built from Google's brand
// palette (red flap, blue/green/yellow body strokes).
export function GmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 36" className={className}>
      <path d="M4.5 4.5h39a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3h-39a3 3 0 0 1-3-3v-21a3 3 0 0 1 3-3z" fill="#FFFFFF" />
      <path d="M4.5 4.5h4.9L24 17 39.1 4.5H44a3 3 0 0 1 3 3v1.2L24 27 1.5 8.7V7.5a3 3 0 0 1 3-3z" fill="#EA4335" />
      <path d="M1.5 8.7V28.5a3 3 0 0 0 3 3h4V13.5z" fill="#4285F4" />
      <path d="M39.5 13.5v18h4a3 3 0 0 0 3-3V8.7z" fill="#34A853" />
      <path d="M8.5 13.5 24 25.5 39.5 13.5v18h-31z" fill="#FBBC05" />
    </svg>
  );
}

// Google Calendar's mark — colored corner tabs over a white body with the
// day number, matching the app icon's general composition.
export function GoogleCalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect x="2" y="4" width="20" height="18" rx="2.5" fill="#FFFFFF" stroke="#DADCE0" strokeWidth="0.5" />
      <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h6V9H2z" fill="#1A73E8" />
      <path d="M13.5 4h6A2.5 2.5 0 0 1 22 6.5V9h-8.5z" fill="#EA4335" />
      <path d="M2 9h8.5v6.5H2z" fill="#FBBC05" />
      <path d="M13.5 9H22v6.5h-8.5z" fill="#34A853" />
      <rect x="2" y="15.5" width="20" height="6.5" fill="#FFFFFF" />
      <text x="12" y="20.5" fill="#3C4043" fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="Arial, sans-serif">31</text>
    </svg>
  );
}

// Google Meet's mark — the four-color folded camera shape.
export function GoogleMeetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M2 8.5h9v8H4a2 2 0 0 1-2-2z" fill="#FFFFFF" stroke="#DADCE0" strokeWidth="0.5" />
      <path d="M11 8.5v3.2l4-2.4V7.5a1 1 0 0 0-1.5-.9z" fill="#00832D" />
      <path d="M11 16.5v-3.2l4 2.4v1.6a1 1 0 0 1-1.5.9z" fill="#0066DA" />
      <path d="M15 9.3v6.4l5.3 3.1a1 1 0 0 0 1.5-.9V7.1a1 1 0 0 0-1.5-.9z" fill="#E94235" />
      <path d="M2 8.5h5.5L11 6.2V8.5H2z" fill="#00AC47" />
      <path d="M2 16.5h5.5L11 18.8v-2.3H2z" fill="#FFBA00" />
    </svg>
  );
}

export function NotionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2.5 4v12h2.5V8.5L15 18h2.5V6H15v9.5L9 6H6.5z" />
    </svg>
  );
}

// Slack's mark — the four-color pinwheel of rounded bars.
export function SlackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M9 2.5a2 2 0 1 0 0 4h2v-2a2 2 0 0 0-2-2z" fill="#36C5F0" />
      <path d="M9 8.5H4a2 2 0 1 0 0 4h5a2 2 0 0 0 0-4z" fill="#36C5F0" />
      <path d="M21.5 9a2 2 0 1 0-4 0v2h2a2 2 0 0 0 2-2z" fill="#2EB67D" />
      <path d="M15.5 9V4a2 2 0 1 0-4 0v5a2 2 0 0 0 4 0z" fill="#2EB67D" />
      <path d="M15 21.5a2 2 0 1 0 0-4h-2v2a2 2 0 0 0 2 2z" fill="#ECB22E" />
      <path d="M15 15.5h5a2 2 0 1 0 0-4h-5a2 2 0 0 0 0 4z" fill="#ECB22E" />
      <path d="M2.5 15a2 2 0 1 0 4 0v-2h-2a2 2 0 0 0-2 2z" fill="#E01E5A" />
      <path d="M8.5 15v5a2 2 0 1 0 4 0v-5a2 2 0 0 0-4 0z" fill="#E01E5A" />
    </svg>
  );
}

// Microsoft 365's mark — the four-color window panes.
export function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
    </svg>
  );
}

// Linear's mark — four diagonal bars of increasing length.
export function LinearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#5E6AD2">
      <rect x="16.3" y="2.3" width="2.2" height="5.5" rx="1.1" transform="rotate(45 17.4 5)" />
      <rect x="12" y="1" width="2.2" height="11" rx="1.1" transform="rotate(45 13 6.5)" />
      <rect x="6.5" y="1" width="2.2" height="17.5" rx="1.1" transform="rotate(45 7.5 9.5)" />
      <rect x="1" y="4.5" width="2.2" height="18" rx="1.1" transform="rotate(45 2 13.5)" />
    </svg>
  );
}

// Dropbox's mark — the four-rhombi glyph folding into a box.
export function DropboxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#0061FF">
      <polygon points="6,3 12,7 6,11 0,7" />
      <polygon points="18,3 24,7 18,11 12,7" />
      <polygon points="6,12 12,16 6,20 0,16" />
      <polygon points="18,12 24,16 18,20 12,16" />
      <polygon points="12,17 18,13 12,9 6,13" />
    </svg>
  );
}
