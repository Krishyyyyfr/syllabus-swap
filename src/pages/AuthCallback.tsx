import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/supabase-client';
import { getAttemptedEmail, resolveSchoolEmail, setSessionFromSupabaseUser } from '@/lib/auth';

function oauthCallbackPresent(): boolean {
  const url = new URL(window.location.href);
  if (url.searchParams.has('code')) return true;
  const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
  const hashParams = new URLSearchParams(hash);
  return hashParams.has('access_token') || hashParams.has('code');
}

function oauthErrorFromUrl(): string | null {
  const url = new URL(window.location.href);
  const queryError = url.searchParams.get('error_description') || url.searchParams.get('error');
  if (queryError) return queryError;
  const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
  const hashParams = new URLSearchParams(hash);
  return hashParams.get('error_description') || hashParams.get('error');
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'ok' | 'invalid'>('loading');

  useEffect(() => {
    let cancelled = false;
    let settled = false;
    let sawSignedIn = false;
    const waitingForOAuth = oauthCallbackPresent();
    const providerError = oauthErrorFromUrl();

    const go = (path: string) => {
      if (cancelled) return;
      navigate(path, { replace: true });
    };

    const finish = async (session: Session | null, source: 'signed_in' | 'existing' | 'timeout') => {
      if (cancelled || settled) return;

      // A leftover session is not this Google login. Do not treat it as "wrong school account".
      if (waitingForOAuth && source !== 'signed_in') return;

      settled = true;

      if (!session?.user) {
        setStatus('invalid');
        go(providerError ? '/?error=auth_failed' : '/');
        return;
      }

      const user = setSessionFromSupabaseUser(session.user);
      if (!user) {
        const signedInAs = getAttemptedEmail(session.user);
        setStatus('invalid');
        const params = new URLSearchParams({ error: 'school_email_required' });
        if (signedInAs) params.set('as', signedInAs);
        window.setTimeout(() => {
          void supabase.auth.signOut().finally(() => go(`/?${params.toString()}`));
        }, 0);
        return;
      }

      setStatus('ok');
      go('/');
    };

    if (providerError && !waitingForOAuth) {
      settled = true;
      setStatus('invalid');
      go('/?error=auth_failed');
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        sawSignedIn = true;
        void finish(session, 'signed_in');
        return;
      }
      if (event === 'INITIAL_SESSION' && session && !waitingForOAuth) {
        void finish(session, 'existing');
      }
    });

    // Cover the case where PKCE finished before this listener was attached.
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled || settled || !session?.user) return;
      if (waitingForOAuth) {
        if (resolveSchoolEmail(session.user)) {
          sawSignedIn = true;
          void finish(session, 'signed_in');
        }
        return;
      }
      void finish(session, 'existing');
    });

    const timeoutMs = waitingForOAuth ? 8000 : 1500;
    const timer = window.setTimeout(async () => {
      if (cancelled || settled) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && resolveSchoolEmail(session.user)) {
        void finish(session, 'signed_in');
        return;
      }
      if (waitingForOAuth && !sawSignedIn) {
        const exchangeFinished = !oauthCallbackPresent();
        if (session?.user && exchangeFinished) {
          void finish(session, 'signed_in');
          return;
        }
        settled = true;
        setStatus('invalid');
        go('/?error=auth_failed');
        return;
      }
      void finish(session, 'timeout');
    }, timeoutMs);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <p className="text-muted-foreground text-sm font-medium">
        {status === 'loading' ? 'Signing you in…' : 'Redirecting…'}
      </p>
    </div>
  );
}
