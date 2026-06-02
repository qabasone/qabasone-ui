import { useMemo } from "react";
import type { ChangeEvent } from "react";
import { Text } from "../atoms/Typography";

export type PeriodPreset = "today" | "last7days" | "month" | "custom";

export interface DateRange {
    start: string;
    end: string;
}

export interface PeriodFilterProps {
    selectedPeriod: PeriodPreset;
    dateRange: DateRange;
    onPeriodChange: (period: PeriodPreset) => void;
    onRangeChange: (range: DateRange) => void;
    presets?: Array<{ value: PeriodPreset; label: string }>;
    disabled?: boolean;
}

const DEFAULT_PRESETS: Array<{ value: PeriodPreset; label: string }> = [
    { value: "today", label: "اليوم" },
    { value: "last7days", label: "آخر 7 أيام" },
    { value: "month", label: "الشهر الحالي" },
    { value: "custom", label: "مخصص" },
];

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export function PeriodFilter({
    selectedPeriod,
    dateRange,
    onPeriodChange,
    onRangeChange,
    presets = DEFAULT_PRESETS,
    disabled = false,
}: PeriodFilterProps) {
    const hasCustom = selectedPeriod === "custom";
    const formattedRange = useMemo(() => `${dateRange.start} — ${dateRange.end}`, [dateRange]);

    const handleDateChange = (field: keyof DateRange) => (event: ChangeEvent<HTMLInputElement>) => {
        onRangeChange({ ...dateRange, [field]: event.target.value });
    };

    return (
        <div className={cx("rounded-3xl border border-border bg-card p-4 shadow-sm", disabled && "opacity-60 pointer-events-none")}>
            <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset.value}
                        type="button"
                        onClick={() => onPeriodChange(preset.value)}
                        className={cx(
                            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                            selectedPeriod === preset.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground hover:bg-secondary"
                        )}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                    <Text as="p" variant="caption" tone="muted">
                        الفترة المحددة
                    </Text>
                    <div className="mt-2 text-sm text-foreground">{formattedRange}</div>
                </div>
                {hasCustom ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm text-foreground">
                            <span>من</span>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={handleDateChange("start")}
                                className="rounded-xl border border-border bg-input px-3 py-2 text-sm"
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-foreground">
                            <span>إلى</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={handleDateChange("end")}
                                className="rounded-xl border border-border bg-input px-3 py-2 text-sm"
                            />
                        </label>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
