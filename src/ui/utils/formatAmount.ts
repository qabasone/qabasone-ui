/**
 * Utility functions for formatting money amounts and quantities
 * Implements the standardization rule from MONEY stories
 */

import type { AmountDisplayFormat } from '../config/formatting.config';
import { FormattingSettings } from '../config/formatting.config';

export interface FormatAmountOptions {
    /** Override the default format */
    format?: AmountDisplayFormat;
    /** Override currency label */
    currencyLabel?: string;
    /** Number of decimal places */
    decimalPlaces?: number;
    /** Include currency in output */
    includeCurrency?: boolean;
    /** Custom thousand separator */
    thousandSeparator?: ',' | ' ';
    /** Custom decimal separator */
    decimalSeparator?: '.' | ',';
}

/**
 * Standardization rule:
 * - < 1,000: 950 جنيه
 * - 1,000 to < 1,000,000: 12.5 ألف
 * - 1,000,000 to < 1,000,000,000: 1.25 مليون
 * - ≥ 1,000,000,000: 1.3 مليار
 */
function formatAmountAuto(value: number, options: FormatAmountOptions): string {
    const { currencyLabel = 'جنيه', decimalPlaces = 2, thousandSeparator = ',', decimalSeparator = '.' } = options;

    const absValue = Math.abs(value);
    let formatted: string;
    let unit = '';

    if (absValue < 1000) {
        // Under 1,000: show full number
        formatted = formatFullNumber(value, { thousandSeparator, decimalSeparator, decimalPlaces });
        unit = currencyLabel;
    } else if (absValue < 1000000) {
        // 1,000 to < 1,000,000: show in thousands
        const thousands = value / 1000;
        formatted = formatDecimal(thousands, decimalPlaces, decimalSeparator);
        unit = `ألف ${currencyLabel}`;
    } else if (absValue < 1000000000) {
        // 1,000,000 to < 1,000,000,000: show in millions
        const millions = value / 1000000;
        formatted = formatDecimal(millions, decimalPlaces, decimalSeparator);
        unit = `مليون ${currencyLabel}`;
    } else {
        // ≥ 1,000,000,000: show in billions
        const billions = value / 1000000000;
        formatted = formatDecimal(billions, decimalPlaces, decimalSeparator);
        unit = `مليار ${currencyLabel}`;
    }

    return `${formatted} ${unit}`.trim();
}

/**
 * Format amount to full number with separators
 */
function formatFullNumber(value: number, options: { thousandSeparator?: ',' | ' '; decimalSeparator?: '.' | ','; decimalPlaces?: number }): string {
    const { thousandSeparator = ',', decimalSeparator = '.', decimalPlaces = 0 } = options;

    const parts = Math.abs(value).toFixed(decimalPlaces).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

    const formatted = parts.join(decimalSeparator);
    return value < 0 ? `-${formatted}` : formatted;
}

/**
 * Format decimal number
 */
function formatDecimal(value: number, decimalPlaces: number = 2, decimalSeparator: '.' | ',' = '.'): string {
    const fixed = Math.abs(value).toFixed(decimalPlaces);
    const formatted = fixed.replace('.', decimalSeparator);
    return value < 0 ? `-${formatted}` : formatted;
}

/**
 * Main function: format amount based on configuration
 * Returns both display value and full value for tooltips
 */
export function formatAmount(value: number | null | undefined, options: FormatAmountOptions = {}) {
    if (value === null || value === undefined) {
        return { display: '0 جنيه', full: '0 جنيه', raw: 0 };
    }

    const config = FormattingSettings.getInstance();
    const format = options.format ?? config.amount.displayFormat;
    const currencyLabel = options.currencyLabel ?? config.amount.currencyLabel;
    const decimalPlaces = options.decimalPlaces ?? config.amount.decimalPlaces;
    const thousandSeparator = options.thousandSeparator ?? config.amount.thousandSeparator;
    const decimalSeparator = options.decimalSeparator ?? config.amount.decimalSeparator;
    const includeCurrency = options.includeCurrency !== false;

    let display: string;
    const full = formatFullNumber(value, { thousandSeparator, decimalSeparator, decimalPlaces: 2 }) + ` ${currencyLabel}`;

    if (format === 'auto') {
        display = formatAmountAuto(value, { currencyLabel, decimalPlaces, thousandSeparator, decimalSeparator });
    } else if (format === 'full') {
        display = full;
    } else if (format === 'thousands') {
        const thousands = value / 1000;
        display = formatDecimal(thousands, decimalPlaces, decimalSeparator) + ` ألف ${currencyLabel}`;
    } else if (format === 'millions') {
        const millions = value / 1000000;
        display = formatDecimal(millions, decimalPlaces, decimalSeparator) + ` مليون ${currencyLabel}`;
    } else if (format === 'billions') {
        const billions = value / 1000000000;
        display = formatDecimal(billions, decimalPlaces, decimalSeparator) + ` مليار ${currencyLabel}`;
    } else {
        display = full;
    }

    if (!includeCurrency) {
        // Remove currency label for cases where it's added separately
        display = display.replace(` ${currencyLabel}`, '').replace(` ألف ${currencyLabel}`, '').replace(` مليون ${currencyLabel}`, '').replace(` مليار ${currencyLabel}`, '');
    }

    return { display, full, raw: value };
}

/**
 * Format amount for negative values with special display
 * Examples: -45 ألف, عجز 500 جنيه, زيادة 1.2 ألف
 */
export function formatNegativeAmount(value: number, prefix: 'عجز' | 'زيادة' | null = null): { display: string; full: string } {
    const formatted = formatAmount(Math.abs(value), { includeCurrency: true });

    const prefix_text = prefix === 'عجز' ? 'عجز' : prefix === 'زيادة' ? 'زيادة' : value < 0 ? '-' : '';
    const display = `${prefix_text} ${formatted.display}`.trim();
    const full = `${prefix_text} ${formatted.full}`.trim();

    return { display, full };
}

/**
 * Format amount comparison (current vs previous)
 * Example: +15 ألف (12.5% ↑)
 */
export function formatAmountComparison(current: number, previous: number): { display: string; trend: 'up' | 'down' | 'flat' } {
    const diff = current - previous;
    const percent = previous !== 0 ? Math.abs((diff / previous) * 100) : 0;
    const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';

    const formatted = formatAmount(diff, { includeCurrency: true });
    const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
    const display = `${formatted.display} (${percent.toFixed(1)}% ${arrow})`;

    return { display, trend };
}
