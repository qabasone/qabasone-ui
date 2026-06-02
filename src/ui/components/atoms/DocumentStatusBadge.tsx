import { StatusBadge } from "./StatusBadge";

export type DocumentStatus =
    | "draft"
    | "posted"
    | "cancelled"
    | "failed"
    | "pending-review"
    | "closed";

const STATUS_CONFIG: Record<DocumentStatus, { label: string; variant: Parameters<typeof StatusBadge>[0]["variant"] }> = {
    draft: { label: "مسودة", variant: "draft" },
    posted: { label: "مرحّل", variant: "success" },
    cancelled: { label: "ملغى", variant: "cancelled" },
    failed: { label: "فشل", variant: "failed" },
    "pending-review": { label: "بانتظار المراجعة", variant: "warning" },
    closed: { label: "مغلقة", variant: "muted" },
};

export interface DocumentStatusBadgeProps {
    status: DocumentStatus;
    className?: string;
}

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;

    return <StatusBadge label={config.label} variant={config.variant} className={className} />;
}
