import {
  useCallback,
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

type TabsDirection = "rtl" | "ltr";
type TabsListVariant = "top-navigation" | "pill-group" | "underline" | "surface";
type TabsTriggerVariant = "top-navigation" | "pill";

interface TabsContextValue {
  value: string;
  setValue: (next: string) => void;
  baseId: string;
  dir: TabsDirection;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function useTabsContext(componentName: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`${componentName} must be used within <Tabs>.`);
  }
  return ctx;
}

export interface TabsProps {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  dir?: TabsDirection;
  className?: string;
  children: ReactNode;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  dir = "rtl",
  className,
  children,
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const baseId = useId().replace(/:/g, "");
  const currentValue = value ?? uncontrolledValue;

  const setValue = useCallback(
    (next: string) => {
      if (value === undefined) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [onValueChange, value]
  );

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      setValue,
      baseId,
      dir,
    }),
    [baseId, currentValue, dir, setValue]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cx("w-full", className)} dir={dir}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  variant?: TabsListVariant;
}

export function TabsList({
  children,
  className,
  variant = "underline",
  ...props
}: TabsListProps) {
  const resolvedVariant =
    variant === "underline"
      ? "top-navigation"
      : variant === "surface"
      ? "pill-group"
      : variant;
  const base =
    resolvedVariant === "pill-group"
      ? "inline-flex items-center gap-2 flex-wrap"
      : "inline-flex items-end gap-1 border-b border-border w-full";

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      data-tabs-list-variant={resolvedVariant}
      className={cx(base, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  variant?: TabsTriggerVariant;
  badge?: ReactNode;
  startIcon?: ReactNode;
}

export function TabsTrigger({
  value,
  variant,
  badge,
  startIcon,
  className,
  onClick,
  onKeyDown,
  disabled,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: currentValue, setValue, baseId, dir } = useTabsContext("TabsTrigger");
  const selected = currentValue === value;
  const safeValue = value.replace(/\s+/g, "-");
  const tabId = `${baseId}-tab-${safeValue}`;
  const panelId = `${baseId}-panel-${safeValue}`;

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, delta: number) => {
    const tabList = event.currentTarget.closest('[role="tablist"]');
    if (!tabList) return;

    const tabs = Array.from(
      tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
    );
    const index = tabs.indexOf(event.currentTarget);
    if (index < 0 || tabs.length === 0) return;

    const nextIndex = (index + delta + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    nextTab.focus();
    const nextValue = nextTab.dataset.value;
    if (nextValue) {
      setValue(nextValue);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const isRtl = dir === "rtl";
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFocus(event, isRtl ? -1 : 1);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(event, isRtl ? 1 : -1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      const tabList = event.currentTarget.closest('[role="tablist"]');
      const firstTab = tabList?.querySelector<HTMLButtonElement>('[role="tab"]:not([disabled])');
      if (firstTab) {
        firstTab.focus();
        const firstValue = firstTab.dataset.value;
        if (firstValue) setValue(firstValue);
      }
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      const tabList = event.currentTarget.closest('[role="tablist"]');
      if (!tabList) return;
      const tabs = Array.from(
        tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
      );
      const lastTab = tabs[tabs.length - 1];
      if (lastTab) {
        lastTab.focus();
        const lastValue = lastTab.dataset.value;
        if (lastValue) setValue(lastValue);
      }
      return;
    }
  };

  const resolvedVariant = variant ?? "top-navigation";
  const topNavigationClasses = selected
    ? "h-10 px-3 border-b-2 border-primary text-primary font-semibold"
    : "h-10 px-3 border-b-2 border-transparent text-foreground/80 hover:text-foreground";
  const pillClasses = selected
    ? "h-9 px-3 rounded-xl border border-primary/35 bg-primary/10 text-primary"
    : "h-9 px-3 rounded-xl border border-border bg-card text-foreground/85 hover:bg-muted";

  return (
    <button
      type="button"
      role="tab"
      id={tabId}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      data-tabs-trigger-variant={resolvedVariant}
      className={cx(
        "inline-flex items-center gap-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
        resolvedVariant === "pill" ? pillClasses : topNavigationClasses,
        className
      )}
      disabled={disabled}
      onClick={(event) => {
        setValue(value);
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        handleKeyDown(event);
        onKeyDown?.(event);
      }}
      {...props}
    >
      {startIcon ? <span className="shrink-0">{startIcon}</span> : null}
      <span>{children}</span>
      {badge !== undefined && badge !== null ? (
        <span
          className={cx(
            "inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px] leading-none",
            selected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  keepMounted?: boolean;
}

export function TabsContent({
  value,
  keepMounted = false,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value: currentValue, baseId } = useTabsContext("TabsContent");
  const selected = currentValue === value;
  const safeValue = value.replace(/\s+/g, "-");
  const panelId = `${baseId}-panel-${safeValue}`;
  const tabId = `${baseId}-tab-${safeValue}`;

  if (!keepMounted && !selected) return null;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      hidden={!selected}
      className={cx("pt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
