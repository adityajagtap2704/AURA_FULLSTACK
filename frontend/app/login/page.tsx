'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { GmailIcon, GoogleCalendarIcon, NotionIcon, GoogleMeetIcon } from '@/components/icons/ServiceIcons';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(values.email, values.password);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (oauthError) throw oauthError;
      // Browser is redirected to Google's consent screen from here.
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed to start');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Full-page photo background (Pexels — "console table with pampas
          grass" by cottonbro studio), not the exact reference image, chosen
          for a close match: bright white paneled wall, pampas grass in a
          vase, framed art, warm wood tones. */}
      <img
        src="https://images.pexels.com/photos/9566054/pexels-photo-9566054.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#EDE4D8]/95 via-[#EDE4D8]/75 to-[#EDE4D8]/25" />

      {/* LEFT COLUMN: HERO & BRAND DETAILS (55% Width) */}
      <div className="relative z-10 w-full md:w-[55%] flex flex-col justify-between p-8 md:p-12 lg:p-20">

        {/* AURA Logo Header */}
        <div className="flex items-center gap-3">
          <div className="p-1">
            <svg viewBox="0 0 100 100" className="h-14 w-14 text-[#C8842B] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
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
          </div>
          <span className="text-4xl font-black tracking-wide text-[#C8842B]">AURA</span>
        </div>

        {/* Main Hero content */}
        <div className="my-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#1F1B16] tracking-tight leading-tight">
              Aura makes your life <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8842B] to-[#D4953A] relative inline-block">
                easy and fast.
                <svg viewBox="0 0 200 12" className="absolute left-0 bottom-[-4px] w-full h-2 text-[#D4953A] shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M 5 6 C 50 2, 150 2, 195 6" />
                </svg>
              </span>
            </h1>
          </div>
          <p className="text-sm text-[#6B6258] max-w-lg leading-relaxed">
            AURA is your all-in-one productivity hub that brings your tools, tasks, and insights together — so you can focus on what matters most.
          </p>

          {/* Integrations grid — official brand-accurate icons */}
          <div className="grid grid-cols-4 gap-3 max-w-md pt-4">
            {[
              { label: 'Gmail', Icon: GmailIcon },
              { label: 'Calendar', Icon: GoogleCalendarIcon },
              { label: 'Notion', Icon: NotionIcon },
              { label: 'Meet', Icon: GoogleMeetIcon },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-[#E5DDD0] p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm">
                <item.Icon className="h-6 w-6" />
                <span className="text-[10px] font-semibold text-[#6B6258]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Rows */}
        <div className="bg-[#FDFBF7]/60 backdrop-blur-sm rounded-2xl p-5 space-y-4 max-w-lg shadow-md">
          {[
            {
              title: 'What is AURA?',
              desc: 'AURA brings your essential apps into one simple workspace and helps you get more done, effortlessly.',
              icon: Target
            },
            {
              title: 'Why use AURA?',
              desc: 'AI-powered summaries, smart prioritization, and a clean dashboard that saves you time every day.',
              icon: Sparkles
            },
            {
              title: 'Purpose of AURA',
              desc: "AURA's purpose is to simplify your work life by bringing clarity, speed, and focus to everything you do.",
              icon: Lightbulb
            }
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#F3E3C9] text-[#C8842B] flex items-center justify-center shrink-0">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#1F1B16]">{feature.title}</h4>
                  <p className="text-[11px] text-[#6B6258] leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* RIGHT COLUMN: AUTH CARD (45% Width) — untouched, just repositioned
          above the shared full-page background instead of its own panel. */}
      <div className="relative z-10 w-full md:w-[45%] flex items-center justify-center p-6 md:p-12 min-h-[500px] md:min-h-screen">
        <div className="bg-[#FDFBF7]/95 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-[0_15px_50px_rgba(31,27,22,0.12)] border border-[#E5DDD0] w-full max-w-md space-y-6 z-10">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-[#1F1B16] tracking-tight">Welcome back!</h2>
            <p className="text-xs text-[#6B6258]">Login to continue to your Aura account</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3.5 text-xs text-red-600 border border-red-200">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-[11px] font-bold text-[#1F1B16] uppercase tracking-wider mb-2">
                Email address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B6258]/70">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-xs outline-none transition-all placeholder:text-[#6B6258]/50 ${
                    errors.email 
                      ? 'border-red-400 focus:ring-1 focus:ring-red-400' 
                      : 'border-[#E5DDD0] focus:border-[#C17817] focus:ring-1 focus:ring-[#C17817]'
                  }`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[10px] text-red-600 font-semibold">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold text-[#1F1B16] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-[#C17817] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B6258]/70">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-10 text-xs outline-none transition-all placeholder:text-[#6B6258]/50 ${
                    errors.password 
                      ? 'border-red-400 focus:ring-1 focus:ring-red-400' 
                      : 'border-[#E5DDD0] focus:border-[#C17817] focus:ring-1 focus:ring-[#C17817]'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#6B6258]/70 hover:text-[#1F1B16] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[10px] text-red-600 font-semibold">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C17817] to-[#D89A3E] hover:from-[#9C651F] hover:to-[#B7792B] text-white font-bold text-xs transition-all shadow shadow-[#C17817]/10 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] cursor-pointer"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5DDD0]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#FDFBF7] px-3 text-[#6B6258] font-bold">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex h-12 items-center justify-center gap-3 rounded-xl border border-[#E5DDD0] bg-white text-[#1F1B16] font-bold text-xs transition-all hover:bg-[#FDFBF7] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] cursor-pointer"
          >
            {googleLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1F1B16] border-t-transparent"></div>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Secure Footer Indicator */}
          <div className="pt-4 border-t border-[#E5DDD0] flex flex-col items-center gap-2 text-[10px] text-[#6B6258]">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4.5 w-4.5 text-[#C17817]" />
              <span>Your data is safe and secure</span>
            </div>
            <div>
              <span>Powered by <span className="font-bold text-[#C17817]">Kalnet</span></span>
            </div>
          </div>

          <p className="text-center text-xs text-[#6B6258]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold text-[#C17817] hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
