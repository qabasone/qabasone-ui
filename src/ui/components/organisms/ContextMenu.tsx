import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ContextMenuItem {
  id: string;
  label: string;
  /** Lucide icon component */
  icon?: React.ElementType;
  /** Keyboard shortcut hint shown on the trailing side */
  shortcut?: string;
  /** "danger" → red, "featured" → bold, "default" → normal */
  variant?: "default" | "danger" | "featured";
  disabled?: boolean;
  onClick?: () => void;
}

export interface ContextMenuGroup {
  /** Optional small group heading */
  label?: string;
  items: ContextMenuItem[];
}

// ── Menu panel (rendered in a portal) ─────────────────────────────────────────

interface PanelProps {
  groups: ContextMenuGroup[];
  position: { x: number; y: number };
  onClose: () => void;
}

const MARGIN = 10;

function Panel({ groups, position, onClose }: PanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Start invisible so we can measure before revealing
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal: open at cursor, flip left if clips right edge, then hard-clamp
    let left = position.x;
    if (left + width + MARGIN > vw) left = position.x - width;
    left = Math.max(MARGIN, Math.min(left, vw - width - MARGIN));

    // Vertical: open below cursor, flip up if clips bottom edge, then hard-clamp
    let top = position.y;
    if (top + height + MARGIN > vh) top = position.y - height;
    top = Math.max(MARGIN, Math.min(top, vh - height - MARGIN));

    setCoords({ top, left });
  }, [position.x, position.y]);

  // Close on outside click or Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    // slight delay so the triggering click doesn't immediately close
    const t = setTimeout(() => document.addEventListener("mousedown", onMouse), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.removeEventListener("mousedown", onMouse);
    };
  }, [onClose]);

  return createPortal(
    <div
      dir="rtl"
      ref={ref}
      onClick={e => e.stopPropagation()}
      onContextMenu={e => { e.preventDefault(); e.stopPropagation(); }}
      style={{
        position: "fixed",
        zIndex: 9999,
        fontFamily: "var(--font-family)",
        boxShadow: "var(--shadow-modal)",
        // Invisible until measured; avoids position flash
        visibility: coords ? "visible" : "hidden",
        top: coords?.top ?? position.y,
        left: coords?.left ?? position.x,
        // Animate only after position is resolved
        animation: coords ? "ctx-in 0.15s cubic-bezier(0.16,1,0.3,1) both" : "none",
      }}
      className="bg-card rounded-2xl border border-border py-1.5 min-w-[200px] max-w-[280px] max-h-[70vh] overflow-y-auto overscroll-contain dropdown-scroll"
    >
      {groups.map((group, gi) => (
        <div key={gi}>
          {/* Group divider */}
          {gi > 0 && <div className="my-1.5 border-t border-border" />}

          {/* Group label */}
          {group.label && (
            <p
              className="px-3.5 pt-1.5 pb-0.5 text-xs text-muted-foreground"
              style={{ fontWeight: 600, opacity: 0.55, letterSpacing: "0.04em" }}
            >
              {group.label}
            </p>
          )}

          {/* Items — wrapped in px-1.5 so hover bg doesn't touch menu edges */}
          <div className="px-1.5">
            {group.items.map(item => {
              const Icon = item.icon;
              const isDanger   = item.variant === "danger";
              const isFeatured = item.variant === "featured";

              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => { if (!item.disabled) { item.onClick?.(); onClose(); } }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-sm transition-colors text-right disabled:opacity-35 disabled:cursor-not-allowed rounded-xl hover:bg-muted active:scale-[0.98]"
                  style={{
                    color: isDanger ? "var(--destructive)" : "var(--foreground)",
                    fontWeight: isFeatured ? 700 : 500,
                    minHeight: "34px",
                  }}
                >
                  {/* Icon */}
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

                  {/* Label */}
                  <span className="flex-1 text-right leading-snug">{item.label}</span>

                  {/* Shortcut badge */}
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
    document.body
  );
}

// ── Hook: programmatic control (for right-click on rows, custom triggers) ──────

/**
 * Low-level hook for full programmatic control.
 *
 * @example
 * const { isOpen, open, close, menuElement } = useContextMenu(groups);
 * <tr onContextMenu={e => { e.preventDefault(); open(e.clientX, e.clientY); }}>
 *   ...
 *   {menuElement}
 * </tr>
 */
export function useContextMenu(groups: ContextMenuGroup[]) {
  const [state, setState] = useState<{ x: number; y: number } | null>(null);

  const open = useCallback((x: number, y: number) => setState({ x, y }), []);
  const close = useCallback(() => setState(null), []);

  const menuElement = state
    ? <Panel groups={groups} position={state} onClose={close} />
    : null;

  return { isOpen: !!state, open, close, menuElement };
}

// ── Wrapper component: wraps any trigger ───────────────────────────────────────

/**
 * Wraps any element. Opens the menu at the exact cursor position on click.
 * Right-click is also supported.
 *
 * @example
 * <ContextMenuTrigger groups={groups}>
 *   <button>⋯</button>
 * </ContextMenuTrigger>
 */
export function ContextMenuTrigger({
  groups,
  children,
  triggerOn = "click",
}: {
  groups: ContextMenuGroup[];
  children: React.ReactNode;
  /** "click" (default), "right-click", or "both" */
  triggerOn?: "click" | "right-click" | "both";
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Use the actual mouse coordinates so menu always appears at cursor
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
      {pos && <Panel groups={groups} position={pos} onClose={() => setPos(null)} />}
    </>
  );
}
