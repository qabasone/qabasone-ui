import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Typography";

type Direction = "rtl" | "ltr" | "auto";
type RowEditValue = string | number | boolean | null | undefined;
type RowEditValues = object;

export interface RowEditOption {
  value: string;
  label: string;
}

export interface RowEditField<TValues extends RowEditValues = RowEditValues> {
  id: Extract<keyof TValues, string>;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea" | "checkbox" | "readonly" | "custom";
  placeholder?: string;
  description?: ReactNode;
  options?: RowEditOption[];
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  inputMode?: "text" | "decimal" | "numeric" | "tel" | "email" | "url";
  render?: (params: {
    value: TValues[Extract<keyof TValues, string>];
    values: TValues;
    setValue: (value: RowEditValue) => void;
  }) => ReactNode;
}

export interface RowEditDialogLabels {
  save?: string;
  cancel?: string;
  close?: string;
  loading?: string;
}

export interface RowEditDialogProps<TValues extends RowEditValues = RowEditValues> {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  values: TValues;
  fields: RowEditField<TValues>[];
  onChange?: (values: TValues) => void;
  onSubmit: (values: TValues) => void;
  onCancel: () => void;
  labels?: RowEditDialogLabels;
  loading?: boolean;
  closeOnBackdrop?: boolean;
  dir?: Direction;
  portalTarget?: HTMLElement | null;
  className?: string;
  style?: CSSProperties;
  maxWidth?: number | string;
}

const DEFAULT_LABELS: Required<RowEditDialogLabels> = {
  save: "حفظ التعديلات",
  cancel: "إلغاء",
  close: "إغلاق",
  loading: "جاري الحفظ",
};

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function stringifyValue(value: RowEditValue) {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function RowEditDialog<TValues extends RowEditValues = RowEditValues>({
  open,
  title,
  description,
  values,
  fields,
  onChange,
  onSubmit,
  onCancel,
  labels,
  loading = false,
  closeOnBackdrop = true,
  dir = "rtl",
  portalTarget,
  className,
  style,
  maxWidth = 640,
}: RowEditDialogProps<TValues>) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [draft, setDraft] = useState<TValues>(values);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);
  const titleId = useMemo(() => `row-edit-title-${Math.random().toString(36).slice(2)}`, []);
  const descriptionId = description ? `${titleId}-description` : undefined;

  useEffect(() => {
    if (open) setDraft(values);
  }, [open, values]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        event.stopPropagation();
        onCancel();
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
  }, [loading, onCancel, open]);

  if (!open) return null;
  const resolvedPortalTarget = portalTarget ?? (typeof document !== "undefined" ? document.body : null);
  if (!resolvedPortalTarget) return null;

  const setValue = (fieldId: Extract<keyof TValues, string>, value: RowEditValue) => {
    setDraft((current) => {
      const next = { ...current, [fieldId]: value } as TValues;
      onChange?.(next);
      return next;
    });
  };

  const inputClass =
    "qbs-field qbs-focus h-10 w-full px-3 text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60";

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
        className={cx("qbs-panel relative flex max-h-[86vh] w-full flex-col overflow-hidden", className)}
        style={{
          maxWidth,
          boxShadow: "var(--shadow-modal)",
          animation: "modal-slide-in 0.22s cubic-bezier(0.16,1,0.3,1) both",
          ...style,
        }}
      >
        <header className="flex shrink-0 items-start gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <Text id={titleId} as="h2" variant="body-lg" className="font-semibold text-foreground">
              {title}
            </Text>
            {description ? (
              <Text id={descriptionId} as="p" variant="body-sm" tone="muted" className="mt-1">
                {description}
              </Text>
            ) : null}
          </div>
          <button
            type="button"
            className="qbs-focus flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={text.close}
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
            onSubmit(draft);
          }}
        >
          <div className="dropdown-scroll grid gap-4 overflow-y-auto p-5 sm:grid-cols-2">
            {fields.map((field, index) => {
              const rawValue = draft[field.id];
              const value = rawValue as RowEditValue;
              const focusRef = (
                node: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
              ) => {
                if (index === 0) firstFieldRef.current = node;
              };
              const commonProps = {
                id: field.id,
                name: field.id,
                disabled: field.disabled || loading,
                required: field.required,
                readOnly: field.readOnly,
                "aria-describedby": field.description ? `${field.id}-description` : undefined,
              };

              return (
                <label key={field.id} className={cx("grid gap-1.5", field.fullWidth && "sm:col-span-2")}>
                  <span className="text-sm font-semibold text-foreground">
                    {field.label}
                    {field.required ? <span className="text-destructive"> *</span> : null}
                  </span>

                  {field.type === "custom" && field.render ? (
                    field.render({
                      value: rawValue,
                      values: draft,
                      setValue: (nextValue) => setValue(field.id, nextValue),
                    })
                  ) : field.type === "select" ? (
                    <select
                      {...commonProps}
                      ref={focusRef}
                      value={stringifyValue(value)}
                      onChange={(event) => setValue(field.id, event.target.value)}
                      className={cx(inputClass, "appearance-none pe-9")}
                    >
                      {field.placeholder ? <option value="">{field.placeholder}</option> : null}
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      {...commonProps}
                      ref={focusRef}
                      value={stringifyValue(value)}
                      onChange={(event) => setValue(field.id, event.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className={cx(inputClass, "h-auto resize-none py-2")}
                    />
                  ) : field.type === "checkbox" ? (
                    <span className="flex h-10 items-center gap-2">
                      <input
                        {...commonProps}
                        ref={focusRef}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(event) => setValue(field.id, event.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                    </span>
                  ) : field.type === "readonly" ? (
                    <input
                      {...commonProps}
                      ref={focusRef}
                      value={stringifyValue(value)}
                      readOnly
                      className={cx(inputClass, "bg-muted")}
                    />
                  ) : (
                    <input
                      {...commonProps}
                      ref={focusRef}
                      type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                      inputMode={field.inputMode}
                      value={stringifyValue(value)}
                      onChange={(event) => setValue(field.id, field.type === "number" ? event.target.value : event.target.value)}
                      placeholder={field.placeholder}
                      className={cx(inputClass, field.type === "number" || field.type === "date" ? "amount" : undefined)}
                    />
                  )}

                  {field.description ? (
                    <span id={`${field.id}-description`} className="text-xs text-muted-foreground">
                      {field.description}
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>

          <footer className="flex shrink-0 flex-wrap items-center justify-start gap-2 border-t border-border px-5 py-4">
            <Button type="button" variant="outline" size="sm" disabled={loading} onClick={onCancel}>
              {text.cancel}
            </Button>
            <Button type="submit" size="sm" disabled={loading} startIcon={loading ? <Loader2 size={15} className="animate-spin" /> : undefined}>
              {loading ? text.loading : text.save}
            </Button>
          </footer>
        </form>
      </div>
    </div>,
    resolvedPortalTarget
  );
}
