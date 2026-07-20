'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useDashboard } from '@/hooks/useDashboard';
import { authService } from '@/services/auth';
import { AuraLogoIcon, GmailIcon, GoogleCalendarIcon, GoogleMeetIcon, NotionIcon } from '@/components/icons/ServiceIcons';
import { getDisplayName, getAvatarUrl } from '@/lib/userDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardShortcutsModal from '@/components/help/KeyboardShortcutsModal';
import ReportBugModal from '@/components/help/ReportBugModal';
import ContactSupportModal from '@/components/help/ContactSupportModal';
import AboutAuraModal from '@/components/help/AboutAuraModal';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Mail,
  FileText,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Search,
  ChevronDown,
  Bell,
  HelpCircle,
  Shield,
  CheckCircle2,
  ExternalLink,
  Keyboard,
  Bug,
  Mail as MailIcon,
  Info
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Today', icon: LayoutDashboard },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/gmail', label: 'Messages', icon: Mail },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
 const { connectorStatus, data } = useDashboard();
  const router = useRouter();

  const finalNavItems = [
    ...navItems,
    ...(role === 'ADMIN' ? [{ href: '/dashboard/admin', label: 'Admin Panel', icon: Shield }] : [])
  ];
  const pathname = usePathname();
const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
const [helpOpen, setHelpOpen] = useState(false);

const [shortcutsOpen, setShortcutsOpen] = useState(false);
const [aboutOpen, setAboutOpen] = useState(false);
const [reportBugOpen, setReportBugOpen] = useState(false);
const [helpCenterOpen, setHelpCenterOpen] = useState(false);
const [contactSupportOpen, setContactSupportOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
  let waitingForG = false;

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl + K → Focus Search
    if (e.ctrlKey && e.key.toLowerCase() === "k") {
      e.preventDefault();

      const input = document.querySelector(
        'input[placeholder="Search across your tools, tasks, messages..."]'
      ) as HTMLInputElement | null;

      input?.focus();
      return;
    }

    // Ctrl + / → Open Keyboard Shortcuts
    if (e.ctrlKey && e.key === "/") {
      e.preventDefault();
      setShortcutsOpen(true);
      return;
    }

    // Esc → Close all popups
    if (e.key === "Escape") {
      setHelpOpen(false);
      setShortcutsOpen(false);
      setAboutOpen(false);
      setHelpCenterOpen(false);
      setNotificationOpen(false);
      setProfileMenuOpen(false);
      return;
    }

    // Press G
    if (e.key.toLowerCase() === "g") {
      waitingForG = true;

      setTimeout(() => {
        waitingForG = false;
      }, 1000);

      return;
    }

    if (!waitingForG) return;

    switch (e.key.toLowerCase()) {
      case "d":
        router.push("/dashboard");
        break;

      case "t":
        router.push("/dashboard/tasks");
        break;

      case "c":
        router.push("/dashboard/calendar");
        break;

      case "m":
        router.push("/dashboard/gmail");
        break;

      case "s":
        router.push("/dashboard/settings");
        break;
    }

    waitingForG = false;
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
    const userEmail = user?.email || 'user@aura.space';
  // Real Google display name/photo when available (Supabase stores both in
  // user_metadata for Google OAuth sign-ins); falls back to email-derived
  // values for accounts that only ever used email/password.
  const userName = getDisplayName(user);
  const avatarUrl = getAvatarUrl(user);
  const userInitials = userEmail.slice(0, 2).toUpperCase();

  // Google Meet has no real connector/backend in this app — shown as a
  // static, always-"not connected" entry at your request, not tied to
  // connectorStatus like the other three.
  const searchResults = useMemo(() => {

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }


  if (!searchQuery.trim() || !data) return [];

  const q = searchQuery.toLowerCase();

  const tasks = data.tasks
    .filter(task =>
      task.title.toLowerCase().includes(q)
    )
    .map(task => ({
      type: "Task",
      title: task.title,
      href: "/dashboard/tasks"
    }));

  const events = data.events
    .filter(event =>
      event.title.toLowerCase().includes(q)
    )
    .map(event => ({
      type: "Calendar",
      title: event.title,
      href: "/dashboard/calendar"
    }));

  const messages = data.messages
    .filter(msg =>
      msg.subject?.toLowerCase().includes(q) ||
      msg.sender?.toLowerCase().includes(q)
    )
    .map(msg => ({
      type: "Message",
      title: msg.subject || "(No Subject)",
      href: "/dashboard/gmail"
    }));

  const documents = data.documents
    .filter(doc =>
      doc.title.toLowerCase().includes(q)
    )
    .map(doc => ({
      type: "Document",
      title: doc.title,
      href: "/dashboard/documents"
    }));

  return [...tasks, ...events, ...messages, ...documents];
}, [searchQuery, data]);
  const integrations = [
    { label: 'Gmail', icon: GmailIcon, connected: connectorStatus?.google ?? false, href: '/dashboard/gmail' },
    { label: 'Google Calendar', icon: GoogleCalendarIcon, connected: connectorStatus?.google ?? false, href: '/dashboard/calendar' },
    { label: 'Notion', icon: NotionIcon, connected: connectorStatus?.notion ?? false, href: '/dashboard/documents' },
    { label: 'Google Meet', icon: GoogleMeetIcon, connected: false, href: '/dashboard/integrations' },
  ];

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="h-16 flex items-center px-6 gap-2.5 border-b border-border">
        <AuraLogoIcon className="h-8 w-8 text-primary shrink-0" />
        <span className="font-bold tracking-wide text-lg">AURA</span>
      </div>

      {/* Navigation */}
      <nav className="px-4 pt-6 space-y-1.5">
        {finalNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow shadow-primary/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Integrations */}
      <div className="px-4 pt-6">
        <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Integrations</span>
        <div className="mt-2 space-y-1">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <Link
                key={integration.label}
                href={integration.connected ? integration.href : '/dashboard/integrations'}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span className="flex-1 truncate">{integration.label}</span>
                {integration.connected && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex-1" />

      {/* Settings */}
      <div className="p-4 border-t border-border">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <Settings className="h-4.5 w-4.5" />
          <span>Settings</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border shrink-0 z-30">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-20">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/65 backdrop-blur-md sticky top-0 flex items-center justify-between px-6 gap-4 z-30">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative max-w-md w-full hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-[17px] w-[17px] text-[#F97316]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across your tools, tasks, messages..."
                className="w-full rounded-xl bg-card border border-border pl-10 pr-12 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50 shadow-sm"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-semibold text-muted-foreground/60 border border-border rounded px-1.5 py-0.5">
                Ctrl K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
           <div className="relative">
  <button
    onClick={() => {
      setNotificationOpen(!notificationOpen);
      setHelpOpen(false);
      setProfileMenuOpen(false);
    }}
    className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    title="Notifications"
  >
    <Bell className="h-4.5 w-4.5" />
  </button>

  <AnimatePresence>
    {notificationOpen && (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={() => setNotificationOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-xl z-50"
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Notifications</h3>
          </div>

          <div className="p-4 text-sm text-muted-foreground">
            No new notifications.
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
</div>
            <div className="relative">
  <button
    onClick={() => {
      setHelpOpen(!helpOpen);
      setNotificationOpen(false);
      setProfileMenuOpen(false);
    }}
    className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    title="Help"
  >
    <HelpCircle className="h-4.5 w-4.5" />
  </button>

  <AnimatePresence>
    {helpOpen && (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={() => setHelpOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-12 w-72 bg-card border border-border rounded-xl shadow-xl z-50"
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Help</h3>
          </div>

          <div className="py-2">

            <button
             onClick={() => {
  setHelpOpen(false);
  setHelpCenterOpen(true);
}}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 text-sm"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              Help Center
             
            </button>

            <button
              onClick={() => { setHelpOpen(false); setShortcutsOpen(true); }}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 text-sm"
            >
              <Keyboard className="h-4 w-4 text-muted-foreground" />
              Keyboard Shortcuts
            </button>

          <button
  onClick={() => {
    setHelpOpen(false);
    setReportBugOpen(true);
  }}
  className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 text-sm"
>
  <Bug className="h-4 w-4 text-muted-foreground" />
  Report a Bug
</button>

           <button
  onClick={() => {
    setHelpOpen(false);
    setContactSupportOpen(true);
  }}
  className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 text-sm"
>
  <MailIcon className="h-4 w-4 text-muted-foreground" />
  Contact Support
</button>

            <button
              onClick={() => { setHelpOpen(false); setAboutOpen(true); }}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 text-sm"
            >
              <Info className="h-4 w-4 text-muted-foreground" />
              About AURA
            </button>

          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
</div>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-muted transition-colors"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="h-8 w-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {userInitials}
                  </div>
                )}
                <span className="text-xs font-semibold text-foreground hidden sm:block truncate max-w-[140px]">
                  {userName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute top-12 right-0 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-50"
                    >
                      <div className="px-3.5 py-2 border-b border-border flex items-center gap-2.5">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={userName} className="h-8 w-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {userInitials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
                        </div>
                      </div>

                      <div className="px-1.5 py-1.5">
                        <p className="px-2 pb-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Theme</p>
                        <div className="flex gap-1 px-1">
                          <button
                            onClick={() => setTheme('light')}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium ${theme === 'light' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                          >
                            <Sun className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setTheme('dark')}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                          >
                            <Moon className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setTheme('system')}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium ${theme === 'system' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                          >
                            <Monitor className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-border pt-1.5 px-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium text-danger hover:bg-danger/10 transition-colors"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Log out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-1 p-6 overflow-y-auto w-full">
          {children}
        </main>
      </div>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border flex flex-col z-50 md:hidden"
            >
              <div className="flex items-center justify-end px-4 pt-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {shortcutsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShortcutsOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                  <button onClick={() => setShortcutsOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { keys: 'Ctrl + K', action: 'Open search' },
                    { keys: 'Ctrl + /', action: 'Toggle shortcuts' },
                    { keys: 'Esc', action: 'Close modal / dropdown' },
                    { keys: 'G then D', action: 'Go to Dashboard' },
                    { keys: 'G then T', action: 'Go to Tasks' },
                    { keys: 'G then C', action: 'Go to Calendar' },
                    { keys: 'G then M', action: 'Go to Messages' },
                    { keys: 'G then S', action: 'Go to Settings' },
                  ].map((shortcut) => (
                    <div key={shortcut.keys} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-muted-foreground">{shortcut.action}</span>
                      <kbd className="px-2 py-0.5 text-xs font-mono bg-muted border border-border rounded">{shortcut.keys}</kbd>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
<ReportBugModal
  open={reportBugOpen}
  onClose={() => setReportBugOpen(false)}
/>
      {/* About AURA Modal */}
      <AnimatePresence>
        {aboutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setAboutOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <AuraLogoIcon className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1">AURA</h2>
                <p className="text-sm text-muted-foreground mb-4">Unified Productivity Space</p>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p>Version 1.0.0</p>
                  <p>Your all-in-one workspace for tasks, calendar, messages, and documents.</p>
                </div>
                <button
                  onClick={() => setAboutOpen(false)}
                  className="mt-6 w-full py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ContactSupportModal
  open={contactSupportOpen}
  onClose={() => setContactSupportOpen(false)}
/>
{/* Help Center Modal */}
<AnimatePresence>
  {helpCenterOpen && (
    <>
      {/* Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        exit={{ opacity: 0 }}
        onClick={() => setHelpCenterOpen(false)}
        className="fixed inset-0 bg-black z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-6"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-primary">
                Help Center
              </h2>

              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Welcome to the AURA Help Center. Learn how to use Tasks,
                Calendar, Messages, Documents and AI features to improve your
                daily productivity.
              </p>
            </div>

            <button
              onClick={() => setHelpCenterOpen(false)}
              className="p-2 rounded-xl hover:bg-muted transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-8 space-y-8">

            {/* Quick Start */}
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <h3 className="text-2xl font-semibold text-primary mb-4">
                Quick Start Guide
              </h3>

              <ol className="space-y-3 text-sm text-muted-foreground list-decimal ml-5">
                <li>Connect your Gmail account.</li>
                <li>Connect Google Calendar.</li>
                <li>Connect your Notion workspace.</li>
                <li>Create and organize your daily tasks.</li>
                <li>Manage meetings from Calendar.</li>
                <li>View Gmail messages inside AURA.</li>
                <li>Access Notion documents without leaving AURA.</li>
                <li>Use the AI Assistant for summaries and productivity.</li>
              </ol>
            </div>

            {/* Help Topics */}
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-5">
                Help Topics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                <div className="rounded-xl border border-border p-5">
                  <h4 className="font-semibold text-lg mb-2">
                    Getting Started
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Connect Gmail, Google Calendar and Notion to start using
                    your unified workspace.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-5">
                  <h4 className="font-semibold text-lg mb-2">
                    Tasks
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Create, update and manage your daily tasks with priorities
                    and due dates.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-5">
                  <h4 className="font-semibold text-lg mb-2">
                    Calendar
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Schedule meetings and synchronize events with Google
                    Calendar.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-5">
                  <h4 className="font-semibold text-lg mb-2">
                    Messages
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Read Gmail emails, search conversations and stay organized
                    without switching applications.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-5">
                  <h4 className="font-semibold text-lg mb-2">
                    Documents
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    View and manage your connected Notion pages from one place.
                  </p>
                </div>

                <div className="rounded-xl border border-border p-5">
                  <h4 className="font-semibold text-lg mb-2">
                    Need More Help?
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Use Contact Support, Report a Bug or About AURA for
                    additional assistance.
                  </p>
                </div>

              </div>
            </div>

            {/* Support */}
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <h3 className="text-2xl font-semibold text-primary mb-3">
                Support
              </h3>

              <p className="text-sm text-muted-foreground">
                If you experience issues while using AURA, you can access
                Keyboard Shortcuts, Report a Bug, Contact Support or About AURA
                from the Help menu.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end">
              <button
                onClick={() => setHelpCenterOpen(false)}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

    </div>
  );
}
