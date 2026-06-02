import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Scale, CircleDashed } from "lucide-react";
import { Text } from "../atoms/Typography";
import { FormattedAmount } from "../atoms";
import { Button } from "../atoms/Button";

export interface TradingSummaryCardProps {
    title: string;
    salesAmount: number;
    purchaseAmount: number;
    netAmount: number;
    currency?: string;
    paymentType?: "cash" | "credit" | "mixed";
    subtitle?: string;
    onDetails?: () => void;
    actionLabel?: string;
    icon?: ReactNode;
}

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export function TradingSummaryCard({
    title,
    salesAmount,
    purchaseAmount,
    netAmount,
    currency,
    paymentType,
    subtitle,
    onDetails,
    actionLabel = "عرض التفاصيل",
    icon,
}: TradingSummaryCardProps) {
    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Text as="p" variant="body-sm" tone="muted">
                        {title}
                    </Text>
                    <div className="mt-2 flex items-center gap-2">
                        {icon ? <div className="text-primary">{icon}</div> : <Scale size={20} className="text-primary" />}
                        <Text as="p" variant="title-xl" tone="default">
                            {paymentType ? `${paymentType}` : "ملخص"}
                        </Text>
                    </div>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-border bg-muted p-4">
                    <Text as="p" variant="caption" tone="muted">
                        مبيعات اليوم
                    </Text>
                    <FormattedAmount value={salesAmount} variant="title-lg" tone="default" format="auto" showTooltip={true} />
                </div>
                <div className="rounded-3xl border border-border bg-muted p-4">
                    <Text as="p" variant="caption" tone="muted">
                        مشتريات اليوم
                    </Text>
                    <FormattedAmount value={purchaseAmount} variant="title-lg" tone="default" format="auto" showTooltip={true} />
                </div>
                <div className="rounded-3xl border border-border bg-muted p-4">
                    <Text as="p" variant="caption" tone="muted">
                        الصافي
                    </Text>
                    <FormattedAmount value={netAmount} variant="title-lg" tone={netAmount >= 0 ? "default" : "error"} format="auto" showTooltip={true} />
                </div>
            </div>

            {subtitle ? (
                <Text as="p" variant="body-sm" tone="muted" className="mt-4">
                    {subtitle}
                </Text>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
                {onDetails ? (
                    <Button action="view" size="sm" onClick={onDetails} endIcon={<ArrowUpRight size={14} />}>
                        {actionLabel}
                    </Button>
                ) : null}
                <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-sm text-muted-foreground">
                    <CircleDashed size={14} />
                    <span>{paymentType ? `نوع الدفع: ${paymentType}` : "نوع الدفع غير محدد"}</span>
                </div>
            </div>
        </div>
    );
}
