'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          'Invalid or expired password reset link. Please request a new one.'
        );
      }

      setCheckingSession(false);
    };

    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess('Password updated successfully! Redirecting to login...');

    setTimeout(async () => {
      await supabase.auth.signOut();
      router.push('/login');
    }, 2500);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EC]">
        <div className="text-lg font-semibold text-[#C17817]">
          Verifying reset link...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-8">

        <Link
          href="/login"
          className="flex items-center gap-2 text-[#C17817] font-semibold mb-6 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>

        <h1 className="text-3xl font-bold text-[#1F1B16]">
          Reset Password
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Enter your new password below.
        </p>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 flex gap-2 items-center text-red-600 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 flex gap-2 items-center text-green-600 text-sm">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        {!success && !error.includes('Invalid') && (
          <form onSubmit={handleResetPassword} className="space-y-5">

            {/* New Password */}
            <div>

              <label className="block text-sm font-semibold mb-2">
                New Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-12 outline-none focus:border-[#C17817]"
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

              </div>

            </div>

            {/* Confirm Password */}
            <div>

              <label className="block text-sm font-semibold mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-12 outline-none focus:border-[#C17817]"
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#C17817] to-[#D89A3E] py-3 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}