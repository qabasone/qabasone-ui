import type { CSSProperties, ComponentType, ReactNode } from "react";

export type SidebarDirection = "rtl" | "ltr" | "auto";

export interface SidebarIconProps {
  size?: string | number;
  className?: string;
  style?: CSSProperties;
}

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: ComponentType<SidebarIconProps>;
  badge?: number;
}

export interface SidebarNavGroup {
  id: string;
  label?: string | null;
  defaultOpen?: boolean;
  items: SidebarNavItem[];
}

export interface SidebarUserMenuItem {
  id: string;
  label: string;
  icon: ComponentType<SidebarIconProps>;
  shortcut?: string;
  danger?: boolean;
  onSelect?: () => void;
}

export interface SidebarUserMenuGroup {
  items: SidebarUserMenuItem[];
}

export interface SidebarCompanyInfo {
  name: string;
  subtitle?: string;
  icon?: ReactNode;
}

export interface SidebarUserProfile {
  initials: string;
  name: string;
  role?: string;
  statusLabel?: string;
}

export interface SidebarMenuPosition {
  top: number;
  side: "left" | "right";
  sideOffset: number;
}
