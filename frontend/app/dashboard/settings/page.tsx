'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Settings as SettingsIcon, User, Lock, Bell, Eye, EyeOff, Shield, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'security'>('profile');

  const userEmail = user?.email || 'user@aura.space';
  const userName = userEmail.split('@')[0];
  const userInitials = userEmail.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-muted-foreground" /> Settings & Workspace Preferences
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal profile, security configuration, and account settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-sm">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-all ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="h-4.5 w-4.5" /> Profile Info
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-all ${
            activeTab === 'appearance'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bell className="h-4.5 w-4.5" /> Appearance & Theme
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-all ${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield className="h-4.5 w-4.5" /> Security & Access
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-foreground">User Information</h3>
            
            {/* Avatar display */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary to-primary/80 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-primary/10">
                {userInitials}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground capitalize">{userName}</h4>
                <p className="text-xs text-muted-foreground">Standard AURA Workspace Account</p>
              </div>
            </div>

            {/* Profile fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="text"
                  value={userEmail}
                  disabled
                  className="w-full rounded-lg border border-border bg-muted/40 px-3.5 py-2 text-xs text-muted-foreground outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Organization ID
                </label>
                <input
                  type="text"
                  value={user?.id || 'KALNET-demo-org'}
                  disabled
                  className="w-full rounded-lg border border-border bg-muted/40 px-3.5 py-2 text-xs text-muted-foreground outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-foreground">Workspace Theme</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Select your preferred visual style. The AURA interface supports light, dark, or system-matching theme modes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[
                { name: 'light', label: 'Light Mode' },
                { name: 'dark', label: 'Dark Mode' },
                { name: 'system', label: 'System Defaults' }
              ].map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setTheme(opt.name as 'light' | 'dark' | 'system')}
                  className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 capitalize transition-all hover:bg-muted/30 ${
                    theme === opt.name
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border bg-card'
                  }`}
                >
                  <span className="text-xs font-semibold text-foreground">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <h3 className="text-base font-bold text-foreground">Notification Settings</h3>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="notif"
                  defaultChecked
                  className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary outline-none"
                />
                <label htmlFor="notif" className="text-xs font-medium text-foreground">
                  Receive email notifications for sync health errors
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-foreground font-semibold">Security Controls</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Manage credentials, authentication parameters, and active tokens.
            </p>

            <div className="space-y-4 pt-4 border-t border-border">
              {/* Reset password fields */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full max-w-xs rounded-lg border border-border bg-background px-3.5 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <button className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all">
                Update Security Credentials
              </button>
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <h3 className="text-sm font-bold text-foreground">Active Sessions</h3>
              <div className="flex items-center justify-between text-xs py-2 bg-muted/40 px-3.5 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground">Current Desktop Session</span>
                  <p className="text-[10px] text-muted-foreground">Chrome Browser • Active Now</p>
                </div>
                <span className="text-[9px] bg-success/15 text-success border border-success/20 px-2 py-0.5 rounded font-bold uppercase">
                  This Device
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
