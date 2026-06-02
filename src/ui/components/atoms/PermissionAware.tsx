import type { ReactNode } from "react";

export interface PermissionAwareProps {
    canView?: boolean;
    canEdit?: boolean;
    fallback?: ReactNode;
    children: ReactNode;
    className?: string;
    disableInteraction?: boolean;
}

export function PermissionAware({
    canView = true,
    canEdit = true,
    fallback = null,
    children,
    className,
    disableInteraction = false,
}: PermissionAwareProps) {
    if (!canView) return <>{fallback}</>;

    if (!canEdit || disableInteraction) {
        return (
            <div
                className={className}
                aria-disabled="true"
                style={{ pointerEvents: "none", opacity: 0.55 }}
            >
                {children}
            </div>
        );
    }

    return <div className={className}>{children}</div>;
}
