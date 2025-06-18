'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [emailToResend, setEmailToResend] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    setErrorMsg('');
    setShowResend(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Check for specific unconfirmed email error first
    if (error) {

      if (error.message.includes('Email not confirmed') || error.message.includes('user is not confirmed')) {
        setEmailToResend(email);
        setShowResend(true);
        setErrorMsg(
          'Please confirm your email before logging in. Check your inbox or spam folder.'
        );
      } else {
        // Handle other general login errors
        setErrorMsg(error.message);
      }
      return;
    }

    const session = data?.session;

    if (!session?.user?.email_confirmed_at) {
        await supabase.auth.signOut();
        setEmailToResend(email);
        setShowResend(true);
        setErrorMsg(
          'Please confirm your email before logging in. Check your inbox or spam folder.'
        );
        return;
    }

    // Email is confirmed, allow login
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
          >
            Log In
          </button>
        </form>
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 text-sm">
            {errorMsg}
          </div>
        )}

        {showResend && (
          <div className="text-center mt-4">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
              onClick={async () => {
                setResendStatus('');
                const { error } = await supabase.auth.resend({
                  type: 'signup',
                  email: emailToResend!,
                });

                if (error) {
                  setResendStatus('Failed to resend confirmation email. Try again.');
                } else {
                  setResendStatus('Confirmation email has been resent!');
                }
              }}
            >
              Resend Confirmation Email
            </button>

            {resendStatus && (
              <p className="text-sm mt-2 text-gray-700">{resendStatus}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}