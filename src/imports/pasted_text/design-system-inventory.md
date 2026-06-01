Below is the **component inventory** I’d define for your **Arabic-first, RTL, light-theme single-tenant accounting SaaS design system**.

Think of it in layers:

```txt
Foundations → Primitives → Composed Components → Accounting Components → Page Patterns
```

---

# 1. Foundations

These are not UI components, but the design system depends on them.

## Design Tokens

| Token Group | Needed Tokens                                                                |
| ----------- | ---------------------------------------------------------------------------- |
| Colors      | background, surface, border, primary, accent, success, warning, danger, text |
| Typography  | font family, sizes, weights, line-height                                     |
| Spacing     | 4px scale: 4, 8, 12, 16, 20, 24, 32, 40                                      |
| Radius      | sm, md, lg, xl, full                                                         |
| Shadows     | card, popover, modal                                                         |
| Z-index     | dropdown, sticky header, modal, toast                                        |
| Motion      | duration, easing                                                             |
| Breakpoints | mobile, tablet, desktop                                                      |
| Direction   | RTL support, LTR number handling                                             |

## Required Utility Classes

```css
.amount,
.number,
.currency {
  direction: ltr;
  unicode-bidi: plaintext;
  font-variant-numeric: tabular-nums;
}
```

For Arabic accounting UI, this is essential.

---

# 2. Core Primitives

These are the smallest reusable components.

## Typography

| Component    | Usage                       |
| ------------ | --------------------------- |
| `Heading`    | Page titles, section titles |
| `Text`       | Body text                   |
| `Label`      | Form labels                 |
| `MutedText`  | Secondary descriptions      |
| `ErrorText`  | Form validation             |
| `AmountText` | Money values                |
| `NumberText` | Counts, percentages         |
| `CodeText`   | Invoice numbers, IDs        |

Example:

```tsx
<AmountText value="12,450.00 ج.م" />
```

---

## Icons

Use a wrapper instead of placing Lucide icons directly everywhere.

| Component    | Usage                         |
| ------------ | ----------------------------- |
| `Icon`       | Standard icon wrapper         |
| `IconButton` | Icon-only button              |
| `IconBadge`  | Icon inside colored container |

Why?
So icon size, stroke width, RTL spacing, and color stay consistent.

---

# 3. Buttons

You need a complete button system.

| Component       | Variants                                   |
| --------------- | ------------------------------------------ |
| `Button`        | primary, secondary, ghost, danger, success |
| `IconButton`    | default, ghost, danger                     |
| `ButtonGroup`   | grouped actions                            |
| `SplitButton`   | action + dropdown                          |
| `LoadingButton` | submit states                              |

## Button sizes

```txt
sm: 32px
md: 40px
lg: 44px
```

## Common Arabic labels

```txt
حفظ
إلغاء
تعديل
حذف
إضافة
تصدير
طباعة
فاتورة جديدة
عميل جديد
```

---

# 4. Form Components

Accounting systems have many forms. These need to be polished.

## Inputs

| Component         | Purpose                    |
| ----------------- | -------------------------- |
| `Input`           | Text fields                |
| `NumberInput`     | Quantity, tax %, discount  |
| `CurrencyInput`   | Amounts                    |
| `PercentageInput` | Tax, discount, margin      |
| `PhoneInput`      | Egyptian phone numbers     |
| `EmailInput`      | Customer/vendor email      |
| `Textarea`        | Notes, descriptions        |
| `SearchInput`     | Search inside tables/lists |
| `PasswordInput`   | Login/settings             |
| `OTPInput`        | Optional auth flow         |

## Selectors

| Component         | Purpose                    |
| ----------------- | -------------------------- |
| `Select`          | Simple dropdown            |
| `Combobox`        | Searchable select          |
| `MultiSelect`     | Tags, categories           |
| `DatePicker`      | Invoice issue/due date     |
| `DateRangePicker` | Reports                    |
| `MonthPicker`     | Monthly accounting reports |
| `YearPicker`      | Fiscal year                |
| `Checkbox`        | Boolean settings           |
| `RadioGroup`      | Payment method, type       |
| `Switch`          | Enable/disable options     |

## Form structure

| Component           | Purpose                    |
| ------------------- | -------------------------- |
| `FormField`         | Label + input + error      |
| `FormSection`       | Group related fields       |
| `RequiredMark`      | Required indicator         |
| `FieldHint`         | Helper text                |
| `ValidationMessage` | Error/success messages     |
| `InlineFormRow`     | Label/input horizontal row |
| `FormActions`       | Save/cancel footer         |

---

# 5. Navigation Components

Since the app is RTL, navigation needs special attention.

| Component          | Purpose                        |
| ------------------ | ------------------------------ |
| `AppShell`         | Main layout wrapper            |
| `Sidebar`          | Right-side navigation          |
| `SidebarItem`      | Single nav item                |
| `SidebarGroup`     | Grouped nav sections           |
| `SidebarFooter`    | Company/user/settings          |
| `TopBar`           | Search, company, notifications |
| `Breadcrumbs`      | Page path                      |
| `Tabs`             | Page-level switching           |
| `SegmentedControl` | View switching                 |
| `CommandMenu`      | Quick search/actions           |
| `MobileNav`        | Mobile drawer navigation       |

## Recommended sidebar items

```txt
الرئيسية
الفواتير
المبيعات
المشتريات
المصروفات
العملاء
الموردين
الخزنة والبنوك
القيود اليومية
التقارير
الإعدادات
```

---

# 6. Layout Components

These create consistent page structure.

| Component         | Purpose                     |
| ----------------- | --------------------------- |
| `Page`            | Main page wrapper           |
| `PageHeader`      | Title, description, actions |
| `PageTitle`       | Main page heading           |
| `PageDescription` | Supporting text             |
| `PageActions`     | Buttons beside title        |
| `Section`         | Content grouping            |
| `SectionHeader`   | Section title/actions       |
| `Card`            | Base surface                |
| `CardHeader`      | Card title/actions          |
| `CardContent`     | Card body                   |
| `CardFooter`      | Card actions                |
| `Grid`            | Responsive layouts          |
| `Stack`           | Vertical spacing            |
| `Inline`          | Horizontal spacing          |
| `Divider`         | Separators                  |

---

# 7. Data Display Components

Accounting UI depends heavily on readable data.

## Tables

| Component         | Purpose              |
| ----------------- | -------------------- |
| `DataTable`       | Base table           |
| `TableHeader`     | Column headers       |
| `TableRow`        | Row styling          |
| `TableCell`       | Standard cell        |
| `AmountCell`      | Money cell           |
| `DateCell`        | Date formatting      |
| `StatusCell`      | Badge inside table   |
| `ActionsCell`     | Row actions          |
| `SortableHeader`  | Sort columns         |
| `SelectableRow`   | Bulk actions         |
| `TableToolbar`    | Search/filter/export |
| `TablePagination` | Pagination           |
| `TableSkeleton`   | Loading state        |
| `TableEmptyState` | No data state        |

## Lists

| Component          | Purpose                    |
| ------------------ | -------------------------- |
| `DescriptionList`  | Label/value details        |
| `ActivityList`     | Recent activity            |
| `TransactionList`  | Recent financial movements |
| `NotificationList` | Notifications              |
| `AuditLogList`     | System changes             |

---

# 8. Feedback Components

| Component              | Purpose                     |
| ---------------------- | --------------------------- |
| `Toast`                | Success/error notifications |
| `Alert`                | Inline warning/info         |
| `Banner`               | Page-level notice           |
| `LoadingSpinner`       | Small loading               |
| `Skeleton`             | Loading placeholder         |
| `EmptyState`           | No data                     |
| `ErrorState`           | Failed load                 |
| `SuccessState`         | Completed action            |
| `ConfirmDialog`        | Destructive confirmation    |
| `UnsavedChangesDialog` | Form exit warning           |

## Empty state examples

| Case         | Title               |
| ------------ | ------------------- |
| No invoices  | مفيش فواتير لسه     |
| No customers | مفيش عملاء لسه      |
| No expenses  | مفيش مصروفات مسجلة  |
| No results   | مفيش نتائج مطابقة   |
| Load error   | تعذر تحميل البيانات |

---

# 9. Overlay Components

| Component      | Purpose                   |
| -------------- | ------------------------- |
| `Dialog`       | General modal             |
| `Drawer`       | Side panel                |
| `Sheet`        | Mobile/side actions       |
| `Popover`      | Floating small content    |
| `DropdownMenu` | Row/user actions          |
| `Tooltip`      | Small explanation         |
| `ContextMenu`  | Optional advanced actions |

For RTL Arabic apps, drawers should usually open from the **left** when they are secondary panels, because the sidebar is already on the right.

---

# 10. Status & Badge Components

## Generic badges

| Component     | Variants                                       |
| ------------- | ---------------------------------------------- |
| `Badge`       | default, success, warning, danger, info, muted |
| `StatusBadge` | semantic statuses                              |
| `CountBadge`  | notifications/counts                           |
| `DotStatus`   | small visual status                            |

## Accounting-specific badges

| Badge                       | Arabic                             |
| --------------------------- | ---------------------------------- |
| `InvoiceStatusBadge`        | مدفوعة، متأخرة، مسودة، في الانتظار |
| `PaymentStatusBadge`        | مكتمل، جزئي، فشل، مسترد            |
| `CustomerStatusBadge`       | نشط، غير نشط                       |
| `ExpenseStatusBadge`        | معتمد، قيد المراجعة، مرفوض         |
| `ReconciliationStatusBadge` | مطابق، غير مطابق                   |

---

# 11. Accounting-Specific Components

These are the most important for your product.

## Financial Display

| Component          | Purpose                        |
| ------------------ | ------------------------------ |
| `Money`            | Display currency values        |
| `PercentageChange` | `+12.5%` / `-4.2%`             |
| `TrendIndicator`   | Up/down/neutral                |
| `BalanceAmount`    | Debit/credit balance           |
| `DebitCreditValue` | Shows debit/credit clearly     |
| `TaxValue`         | VAT/tax display                |
| `TotalSummary`     | Subtotal, tax, discount, total |

## KPI Components

| Component         | Purpose                 |
| ----------------- | ----------------------- |
| `KpiCard`         | Single metric           |
| `KpiGrid`         | Dashboard metric layout |
| `RevenueCard`     | Revenue metric          |
| `ExpenseCard`     | Expense metric          |
| `ProfitCard`      | Net profit              |
| `OutstandingCard` | Unpaid invoices         |

Example KPIs:

```txt
إجمالي الإيرادات
إجمالي المصروفات
صافي الربح
فواتير غير مدفوعة
```

---

## Invoice Components

| Component               | Purpose                          |
| ----------------------- | -------------------------------- |
| `InvoiceNumber`         | Display invoice ID               |
| `InvoiceStatusBadge`    | Paid/pending/overdue             |
| `InvoiceTable`          | List invoices                    |
| `InvoiceLineItemsTable` | Products/services inside invoice |
| `InvoiceLineItemRow`    | One line item                    |
| `InvoiceTotalsBox`      | Subtotal, tax, discount, total   |
| `InvoicePreview`        | Printable invoice preview        |
| `InvoiceHeader`         | Company/customer/date info       |
| `InvoiceActions`        | Print/download/mark paid         |
| `PaymentTimeline`       | Payment history                  |
| `InvoiceDueIndicator`   | Due/overdue display              |

---

## Customer Components

| Component                | Purpose                 |
| ------------------------ | ----------------------- |
| `CustomerCard`           | Customer summary        |
| `CustomerAvatar`         | Initials/logo           |
| `CustomerBalance`        | Current balance         |
| `CustomerDetailsPanel`   | Full customer info      |
| `CustomerStatementTable` | Customer transactions   |
| `CustomerQuickActions`   | Invoice/payment actions |

---

## Vendor Components

| Component              | Purpose                  |
| ---------------------- | ------------------------ |
| `VendorCard`           | Vendor summary           |
| `VendorBalance`        | Payable amount           |
| `VendorStatementTable` | Vendor activity          |
| `VendorQuickActions`   | Purchase/payment actions |

---

## Expenses Components

| Component               | Purpose                   |
| ----------------------- | ------------------------- |
| `ExpenseTable`          | Expenses list             |
| `ExpenseCategoryBadge`  | Rent, salaries, supplies  |
| `ExpenseReceiptPreview` | Receipt attachment        |
| `ExpenseApprovalStatus` | Approved/pending/rejected |
| `ExpenseSummaryCard`    | Monthly expenses          |

---

## Payment Components

| Component                | Purpose                    |
| ------------------------ | -------------------------- |
| `PaymentMethodBadge`     | Cash, bank, card, wallet   |
| `PaymentStatusBadge`     | Completed, failed, partial |
| `PaymentRecordCard`      | Single payment             |
| `PaymentAllocationTable` | Payment against invoices   |
| `PaymentSummary`         | Total paid/remaining       |

Arabic payment method labels:

```txt
نقدي
تحويل بنكي
بطاقة
محفظة إلكترونية
شيك
```

---

## Reports Components

| Component            | Purpose                       |
| -------------------- | ----------------------------- |
| `ReportHeader`       | Report title/date/actions     |
| `ReportFilters`      | Date range, account, customer |
| `ReportSummaryCard`  | Totals                        |
| `ReportTable`        | Financial report table        |
| `ProfitLossReport`   | P&L layout                    |
| `BalanceSheetReport` | Balance sheet layout          |
| `CashFlowReport`     | Cash flow layout              |
| `ExportMenu`         | PDF/Excel/CSV                 |

---

# 12. Charts

Keep charts minimal. Accounting products do not need overly decorative charts.

| Component               | Purpose                     |
| ----------------------- | --------------------------- |
| `RevenueExpenseChart`   | Compare income/expenses     |
| `CashFlowChart`         | Cash movement               |
| `ProfitTrendChart`      | Net profit over time        |
| `ExpenseBreakdownChart` | Expenses by category        |
| `AgingReceivablesChart` | Outstanding invoices by age |

Chart rules:

```txt
Minimal colors
Clear labels
Arabic month names
LTR numbers
No unnecessary 3D or gradients
```

---

# 13. Search, Filter, and Bulk Action Components

These matter a lot once data grows.

| Component              | Purpose                  |
| ---------------------- | ------------------------ |
| `SearchBar`            | Global/page search       |
| `FilterButton`         | Opens filters            |
| `FilterPanel`          | Advanced filters         |
| `ActiveFilters`        | Shows applied filters    |
| `SortMenu`             | Sort options             |
| `BulkActionBar`        | Actions on selected rows |
| `ColumnVisibilityMenu` | Show/hide table columns  |
| `SavedViews`           | Saved filters/views      |

Example active filters:

```txt
الحالة: متأخرة
الفترة: آخر 30 يوم
العميل: شركة النور
```

---

# 14. Authentication Components

| Component            | Purpose               |
| -------------------- | --------------------- |
| `AuthLayout`         | Login/register shell  |
| `LoginForm`          | Sign in               |
| `RegisterForm`       | Sign up               |
| `ForgotPasswordForm` | Password reset        |
| `ResetPasswordForm`  | New password          |
| `InviteAcceptForm`   | Accept company invite |
| `TwoFactorForm`      | Optional 2FA          |
| `AuthCard`           | Form wrapper          |

---

# 15. Settings Components

| Component              | Purpose                 |
| ---------------------- | ----------------------- |
| `SettingsLayout`       | Settings page shell     |
| `SettingsNav`          | Settings sidebar/tabs   |
| `CompanyProfileForm`   | Company details         |
| `TaxSettingsForm`      | VAT/tax config          |
| `InvoiceSettingsForm`  | Numbering, terms        |
| `CurrencySettingsForm` | Currency display        |
| `UserManagementTable`  | Users/roles             |
| `RoleBadge`            | Admin/accountant/viewer |
| `PermissionMatrix`     | Roles/permissions       |
| `DangerZone`           | Delete/reset actions    |

---

# 16. Document and File Components

| Component            | Purpose               |
| -------------------- | --------------------- |
| `FileUploader`       | Upload receipts/logos |
| `AttachmentList`     | Show uploaded files   |
| `FilePreview`        | Preview image/PDF     |
| `LogoUploader`       | Company logo          |
| `ImportDropzone`     | Import CSV/Excel      |
| `ImportMappingTable` | Map imported columns  |
| `ExportButton`       | Export data           |

---

# 17. Notification and Activity Components

| Component          | Purpose               |
| ------------------ | --------------------- |
| `NotificationBell` | Top bar notifications |
| `NotificationItem` | Single notification   |
| `ActivityFeed`     | Recent actions        |
| `AuditLogEntry`    | Who changed what      |
| `SystemMessage`    | App-level message     |

Examples:

```txt
تم إنشاء فاتورة جديدة
تم تسجيل دفعة
تم تعديل بيانات العميل
```

---

# 18. Print / PDF Components

Accounting systems need printable documents.

| Component            | Purpose                |
| -------------------- | ---------------------- |
| `PrintableInvoice`   | Invoice PDF/print view |
| `PrintableReceipt`   | Receipt view           |
| `PrintableStatement` | Customer statement     |
| `PrintHeader`        | Company info           |
| `PrintFooter`        | Legal/tax info         |
| `PrintTotalsBox`     | Totals section         |
| `PrintSignatureArea` | Signature/stamp area   |

Important: print layouts should not depend on the app shell.

---

# 19. Page Templates

After components, define page-level patterns.

| Template                 | Used For                       |
| ------------------------ | ------------------------------ |
| `ListPageTemplate`       | Invoices, customers, expenses  |
| `CreateEditPageTemplate` | Forms                          |
| `DetailsPageTemplate`    | Customer/invoice/vendor detail |
| `DashboardTemplate`      | Main overview                  |
| `ReportPageTemplate`     | Reports                        |
| `SettingsPageTemplate`   | Settings                       |
| `ImportWizardTemplate`   | Data import                    |
| `AuthPageTemplate`       | Login/register                 |

---

# 20. Minimum Viable Design System

If you want to start lean, build these first:

## Phase 1 — Must-have

```txt
AppShell
Sidebar
TopBar
PageHeader
Button
Input
Select
DatePicker
Card
Badge
StatusBadge
DataTable
AmountText
Money
EmptyState
Dialog
Toast
KpiCard
InvoiceTable
InvoiceStatusBadge
InvoiceTotalsBox
```

## Phase 2 — Accounting polish

```txt
CurrencyInput
PercentageInput
FilterPanel
BulkActionBar
CustomerCard
PaymentStatusBadge
ExpenseCategoryBadge
ReportHeader
ReportFilters
PrintableInvoice
ActivityFeed
AuditLogEntry
```

## Phase 3 — Advanced

```txt
ImportWizard
PermissionMatrix
SavedViews
ColumnVisibilityMenu
CommandMenu
AdvancedReports
ReconciliationComponents
```

---

# Recommended Folder Structure

For a Next.js/shadcn-style project:

```txt
src/
  components/
    ui/
      button.tsx
      input.tsx
      card.tsx
      badge.tsx
      dialog.tsx
      table.tsx
      toast.tsx

    layout/
      app-shell.tsx
      sidebar.tsx
      top-bar.tsx
      page-header.tsx

    data-display/
      data-table.tsx
      amount-text.tsx
      status-badge.tsx
      empty-state.tsx

    accounting/
      money.tsx
      kpi-card.tsx
      invoice-table.tsx
      invoice-status-badge.tsx
      invoice-totals-box.tsx
      payment-status-badge.tsx
      customer-card.tsx
      expense-category-badge.tsx

    forms/
      form-field.tsx
      currency-input.tsx
      percentage-input.tsx
      date-picker.tsx
      search-input.tsx

    feedback/
      confirm-dialog.tsx
      error-state.tsx
      loading-state.tsx

    print/
      printable-invoice.tsx
      print-header.tsx
      print-footer.tsx

  design-system/
    tokens.ts
    typography.ts
    statuses.ts
    navigation.ts
    formatters.ts
```

---

# My recommended starting order

Build in this order:

```txt
1. Tokens
2. Typography
3. Button
4. Input
5. Card
6. Badge
7. DataTable
8. AppShell
9. Sidebar
10. PageHeader
11. Money / AmountText
12. StatusBadge
13. EmptyState
14. KpiCard
15. InvoiceTable
16. InvoiceForm
17. PrintableInvoice
```

The most important components for your system are:

```txt
DataTable
Money / AmountText
StatusBadge
InvoiceTable
InvoiceForm
InvoiceTotalsBox
AppShell
Sidebar
PageHeader
EmptyState
```

If these are excellent, the whole accounting system will feel professional.
