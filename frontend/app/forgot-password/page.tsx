'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(
        'Password reset link has been sent to your email. Please check your inbox.'
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E5DDD0] p-8">

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[#C17817] hover:underline text-sm font-semibold mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <h1 className="text-3xl font-bold text-[#1F1B16]">
          Forgot Password
        </h1>

        <p className="text-[#6B6258] text-sm mt-2 mb-8">
          Enter your email address and we'll send you a password reset link.
        </p>

        {success && (
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-5">
            <CheckCircle className="w-5 h-5 mt-0.5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-5">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-5">

          <div>
            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#E5DDD0] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#C17817]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C17817] hover:bg-[#A96912] text-white font-semibold rounded-xl py-3 transition disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-[#C17817] font-semibold hover:underline"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}