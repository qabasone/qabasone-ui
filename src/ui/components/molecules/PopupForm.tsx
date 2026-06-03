import { useEffect, useMemo, useRef, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Loader2, X, type LucideIcon } from "lucide-react";
import { Button, type ButtonProps } from "../atoms/Button";
import { Text } from "../atoms/Typography";

type Direction = "rtl" | "ltr" | "auto";
type PopupFormSize = "sm" | "md" | "lg" | "xl";

export interface PopupFormAction {
  id: string;
  label: string;
  type?: "button" | "submit" | "reset";
  variant?: ButtonProps["variant"];
  action?: ButtonProps["action"];
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  onClick?: () => void;
}

export interface PopupFormLabels {
  close?: string;
}

export interface PopupFormProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  actions?: PopupFormAction[];
  secondaryActions?: ReactNode;
  headerActions?: ReactNode;
  footerNote?: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  labels?: PopupFormLabels;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  loading?: boolean;
  dir?: Direction;
  size?: PopupFormSize;
  portalTarget?: HTMLElement | null;
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
}

export interface PopupFormFieldProps {
  label: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const SIZE_WIDTH: Record<PopupFormSize, string> = {
  sm: "420px",
  md: "560px",
  lg: "720px",
  xl: "920px",
};

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

export function PopupFormField({
  label,
  children,
  description,
  error,
  required,
  fullWidth,
  className,
}: PopupFormFieldProps) {
  return (
    <label className={cx("grid gap-1.5", fullWidth && "sm:col-span-2", className)}>
      <span className="text-sm font-semibold text-foreground">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-xs text-destructive">{error}</span>
      ) : description ? (
        <span className="text-xs text-muted-foreground">{description}</span>
      ) : null}
    </label>
  );
}

export function PopupForm({
  open,
  title,
  description,
  eyebrow,
  children,
  actions,
  secondaryActions,
  headerActions,
  footerNote,
  onSubmit,
  onCancel,
  labels,
  closeOnBackdrop = true,
  closeOnEscape = true,
  loading = false,
  dir = "rtl",
  size = "md",
  portalTarget,
  className,
  bodyClassName,
  style,
}: PopupFormProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useMemo(() => `popup-form-title-${Math.random().toString(36).slice(2)}`, []);
  const descriptionId = description ? `${titleId}-description` : undefined;
  const closeLabel = labels?.close ?? "إغلاق";

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      const focusTarget =
        panelRef.current?.querySelector<HTMLElement>("[data-autofocus='true']")
        ?? panelRef.current?.querySelector<HTMLElement>(
          'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
        );
      focusTarget?.focus();
    }, 60);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && !loading) {
        event.stopPropagation();
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey, { capture: true });
    return () => document.removeEventListener("keydown", handleKey, { capture: true });
  }, [closeOnEscape, loading, onCancel, open]);

  if (!open) return null;
  const resolvedPortalTarget = portalTarget ?? (typeof document !== "undefined" ? document.body : null);
  if (!resolvedPortalTarget) return null;

  return createPortal(
    <div
      dir={dir}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ fontFamily: "var(--font-family)" }}
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
        className={cx("qbs-panel relative flex max-h-[88vh] w-full flex-col overflow-hidden", className)}
        style={{
          maxWidth: SIZE_WIDTH[size],
          boxShadow: "var(--shadow-modal)",
          animation: "modal-slide-in 0.22s cubic-bezier(0.16,1,0.3,1) both",
          ...style,
        }}
      >
        <header className="flex shrink-0 items-start gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            {eyebrow ? (
              <Text as="p" variant="caption" tone="muted" className="mb-1 font-semibold">
                {eyebrow}
              </Text>
            ) : null}
            <Text id={titleId} as="h2" variant="body-lg" className="font-semibold text-foreground">
              {title}
            </Text>
            {description ? (
              <Text id={descriptionId} as="p" variant="body-sm" tone="muted" className="mt-1">
                {description}
              </Text>
            ) : null}
          </div>
          {headerActions}
          <button
            type="button"
            className="qbs-focus flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={closeLabel}
            disabled={loading}
            onClick={onCancel}
          >
            <X size={16} />
          </button>
        </header>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.(event);
          }}
        >
          <div className={cx("dropdown-scroll min-h-0 flex-1 overflow-y-auto p-5", bodyClassName)}>
            {children}
          </div>

          {(actions?.length || secondaryActions || footerNote) ? (
            <footer className="flex shrink-0 flex-wrap items-center gap-2 border-t border-border px-5 py-4">
              {footerNote ? (
                <Text as="p" variant="caption" tone="muted" className="me-auto">
                  {footerNote}
                </Text>
              ) : null}
              {secondaryActions}
              {actions?.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    type={item.type ?? "button"}
                    size="sm"
                    variant={item.variant}
                    action={item.action}
                    disabled={loading || item.disabled || item.loading}
                    loading={item.loading}
                    iconComponent={Icon}
                    data-autofocus={item.autoFocus ? "true" : undefined}
                    onClick={item.onClick}
                  >
                    {item.loading ? "..." : item.label}
                  </Button>
                );
              })}
            </footer>
          ) : null}
        </form>
      </div>
    </div>,
    resolvedPortalTarget
  );
}
