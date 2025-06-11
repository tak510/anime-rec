'use client'

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoadingConfirmPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleResendConfirmation = async () => {
    setMessage(null);
    setError(null);

    if (!email) {
      setError('No email found. Please return to signup.');
      return;
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Confirmation email resent successfully!');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <p className="text-emerald-400 text-xl text-center pb-6">
        Signup successful! Please check your email to confirm your address.
      </p>

      <p className="text-center mb-4">
        If you did not receive an email, confirm that the input email address is correct, check your spam/junk mail, or click the button below to resend the confirmation!
      </p>

      {message && <p className="text-green-500 text-center">{message}</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="text-center mt-4">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          onClick={handleResendConfirmation}
        >
          Resend Confirmation
        </button>
      </div>
    </div>
  );
}
