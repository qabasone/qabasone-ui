import type { HTMLAttributes } from "react";
import { Text } from "./Typography";

export type StockStatus = "normal" | "low" | "zero" | "disabled";

export interface UnitConversion {
    unit: string;
    quantity: number;
}

export interface StockQuantityDisplayProps extends HTMLAttributes<HTMLDivElement> {
    baseQuantity: number;
    baseUnit: string;
    conversions?: UnitConversion[];
    status?: StockStatus;
    thresholdLabel?: string;
}

const STATUS_LABEL: Record<StockStatus, string> = {
    normal: "رصيد متوفر",
    low: "رصيد قليل",
    zero: "رصيد صفر",
    disabled: "موقّف",
};

export function StockQuantityDisplay({
    baseQuantity,
    baseUnit,
    conversions = [],
    status = "normal",
    thresholdLabel,
    className,
    ...props
}: StockQuantityDisplayProps) {
    return (
        <div className={className} {...props}>
            <div className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <Text as="p" variant="body-sm" tone="muted">
                            الرصيد الأساسي
                        </Text>
                        <Text as="p" variant="title-lg" tone={status === "zero" || status === "low" ? "error" : "default"}>
                            {baseQuantity} {baseUnit}
                        </Text>
                    </div>
                    <Text as="span" variant="caption" tone={status === "zero" || status === "low" ? "error" : "muted"}>
                        {STATUS_LABEL[status]}
                    </Text>
                </div>

                {conversions.length > 0 ? (
                    <div className="grid gap-2">
                        {conversions.map((conversion) => (
                            <div key={conversion.unit} className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                                <span>{conversion.unit}</span>
                                <span>{conversion.quantity}</span>
                            </div>
                        ))}
                    </div>
                ) : null}

                {thresholdLabel ? (
                    <Text as="p" variant="caption" tone="muted">
                        {thresholdLabel}
                    </Text>
                ) : null}
            </div>
        </div>
    );
}
