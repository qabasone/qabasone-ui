import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { AmountText, Text } from "../atoms/Typography";

const CARD_VARIANTS: Record<
    "normal" | "success" | "warning" | "critical" | "muted",
    string
> = {
    normal: "bg-card text-foreground",
    success: "bg-success/10 text-success-foreground border border-success/20",
    warning: "bg-warning/10 text-warning-foreground border border-warning/20",
    critical: "bg-destructive/10 text-destructive-foreground border border-destructive/20",
    muted: "bg-muted text-muted-foreground",
};

const TREND_ICONS = {
    up: <TrendingUp size={14} />,
    down: <TrendingDown size={14} />,
    neutral: <ChevronRight size={14} className="rotate-90" />,
};

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export interface SummaryCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon?: ReactNode;
    status?: "normal" | "success" | "warning" | "critical" | "muted";
    trend?: {
        direction: "up" | "down" | "neutral";
        description?: string;
    };
    onClick?: () => void;
    subtitle?: string;
    className?: string;
}

export function SummaryCard({
    label,
    value,
    unit,
    icon,
    status = "normal",
    trend,
    onClick,
    subtitle,
    className,
}: SummaryCardProps) {
    const clickable = Boolean(onClick);

    return (
        <div
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={onClick}
            onKeyDown={(event) => {
                if (clickable && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onClick?.();
                }
            }}
            className={cx(
                "rounded-3xl border p-5 shadow-sm transition-all duration-150",
                CARD_VARIANTS[status],
                clickable ? "cursor-pointer hover:shadow-md" : "",
                className
            )}
            aria-label={clickable ? `${label} - اضغط للمزيد` : label}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                    <Text as="p" variant="caption" tone="muted">
                        {label}
                    </Text>
                    <div className="flex items-center gap-2">
                        <AmountText value={value} currency={unit} numericSystem="arabic-indic" variant="display-2xl" />
                    </div>
                    {subtitle ? (
                        <Text as="p" variant="body-sm" tone="muted">
                            {subtitle}
                        </Text>
                    ) : null}
                </div>
                {icon ? <div className="shrink-0">{icon}</div> : null}
            </div>

            {trend ? (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{TREND_ICONS[trend.direction]}</span>
                    <span>{trend.description ?? (trend.direction === "up" ? "صاعد" : trend.direction === "down" ? "نازل" : "مستقر")}</span>
                </div>
            ) : null}
        </div>
    );
}
