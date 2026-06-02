import { useMemo } from "react";
import { Text } from "../atoms/Typography";
import type { ChangeEvent } from "react";

export interface MoneyInputProps {
    value: number | string;
    currency?: string;
    currencyPosition?: "prefix" | "suffix";
    label?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    onChange: (value: number | string) => void;
}

function formatValue(value: number | string) {
    if (value === "" || value === null || value === undefined) return "";
    const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
    if (Number.isNaN(num)) return String(value);

    try {
        return new Intl.NumberFormat("ar-EG").format(num);
    } catch {
        return String(num);
    }
}

function parseValue(value: string) {
    return Number(value.replace(/[٬٫,]/g, "").replace(/٫/g, "."));
}

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export function MoneyInput({
    value,
    currency,
    currencyPosition = "suffix",
    label,
    placeholder,
    error,
    required = false,
    disabled = false,
    readOnly = false,
    onChange,
}: MoneyInputProps) {
    const formatted = useMemo(() => formatValue(value), [value]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        const parsed = parseValue(next);
        onChange(Number.isNaN(parsed) ? next : parsed);
    };

    return (
        <label className="block text-right">
            {label ? (
                <Text as="span" variant="body-sm" tone="muted" className="mb-2 inline-block">
                    {label}{required ? " *" : ""}
                </Text>
            ) : null}
            <div
                className={cx(
                    "flex items-center gap-2 rounded-2xl border bg-input px-3 py-2",
                    error ? "border-destructive" : "border-border",
                    disabled || readOnly ? "opacity-60" : ""
                )}
            >
                {currency && currencyPosition === "prefix" ? (
                    <span className="text-sm text-muted-foreground">{currency}</span>
                ) : null}
                <input
                    type="text"
                    value={formatted}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled || readOnly}
                    readOnly={readOnly}
                    inputMode="decimal"
                    className="min-w-0 flex-1 bg-transparent text-right text-sm outline-none disabled:cursor-not-allowed"
                />
                {currency && currencyPosition === "suffix" ? (
                    <span className="text-sm text-muted-foreground">{currency}</span>
                ) : null}
            </div>
            {error ? <Text as="p" variant="caption" tone="error" className="mt-1 block">{error}</Text> : null}
        </label>
    );
}
