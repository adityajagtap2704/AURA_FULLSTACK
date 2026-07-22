'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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

    setTimeout(() => {
      router.push('/login');
    }, 2000);
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
          Reset Password
        </h1>

        <p className="text-[#6B6258] text-sm mt-2 mb-8">
          Enter your new password below.
        </p>

        {success && (
          <div className="flex gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-5">
            <CheckCircle className="w-5 h-5 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="flex gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-5">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleResetPassword}
          className="space-y-5"
        >
          <div>
            <label className="block font-semibold mb-2">
              New Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#E5DDD0] rounded-xl py-3 pl-11 pr-11 focus:ring-2 focus:ring-[#C17817] outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full border border-[#E5DDD0] rounded-xl py-3 pl-11 pr-11 focus:ring-2 focus:ring-[#C17817] outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-3"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C17817] hover:bg-[#A96A13] text-white rounded-xl py-3 font-semibold transition disabled:opacity-60"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}