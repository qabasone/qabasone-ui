import type { ReactNode } from "react";
import { CreditCard, DollarSign, ShieldCheck, Wallet } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export type PaymentType = "cash" | "credit" | "mixed" | "deferred";

const PAYMENT_CONFIG: Record<PaymentType, { label: string; variant: Parameters<typeof StatusBadge>[0]["variant"]; icon: ReactNode }> = {
    cash: { label: "نقدي", variant: "success", icon: <DollarSign size={14} /> },
    credit: { label: "آجل", variant: "warning", icon: <CreditCard size={14} /> },
    mixed: { label: "مختلط", variant: "info", icon: <Wallet size={14} /> },
    deferred: { label: "مؤجل", variant: "muted", icon: <ShieldCheck size={14} /> },
};

interface PaymentTypeBadgeProps {
    type: PaymentType;
    className?: string;
}

export function PaymentTypeBadge({ type, className }: PaymentTypeBadgeProps) {
    const config = PAYMENT_CONFIG[type] ?? PAYMENT_CONFIG.cash;
    return <StatusBadge label={config.label} variant={config.variant} icon={config.icon} className={className} />;
}
