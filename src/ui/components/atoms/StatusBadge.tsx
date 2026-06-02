import type { HTMLAttributes, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

const VARIANT_STYLES: Record<string, { className: string; title: string }> = {
    normal: { className: "bg-muted text-foreground", title: "معلومات" },
    success: { className: "bg-success text-success-foreground", title: "ناجح" },
    warning: { className: "bg-warning text-warning-foreground", title: "تنبيه" },
    critical: { className: "bg-destructive text-destructive-foreground", title: "خطأ" },
    info: { className: "bg-info text-info-foreground", title: "معلومات" },
    draft: { className: "bg-muted text-foreground", title: "مسودة" },
    posted: { className: "bg-success text-success-foreground", title: "مرحّل" },
    cancelled: { className: "bg-muted text-foreground", title: "ملغى" },
    failed: { className: "bg-destructive text-destructive-foreground", title: "فشل" },
};

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    label: string;
    variant?: keyof typeof VARIANT_STYLES;
    icon?: ReactNode;
    size?: "sm" | "md";
    title?: string;
}

export function StatusBadge({
    label,
    variant = "normal",
    icon,
    size = "md",
    title,
    className,
    ...props
}: StatusBadgeProps) {
    const resolved = VARIANT_STYLES[variant] ?? VARIANT_STYLES.normal;
    const defaultIcon =
        variant === "success"
            ? <CheckCircle2 size={14} />
            : variant === "warning"
                ? <AlertTriangle size={14} />
                : variant === "critical"
                    ? <XCircle size={14} />
                    : <Info size={14} />;

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1 rounded-full px-2.5 font-medium",
                size === "sm" ? "h-7 text-xs" : "h-8 text-sm",
                resolved.className,
                className
            )}
            title={title ?? resolved.title}
            {...props}
        >
            <span className="shrink-0">{icon ?? defaultIcon}</span>
            <span>{label}</span>
        </span>
    );
}
