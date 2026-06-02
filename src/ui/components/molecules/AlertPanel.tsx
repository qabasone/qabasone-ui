import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Button } from "../atoms/Button";

const ALERT_STYLES: Record<AlertSeverity, { icon: ReactNode; className: string; label: string }> = {
    critical: { icon: <XCircle size={16} />, className: "bg-destructive/10 text-destructive-foreground border border-destructive/20", label: "خطأ" },
    warning: { icon: <AlertTriangle size={16} />, className: "bg-warning/10 text-warning-foreground border border-warning/20", label: "تنبيه" },
    info: { icon: <Info size={16} />, className: "bg-info/10 text-info-foreground border border-info/20", label: "معلومة" },
    success: { icon: <CheckCircle2 size={16} />, className: "bg-success/10 text-success-foreground border border-success/20", label: "نجاح" },
};

export type AlertSeverity = "critical" | "warning" | "info" | "success";

export interface AlertItem {
    id: string;
    severity: AlertSeverity;
    title?: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    dismissible?: boolean;
}

export interface AlertPanelProps {
    alerts: AlertItem[];
    onDismiss?: (alertId: string) => void;
}

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export function AlertPanel({ alerts, onDismiss }: AlertPanelProps) {
    if (!alerts.length) return null;

    return (
        <div className="space-y-3">
            {alerts.map((alert) => {
                const style = ALERT_STYLES[alert.severity] ?? ALERT_STYLES.info;

                return (
                    <div key={alert.id} className={cx("rounded-3xl border p-4 shadow-sm", style.className)}>
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">{style.icon}</div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold">{alert.title ?? style.label}</p>
                                        <p className="mt-1 text-sm leading-relaxed">{alert.message}</p>
                                    </div>
                                    {alert.dismissible ? (
                                        <button
                                            type="button"
                                            onClick={() => onDismiss?.(alert.id)}
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label="Dismiss alert"
                                        >
                                            &times;
                                        </button>
                                    ) : null}
                                </div>
                                {alert.onAction && alert.actionLabel ? (
                                    <div className="mt-4">
                                        <Button variant="outline" size="sm" onClick={alert.onAction}>
                                            {alert.actionLabel}
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
