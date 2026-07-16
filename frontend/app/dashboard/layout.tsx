'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { authService } from '@/services/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Mail,
  FileText,
  Sparkles,
  Link2,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Search,
  ChevronDown,
  User,
  Shield
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/gmail', label: 'Gmail', icon: Mail },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/integrations', label: 'Integrations', icon: Link2 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const finalNavItems = [
    ...navItems,
    ...(role === 'ADMIN' ? [{ href: '/dashboard/admin', label: 'Admin Panel', icon: Shield }] : [])
  ];
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    setThemeMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

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

  const userEmail = user?.email || 'user@aura.space';
  const userInitials = userEmail.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[40%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border shrink-0 z-30">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-primary/80 text-white font-bold text-sm shadow shadow-primary/20">
            A
          </div>
          <span className="font-bold tracking-tight text-lg">AURA</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {finalNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow shadow-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  <span>{item.label}</span>
                  {!isActive && (
                    <div className="absolute left-0 w-1 h-4 bg-primary rounded-r scale-y-0 group-hover:scale-y-100 transition-transform origin-left" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Settings & Logout */}
        <div className="p-4 border-t border-border space-y-2">
          {/* User profile capsule */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/40 relative">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shadow-inner">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold truncate leading-none text-foreground">{userEmail.split('@')[0]}</p>
              <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
              title="Change theme"
            >
              {resolvedTheme === 'dark' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
              
              <AnimatePresence>
                {themeMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setThemeMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute bottom-10 left-0 w-36 bg-card border border-border rounded-lg shadow-xl py-1 z-50 text-left"
                    >
                      <button
                        onClick={() => setTheme('light')}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium ${theme === 'light' ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                      >
                        <Sun className="h-3.5 w-3.5" /> Light
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium ${theme === 'dark' ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                      >
                        <Moon className="h-3.5 w-3.5" /> Dark
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium ${theme === 'system' ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                      >
                        <Monitor className="h-3.5 w-3.5" /> System
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-20">
        {/* Header - Desktop & Mobile */}
        <header className="h-16 border-b border-border bg-card/65 backdrop-blur-md sticky top-0 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Quick search */}
            <div className="relative max-w-xs hidden sm:block">
              <Search className="absolute inset-y-0 left-0 pl-3 h-full w-4.5 text-muted-foreground/60 flex items-center" />
              <input
                type="text"
                placeholder="Search anything... (⌘K)"
                className="w-64 rounded-lg bg-muted/40 border border-border pl-10 pr-4 py-1.5 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status pills or indicators */}
            <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-success/10 text-success border border-success/20">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live Workspace
            </span>

            {/* Current Date Display */}
            <span className="text-xs font-medium text-muted-foreground hidden md:inline">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
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
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Mobile drawer container */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border flex flex-col z-50 md:hidden"
            >
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-secondary text-white font-bold text-sm">
                    A
                  </div>
                  <span className="font-bold tracking-tight text-lg">AURA</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {finalNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow shadow-primary/20'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-border space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-white text-sm font-bold">
                    {userInitials}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-semibold truncate leading-none">{userEmail.split('@')[0]}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center px-1">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-2 rounded-lg ${theme === 'light' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                      title="Light Theme"
                    >
                      <Sun className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                      title="Dark Theme"
                    >
                      <Moon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`p-2 rounded-lg ${theme === 'system' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                      title="System Theme"
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
