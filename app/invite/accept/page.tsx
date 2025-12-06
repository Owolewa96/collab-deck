"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramToken = searchParams?.get('token') || '';
  const [token, setToken] = useState<string>(paramToken || '');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'needs-auth'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // if token not present in query, try reading cookie set by server redirect
    if (!token) {
      try {
        const match = document.cookie.split('; ').find((c) => c.startsWith('pendingInviteToken='));
        if (match) {
          const value = match.split('=')[1] || '';
          if (value) {
            setToken(value);
            setMessage('Found invite token from cookie. Ready to accept.');
            setStatus('idle');
            return;
          }
        }
      } catch (err) {
        // ignore cookie read errors
      }

      setMessage('No invite token found in the URL or cookie.');
      setStatus('error');
    }
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    setStatus('loading');
    setMessage('Accepting invite...');
    try {
      const res = await fetch('/api/invites/accept', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('Invite accepted — you have been added to the project. Redirecting...');
        // clear pending cookie
        try { document.cookie = 'pendingInviteToken=; Max-Age=0; path=/;'; } catch (e) {}
        setTimeout(() => {
          // redirect to project page if returned
          if (data.project && data.project._id) router.push(`/projects/${data.project._id}`);
          else router.push('/dashboard');
        }, 1200);
      } else if (res.status === 401) {
        setStatus('needs-auth');
        setMessage('You must be signed in to accept this invite. Please sign in and try again.');
      } else {
        setStatus('error');
        setMessage(data?.error || 'Failed to accept invite.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error while accepting invite.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-3">Accept Invitation</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Token: <code className="break-all">{token || '—'}</code></p>

        {status === 'idle' && (
          <div>
            <p className="mb-4">Click the button below to accept the invitation and join the project.</p>
            <div className="flex gap-3">
              <button onClick={handleAccept} className="px-4 py-2 bg-emerald-600 text-white rounded">Accept Invite</button>
              <button onClick={() => router.push('/')} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div>
            <p>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <p className="text-green-600">{message}</p>
          </div>
        )}

        {status === 'needs-auth' && (
          <div>
            <p className="text-yellow-600 mb-4">{message}</p>
            <div className="flex gap-3">
              <a href="/signin" className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</a>
              <button onClick={handleAccept} className="px-4 py-2 border rounded">Retry</button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <p className="text-red-600 mb-4">{message}</p>
            <div className="flex gap-3">
              <button onClick={() => { setStatus('idle'); setMessage(''); }} className="px-4 py-2 border rounded">Try Again</button>
              <button onClick={() => router.push('/')} className="px-4 py-2 rounded bg-zinc-100 dark:bg-zinc-800">Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
