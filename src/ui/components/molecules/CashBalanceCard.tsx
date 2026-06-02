import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Typography";
import { FormattedAmount } from "../atoms";
import type { ReactNode } from "react";

export interface CashBalanceCardProps {
    title: string;
    balance: number;
    currency?: string;
    status?: "positive" | "zero" | "negative" | "locked";
    subtitle?: string;
    icon?: ReactNode;
    onView?: () => void;
}

const STATUS_STYLES: Record<CashBalanceCardProps["status"], string> = {
    positive: "border border-success/20 bg-success/10 text-success-foreground",
    zero: "border border-muted bg-muted text-muted-foreground",
    negative: "border border-destructive/20 bg-destructive/10 text-destructive-foreground",
    locked: "border border-warning/20 bg-warning/10 text-warning-foreground",
};

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export function CashBalanceCard({
    title,
    balance,
    currency,
    status = "positive",
    subtitle,
    icon,
    onView,
}: CashBalanceCardProps) {
    return (
        <div className={cx("rounded-3xl p-5 shadow-sm", STATUS_STYLES[status])}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Text as="p" variant="body-sm" tone="muted">
                        {title}
                    </Text>
                    <div className="mt-2 flex items-center gap-2">
                        <FormattedAmount value={balance} variant="display-2xl" tone={status === "negative" ? "error" : "default"} format="auto" showTooltip={true} />
                    </div>
                    {subtitle ? (
                        <Text as="p" variant="body-sm" tone="muted" className="mt-2">
                            {subtitle}
                        </Text>
                    ) : null}
                </div>
                {icon ? <div className="shrink-0">{icon}</div> : null}
            </div>
            {onView ? (
                <div className="mt-5 flex justify-end">
                    <Button action="view" variant="outline" size="sm" endIcon={onView ? <ChevronLeft size={14} /> : undefined} onClick={onView}>
                        عرض الحركة
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
