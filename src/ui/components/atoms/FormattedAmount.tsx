import { useState } from 'react';
import type { FormatAmountOptions } from '../../utils/formatAmount';
import { formatAmount } from '../../utils/formatAmount';
import { Text } from './Typography';

export interface FormattedAmountProps {
    value: number | null | undefined;
    /**  Text variant from Typography */
    variant?: 'body-sm' | 'body-lg' | 'caption' | 'title-sm' | 'title-lg' | 'title-xl';
    /**  Text tone/color */
    tone?: 'default' | 'muted' | 'success' | 'warning' | 'error';
    /**  Override format (auto, full, thousands, millions, billions) */
    format?: 'auto' | 'full' | 'thousands' | 'millions' | 'billions';
    /**  Override currency label */
    currencyLabel?: string;
    /**  Additional CSS class */
    className?: string;
    /**  Show full value on hover (tooltip) */
    showTooltip?: boolean;
}

/**
 * Formatted amount component with abbreviation support
 * Displays abbreviated amounts with full value in tooltip
 *
 * Examples:
 * - 950 جنيه
 * - 12.5 ألف
 * - 1.25 مليون
 * - 1.3 مليار (with tooltip showing 1,300,000,000 جنيه)
 */
export function FormattedAmount({
    value,
    variant = 'body-lg',
    tone = 'default',
    format,
    currencyLabel,
    className,
    showTooltip = true,
}: FormattedAmountProps) {
    const [showFull, setShowFull] = useState(false);

    const formatted = formatAmount(value, { format, currencyLabel, includeCurrency: true });

    return (
        <div className="relative inline-block">
            <Text
                as="span"
                variant={variant}
                tone={tone}
                className={className}
                title={showTooltip ? formatted.full : undefined}
                onMouseEnter={() => showTooltip && setShowFull(true)}
                onMouseLeave={() => showTooltip && setShowFull(false)}
                onClick={() => showTooltip && setShowFull(!showFull)}
                style={{ cursor: showTooltip ? 'help' : 'default' }}
            >
                {showFull && showTooltip ? formatted.full : formatted.display}
            </Text>

            {showTooltip && (
                <div
                    className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground/90 px-2 py-1 text-xs text-background opacity-0 transition-opacity duration-200 z-50"
                    style={{ opacity: showFull ? 1 : 0 }}
                >
                    {formatted.full}
                </div>
            )}
        </div>
    );
}
