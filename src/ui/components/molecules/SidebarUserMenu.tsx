import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import type {
  SidebarDirection,
  SidebarMenuPosition,
  SidebarUserMenuGroup,
  SidebarUserProfile,
} from "../types/sidebar";

export interface SidebarUserMenuProps {
  open: boolean;
  dir?: SidebarDirection;
  position: SidebarMenuPosition | null;
  user: SidebarUserProfile;
  groups: SidebarUserMenuGroup[];
  onClose: () => void;
  portalTarget?: HTMLElement | null;
}

export function SidebarUserMenu({
  open,
  dir = "auto",
  position,
  user,
  groups,
  onClose,
  portalTarget,
}: SidebarUserMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const timeoutId = setTimeout(() => document.addEventListener("mousedown", handler), 60);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handler);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const resolvedPortalTarget =
    portalTarget ?? (typeof document !== "undefined" ? document.body : null);

  if (!open || !position || !resolvedPortalTarget) return null;

  return createPortal(
    <div
      dir={dir}
      ref={ref}
      style={{
        position: "fixed",
        top: position.top,
        width: "240px",
        zIndex: 9990,
        fontFamily: "var(--font-family)",
        boxShadow: "var(--shadow-modal)",
        animation: "ctx-in 0.18s cubic-bezier(0.16,1,0.3,1) both",
        [position.side]: position.sideOffset,
      }}
      className="bg-card rounded-2xl border border-border py-1.5"
    >
      <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border mb-1">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-xs" style={{ fontWeight: 700 }}>
            {user.initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate" style={{ fontWeight: 600 }}>
            {user.name}
          </p>
          {user.statusLabel ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
              <p className="text-xs text-muted-foreground">{user.statusLabel}</p>
            </div>
          ) : null}
        </div>
      </div>

      {groups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {groupIndex > 0 && <div className="my-1 border-t border-border" />}
          <div className="px-1.5">
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onSelect?.();
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-sm text-right hover:bg-muted transition-colors"
                style={{
                  color: item.danger ? "var(--destructive)" : "var(--foreground)",
                  fontWeight: 500,
                  minHeight: "34px",
                }}
              >
                <item.icon
                  size={15}
                  className="shrink-0"
                  style={{
                    color: item.danger ? "var(--destructive)" : "var(--muted-foreground)",
                  }}
                />
                <span className="flex-1 text-right">{item.label}</span>
                {item.shortcut ? (
                  <kbd
                    className="text-[10.5px] px-1.5 py-0.5 rounded-md border border-border amount"
                    style={{
                      backgroundColor: "var(--muted)",
                      color: "var(--muted-foreground)",
                      fontFamily: "var(--font-family)",
                      fontWeight: 500,
                    }}
                  >
                    {item.shortcut}
                  </kbd>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>,
    resolvedPortalTarget
  );
}
