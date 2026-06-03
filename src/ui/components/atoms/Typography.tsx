import type { HTMLAttributes, ElementType, ReactNode } from "react";

export type TypographyVariant =
  | "display-4xl"
  | "display-3xl"
  | "display-2xl"
  | "title-xl"
  | "title-lg"
  | "title-sm"
  | "body-lg"
  | "body"
  | "body-sm"
  | "caption"
  | "amount"
  | "number"
  | "code";

export type TypographyTone = "default" | "muted" | "error" | "primary" | "success" | "warning";
export type NumericSystem = "western" | "arabic-indic";

const VARIANT_CLASSES: Record<TypographyVariant, string> = {
  "display-4xl": "text-4xl font-bold",
  "display-3xl": "text-3xl font-bold",
  "display-2xl": "text-2xl font-bold",
  "title-xl": "text-xl font-semibold",
  "title-lg": "text-lg font-semibold",
  "title-sm": "text-sm font-semibold",
  "body-lg": "text-lg",
  body: "text-base",
  "body-sm": "text-sm",
  caption: "text-xs",
  amount: "text-2xl font-semibold amount",
  number: "text-xl font-medium amount",
  code: "font-mono text-base amount",
};

const TONE_CLASSES: Record<TypographyTone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  error: "text-destructive",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
};

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

export function toArabicIndicDigits(value: string | number) {
  return String(value)
    .replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)])
    .replace(/,/g, "٬")
    .replace(/\./g, "٫");
}

export function formatNumericSystem(value: string | number, numericSystem: NumericSystem = "western") {
  if (numericSystem === "arabic-indic") return toArabicIndicDigits(value);
  return String(value);
}

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TypographyVariant;
  tone?: TypographyTone;
  children: ReactNode;
}

export function Text({
  as: Comp = "span",
  variant = "body",
  tone = "default",
  className,
  children,
  ...props
}: TextProps) {
  return <Comp className={cx(VARIANT_CLASSES[variant], TONE_CLASSES[tone], className)} {...props}>{children}</Comp>;
}

export interface NumberTextProps {
  as?: ElementType;
  value: string | number;
  variant?: TypographyVariant;
  tone?: TypographyTone;
  numericSystem?: NumericSystem;
  className?: string;
}

export function NumberText({
  as = "p",
  value,
  variant = "number",
  tone = "default",
  numericSystem = "western",
  className,
}: NumberTextProps) {
  return (
    <Text as={as} variant={variant} tone={tone} className={className}>
      {formatNumericSystem(value, numericSystem)}
    </Text>
  );
}

export interface AmountTextProps {
  as?: ElementType;
  value: string | number;
  currency?: string;
  currencyPosition?: "prefix" | "suffix";
  variant?: TypographyVariant;
  tone?: TypographyTone;
  numericSystem?: NumericSystem;
  className?: string;
}

export function AmountText({
  as = "p",
  value,
  currency,
  currencyPosition = "suffix",
  variant = "amount",
  tone = "default",
  numericSystem = "western",
  className,
}: AmountTextProps) {
  const renderedValue = formatNumericSystem(value, numericSystem);
  const rendered =
    currency == null
      ? renderedValue
      : currencyPosition === "prefix"
        ? `${currency} ${renderedValue}`
        : `${renderedValue} ${currency}`;

  return (
    <Text as={as} variant={variant} tone={tone} className={className}>
      {rendered}
    </Text>
  );
}

export interface CodeTextProps {
  as?: ElementType;
  value: string;
  tone?: TypographyTone;
  className?: string;
}

export function CodeText({ as = "p", value, tone = "default", className }: CodeTextProps) {
  return (
    <Text as={as} variant="code" tone={tone} className={className}>
      {value}
    </Text>
  );
}
