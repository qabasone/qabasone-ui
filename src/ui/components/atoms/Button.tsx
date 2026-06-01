import type { ButtonHTMLAttributes, CSSProperties, ElementType, ReactNode } from "react";
import { Loader2, type LucideProps } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "warning"
  | "info";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type AccountingButtonAction =
  | "save"
  | "cancel"
  | "delete"
  | "edit"
  | "create"
  | "post"
  | "print"
  | "export"
  | "send"
  | "approve"
  | "reject"
  | "collect"
  | "refund"
  | "archive"
  | "duplicate"
  | "back";

const VARIANT_STYLES: Record<ButtonVariant, { className: string; style?: CSSProperties }> = {
  primary: { className: "bg-primary text-primary-foreground" },
  secondary: { className: "bg-secondary text-secondary-foreground border border-border" },
  outline: { className: "border border-border text-foreground bg-transparent" },
  ghost: { className: "text-foreground bg-transparent" },
  danger: { className: "bg-destructive text-destructive-foreground" },
  success: { className: "bg-success text-success-foreground" },
  warning: {
    className: "text-white",
    style: { backgroundColor: "var(--warning)" },
  },
  info: {
    className: "text-white",
    style: { backgroundColor: "var(--info)" },
  },
};

const ACTION_VARIANT: Record<AccountingButtonAction, ButtonVariant> = {
  save: "primary",
  cancel: "secondary",
  delete: "danger",
  edit: "outline",
  create: "primary",
  post: "success",
  print: "secondary",
  export: "outline",
  send: "ghost",
  approve: "success",
  reject: "danger",
  collect: "primary",
  refund: "warning",
  archive: "secondary",
  duplicate: "outline",
  back: "ghost",
};

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function resolveSize(size: ButtonSize, iconOnly: boolean) {
  if (iconOnly) {
    if (size === "xs") return "w-7 h-7";
    if (size === "sm") return "w-8 h-8";
    if (size === "lg") return "w-11 h-11";
    return "w-10 h-10";
  }

  if (size === "xs") return "h-7 px-2.5 text-xs";
  if (size === "sm") return "h-8 px-3 text-sm";
  if (size === "lg") return "h-11 px-5 text-base";
  return "h-10 px-4 text-sm";
}

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  action?: AccountingButtonAction;
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  iconOnly?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  iconComponent?: ElementType<LucideProps>;
}

export function Button({
  action,
  variant,
  size = "md",
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  iconOnly = false,
  fullWidth = false,
  className,
  style,
  children,
  type = "button",
  iconComponent: IconComponent,
  ...props
}: ButtonProps) {
  const resolvedVariant = variant ?? (action ? ACTION_VARIANT[action] : "primary");
  const variantStyle = VARIANT_STYLES[resolvedVariant];

  const iconNode = IconComponent ? <IconComponent size={16} /> : undefined;
  const resolvedStartIcon = startIcon ?? iconNode;

  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 font-medium hover:opacity-90 active:opacity-80",
        resolveSize(size, iconOnly),
        variantStyle.className,
        fullWidth && "w-full",
        className
      )}
      style={{ ...variantStyle.style, ...style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin shrink-0" /> : resolvedStartIcon}
      {!iconOnly && children}
      {!iconOnly && endIcon}
    </button>
  );
}
