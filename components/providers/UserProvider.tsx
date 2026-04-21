"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { User } from "@/types/user";
import { removeFromStorage, setToStorage } from "@/utils/storage";

const USER_STORAGE_KEY = "revalsys_user_v1";

type UserContextValue = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

const userStoreEvents = new EventTarget();
const USER_EVENT_NAME = "revalsys-user";

function notifyUserStore() {
  userStoreEvents.dispatchEvent(new Event(USER_EVENT_NAME));
}

function subscribe(callback: () => void) {
  const handler = () => callback();
  userStoreEvents.addEventListener(USER_EVENT_NAME, handler);

  const onStorage = (e: StorageEvent) => {
    if (e.key === USER_STORAGE_KEY) callback();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    userStoreEvents.removeEventListener(USER_EVENT_NAME, handler);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

let cachedRaw: string | null | undefined = undefined;
let cachedValue: User | null = null;

function parseUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = parseUser(raw);
  return cachedValue;
}

function getServerSnapshot() {
  return null;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback((next: User) => {
    setToStorage(USER_STORAGE_KEY, next);
    notifyUserStore();
  }, []);

  const logout = useCallback(() => {
    removeFromStorage(USER_STORAGE_KEY);
    notifyUserStore();
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({ user, login, logout }),
    [login, logout, user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
