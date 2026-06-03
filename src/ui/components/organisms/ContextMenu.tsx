import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Direction = "rtl" | "ltr" | "auto";
type TriggerMode = "click" | "right-click" | "both";
type MenuPosition = { x: number; y: number };
type MenuCoords = { top: number; left: number };

export interface ContextMenuItem {
  id: string;
  label: string;
  ariaLabel?: string;
  icon?: ElementType;
  shortcut?: string;
  variant?: "default" | "danger" | "featured";
  disabled?: boolean;
  description?: string;
  items?: ContextMenuGroup[];
  keepOpenOnSelect?: boolean;
  closeOnSelect?: boolean;
  renderContent?: (item: ContextMenuItem) => ReactNode;
  onClick?: () => void;
}

export interface ContextMenuGroup {
  id?: string;
  label?: string;
  items: ContextMenuItem[];
}

interface FocusableMenuItem {
  groupIndex: number;
  itemIndex: number;
  item: ContextMenuItem;
}

interface ContextMenuPanelProps {
  groups: ContextMenuGroup[];
  position: MenuPosition;
  onClose: () => void;
  dir: Direction;
  portalTarget?: HTMLElement | null;
  labelledBy?: string;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number | string;
  className?: string;
  style?: CSSProperties;
  closeOnBlur?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  onOpenAutoFocus?: (element: HTMLElement | null) => void;
  onCloseAutoFocus?: () => void;
}

const MARGIN = 8;

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function getFocusableItems(groups: ContextMenuGroup[]) {
  return groups.flatMap((group, groupIndex) =>
    group.items.map((item, itemIndex) => ({ groupIndex, itemIndex, item }))
  );
}

function getItemKey(groupIndex: number, itemIndex: number) {
  return `${groupIndex}:${itemIndex}`;
}

function getNextEnabledIndex(items: FocusableMenuItem[], startIndex: number, delta: number) {
  if (!items.length) return -1;

  for (let step = 0; step < items.length; step += 1) {
    const nextIndex = (startIndex + delta * step + items.length) % items.length;
    if (!items[nextIndex].item.disabled) return nextIndex;
  }

  return -1;
}

function resolveCoords(position: MenuPosition, panel: HTMLElement) {
  const { width, height } = panel.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = position.x;
  if (left + width + MARGIN > vw) left = position.x - width;
  left = Math.max(MARGIN, Math.min(left, vw - width - MARGIN));

  let top = position.y;
  if (top + height + MARGIN > vh) top = position.y - height;
  top = Math.max(MARGIN, Math.min(top, vh - height - MARGIN));

  return { top, left };
}

function ContextMenuPanel({
  groups,
  position,
  onClose,
  dir,
  portalTarget,
  labelledBy,
  minWidth = 220,
  maxWidth = 320,
  maxHeight = "70vh",
  className,
  style,
  closeOnBlur = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  onOpenAutoFocus,
  onCloseAutoFocus,
}: ContextMenuPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const [openSubmenuPath, setOpenSubmenuPath] = useState<string | null>(null);
  const allItems = useMemo(() => getFocusableItems(groups), [groups]);
  const initialIndex = useMemo(() => getNextEnabledIndex(allItems, 0, 1), [allItems]);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!panelRef.current) return;
    setCoords(resolveCoords(position, panelRef.current));
  }, [groups, position.x, position.y]);

  useEffect(() => {
    const key = allItems[activeIndex]
      ? getItemKey(allItems[activeIndex].groupIndex, allItems[activeIndex].itemIndex)
      : undefined;
    const node = key ? itemRefs.current.get(key) : panelRef.current;
    window.requestAnimationFrame(() => {
      node?.focus();
      onOpenAutoFocus?.(node ?? null);
    });
  }, [activeIndex, allItems, onOpenAutoFocus]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onClose();
        onCloseAutoFocus?.();
      }
    };

    const handleMouse = (event: MouseEvent) => {
      if (!closeOnOutsideClick) return;
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
        onCloseAutoFocus?.();
      }
    };

    document.addEventListener("keydown", handleKey, { capture: true });
    document.addEventListener("mousedown", handleMouse);
    return () => {
      document.removeEventListener("keydown", handleKey, { capture: true });
      document.removeEventListener("mousedown", handleMouse);
    };
  }, [closeOnEscape, closeOnOutsideClick, onClose, onCloseAutoFocus]);

  const focusByIndex = (nextIndex: number) => {
    if (nextIndex < 0 || !allItems[nextIndex]) return;
    setActiveIndex(nextIndex);
  };

  const focusFirstSubmenuItem = (submenuPath: string) => {
    window.requestAnimationFrame(() => {
      const submenu = panelRef.current?.querySelector<HTMLElement>(
        `[data-submenu-path="${submenuPath}"]`
      );
      submenu?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
    });
  };

  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusByIndex(getNextEnabledIndex(allItems, activeIndex + 1, 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusByIndex(getNextEnabledIndex(allItems, activeIndex - 1, -1));
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      focusByIndex(getNextEnabledIndex(allItems, 0, 1));
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      focusByIndex(getNextEnabledIndex(allItems, allItems.length - 1, -1));
      return;
    }
  };

  const runItem = (item: ContextMenuItem) => {
    if (item.disabled) return;
    if (item.items?.length && !item.onClick) return;
    item.onClick?.();
    if (item.closeOnSelect !== false && !item.keepOpenOnSelect) {
      onClose();
      onCloseAutoFocus?.();
    }
  };

  const resolvedPortalTarget = portalTarget ?? (typeof document !== "undefined" ? document.body : null);
  if (!resolvedPortalTarget) return null;

  return createPortal(
    <div
      dir={dir}
      ref={panelRef}
      role="menu"
      aria-labelledby={labelledBy}
      tabIndex={-1}
      onKeyDown={handlePanelKeyDown}
      onBlur={(event) => {
        if (!closeOnBlur) return;
        const next = event.relatedTarget as Node | null;
        if (next && panelRef.current?.contains(next)) return;
        onClose();
        onCloseAutoFocus?.();
      }}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      style={{
        position: "fixed",
        zIndex: 9999,
        top: coords?.top ?? position.y,
        left: coords?.left ?? position.x,
        minWidth,
        maxWidth,
        maxHeight,
        overflow: "visible",
        fontFamily: "var(--font-family)",
        visibility: coords ? "visible" : "hidden",
        animation: coords ? "ctx-in 0.14s cubic-bezier(0.16,1,0.3,1) both" : "none",
        ...style,
      }}
      className={cx("qbs-panel dropdown-scroll overscroll-contain py-1.5", className)}
    >
      <div className="dropdown-scroll" style={{ maxHeight, overflowY: "auto", overflowX: "visible" }}>
        {groups.map((group, groupIndex) => (
          <div key={group.id ?? groupIndex} role="group" aria-label={group.label}>
            {groupIndex > 0 ? <div role="separator" className="my-1 border-t border-border" /> : null}
            {group.label ? (
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                {group.label}
              </p>
            ) : null}
            <div className="px-1.5">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const hasSubmenu = Boolean(item.items?.length);
                const submenuPath = getItemKey(groupIndex, itemIndex);
                const key = submenuPath;
                const isDanger = item.variant === "danger";
                const isFeatured = item.variant === "featured";
                const currentIndex = allItems.findIndex(
                  (entry) => entry.groupIndex === groupIndex && entry.itemIndex === itemIndex
                );
                const content = item.renderContent?.(item);
                const Chevron = dir === "rtl" ? ChevronLeft : ChevronRight;

                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => {
                      if (hasSubmenu && !item.disabled) setOpenSubmenuPath(submenuPath);
                      if (!hasSubmenu) setOpenSubmenuPath(null);
                    }}
                  >
                <button
                  ref={(node) => {
                    if (node) itemRefs.current.set(key, node);
                    else itemRefs.current.delete(key);
                  }}
                  role="menuitem"
                  aria-label={item.ariaLabel}
                  aria-haspopup={hasSubmenu ? "menu" : undefined}
                  aria-expanded={hasSubmenu ? openSubmenuPath === submenuPath : undefined}
                  type="button"
                  disabled={item.disabled}
                  tabIndex={currentIndex === activeIndex ? 0 : -1}
                  onMouseEnter={() => {
                    if (!item.disabled && currentIndex >= 0) setActiveIndex(currentIndex);
                  }}
                  onKeyDown={(event) => {
                    const openKey = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
                    const closeKey = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
                    if (hasSubmenu && event.key === openKey) {
                      event.preventDefault();
                      setOpenSubmenuPath(submenuPath);
                      focusFirstSubmenuItem(submenuPath);
                    }
                    if (hasSubmenu && event.key === closeKey) {
                      event.preventDefault();
                      setOpenSubmenuPath(null);
                    }
                  }}
                  onClick={() => runItem(item)}
                  className={cx(
                    "qbs-focus flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-right transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                    isDanger
                      ? "text-destructive hover:bg-destructive/10"
                      : isFeatured
                        ? "text-primary hover:bg-primary/10"
                        : "text-foreground hover:bg-muted"
                  )}
                  style={{ fontWeight: isFeatured ? 700 : 500 }}
                  >
                  {hasSubmenu ? (
                    <Chevron size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  ) : null}
                  {Icon ? (
                    <Icon
                      size={15}
                      className={cx("shrink-0", isDanger ? "text-destructive" : "text-muted-foreground")}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate leading-snug">{item.label}</span>
                    {item.description ? (
                      <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                        {item.description}
                      </span>
                    ) : null}
                    {content}
                  </span>
                  {item.shortcut ? (
                    <kbd className="amount shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                      {item.shortcut}
                    </kbd>
                  ) : null}
                </button>
                    {hasSubmenu && openSubmenuPath === submenuPath ? (
                      <div
                        role="menu"
                        aria-label={item.label}
                        data-submenu-path={submenuPath}
                        className={cx(
                          "qbs-panel absolute top-0 z-[10000] min-w-52 py-1.5 shadow-lg",
                          dir === "rtl" ? "right-full mr-2" : "left-full ml-2"
                        )}
                        onMouseLeave={() => setOpenSubmenuPath(null)}
                      >
                        {item.items?.map((subGroup, subGroupIndex) => (
                          <div key={subGroup.id ?? subGroupIndex} role="group" aria-label={subGroup.label}>
                            {subGroupIndex > 0 ? (
                              <div role="separator" className="my-1 border-t border-border" />
                            ) : null}
                            {subGroup.label ? (
                              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                                {subGroup.label}
                              </p>
                            ) : null}
                            <div className="px-1.5">
                              {subGroup.items.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const subContent = subItem.renderContent?.(subItem);
                                const subIsDanger = subItem.variant === "danger";
                                const subIsFeatured = subItem.variant === "featured";

                                return (
                                  <button
                                    key={subItem.id}
                                    role="menuitem"
                                    type="button"
                                    disabled={subItem.disabled}
                                    aria-label={subItem.ariaLabel}
                                    onKeyDown={(event) => {
                                      const closeKey = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
                                      if (event.key === closeKey) {
                                        event.preventDefault();
                                        setOpenSubmenuPath(null);
                                        itemRefs.current.get(key)?.focus();
                                      }
                                    }}
                                    onClick={() => runItem(subItem)}
                                    className={cx(
                                      "qbs-focus flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-right transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                                      subIsDanger
                                        ? "text-destructive hover:bg-destructive/10"
                                        : subIsFeatured
                                          ? "text-primary hover:bg-primary/10"
                                          : "text-foreground hover:bg-muted"
                                    )}
                                    style={{ fontWeight: subIsFeatured ? 700 : 500 }}
                                  >
                                    {SubIcon ? (
                                      <SubIcon
                                        size={15}
                                        className={cx(
                                          "shrink-0",
                                          subIsDanger ? "text-destructive" : "text-muted-foreground"
                                        )}
                                        aria-hidden="true"
                                      />
                                    ) : null}
                                    <span className="min-w-0 flex-1">
                                      <span className="block truncate leading-snug">{subItem.label}</span>
                                      {subItem.description ? (
                                        <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                                          {subItem.description}
                                        </span>
                                      ) : null}
                                      {subContent}
                                    </span>
                                    {subItem.shortcut ? (
                                      <kbd className="amount shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                                        {subItem.shortcut}
                                      </kbd>
                                    ) : null}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>,
    resolvedPortalTarget
  );
}

export interface UseContextMenuOptions {
  dir?: Direction;
  portalTarget?: HTMLElement | null;
  closeOnBlur?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number | string;
  menuClassName?: string;
  menuStyle?: CSSProperties;
}

export function useContextMenu(groups: ContextMenuGroup[], options: UseContextMenuOptions = {}) {
  const [state, setState] = useState<MenuPosition | null>(null);
  const open = useCallback((x: number, y: number) => setState({ x, y }), []);
  const close = useCallback(() => setState(null), []);
  const dir = options.dir ?? "auto";

  const menuElement = state ? (
    <ContextMenuPanel
      groups={groups}
      position={state}
      onClose={close}
      dir={dir}
      portalTarget={options.portalTarget}
      closeOnBlur={options.closeOnBlur}
      closeOnOutsideClick={options.closeOnOutsideClick}
      closeOnEscape={options.closeOnEscape}
      minWidth={options.minWidth}
      maxWidth={options.maxWidth}
      maxHeight={options.maxHeight}
      className={options.menuClassName}
      style={options.menuStyle}
    />
  ) : null;

  return { isOpen: !!state, open, close, menuElement };
}

export interface ContextMenuTriggerProps {
  groups: ContextMenuGroup[];
  children: ReactNode;
  triggerOn?: TriggerMode;
  dir?: Direction;
  portalTarget?: HTMLElement | null;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnBlur?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number | string;
  menuClassName?: string;
  menuStyle?: CSSProperties;
  onOpenAutoFocus?: (element: HTMLElement | null) => void;
}

export function ContextMenuTrigger({
  groups,
  children,
  triggerOn = "click",
  dir = "auto",
  portalTarget,
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnBlur,
  closeOnOutsideClick,
  closeOnEscape,
  minWidth,
  maxWidth,
  maxHeight,
  menuClassName,
  menuStyle,
  onOpenAutoFocus,
}: ContextMenuTriggerProps) {
  const triggerId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const openAt = useCallback(
    (x: number, y: number) => {
      setPosition({ x, y });
      setOpen(true);
    },
    [setOpen]
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (triggerOn === "right-click") return;
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    openAt(rect.left, rect.bottom + 6);
  };

  const handleContextMenu = (event: ReactMouseEvent<HTMLElement>) => {
    if (triggerOn === "click") return;
    event.preventDefault();
    event.stopPropagation();
    openAt(event.clientX, event.clientY);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      openAt(rect.left, rect.bottom + 6);
    }
  };

  const triggerProps = {
    id: triggerId,
    "aria-haspopup": "menu" as const,
    "aria-expanded": Boolean(isOpen),
    onClick: handleClick,
    onContextMenu: handleContextMenu,
    onKeyDown: handleKeyDown,
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
    },
  };

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<any>, {
        ...triggerProps,
        onClick: (event: ReactMouseEvent<HTMLElement>) => {
          (children as ReactElement<any>).props.onClick?.(event);
          handleClick(event);
        },
        onContextMenu: (event: ReactMouseEvent<HTMLElement>) => {
          (children as ReactElement<any>).props.onContextMenu?.(event);
          handleContextMenu(event);
        },
        onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
          (children as ReactElement<any>).props.onKeyDown?.(event);
          handleKeyDown(event);
        },
      })
    : (
      <span {...triggerProps} role="button" tabIndex={0} style={{ display: "contents" }}>
        {children}
      </span>
    );

  return (
    <>
      {trigger}
      {isOpen && position ? (
        <ContextMenuPanel
          groups={groups}
          position={position}
          onClose={close}
          dir={dir}
          portalTarget={portalTarget}
          labelledBy={triggerId}
          closeOnBlur={closeOnBlur}
          closeOnOutsideClick={closeOnOutsideClick}
          closeOnEscape={closeOnEscape}
          minWidth={minWidth}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          className={menuClassName}
          style={menuStyle}
          onOpenAutoFocus={onOpenAutoFocus}
          onCloseAutoFocus={() => triggerRef.current?.focus()}
        />
      ) : null}
    </>
  );
}
