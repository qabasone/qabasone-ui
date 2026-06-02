import { ArrowRight, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Button } from "../atoms/Button";
import { StatusBadge } from "../atoms/StatusBadge";
import { Text, AmountText } from "../atoms/Typography";
import type { ReactNode } from "react";

export type DriverJournalStatus = "open" | "pending-review" | "reviewed" | "settled" | "discrepancy";

export interface DriverJournalCardProps {
    driverName: string;
    journalDate: string;
    status: DriverJournalStatus;
    totalSales: number;
    totalPurchases: number;
    expectedBalance?: number;
    actualBalance?: number;
    discrepancy?: number;
    currency?: string;
    onReview?: () => void;
    onSettle?: () => void;
    badgeIcon?: ReactNode;
}

const STATUS_MAP: Record<DriverJournalStatus, { label: string; variant: Parameters<typeof StatusBadge>[0]["variant"] }> = {
    open: { label: "مفتوحة", variant: "warning" },
    "pending-review": { label: "بانتظار المراجعة", variant: "warning" },
    reviewed: { label: "تمت المراجعة", variant: "success" },
    settled: { label: "متسوية", variant: "success" },
    discrepancy: { label: "يوجد فرق", variant: "critical" },
};

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export function DriverJournalCard({
    driverName,
    journalDate,
    status,
    totalSales,
    totalPurchases,
    expectedBalance,
    actualBalance,
    discrepancy,
    currency,
    onReview,
    onSettle,
    badgeIcon,
}: DriverJournalCardProps) {
    const statusConfig = STATUS_MAP[status];

    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Text as="p" variant="title-lg" tone="default">
                        {driverName}
                    </Text>
                    <Text as="p" variant="body-sm" tone="muted">
                        {journalDate}
                    </Text>
                </div>
                <div className="flex items-start gap-2">
                    <StatusBadge label={statusConfig.label} variant={statusConfig.variant} />
                    {badgeIcon ? <div className="mt-1">{badgeIcon}</div> : null}
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-muted p-4">
                    <Text as="p" variant="caption" tone="muted">
                        المبيعات
                    </Text>
                    <AmountText value={totalSales} currency={currency} variant="title-lg" />
                </div>
                <div className="rounded-3xl border border-border bg-muted p-4">
                    <Text as="p" variant="caption" tone="muted">
                        المشتريات
                    </Text>
                    <AmountText value={totalPurchases} currency={currency} variant="title-lg" />
                </div>
            </div>

            {(expectedBalance !== undefined || actualBalance !== undefined) && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {expectedBalance !== undefined ? (
                        <div className="rounded-3xl border border-border bg-card p-4">
                            <Text as="p" variant="caption" tone="muted">
                                المتوقع
                            </Text>
                            <AmountText value={expectedBalance} currency={currency} variant="title-lg" />
                        </div>
                    ) : null}
                    {actualBalance !== undefined ? (
                        <div className="rounded-3xl border border-border bg-card p-4">
                            <Text as="p" variant="caption" tone="muted">
                                الفعلي
                            </Text>
                            <AmountText value={actualBalance} currency={currency} variant="title-lg" />
                        </div>
                    ) : null}
                </div>
            )}

            {discrepancy !== undefined ? (
                <div className={cx("mt-4 rounded-3xl border p-4", discrepancy === 0 ? "border-success/20 bg-success/10" : "border-destructive/20 bg-destructive/10")}>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        {discrepancy === 0 ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
                        <span>{discrepancy === 0 ? "بدون فرق" : `فرق ${discrepancy} ${currency ?? ""}`}</span>
                    </div>
                </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
                {onReview ? (
                    <Button action="approve" size="sm" onClick={onReview}>
                        مراجعة
                    </Button>
                ) : null}
                {onSettle ? (
                    <Button action="collect" variant="secondary" size="sm" onClick={onSettle}>
                        تسوية
                    </Button>
                ) : null}
                <Button variant="ghost" size="sm" endIcon={<ArrowRight size={14} />}>
                    فتح التفاصيل
                </Button>
            </div>
        </div>
    );
}
