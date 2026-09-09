import { supabase, SUPABASE_URL } from '@/supabase-client';

export const SCHOOL_EMAIL_SUFFIX = '@stjohnscollege.co.za';
export const ALLOWED_EMAIL_DOMAIN_DISPLAY = 'stjohnscollege.co.za';
export const SCHOOL_HOSTED_DOMAIN = 'stjohnscollege.co.za';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/** Minimal user shape from Supabase Auth / Google OAuth. */
export type AuthUserLike = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  identities?: Array<{
    email?: string | null;
    identity_data?: Record<string, unknown> | null;
  }> | null;
};

const SESSION_KEY = 'sjc-marketplace-session';

function asString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeEmail(value: unknown): string | null {
  const raw = asString(value);
  if (!raw || !raw.includes('@')) return null;
  return raw.replace(/\s+/g, '').toLowerCase();
}

export function isAllowedSchoolEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return !!normalized && normalized.endsWith(SCHOOL_EMAIL_SUFFIX);
}

function hostedDomainsFromUser(sbUser: AuthUserLike): string[] {
  const domains: string[] = [];
  const push = (value: unknown) => {
    const hd = asString(value)?.toLowerCase();
    if (hd) domains.push(hd);
  };
  push(sbUser.user_metadata?.hd);
  for (const identity of sbUser.identities ?? []) {
    push(identity.identity_data?.hd);
  }
  return [...new Set(domains)];
}

export function hasSchoolHostedDomain(sbUser: AuthUserLike): boolean {
  return hostedDomainsFromUser(sbUser).includes(SCHOOL_HOSTED_DOMAIN);
}

/** Every email Google / Supabase attached to this login. */
export function collectAuthEmails(sbUser: AuthUserLike): string[] {
  const emails: string[] = [];
  const push = (value: unknown) => {
    const email = normalizeEmail(value);
    if (email) emails.push(email);
  };
  push(sbUser.email);
  push(sbUser.user_metadata?.email);
  for (const identity of sbUser.identities ?? []) {
    push(identity.email);
    push(identity.identity_data?.email);
    push(identity.identity_data?.preferred_username);
  }
  return [...new Set(emails)];
}

/**
 * School email to use for the app session, or null if this Google account is not SJC.
 * Prefers @stjohnscollege.co.za even when Google's "primary" email is a linked Gmail.
 */
export function resolveSchoolEmail(sbUser: AuthUserLike): string | null {
  const emails = collectAuthEmails(sbUser);
  const schoolEmail = emails.find(isAllowedSchoolEmail);
  if (schoolEmail) return schoolEmail;
  if (hasSchoolHostedDomain(sbUser) && emails[0]) return emails[0];
  return null;
}

export function getAttemptedEmail(sbUser: AuthUserLike): string {
  return collectAuthEmails(sbUser)[0] ?? '';
}

function displayNameFromUser(sbUser: AuthUserLike, email: string): string {
  const meta = sbUser.user_metadata ?? {};
  const name =
    asString(meta.full_name) ??
    asString(meta.name) ??
    email.split('@')[0] ??
    'User';
  return name.trim() || 'User';
}

function supabaseUserToAppUser(sbUser: AuthUserLike, email: string): User {
  return {
    id: sbUser.id,
    name: displayNameFromUser(sbUser, email),
    email,
    createdAt: new Date().toISOString(),
  };
}

/** Sign in with Google via this project's Supabase Auth URL, then return to the app. */
export async function signInWithGoogle(): Promise<void> {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const redirectTo = `${window.location.origin}${base}/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        prompt: "select_account",
        hd: SCHOOL_HOSTED_DOMAIN,
      },
    },
  });
  if (error) throw error;
  if (!data.url) throw new Error("Google sign-in did not return an auth URL.");

  const authUrl = new URL(data.url);
  const supabaseOrigin = new URL(SUPABASE_URL);
  authUrl.protocol = supabaseOrigin.protocol;
  authUrl.host = supabaseOrigin.host;
  window.location.assign(authUrl.toString());
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  supabase.auth.signOut();
}

export function getSession(): User | null {
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

function setSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/** Used by AuthCallback: set app session from Supabase user if email is allowed; returns User or null. */
export function setSessionFromSupabaseUser(sbUser: AuthUserLike): User | null {
  const email = resolveSchoolEmail(sbUser);
  if (!email) return null;
  const user = supabaseUserToAppUser(sbUser, email);
  setSession(user);
  return user;
}

/**
 * Initialize auth: restore session from Supabase after OAuth redirect, and subscribe to auth changes.
 * Call once on app load (e.g. in Index useEffect).
 * - If Supabase session exists and email is @stjohnscollege.co.za → onUser(user)
 * - If Supabase session exists but email is not allowed → sign out and onUser(null, errorMessage)
 */
export function initAuth(onUser: (user: User | null, error?: string) => void): () => void {
  const applySession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      localStorage.removeItem(SESSION_KEY);
      onUser(null);
      return;
    }
    const email = resolveSchoolEmail(session.user);
    if (!email) {
      const attempted = getAttemptedEmail(session.user);
      await supabase.auth.signOut();
      localStorage.removeItem(SESSION_KEY);
      onUser(
        null,
        attempted
          ? `Google signed you in as ${attempted}. Only @${ALLOWED_EMAIL_DOMAIN_DISPLAY} school accounts can use this app.`
          : 'Only school accounts can use this app. Please sign in with your school Google account.'
      );
      return;
    }
    const user = supabaseUserToAppUser(session.user, email);
    setSession(user);
    onUser(user);
  };

  applySession();

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) {
      localStorage.removeItem(SESSION_KEY);
      onUser(null);
      return;
    }
    const email = resolveSchoolEmail(session.user);
    if (!email) {
      const attempted = getAttemptedEmail(session.user);
      localStorage.removeItem(SESSION_KEY);
      onUser(
        null,
        attempted
          ? `Google signed you in as ${attempted}. Only @${ALLOWED_EMAIL_DOMAIN_DISPLAY} school accounts can use this app.`
          : 'Only school accounts can use this app. Please sign in with your school Google account.'
      );
      window.setTimeout(() => {
        void supabase.auth.signOut();
      }, 0);
      return;
    }
    const user = supabaseUserToAppUser(session.user, email);
    setSession(user);
    onUser(user);
  });

  return () => subscription?.unsubscribe?.();
}

export function updateUser(updates: Partial<Pick<User, 'name'>>): User | null {
  const session = getSession();
  if (!session) return null;
  const next: User = { ...session, ...updates };
  if (updates.name) next.name = updates.name.trim();
  setSession(next);
  return next;
}
