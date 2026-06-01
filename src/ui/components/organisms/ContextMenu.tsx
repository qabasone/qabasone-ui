import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

type Direction = "rtl" | "ltr" | "auto";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  shortcut?: string;
  variant?: "default" | "danger" | "featured";
  disabled?: boolean;
  onClick?: () => void;
}

export interface ContextMenuGroup {
  label?: string;
  items: ContextMenuItem[];
}

interface PanelProps {
  groups: ContextMenuGroup[];
  position: { x: number; y: number };
  onClose: () => void;
  dir: Direction;
  portalTarget?: HTMLElement | null;
}

const MARGIN = 10;

function Panel({ groups, position, onClose, dir, portalTarget }: PanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = position.x;
    if (left + width + MARGIN > vw) left = position.x - width;
    left = Math.max(MARGIN, Math.min(left, vw - width - MARGIN));

    let top = position.y;
    if (top + height + MARGIN > vh) top = position.y - height;
    top = Math.max(MARGIN, Math.min(top, vh - height - MARGIN));

    setCoords({ top, left });
  }, [position.x, position.y]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => document.addEventListener("mousedown", onMouse), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.removeEventListener("mousedown", onMouse);
    };
  }, [onClose]);

  const resolvedPortalTarget = portalTarget ?? (typeof document !== "undefined" ? document.body : null);
  if (!resolvedPortalTarget) return null;

  return createPortal(
    <div
      dir={dir}
      ref={ref}
      onClick={e => e.stopPropagation()}
      onContextMenu={e => { e.preventDefault(); e.stopPropagation(); }}
      style={{
        position: "fixed",
        zIndex: 9999,
        fontFamily: "var(--font-family)",
        boxShadow: "var(--shadow-modal)",
        visibility: coords ? "visible" : "hidden",
        top: coords?.top ?? position.y,
        left: coords?.left ?? position.x,
        animation: coords ? "ctx-in 0.15s cubic-bezier(0.16,1,0.3,1) both" : "none",
      }}
      className="bg-card rounded-2xl border border-border py-1.5 min-w-[200px] max-w-[280px] max-h-[70vh] overflow-y-auto overscroll-contain dropdown-scroll"
    >
      {groups.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && <div className="my-1.5 border-t border-border" />}
          {group.label && (
            <p
              className="px-3.5 pt-1.5 pb-0.5 text-xs text-muted-foreground"
              style={{ fontWeight: 600, opacity: 0.55, letterSpacing: "0.04em" }}
            >
              {group.label}
            </p>
          )}
          <div className="px-1.5">
            {group.items.map(item => {
              const Icon = item.icon;
              const isDanger = item.variant === "danger";
              const isFeatured = item.variant === "featured";

              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick?.();
                      onClose();
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-sm transition-colors text-right disabled:opacity-35 disabled:cursor-not-allowed rounded-xl hover:bg-muted active:scale-[0.98]"
                  style={{
                    color: isDanger ? "var(--destructive)" : "var(--foreground)",
                    fontWeight: isFeatured ? 700 : 500,
                    minHeight: "34px",
                  }}
                >
                  {Icon && (
                    <Icon
                      size={15}
                      className="shrink-0"
                      style={{
                        color: isDanger ? "var(--destructive)" : "var(--muted-foreground)",
                        opacity: item.disabled ? 0.4 : 1,
                      }}
                    />
                  )}
                  <span className="flex-1 text-right leading-snug">{item.label}</span>
                  {item.shortcut && (
                    <kbd
                      className="shrink-0 rounded-md px-1.5 py-0.5 border border-border amount"
                      style={{
                        backgroundColor: "var(--muted)",
                        color: "var(--muted-foreground)",
                        fontFamily: "var(--font-family)",
                        fontWeight: 500,
                        fontSize: "10.5px",
                      }}
                    >
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>,
    resolvedPortalTarget
  );
}

export interface UseContextMenuOptions {
  dir?: Direction;
  portalTarget?: HTMLElement | null;
}

export function useContextMenu(groups: ContextMenuGroup[], options: UseContextMenuOptions = {}) {
  const [state, setState] = useState<{ x: number; y: number } | null>(null);
  const open = useCallback((x: number, y: number) => setState({ x, y }), []);
  const close = useCallback(() => setState(null), []);
  const dir = options.dir ?? "auto";

  const menuElement = state ? (
    <Panel
      groups={groups}
      position={state}
      onClose={close}
      dir={dir}
      portalTarget={options.portalTarget}
    />
  ) : null;

  return { isOpen: !!state, open, close, menuElement };
}

export interface ContextMenuTriggerProps {
  groups: ContextMenuGroup[];
  children: React.ReactNode;
  triggerOn?: "click" | "right-click" | "both";
  dir?: Direction;
  portalTarget?: HTMLElement | null;
}

export function ContextMenuTrigger({
  groups,
  children,
  triggerOn = "click",
  dir = "auto",
  portalTarget,
}: ContextMenuTriggerProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const openAt = useCallback((x: number, y: number) => setPos({ x, y }), []);

  return (
    <>
      <span
        onClick={
          triggerOn !== "right-click"
            ? (e: React.MouseEvent) => { e.stopPropagation(); openAt(e.clientX, e.clientY); }
            : undefined
        }
        onContextMenu={
          triggerOn !== "click"
            ? (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); openAt(e.clientX, e.clientY); }
            : undefined
        }
        style={{ display: "contents" }}
      >
        {children}
      </span>
      {pos && (
        <Panel
          groups={groups}
          position={pos}
          onClose={() => setPos(null)}
          dir={dir}
          portalTarget={portalTarget}
        />
      )}
    </>
  );
}
