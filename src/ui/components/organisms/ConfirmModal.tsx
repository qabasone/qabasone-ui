import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Trash2, AlertTriangle, Info, CheckCircle2, HelpCircle, Loader2,
} from "lucide-react";

type Direction = "rtl" | "ltr" | "auto";

const VARIANTS = {
  danger: {
    iconBg: "var(--destructive-muted)",
    iconColor: "var(--destructive)",
    btnBg: "var(--destructive)",
    btnColor: "var(--destructive-foreground)",
    btnHover: "color-mix(in srgb, var(--destructive) 88%, black)",
    defaultIcon: Trash2,
  },
  warning: {
    iconBg: "var(--warning-muted)",
    iconColor: "var(--warning)",
    btnBg: "var(--warning)",
    btnColor: "var(--warning-foreground)",
    btnHover: "color-mix(in srgb, var(--warning) 88%, black)",
    defaultIcon: AlertTriangle,
  },
  info: {
    iconBg: "var(--info-muted)",
    iconColor: "var(--info)",
    btnBg: "var(--info)",
    btnColor: "var(--info-foreground)",
    btnHover: "color-mix(in srgb, var(--info) 88%, black)",
    defaultIcon: Info,
  },
  success: {
    iconBg: "var(--success-muted)",
    iconColor: "var(--success)",
    btnBg: "var(--success)",
    btnColor: "var(--success-foreground)",
    btnHover: "color-mix(in srgb, var(--success) 88%, black)",
    defaultIcon: CheckCircle2,
  },
  neutral: {
    iconBg: "var(--primary-muted)",
    iconColor: "var(--primary)",
    btnBg: "var(--primary)",
    btnColor: "var(--primary-foreground)",
    btnHover: "color-mix(in srgb, var(--primary) 88%, black)",
    defaultIcon: HelpCircle,
  },
} as const;

const DEFAULT_CONFIRM_LABELS = {
  danger: "Delete",
  warning: "Confirm",
  info: "OK",
  success: "Confirm",
  neutral: "Confirm",
} as const;

export type ConfirmVariant = keyof typeof VARIANTS;

interface ConfirmModalTexts {
  cancelLabel?: string;
  confirmLabels?: Partial<Record<ConfirmVariant, string>>;
}

export interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description?: React.ReactNode;
  variant?: ConfirmVariant;
  icon?: React.ElementType;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  closeOnBackdrop?: boolean;
  checkboxLabel?: string;
  checkboxChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  dir?: Direction;
  texts?: ConfirmModalTexts;
  portalTarget?: HTMLElement | null;
}

export function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  variant = "neutral",
  icon,
  confirmLabel,
  cancelLabel,
  loading = false,
  closeOnBackdrop = true,
  checkboxLabel,
  checkboxChecked = false,
  onCheckboxChange,
  dir = "auto",
  texts,
  portalTarget,
}: ConfirmModalProps) {
  const cfg = VARIANTS[variant];
  const Icon = icon ?? cfg.defaultIcon;

  const resolvedConfirmLabel = confirmLabel
    ?? texts?.confirmLabels?.[variant]
    ?? DEFAULT_CONFIRM_LABELS[variant];
  const resolvedCancelLabel = cancelLabel ?? texts?.cancelLabel ?? "Cancel";

  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      (variant === "danger" ? cancelRef : confirmRef).current?.focus();
    }, 60);
    return () => clearTimeout(timer);
  }, [open, variant]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
      }
    };
    document.addEventListener("keydown", handler, { capture: true });
    return () => document.removeEventListener("keydown", handler, { capture: true });
  }, [open, onCancel]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const focusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const els = focusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  if (!open) return null;
  const resolvedPortalTarget = portalTarget ?? (typeof document !== "undefined" ? document.body : null);
  if (!resolvedPortalTarget) return null;

  return createPortal(
    <div
      dir={dir}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby={description ? "confirm-desc" : undefined}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 10000, fontFamily: "var(--font-family)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(2px)",
          animation: "modal-backdrop-in 0.18s ease both",
        }}
        onClick={closeOnBackdrop && !loading ? onCancel : undefined}
      />

      <div
        ref={panelRef}
        className="qbs-panel relative w-full"
        style={{
          maxWidth: "400px",
          boxShadow: "var(--shadow-modal)",
          animation: "modal-slide-in 0.22s cubic-bezier(0.16,1,0.3,1) both",
          padding: "24px",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: cfg.iconBg }}
        >
          <Icon size={22} style={{ color: cfg.iconColor }} strokeWidth={2.2} />
        </div>

        <h2
          id="confirm-title"
          style={{ color: "var(--foreground)", marginBottom: description ? "8px" : "20px" }}
        >
          {title}
        </h2>

        {description && (
          <p
            id="confirm-desc"
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)", marginBottom: "20px" }}
          >
            {description}
          </p>
        )}

        <div className="flex items-center gap-3">
          {checkboxLabel && onCheckboxChange && (
            <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
              <div className="relative shrink-0">
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  onChange={e => onCheckboxChange(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-4 h-4 rounded flex items-center justify-center transition-all"
                  style={{
                    border: `1.5px solid ${checkboxChecked ? cfg.iconColor : "var(--border-strong)"}`,
                    backgroundColor: checkboxChecked ? cfg.iconBg : "transparent",
                  }}
                >
                  {checkboxChecked && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke={cfg.iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                {checkboxLabel}
              </span>
            </label>
          )}

          {!checkboxLabel && <div className="flex-1" />}

          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={loading}
            className="qbs-focus h-9 px-4 rounded-lg text-sm transition-all disabled:opacity-40 hover:bg-muted"
            style={{
              border: "1.5px solid var(--border-strong)",
              backgroundColor: "var(--card)",
              color: "var(--foreground)",
              fontWeight: 500,
            }}
          >
            {resolvedCancelLabel}
          </button>

          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className="qbs-focus h-9 px-4 rounded-lg text-sm transition-all disabled:opacity-60 flex items-center gap-2 hover:opacity-90"
            style={{
              backgroundColor: cfg.btnBg,
              color: cfg.btnColor,
              fontWeight: 600,
              minWidth: "80px",
              justifyContent: "center",
            }}
          >
            {loading && <Loader2 size={14} className="animate-spin shrink-0" />}
            {resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </div>,
    resolvedPortalTarget
  );
}
