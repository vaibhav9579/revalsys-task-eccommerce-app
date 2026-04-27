"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
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

function parseUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function readUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;
  return parseUser(window.localStorage.getItem(USER_STORAGE_KEY));
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(readUserFromStorage());

    const onCustom = () => setUser(readUserFromStorage());
    userStoreEvents.addEventListener(USER_EVENT_NAME, onCustom);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== USER_STORAGE_KEY) return;
      setUser(parseUser(e.newValue));
    };
    window.addEventListener("storage", onStorage);

    return () => {
      userStoreEvents.removeEventListener(USER_EVENT_NAME, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const login = useCallback((next: User) => {
    setToStorage(USER_STORAGE_KEY, next);
    setUser(next);
    notifyUserStore();
  }, []);

  const logout = useCallback(() => {
    removeFromStorage(USER_STORAGE_KEY);
    setUser(null);
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
