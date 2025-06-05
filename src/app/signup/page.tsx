'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent page reload
      setErrorMsg('');
  
      const { data, error } = await supabase.auth.signUp({
          email,
          password,
      });
  
      if (error) {
          setErrorMsg(error.message);
          return;
      } else {
          console.log("Registration Successful! User info: "+data); //Temporary, will set up an actual confirmation message later
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
      {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
    </div>
  );
}