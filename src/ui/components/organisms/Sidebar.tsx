import { useCallback, useMemo, useRef, useState } from "react";
import { Building2, ChevronDown, MoreVertical, Plus, Search, Settings } from "lucide-react";
import { SidebarIconButton } from "../atoms/SidebarIconButton";
import { SidebarUserMenu } from "../molecules/SidebarUserMenu";
import type {
  SidebarCompanyInfo,
  SidebarDirection,
  SidebarMenuPosition,
  SidebarNavGroup,
  SidebarUserMenuGroup,
  SidebarUserProfile,
} from "../types/sidebar";

export type {
  SidebarCompanyInfo,
  SidebarDirection,
  SidebarNavGroup,
  SidebarUserMenuGroup,
  SidebarUserProfile,
} from "../types/sidebar";

export interface SidebarProps {
  groups: SidebarNavGroup[];
  user: SidebarUserProfile;
  userMenuGroups: SidebarUserMenuGroup[];
  company: SidebarCompanyInfo;
  collapsed?: boolean;
  dir?: SidebarDirection;
  defaultActiveItemId?: string;
  activeItemId?: string;
  onActiveItemChange?: (itemId: string) => void;
  searchPlaceholder?: string;
  searchHotkeyLabel?: string;
  settingsLabel?: string;
  showSettingsButton?: boolean;
  iconRailWidth?: number;
  navPanelWidth?: number;
  portalTarget?: HTMLElement | null;
}

function flattenGroups(groups: SidebarNavGroup[]) {
  return groups.flatMap((group) => group.items);
}

export function Sidebar({
  groups,
  user,
  userMenuGroups,
  company,
  collapsed = false,
  dir = "rtl",
  defaultActiveItemId,
  activeItemId,
  onActiveItemChange,
  searchPlaceholder = "Search...",
  searchHotkeyLabel = "K",
  settingsLabel = "Settings",
  showSettingsButton = true,
  iconRailWidth = 56,
  navPanelWidth = 220,
  portalTarget,
}: SidebarProps) {
  const allItems = useMemo(() => flattenGroups(groups), [groups]);
  const resolvedInitialItemId = defaultActiveItemId ?? allItems[0]?.id ?? "";
  const companyMark = company.name.trim().slice(0, 1);

  const [internalActiveItemId, setInternalActiveItemId] = useState(resolvedInitialItemId);
  const [search, setSearch] = useState("");
  const [userMenuPos, setUserMenuPos] = useState<SidebarMenuPosition | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(groups.filter((group) => group.defaultOpen !== false).map((group) => group.id))
  );

  const sidebarRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const active = activeItemId ?? internalActiveItemId;

  const setActive = useCallback(
    (itemId: string) => {
      if (!activeItemId) setInternalActiveItemId(itemId);
      onActiveItemChange?.(itemId);
    },
    [activeItemId, onActiveItemChange]
  );

  const toggleGroup = useCallback((groupId: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }, []);

  const openUserMenu = useCallback(() => {
    if (!sidebarRef.current || !footerRef.current) return;
    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const footerRect = footerRef.current.getBoundingClientRect();

    const popupWidth = 240;
    const popupHeight = 360;
    const margin = 8;
    const isRtl = dir !== "ltr";

    const side = isRtl ? "right" : "left";
    const sideOffset = isRtl
      ? window.innerWidth - sidebarRect.left + margin
      : sidebarRect.right + margin;

    let top = footerRect.top - popupHeight + footerRect.height;
    top = Math.max(margin, Math.min(top, window.innerHeight - popupHeight - margin));

    const maxSideOffset = window.innerWidth - popupWidth - margin;
    setUserMenuPos({
      top,
      side,
      sideOffset: Math.max(margin, Math.min(sideOffset, maxSideOffset)),
    });
  }, [dir]);

  const closeUserMenu = useCallback(() => setUserMenuPos(null), []);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.includes(search)),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, search]);

  return (
    <>
      <div
        ref={sidebarRef}
        dir={dir}
        className="flex h-full shrink-0 border-s"
        style={{
          borderColor: "var(--border)",
          position: "relative",
          zIndex: 9995,
        }}
      >
        {collapsed ? (
          <div
            className="flex flex-col items-center h-full shrink-0 border-s"
            style={{
              width: `${iconRailWidth}px`,
              backgroundColor: "var(--secondary)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="flex items-center justify-center h-14 w-full border-b shrink-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white text-sm" style={{ fontWeight: 700 }}>
                  {companyMark}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center py-2 gap-0.5 overflow-y-auto sidebar-scroll w-full px-2">
              {allItems.map((item) => (
                <SidebarIconButton
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={active === item.id}
                  badge={item.badge}
                  onClick={() => setActive(item.id)}
                />
              ))}
            </div>

            <div
              className="shrink-0 flex flex-col items-center pb-3 pt-2 gap-1 border-t w-full px-2"
              style={{ borderColor: "var(--border)" }}
            >
              {showSettingsButton ? <SidebarIconButton icon={Settings} label={settingsLabel} /> : null}
              <button
                title={user.name}
                onClick={openUserMenu}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center transition-all hover:ring-2 hover:ring-primary/30"
              >
                <span className="text-white text-[10px]" style={{ fontWeight: 700 }}>
                  {user.initials}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col h-full"
            style={{
              width: `${navPanelWidth}px`,
              backgroundColor: "var(--card)",
              borderRight: "1px solid var(--border)",
            }}
          >
            <div
              className="flex items-center h-14 px-4 border-b shrink-0 gap-2"
              style={{ borderColor: "var(--border)" }}
            >
              {company.icon ?? <Building2 size={14} className="text-muted-foreground shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--foreground)", fontWeight: 600 }}>
                  {company.name}
                </p>
                {company.subtitle ? (
                  <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>
                    {company.subtitle}
                  </p>
                ) : null}
              </div>
              <button className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
                <MoreVertical size={13} />
              </button>
            </div>

            <div className="px-3 pt-3 pb-1 shrink-0">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute top-1/2 -translate-y-1/2 end-2.5 text-muted-foreground pointer-events-none"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-8 ps-3 pe-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder={searchPlaceholder}
                  style={{
                    backgroundColor: "var(--muted)",
                    border: "1px solid transparent",
                    color: "var(--foreground)",
                  }}
                />
                <kbd
                  className="absolute top-1/2 -translate-y-1/2 start-2 text-[10px] px-1 py-0.5 rounded border border-border amount pointer-events-none"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--muted-foreground)",
                    fontFamily: "var(--font-family)",
                    fontWeight: 500,
                  }}
                >
                  {searchHotkeyLabel}
                </kbd>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-1 px-2 sidebar-scroll space-y-px">
              {filteredGroups.map((group) => {
                const isOpen = openGroups.has(group.id);
                return (
                  <div key={group.id}>
                    {group.label ? (
                      <div className="flex items-center group/grp mt-3 mb-0.5 px-1.5">
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className="flex items-center gap-1.5 flex-1"
                        >
                          <ChevronDown
                            size={11}
                            style={{
                              color: "var(--muted-foreground)",
                              transition: "transform 0.18s",
                              transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                            }}
                          />
                          <span
                            className="text-xs flex-1 text-right"
                            style={{ color: "var(--muted-foreground)", fontWeight: 600 }}
                          >
                            {group.label}
                          </span>
                        </button>
                        <button className="w-5 h-5 rounded-md flex items-center justify-center opacity-0 group-hover/grp:opacity-100 transition-opacity hover:bg-muted text-muted-foreground">
                          <Plus size={11} />
                        </button>
                      </div>
                    ) : null}

                    <div
                      style={{
                        overflow: "hidden",
                        maxHeight: isOpen ? "500px" : "0",
                        transition: "max-height 0.2s ease",
                      }}
                    >
                      {group.items.map((item) => {
                        const isActive = active === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-right transition-all"
                            style={{
                              backgroundColor: isActive ? "var(--primary-muted)" : "transparent",
                              color: isActive ? "var(--primary)" : "var(--foreground)",
                              fontWeight: isActive ? 600 : 400,
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                              }
                            }}
                          >
                            <item.icon
                              size={15}
                              className="shrink-0"
                              style={{
                                color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                              }}
                            />
                            <span className="flex-1 text-right">{item.label}</span>
                            {item.badge ? (
                              <span
                                className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] flex items-center justify-center shrink-0"
                                style={{
                                  backgroundColor: isActive ? "var(--primary)" : "var(--destructive)",
                                  color: "#fff",
                                  fontWeight: 600,
                                }}
                              >
                                {item.badge}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            <div ref={footerRef} className="shrink-0 border-t px-2 py-2" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={openUserMenu}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all"
                style={{ backgroundColor: userMenuPos ? "var(--muted)" : "transparent" }}
                onMouseEnter={(e) => {
                  if (!userMenuPos) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)";
                }}
                onMouseLeave={(e) => {
                  if (!userMenuPos) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px]" style={{ fontWeight: 700 }}>
                    {user.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs leading-tight truncate" style={{ color: "var(--foreground)", fontWeight: 600 }}>
                    {user.name}
                  </p>
                  {user.role ? (
                    <p
                      className="text-[10.5px] leading-tight mt-0.5 truncate"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {user.role}
                    </p>
                  ) : null}
                </div>
                <MoreVertical size={13} className="shrink-0 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
      </div>

      <SidebarUserMenu
        open={!!userMenuPos}
        position={userMenuPos}
        user={user}
        groups={userMenuGroups}
        dir={dir}
        onClose={closeUserMenu}
        portalTarget={portalTarget}
      />
    </>
  );
}
