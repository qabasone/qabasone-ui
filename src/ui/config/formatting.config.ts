/**
 * Centralized formatting configuration for money and quantity display
 * Allows developers and admins to easily control how numbers are displayed throughout the app
 */

export type AmountDisplayFormat = 'auto' | 'full' | 'thousands' | 'millions' | 'billions';
export type QuantityDisplayFormat = 'auto' | 'full' | 'converted';

export interface FormattingConfig {
    // Amount/Money display settings
    amount: {
        /** Default display format for large amounts */
        displayFormat: AmountDisplayFormat;
        /** Currency label: 'جنيه' or 'ج.م' */
        currencyLabel: 'جنيه' | 'ج.م';
        /** Decimal places for abbreviated amounts */
        decimalPlaces: number;
        /** Show tooltip with full number on hover */
        showTooltip: boolean;
        /** Thousand separator (comma or space) */
        thousandSeparator: ',' | ' ';
        /** Decimal separator */
        decimalSeparator: '.' | ',';
    };

    // Quantity display settings
    quantity: {
        /** Default display format for large quantities */
        displayFormat: QuantityDisplayFormat;
        /** Auto-convert units (e.g., kilo → ton) */
        autoConvert: boolean;
        /** Decimal places for converted quantities */
        decimalPlaces: number;
        /** Show original unit in parentheses when converted */
        showOriginalUnit: boolean;
    };

    // Context-specific rules
    contexts: {
        // Dashboard summaries - abbreviated
        dashboardSummary: {
            amountFormat: AmountDisplayFormat;
            quantityFormat: QuantityDisplayFormat;
        };
        // Tables and lists - abbreviated with tooltip
        tableView: {
            amountFormat: AmountDisplayFormat;
            quantityFormat: QuantityDisplayFormat;
        };
        // Charts and graphs - abbreviated
        chart: {
            amountFormat: AmountDisplayFormat;
            quantityFormat: QuantityDisplayFormat;
        };
        // Accounting documents - full precision
        accounting: {
            amountFormat: 'full';
            quantityFormat: 'full';
        };
        // Exports and printing - full precision
        export: {
            amountFormat: 'full';
            quantityFormat: 'full';
        };
    };
}

/**
 * Default formatting configuration
 * Follows the standardization rule from MONEY stories
 */
export const defaultFormattingConfig: FormattingConfig = {
    amount: {
        displayFormat: 'auto',
        currencyLabel: 'جنيه',
        decimalPlaces: 2,
        showTooltip: true,
        thousandSeparator: ',',
        decimalSeparator: '.',
    },
    quantity: {
        displayFormat: 'auto',
        autoConvert: true,
        decimalPlaces: 2,
        showOriginalUnit: false,
    },
    contexts: {
        dashboardSummary: {
            amountFormat: 'auto',
            quantityFormat: 'auto',
        },
        tableView: {
            amountFormat: 'auto',
            quantityFormat: 'auto',
        },
        chart: {
            amountFormat: 'auto',
            quantityFormat: 'auto',
        },
        accounting: {
            amountFormat: 'full',
            quantityFormat: 'full',
        },
        export: {
            amountFormat: 'full',
            quantityFormat: 'full',
        },
    },
};

/**
 * Admin override settings
 * Can be stored in localStorage or user preferences
 */
export class FormattingSettings {
    private static instance: FormattingConfig = defaultFormattingConfig;

    static getInstance(): FormattingConfig {
        return this.instance;
    }

    static update(partial: Partial<FormattingConfig>) {
        this.instance = { ...this.instance, ...partial };
    }

    static reset() {
        this.instance = defaultFormattingConfig;
    }

    /**
     * Get context-specific format
     * Falls back to global format if context not defined
     */
    static getContextFormat(context: keyof FormattingConfig['contexts'], type: 'amount' | 'quantity') {
        const contextConfig = this.instance.contexts[context];
        if (type === 'amount') {
            return contextConfig.amountFormat;
        }
        return contextConfig.quantityFormat;
    }

    /**
     * Save to localStorage for persistence
     */
    static save() {
        try {
            localStorage.setItem('formattingConfig', JSON.stringify(this.instance));
        } catch (e) {
            console.warn('Failed to save formatting config:', e);
        }
    }

    /**
     * Load from localStorage
     */
    static load() {
        try {
            const saved = localStorage.getItem('formattingConfig');
            if (saved) {
                this.instance = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load formatting config:', e);
        }
    }
}
