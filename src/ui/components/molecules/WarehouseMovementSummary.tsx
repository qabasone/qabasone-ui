import { Text } from "../atoms/Typography";
import { FormattedQuantity } from "../atoms";
import type { ReactNode } from "react";

export interface WarehouseMovementSummaryProps {
    warehouseName: string;
    incoming: number;
    outgoing: number;
    net: number;
    unit?: string;
    statusLabel?: string;
    icon?: ReactNode;
}

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export function WarehouseMovementSummary({
    warehouseName,
    incoming,
    outgoing,
    net,
    unit,
    statusLabel,
    icon,
}: WarehouseMovementSummaryProps) {
    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Text as="p" variant="body-sm" tone="muted">
                        المخزن
                    </Text>
                    <Text as="p" variant="title-lg" tone="default">
                        {warehouseName}
                    </Text>
                </div>
                {icon ? <div className="shrink-0">{icon}</div> : null}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-border bg-muted p-4">
                    <Text as="p" variant="caption" tone="muted">
                        الداخل
                    </Text>
                    <FormattedQuantity value={incoming} unit={unit as any} variant="title-lg" autoConvert={true} />
                </div>
                <div className="rounded-3xl border border-border bg-muted p-4">
                    <Text as="p" variant="caption" tone="muted">
                        الخارج
                    </Text>
                    <FormattedQuantity value={outgoing} unit={unit as any} variant="title-lg" autoConvert={true} />
                </div>
                <div className="rounded-3xl border border-border bg-muted p-4">
                    <Text as="p" variant="caption" tone="muted">
                        الصافي
                    </Text>
                    <FormattedQuantity value={net} unit={unit as any} variant="title-lg" autoConvert={true} />
                </div>
            </div>

            {statusLabel ? (
                <Text as="p" variant="body-sm" tone="muted" className="mt-4">
                    {statusLabel}
                </Text>
            ) : null}
        </div>
    );
}
