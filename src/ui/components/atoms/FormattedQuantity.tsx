import { useState } from 'react';
import { Text, type TypographyTone, type TypographyVariant } from './Typography';

export type QuantityUnit = 'كيلو' | 'طن' | 'أردب صغير' | 'أردب كبير' | 'عبوة' | 'كيس';

export interface FormattedQuantityProps {
    value: number;
    /** Unit of measurement */
    unit: QuantityUnit;
    /** Text variant from Typography */
    variant?: TypographyVariant;
    /** Text tone/color */
    tone?: TypographyTone;
    /** Auto-convert to larger units (e.g., 12,500 كيلو → 12.5 طن) */
    autoConvert?: boolean;
    /** Show original unit in parentheses when converted */
    showOriginalUnit?: boolean;
    /** Decimal places for converted quantities */
    decimalPlaces?: number;
    /** Additional CSS class */
    className?: string;
    /** Show full value on hover */
    showTooltip?: boolean;
}

/**
 * Unit conversion factors (to base unit: كيلو)
 */
const UNIT_CONVERSIONS: Record<QuantityUnit, number> = {
    'كيلو': 1,
    'طن': 1000,
    'أردب صغير': 75,
    'أردب كبير': 150,
    'عبوة': 50,
    'كيس': 25,
};

/**
 * Auto-convert quantity to most readable unit
 */
function autoConvertQuantity(value: number, unit: QuantityUnit, decimalPlaces: number = 2): { display: string; full: string } {
    const kilos = value * UNIT_CONVERSIONS[unit];

    // If already in kilos and under 1000, show as is
    if (unit === 'كيلو' && kilos < 1000) {
        const formatted = formatNumber(value, decimalPlaces);
        return { display: `${formatted} ${unit}`, full: `${formatted} ${unit}` };
    }

    // Convert to tons if over 1000 kilos
    if (kilos >= 1000) {
        const tons = kilos / 1000;
        const formatted = formatNumber(tons, decimalPlaces);
        return {
            display: `${formatted} طن`,
            full: `${formatted} طن (${formatNumber(kilos, 0)} كيلو)`,
        };
    }

    // Otherwise, keep original unit
    const formatted = formatNumber(value, decimalPlaces);
    return { display: `${formatted} ${unit}`, full: `${formatted} ${unit}` };
}

/**
 * Format number with decimal places
 */
function formatNumber(value: number, decimalPlaces: number): string {
    if (decimalPlaces === 0) {
        return Math.round(value).toLocaleString('ar-EG');
    }
    return value.toFixed(decimalPlaces).replace(/\.?0+$/, '');
}

/**
 * Formatted quantity component for inventory/stock quantities
 *
 * Examples:
 * - 950 كيلو
 * - 12.5 طن (12,500 كيلو)
 * - 20 أردب صغير
 */
export function FormattedQuantity({
    value,
    unit,
    variant = 'body-lg',
    tone = 'default',
    autoConvert = true,
    showOriginalUnit = true,
    decimalPlaces = 2,
    className,
    showTooltip = true,
}: FormattedQuantityProps) {
    const [showFull, setShowFull] = useState(false);

    const converted = autoConvert ? autoConvertQuantity(value, unit, decimalPlaces) : { display: `${formatNumber(value, decimalPlaces)} ${unit}`, full: `${formatNumber(value, decimalPlaces)} ${unit}` };

    const fullValue = showOriginalUnit && showFull ? converted.full : converted.display;

    return (
        <div className="relative inline-block">
            <Text
                as="span"
                variant={variant}
                tone={tone}
                className={className}
                title={showTooltip && converted.full !== converted.display ? converted.full : undefined}
                onMouseEnter={() => showTooltip && converted.full !== converted.display && setShowFull(true)}
                onMouseLeave={() => showTooltip && setShowFull(false)}
                onClick={() => showTooltip && converted.full !== converted.display && setShowFull(!showFull)}
                style={{ cursor: showTooltip && converted.full !== converted.display ? 'help' : 'default' }}
            >
                {fullValue}
            </Text>

            {showTooltip && converted.full !== converted.display && (
                <div
                    className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground/90 px-2 py-1 text-xs text-background opacity-0 transition-opacity duration-200 z-50"
                    style={{ opacity: showFull ? 1 : 0 }}
                >
                    {converted.full}
                </div>
            )}
        </div>
    );
}
