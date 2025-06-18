'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent page reload
      setErrorMsg('');
      setSuccessMsg('');
  
      const { data, error } = await supabase.auth.signUp({
          email,
          password,
      });
  
      if (error) {
          setErrorMsg(error.message);
          return;
      } else {
          if (!data.session || !data.user?.confirmed_at) {
            setSuccessMsg('Signup successful! Please check your email to confirm your address.')
            router.push(`/signup/loadconfirm?email=${encodeURIComponent(email)}`);
          }
      }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={handleSignup}>
          <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4"
          />

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer">
            Sign Up
          </button>
        </form>
        <div>
          {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
          <p className="text-green-400">{successMsg}</p>
        </div>
      </div>
  );
}