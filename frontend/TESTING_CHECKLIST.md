# Command Center - Testing Checklist

## 🧪 Pre-Launch Testing

### Installation
- [ ] Run `npm install` in frontend directory
- [ ] Verify no TypeScript errors with `npm run typecheck`
- [ ] Build succeeds with `npm run build`
- [ ] Dev server starts with `npm run dev`

### Basic Functionality
- [ ] Press Ctrl/Cmd + K opens command palette
- [ ] Command palette shows with smooth animation
- [ ] Search input is auto-focused
- [ ] Typing filters commands in real-time
- [ ] Arrow Up/Down navigates commands
- [ ] Enter executes selected command
- [ ] Esc closes the palette
- [ ] Click outside closes the palette
- [ ] Recent commands show when no query

### Search & Filtering
- [ ] "task" finds "Go to Tasks", "Create Task", "Search Tasks"
- [ ] "sync" finds all sync commands
- [ ] "ai" finds AI commands
- [ ] "theme" finds "Toggle Theme"
- [ ] Fuzzy search works: "cre ta" finds "Create Task"
- [ ] Search is case-insensitive
- [ ] Empty search shows recent commands

### Navigation Commands
- [ ] "Go to Dashboard" navigates to /dashboard
- [ ] "Go to Tasks" navigates to /dashboard/tasks
- [ ] "Go to Calendar" navigates to /dashboard/calendar
- [ ] "Go to Messages" navigates to /dashboard/gmail
- [ ] "Go to Documents" navigates to /dashboard/documents
- [ ] "Go to AI Assistant" navigates to /dashboard/ai-assistant
- [ ] "Go to AI Digest" navigates to /dashboard/ai-digest
- [ ] "Go to Integrations" navigates to /dashboard/integrations
- [ ] "Go to Settings" navigates to /dashboard/settings

### Create Commands
- [ ] "Create Task" opens Notion in new tab
- [ ] "Create Calendar Event" opens Google Calendar in new tab
- [ ] "Create Note" opens Notion in new tab
- [ ] "Compose Email" opens Gmail compose in new tab

### Search Commands
- [ ] "Search Everything" focuses global search
- [ ] "Search Gmail" navigates to Gmail and focuses search
- [ ] "Search Calendar" navigates to Calendar
- [ ] "Search Tasks" navigates to Tasks and focuses search
- [ ] "Search Documents" navigates to Documents

### AI Commands
- [ ] "Ask AURA" navigates to AI Assistant
- [ ] "Daily AI Digest" navigates to AI Digest
- [ ] Other AI commands show proper feedback

### Action Commands
- [ ] "Sync All" triggers sync API call
- [ ] "Sync Google" triggers Google sync
- [ ] "Sync Notion" triggers Notion sync
- [ ] "Toggle Theme" switches between light/dark
- [ ] "Keyboard Shortcuts" opens shortcuts modal
- [ ] "Report Bug" opens bug report modal
- [ ] "Contact Support" opens support modal
- [ ] "About AURA" opens about modal
- [ ] "Manage Integrations" navigates to integrations

### Context-Aware (Gmail Page)
- [ ] Open command palette on /dashboard/gmail
- [ ] Shows Gmail-specific commands at top
- [ ] "Compose Email" appears
- [ ] "Search Gmail" appears
- [ ] "Create Task from Email" appears
- [ ] "Create Event from Email" appears
- [ ] "Summarize Email" appears

### Context-Aware (Calendar Page)
- [ ] Open command palette on /dashboard/calendar
- [ ] Shows Calendar-specific commands
- [ ] "Create Event" appears
- [ ] "Search Events" appears
- [ ] "Today's Events" appears
- [ ] "Create Task from Event" appears
- [ ] "Join Next Meeting" appears

### Context-Aware (Tasks Page)
- [ ] Open command palette on /dashboard/tasks
- [ ] Shows Tasks-specific commands
- [ ] "Create Task" appears
- [ ] "Search Tasks" appears
- [ ] "Complete Task" appears
- [ ] "Prioritize Tasks" appears
- [ ] "Kanban View" appears
- [ ] "List View" appears

### UI & Design
- [ ] Command palette is centered on screen
- [ ] Width is appropriate (max-w-2xl)
- [ ] Icons render correctly
- [ ] Category headers are visible
- [ ] Command descriptions are readable
- [ ] Keyboard hints (kbd badges) show
- [ ] Footer with navigation tips shows
- [ ] Selected command is highlighted
- [ ] Hover effects work smoothly
- [ ] No visual glitches or overlaps

### Dark Mode
- [ ] Toggle to dark mode
- [ ] Command palette adapts to dark theme
- [ ] Text is readable in dark mode
- [ ] Icons are visible in dark mode
- [ ] Hover states work in dark mode
- [ ] Border colors are appropriate
- [ ] Background has correct opacity

### Light Mode
- [ ] Toggle to light mode
- [ ] Command palette adapts to light theme
- [ ] Text is readable in light mode
- [ ] Icons are visible in light mode
- [ ] Hover states work in light mode
- [ ] Border colors are appropriate

### Animations
- [ ] Open animation is smooth (200ms)
- [ ] Close animation is smooth (200ms)
- [ ] Fade in/out is smooth
- [ ] Scale animation works
- [ ] No janky animations
- [ ] Runs at 60fps

### Keyboard Navigation
- [ ] Down arrow moves to next command
- [ ] Up arrow moves to previous command
- [ ] Wraps around at top/bottom
- [ ] Selection stays visible (scroll follows)
- [ ] Enter executes selected command
- [ ] Esc closes palette

### Recent Commands
- [ ] Execute a command
- [ ] Re-open palette with no query
- [ ] Recent command appears
- [ ] Execute 5+ commands
- [ ] Only last 5 show in recent
- [ ] Recent commands persist after page reload

### Edge Cases
- [ ] Command palette works after route change
- [ ] Works in mobile view (responsive)
- [ ] Doesn't conflict with G+key shortcuts
- [ ] Doesn't conflict with existing Ctrl+K search
- [ ] localStorage failure is handled gracefully
- [ ] Works without internet (for local commands)
- [ ] Works when APIs are slow/down

### Modal Integration
- [ ] Command palette opens "Keyboard Shortcuts" modal
- [ ] Command palette opens "Report Bug" modal
- [ ] Command palette opens "Contact Support" modal
- [ ] Command palette opens "About AURA" modal
- [ ] Command palette closes when modal opens
- [ ] Modals close properly after opening from palette

### Event System
- [ ] Theme toggle event works
- [ ] Modal open events work
- [ ] No duplicate event listeners
- [ ] Event listeners are cleaned up
- [ ] No memory leaks

### Performance
- [ ] Command palette opens instantly
- [ ] Search is responsive (no lag)
- [ ] No frame drops during navigation
- [ ] Memory usage is reasonable
- [ ] No console errors/warnings

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on Windows
- [ ] Works on macOS
- [ ] Works on Linux (if applicable)

### Mobile/Tablet
- [ ] Command palette is responsive
- [ ] Touch tap works for selection
- [ ] Virtual keyboard doesn't break layout
- [ ] Backdrop closes palette on tap
- [ ] Footer hints are readable

### Accessibility
- [ ] Search input has focus indicator
- [ ] Commands have hover states
- [ ] Selected command is clearly visible
- [ ] Keyboard navigation works fully
- [ ] Screen reader compatible (basic)
- [ ] Color contrast is sufficient

### Documentation
- [ ] COMMAND_CENTER.md is complete
- [ ] COMMAND_CENTER_QUICKSTART.md is helpful
- [ ] IMPLEMENTATION_SUMMARY.md is accurate
- [ ] Code comments are clear
- [ ] Examples work as written

### Integration
- [ ] Doesn't break existing AURA features
- [ ] Gmail page still works
- [ ] Calendar page still works
- [ ] Tasks page still works
- [ ] AI pages still work
- [ ] Settings page still work
- [ ] Existing shortcuts still work

## 🚨 Critical Issues (Must Fix)
[ ] List any blocking issues here

## ⚠️ Medium Priority (Should Fix)
[ ] List any non-blocking issues here

## 💡 Nice to Have (Future)
[ ] List any enhancement ideas here

## ✅ Sign-Off

- [ ] All critical tests pass
- [ ] No console errors in production build
- [ ] Performance is acceptable
- [ ] Documentation is complete
- [ ] Code is clean and maintainable

**Tested by:** _______________  
**Date:** _______________  
**Status:** ⬜ Pass | ⬜ Fail | ⬜ Needs Work

## 📝 Notes

```
Add any testing notes, observations, or feedback here.
```
