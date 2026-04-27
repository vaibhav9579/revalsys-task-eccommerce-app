"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastVariant = "success" | "danger" | "info";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

type ToastItem = ToastInput & {
  id: string;
};

type ToastContextValue = {
  pushToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function generateToastId(): string {
  const cryptoObj = globalThis.crypto as undefined | { randomUUID?: () => string };
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();
  return `t_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function variantStyles(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return {
        stripe: "bg-emerald-500",
        iconWrap: "bg-emerald-50 text-emerald-700",
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ),
      };
    case "danger":
      return {
        stripe: "bg-rose-500",
        iconWrap: "bg-rose-50 text-rose-700",
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ),
      };
    default:
      return {
        stripe: "bg-zinc-900",
        iconWrap: "bg-zinc-100 text-zinc-700",
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        ),
      };
  }
}

function Toast({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) {
  const variant = toast.variant ?? "info";
  const styles = variantStyles(variant);

  return (
    <div
      role="status"
      className="pointer-events-auto relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg"
    >
      <div className={`absolute left-0 top-0 h-full w-1.5 ${styles.stripe}`} />
      <div className="flex items-start gap-3 p-4 pl-5">
        <div className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${styles.iconWrap}`}>
          {styles.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-xs text-zinc-600">{toast.description}</p>
          ) : null}
          {toast.actionLabel ? (
            <div className="mt-3 flex items-center gap-2">
              {toast.actionHref ? (
                <Link
                  href={toast.actionHref}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 px-3 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-200"
                  onClick={onClose}
                >
                  {toast.actionLabel}
                </Link>
              ) : toast.onAction ? (
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 px-3 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-200"
                  onClick={() => {
                    toast.onAction?.();
                    onClose();
                  }}
                >
                  {toast.actionLabel}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef(new Map<string, number>());

  const removeToast = useCallback((id: string) => {
    const timers = timersRef.current;
    const handle = timers.get(id);
    if (handle) window.clearTimeout(handle);
    timers.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: ToastInput) => {
      const id = generateToastId();
      const durationMs = toast.durationMs ?? 2600;
      setToasts((prev) => [...prev, { ...toast, id }]);

      if (durationMs > 0) {
        const handle = window.setTimeout(() => removeToast(id), durationMs);
        timersRef.current.set(id, handle);
      }
    },
    [removeToast]
  );

  const value = useMemo<ToastContextValue>(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions text"
        className="pointer-events-none fixed bottom-4 left-0 right-0 z-50 px-4 sm:left-auto sm:right-4 sm:w-[420px] sm:px-0"
      >
        <div className="mx-auto flex w-full max-w-[420px] flex-col gap-3 sm:mx-0">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

