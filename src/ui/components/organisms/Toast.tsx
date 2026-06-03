import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

type Direction = "rtl" | "ltr" | "auto";

export type ToastVariant = "info" | "success" | "warning" | "error";
export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  variant?: ToastVariant;
  title: string;
  description?: string;
  action?: ToastAction;
  secondaryAction?: ToastAction;
  closable?: boolean;
  duration?: number;
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

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastCtx = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

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

const POS_STYLE: Record<ToastPosition, React.CSSProperties> = {
  "top-right": { top: 16, right: 16 },
  "top-left": { top: 16, left: 16 },
  "bottom-right": { bottom: 16, right: 16 },
  "bottom-left": { bottom: 16, left: 16 },
};

export interface ToastItemProps {
  data: Pick<ToastData, "variant" | "title" | "description" | "action" | "secondaryAction" | "closable">;
  onDismiss?: () => void;
  animate?: boolean;
  closeAriaLabel?: string;
}

export function ToastItem({
  data,
  onDismiss,
  animate = true,
  closeAriaLabel = "Close",
}: ToastItemProps) {
  const { Icon, iconColor, iconBg, actionBg } = VARIANTS[data.variant];
  const expanded = !!data.description;

  return (
    <div
      className="qbs-panel flex items-start gap-3 relative"
      style={{
        boxShadow: "var(--shadow-popover)",
        padding: expanded ? "14px 16px" : "10px 14px",
        minWidth: expanded ? "300px" : "260px",
        maxWidth: "380px",
        animation: animate ? "toast-slide-in 0.22s cubic-bezier(0.16,1,0.3,1) both" : undefined,
      }}
    >
      <div
        className="rounded-lg flex items-center justify-center shrink-0"
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

      <div className="flex-1 min-w-0">
        {expanded ? (
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
                    className="qbs-focus h-7 px-3 rounded-lg text-xs text-white transition-opacity hover:opacity-85 active:opacity-75"
                    style={{ backgroundColor: actionBg, fontWeight: 600 }}
                  >
                    {data.action.label}
                  </button>
                )}
                {data.secondaryAction && (
                  <button
                    onClick={() => { data.secondaryAction!.onClick(); onDismiss?.(); }}
                    className="qbs-focus h-7 px-2 rounded-md text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    {data.secondaryAction.label}
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-foreground" style={{ fontWeight: 600 }}>
              {data.title}
            </span>
            {(data.action || data.secondaryAction) && (
              <div className="flex items-center gap-2 ms-auto">
                {data.action && (
                  <button
                    onClick={() => { data.action!.onClick(); onDismiss?.(); }}
                    className="qbs-focus h-7 px-3 rounded-lg text-xs text-white transition-opacity hover:opacity-85 active:opacity-75 shrink-0"
                    style={{ backgroundColor: actionBg, fontWeight: 600 }}
                  >
                    {data.action.label}
                  </button>
                )}
                {data.secondaryAction && (
                  <button
                    onClick={() => { data.secondaryAction!.onClick(); onDismiss?.(); }}
                    className="qbs-focus h-7 px-2 rounded-md text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
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

      {data.closable && (
        <button
          onClick={onDismiss}
          className="qbs-focus shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors self-start"
          aria-label={closeAriaLabel}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}

function ToastStack({
  toasts,
  position,
  onDismiss,
  closeAriaLabel,
}: {
  toasts: ToastData[];
  position: ToastPosition;
  onDismiss: (id: string) => void;
  closeAriaLabel: string;
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
          <ToastItem
            data={t}
            onDismiss={() => onDismiss(t.id)}
            closeAriaLabel={closeAriaLabel}
          />
        </div>
      ))}
    </div>
  );
}

const MAX_VISIBLE_TOASTS = 3;
const ALL_POSITIONS: ToastPosition[] = [
  "top-right", "top-left", "bottom-right", "bottom-left",
];

export interface ToastProviderProps {
  children: React.ReactNode;
  dir?: Direction;
  closeAriaLabel?: string;
  portalTarget?: HTMLElement | null;
}

export function ToastProvider({
  children,
  dir = "auto",
  closeAriaLabel = "Close",
  portalTarget,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
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
      while (next.length > MAX_VISIBLE_TOASTS) {
        const evicted = next.shift()!;
        const t = timers.current.get(evicted.id);
        if (t) {
          clearTimeout(t);
          timers.current.delete(evicted.id);
        }
      }
      return next;
    });
    if (duration > 0) {
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
    }
    return id;
  }, [dismiss]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const resolvedPortalTarget = portalTarget ?? (typeof document !== "undefined" ? document.body : null);

  return (
    <ToastCtx.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      {resolvedPortalTarget && createPortal(
        <div dir={dir}>
          {ALL_POSITIONS.map((pos) => (
            <ToastStack
              key={pos}
              position={pos}
              toasts={toasts.filter((t) => t.position === pos)}
              onDismiss={dismiss}
              closeAriaLabel={closeAriaLabel}
            />
          ))}
        </div>,
        resolvedPortalTarget
      )}
    </ToastCtx.Provider>
  );
}
