import type { ReactNode } from "react";
import { DocumentStatusBadge } from "../atoms/DocumentStatusBadge";
import { Text, AmountText } from "../atoms/Typography";
import { Button } from "../atoms/Button";

export interface DocumentStatusCardProps {
    title: string;
    documentCount: number;
    totalAmount: number;
    currency?: string;
    status: "draft" | "posted" | "cancelled" | "failed" | "pending-review" | "closed";
    subtitle?: string;
    onOpen?: () => void;
    actionLabel?: string;
    icon?: ReactNode;
}

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export function DocumentStatusCard({
    title,
    documentCount,
    totalAmount,
    currency,
    status,
    subtitle,
    onOpen,
    actionLabel = "فتح القائمة",
    icon,
}: DocumentStatusCardProps) {
    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Text as="p" variant="body-sm" tone="muted">
                        {title}
                    </Text>
                    <div className="mt-2 flex items-center gap-3">
                        {icon ? <div className="text-primary">{icon}</div> : null}
                        <Text as="p" variant="title-lg" tone="default">
                            {documentCount} مستندات
                        </Text>
                    </div>
                </div>
                <DocumentStatusBadge status={status} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-muted p-4">
                    <Text as="p" variant="caption" tone="muted">
                        القيمة الإجمالية
                    </Text>
                    <AmountText value={totalAmount} currency={currency} variant="title-lg" />
                </div>
                <div className="rounded-3xl border border-border bg-muted p-4">
                    <Text as="p" variant="caption" tone="muted">
                        نوع الحالة
                    </Text>
                    <Text as="p" variant="title-lg" tone="default">
                        {status}
                    </Text>
                </div>
            </div>

            {subtitle ? (
                <Text as="p" variant="body-sm" tone="muted" className="mt-4">
                    {subtitle}
                </Text>
            ) : null}

            {onOpen ? (
                <div className="mt-5">
                    <Button action="view" size="sm" onClick={onOpen}>
                        {actionLabel}
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
