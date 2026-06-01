import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastVariant = "info" | "success" | "warning" | "error";

/** Physical screen corner where the toast stack appears. */
export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Visual style. Default: "info" */
  variant?: ToastVariant;
  /** Bold heading shown in all layouts. */
  title: string;
  /**
   * Optional description. When provided the toast renders in the
   * expanded (multi-line) layout; otherwise compact (single-line).
   */
  description?: string;
  /** Primary CTA button. */
  action?: ToastAction;
  /** Secondary text-link action. */
  secondaryAction?: ToastAction;
  /** Show the × dismiss button. Default: true */
  closable?: boolean;
  /**
   * Auto-dismiss after N ms. Pass 0 to keep the toast until the user
   * explicitly closes it. Default: 4000
   */
  duration?: number;
  /** Corner of the screen. Default: "bottom-right" */
  position?: ToastPosition;
}

interface ToastData extends Required<Pick<ToastOptions, "variant" | "position" | "closable">> {
  id: string;
  title: string;
  description?: string;
  action?: ToastAction;
  secondaryAction?: ToastAction;
  duration: number;
}

// ── Context / hook ─────────────────────────────────────────────────────────────

interface ToastContextValue {
  /** Show a toast. Returns the generated id so you can dismiss it manually. */
  toast: (options: ToastOptions) => string;
  /** Dismiss a specific toast by id. */
  dismiss: (id: string) => void;
  /** Dismiss every visible toast. */
  dismissAll: () => void;
}

const ToastCtx = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ── Variant tokens ─────────────────────────────────────────────────────────────

const VARIANTS: Record<ToastVariant, {
  Icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  actionBg: string;
}> = {
  info: {
    Icon: Info,
    iconColor: "var(--info)",
    iconBg: "var(--info-muted)",
    actionBg: "var(--info)",
  },
  success: {
    Icon: CheckCircle2,
    iconColor: "var(--success)",
    iconBg: "var(--success-muted)",
    actionBg: "var(--success)",
  },
  warning: {
    Icon: AlertTriangle,
    iconColor: "var(--warning)",
    iconBg: "var(--warning-muted)",
    actionBg: "var(--warning)",
  },
  error: {
    Icon: AlertCircle,
    iconColor: "var(--destructive)",
    iconBg: "var(--destructive-muted)",
    actionBg: "var(--destructive)",
  },
};

// ── Position helpers ───────────────────────────────────────────────────────────

const POS_STYLE: Record<ToastPosition, React.CSSProperties> = {
  "top-right":    { top: 16, right: 16 },
  "top-left":     { top: 16, left: 16 },
  "bottom-right": { bottom: 16, right: 16 },
  "bottom-left":  { bottom: 16, left: 16 },
};

// ── Single toast item (also exported for static previews) ─────────────────────

export interface ToastItemProps {
  data: Pick<ToastData, "variant" | "title" | "description" | "action" | "secondaryAction" | "closable">;
  onDismiss?: () => void;
  /** When true the item plays its entrance animation. Default true. */
  animate?: boolean;
}

export function ToastItem({ data, onDismiss, animate = true }: ToastItemProps) {
  const { Icon, iconColor, iconBg, actionBg } = VARIANTS[data.variant];
  const expanded = !!data.description;

  return (
    <div
      className="bg-card border border-border rounded-2xl flex items-start gap-3 relative"
      style={{
        boxShadow: "var(--shadow-popover)",
        padding: expanded ? "14px 16px" : "10px 14px",
        minWidth: expanded ? "300px" : "260px",
        maxWidth: "380px",
        animation: animate ? "toast-slide-in 0.22s cubic-bezier(0.16,1,0.3,1) both" : undefined,
      }}
    >
      {/* Icon */}
      <div
        className="rounded-xl flex items-center justify-center shrink-0"
        style={{
          width: expanded ? 34 : 28,
          height: expanded ? 34 : 28,
          minWidth: expanded ? 34 : 28,
          backgroundColor: iconBg,
          marginTop: expanded ? 1 : 0,
        }}
      >
        <Icon size={expanded ? 16 : 14} style={{ color: iconColor }} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {expanded ? (
          /* Expanded layout */
          <>
            <p className="text-sm text-foreground leading-snug" style={{ fontWeight: 600 }}>
              {data.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {data.description}
            </p>
            {(data.action || data.secondaryAction) && (
              <div className="flex items-center gap-2 mt-3">
                {data.action && (
                  <button
                    onClick={() => { data.action!.onClick(); onDismiss?.(); }}
                    className="h-7 px-3 rounded-lg text-xs text-white transition-opacity hover:opacity-85 active:opacity-75"
                    style={{ backgroundColor: actionBg, fontWeight: 600 }}
                  >
                    {data.action.label}
                  </button>
                )}
                {data.secondaryAction && (
                  <button
                    onClick={() => { data.secondaryAction!.onClick(); onDismiss?.(); }}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    {data.secondaryAction.label}
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          /* Compact layout */
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-foreground" style={{ fontWeight: 600 }}>
              {data.title}
            </span>
            {(data.action || data.secondaryAction) && (
              <div className="flex items-center gap-2 ms-auto">
                {data.action && (
                  <button
                    onClick={() => { data.action!.onClick(); onDismiss?.(); }}
                    className="h-7 px-3 rounded-lg text-xs text-white transition-opacity hover:opacity-85 active:opacity-75 shrink-0"
                    style={{ backgroundColor: actionBg, fontWeight: 600 }}
                  >
                    {data.action.label}
                  </button>
                )}
                {data.secondaryAction && (
                  <button
                    onClick={() => { data.secondaryAction!.onClick(); onDismiss?.(); }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    style={{ fontWeight: 500 }}
                  >
                    {data.secondaryAction.label}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Close */}
      {data.closable && (
        <button
          onClick={onDismiss}
          className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors self-start"
          aria-label="إغلاق"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}

// ── Stack for a single position ───────────────────────────────────────────────

function ToastStack({
  toasts,
  position,
  onDismiss,
}: {
  toasts: ToastData[];
  position: ToastPosition;
  onDismiss: (id: string) => void;
}) {
  if (!toasts.length) return null;
  const isBottom = position.startsWith("bottom");

  return (
    <div
      className="fixed z-[9999] flex flex-col gap-2.5 pointer-events-none"
      style={{
        ...POS_STYLE[position],
        flexDirection: isBottom ? "column-reverse" : "column",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem data={t} onDismiss={() => onDismiss(t.id)} />
        </div>
      ))}
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────────────────────────

/** Maximum number of toasts visible on screen at the same time (globally). */
const MAX_VISIBLE_TOASTS = 3;

const ALL_POSITIONS: ToastPosition[] = [
  "top-right", "top-left", "bottom-right", "bottom-left",
];

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const dismissAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    setToasts([]);
  }, []);

  const toast = useCallback((options: ToastOptions): string => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duration = options.duration ?? 4000;
    const data: ToastData = {
      id,
      variant: options.variant ?? "info",
      title: options.title,
      description: options.description,
      action: options.action,
      secondaryAction: options.secondaryAction,
      closable: options.closable !== false,
      duration,
      position: options.position ?? "bottom-right",
    };
    setToasts((prev) => {
      const next = [...prev, data];
      // Evict oldest toasts beyond the global cap
      while (next.length > MAX_VISIBLE_TOASTS) {
        const evicted = next.shift()!;
        const t = timers.current.get(evicted.id);
        if (t) { clearTimeout(t); timers.current.delete(evicted.id); }
      }
      return next;
    });
    if (duration > 0) {
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
    }
    return id;
  }, [dismiss]);

  // Cleanup on unmount
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  return (
    <ToastCtx.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      {createPortal(
        <div dir="rtl">
          {ALL_POSITIONS.map((pos) => (
            <ToastStack
              key={pos}
              position={pos}
              toasts={toasts.filter((t) => t.position === pos)}
              onDismiss={dismiss}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}
