'use client';

import { useEffect, useState } from 'react';

// Persisted user-role personalization. The Career Architect writes
// the role into localStorage when a visitor completes the diagnostic;
// the homepage hero (and any other surface that wants to react)
// reads it back via this hook on mount.
//
// Key kept stable so future surfaces can read it directly without
// importing the hook — handy for analytics / experiments.

export const ROLE_STORAGE_KEY = 'tarahut_user_role';

// Custom in-window event so multiple useUserRole() instances in the
// same tab stay in sync. The native `storage` event only fires in
// OTHER tabs, which is why the hero didn't react to the picker.
// Exported so consumers (e.g. hero overlay) can react to explicit
// role changes without firing on initial localStorage hydration.
export const ROLE_CHANGE_EVENT = 'tarahut:role-change';

export type UserRole =
  | 'student'
  | 'biz-owner'
  | 'freelancer'
  | 'professional';

const VALID: UserRole[] = ['student', 'biz-owner', 'freelancer', 'professional'];

export const ROLE_LABEL: Record<UserRole, string> = {
  'student':      'Student',
  'biz-owner':    'Business Owner',
  'freelancer':   'Freelancer',
  'professional': 'Professional',
};

function readStored(): UserRole | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (!raw) return null;
    return (VALID as string[]).includes(raw) ? (raw as UserRole) : null;
  } catch {
    return null; // localStorage can throw in private mode / over quota
  }
}

export function useUserRole(): {
  role: UserRole | null;
  setRole: (next: UserRole | null) => void;
} {
  const [role, setRoleState] = useState<UserRole | null>(null);

  // Read once on mount. Avoids SSR hydration mismatch — we render the
  // default (null) on the server and swap to the persisted value
  // after first paint on the client.
  useEffect(() => {
    setRoleState(readStored());
    // Sync across tabs — if the user completes the Architect in one
    // tab, the homepage in another tab updates immediately.
    function onStorage(e: StorageEvent) {
      if (e.key !== ROLE_STORAGE_KEY) return;
      setRoleState(readStored());
    }
    function onRoleChange(e: Event) {
      const detail = (e as CustomEvent<UserRole | null>).detail;
      setRoleState(detail ?? null);
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener(ROLE_CHANGE_EVENT, onRoleChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(ROLE_CHANGE_EVENT, onRoleChange);
    };
  }, []);

  function setRole(next: UserRole | null) {
    setRoleState(next);
    if (typeof window === 'undefined') return;
    try {
      if (next) window.localStorage.setItem(ROLE_STORAGE_KEY, next);
      else window.localStorage.removeItem(ROLE_STORAGE_KEY);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(ROLE_CHANGE_EVENT, { detail: next }));
  }

  return { role, setRole };
}

// Helper for non-hook contexts (e.g. CareerArchitect's submit
// handler) where we just need to write once. Mirrors the storage
// shape used by the hook.
export function persistUserRole(role: UserRole) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(ROLE_CHANGE_EVENT, { detail: role }));
}
