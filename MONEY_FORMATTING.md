# Money & Amount Formatting System

## Overview

A centralized, configurable formatting system for displaying monetary amounts and quantities throughout the Qabas dashboard. Implements the standardization rules from MONEY stories (MONEY-01 through MONEY-20).

## Standardization Rule

| Range | Display Format |
|-------|------|
| < 1,000 | 950 جنيه |
| 1,000 to < 1,000,000 | 12.5 ألف |
| 1,000,000 to < 1,000,000,000 | 1.25 مليون |
| ≥ 1,000,000,000 | 1.3 مليار |

## Architecture

### 1. Centralized Configuration (`src/ui/config/formatting.config.ts`)

The `FormattingSettings` class provides centralized control over all formatting behavior:

```typescript
import { FormattingSettings, defaultFormattingConfig } from '@/ui/config';

// Get current settings
const config = FormattingSettings.getInstance();

// Update settings
FormattingSettings.update({
  amount: {
    displayFormat: 'auto',
    currencyLabel: 'ج.م',
    decimalPlaces: 2,
    // ... other options
  }
});

// Save to localStorage for persistence
FormattingSettings.save();

// Load from localStorage
FormattingSettings.load();

// Reset to defaults
FormattingSettings.reset();
```

### 2. Utility Functions (`src/ui/utils/formatAmount.ts`)

Pure functions for formatting amounts without rendering:

```typescript
import { formatAmount, formatNegativeAmount, formatAmountComparison } from '@/ui/utils';

// Basic formatting
const { display, full, raw } = formatAmount(1250000, { format: 'auto' });
// display: "1.25 مليون"
// full: "1,250,000 جنيه"
// raw: 1250000

// Negative amounts
const negative = formatNegativeAmount(45000, 'عجز');
// display: "عجز 45 ألف"
// full: "عجز 45,000 جنيه"

// Period comparison
const comparison = formatAmountComparison(115000, 100000);
// display: "+15 ألف (15.0% ↑)"
// trend: "up"
```

### 3. UI Components

#### FormattedAmount

Displays amounts with abbreviated formatting and tooltip for full value:

```typescript
import { FormattedAmount } from '@/ui/components';

// Basic usage - default behavior
<FormattedAmount value={1250000} />
// Displays: "1.25 مليون" with tooltip showing "1,250,000 جنيه"

// Customized
<FormattedAmount
  value={850000}
  variant="title-lg"
  tone="success"
  format="auto"
  currencyLabel="ج.م"
  showTooltip={true}
/>

// Full precision (for accounting)
<FormattedAmount value={1250000} format="full" />
// Displays: "1,250,000 جنيه"

// Specific format
<FormattedAmount value={1250000} format="thousands" />
// Displays: "1,250 ألف"
```

#### FormattedQuantity

Displays inventory quantities with auto-conversion (e.g., kilo → ton):

```typescript
import { FormattedQuantity } from '@/ui/components';

// Auto-convert large quantities
<FormattedQuantity value={12500} unit="كيلو" />
// Displays: "12.5 طن" with tooltip showing "12,500 كيلو"

// Keep original unit
<FormattedQuantity value={20} unit="أردب صغير" autoConvert={false} />
// Displays: "20 أردب صغير"

// With variants
<FormattedQuantity
  value={950}
  unit="كيلو"
  variant="body-sm"
  tone="muted"
  decimalPlaces={1}
/>
// Displays: "950 كيلو"
```

## Usage Patterns

### Dashboard Cards

Always use abbreviated format:

```typescript
<FormattedAmount value={3200000} format="auto" />
// "3.2 مليون"
```

### Tables

Abbreviated with tooltip:

```typescript
<FormattedAmount
  value={1250000}
  variant="body-sm"
  format="auto"
  showTooltip={true}
/>
```

### Charts

Clean axes without crowding:

```typescript
// In chart tooltip
<FormattedAmount value={248500} format="auto" />
// "248.5 ألف"
```

### Accounting Documents (Full Precision)

Always show full numbers:

```typescript
<FormattedAmount value={1250000} format="full" />
// "1,250,000 جنيه"
```

### Exports & Printing

Use utility function directly:

```typescript
import { formatAmount } from '@/ui/utils';

const { full } = formatAmount(1250000, { format: 'full' });
// Export as full precision
```

### Negative Values

```typescript
import { formatNegativeAmount } from '@/ui/utils';

<FormattedAmount value={-45000} variant="body-lg" tone="error" />
// Displays: "-45 ألف" (in red)

// With semantic prefix
const { display } = formatNegativeAmount(45000, 'عجز');
// display: "عجز 45 ألف"
```

### Period Comparison

```typescript
import { formatAmountComparison } from '@/ui/utils';

const { display, trend } = formatAmountComparison(115000, 100000);
// display: "+15 ألف (15.0% ↑)"
// trend: "up"

<div style={{ color: trend === 'up' ? 'green' : 'red' }}>
  {display}
</div>
```

## Configuration Examples

### Example 1: Dashboard Admin Settings

```typescript
import { FormattingSettings } from '@/ui/config';

// User selects: "Show amounts in thousands"
FormattingSettings.update({
  amount: {
    displayFormat: 'thousands',
    currencyLabel: 'ج.م',
    decimalPlaces: 1,
  }
});

FormattingSettings.save();

// All FormattedAmount components now display: "1,250 ألف"
```

### Example 2: Context-Specific Formatting

```typescript
import { FormattingSettings } from '@/ui/config';

// Get context-specific format
const dashboardFormat = FormattingSettings.getContextFormat('dashboardSummary', 'amount');
// "auto"

const accountingFormat = FormattingSettings.getContextFormat('accounting', 'amount');
// "full"
```

## Migration Guide

### Before (Manual Formatting)

```typescript
const display = (value / 1000000).toFixed(2) + ' مليون جنيه';
```

### After (Centralized System)

```typescript
import { formatAmount } from '@/ui/utils';

const { display } = formatAmount(value, { format: 'auto' });
```

## Best Practices

1. **Use FormattedAmount for UI display** - Always render in components, not in data
2. **Use formatAmount for logic** - When you need the formatted string for other purposes
3. **Respect context** - Use abbreviated in dashboards, full in accounting
4. **Provide tooltips** - Always show `showTooltip={true}` for abbreviated amounts
5. **Distinguish units** - Use FormattedQuantity for inventory, FormattedAmount for money
6. **Consider RTL** - All components are RTL-aware for Arabic
7. **Persist settings** - Call `FormattingSettings.save()` after user preference changes

## Available Display Formats

- `auto`: Smart abbreviation based on magnitude
- `full`: Complete number with thousand separators
- `thousands`: Always show as thousands (K ألف)
- `millions`: Always show as millions (M مليون)
- `billions`: Always show as billions (B مليار)

## Currency Labels

- `جنيه`: Full word (default)
- `ج.م`: Abbreviated form

## Supported Quantity Units

- `كيلو` (kilogram)
- `طن` (ton) - 1,000 kilos
- `أردب صغير` (small ardeb) - 75 kilos
- `أردب كبير` (large ardeb) - 150 kilos
- `عبوة` (box/package) - 50 kilos
- `كيس` (bag/sack) - 25 kilos
